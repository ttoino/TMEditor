import { Request, Response } from 'express'

import { validatePermissions } from '@app/auth/keycloak-protect'
import { readPagePermissions, readUIMetadata, getAllPages, writeUIMetadata } from '@app/parsers/config-parser'
import { getData, getMeta } from '@app/database/api'
import { UIComponent, UIComponentResponse } from '@types'
import { generateCacheKey, getCache, setCache } from '@app/utils/cache'
import { formatComponentData } from '@app/database/data-formatter'
import logger from '@app/utils/logger'

export const get = async function (req: Request, res: Response): Promise<void> {
  const { page } = req.params
  const pages = getAllPages()

  if (!pages.map(i => i.fileName).includes(page)) {
    res.status(404).send('Page not found')
    return
  }

  if (await validatePermissions(req, res, readPagePermissions(page))) {
    try {
      if (!validateDateQuery(req.query)) {
        res.status(400).send('Wrong query parameters')
        return
      }

      const { components, title } = await readUIMetadata(page)

      res.status(200).send({
        title,
        components: await parseComponentsData(req, res, components)
      })
    } catch (e) {
      logger.error(e)
      res.sendStatus(500)
    }
  } else {
    res.status(403).send('No permission to view page')
  }
}

export const put = async function (req: Request, res: Response): Promise<void> {
  const { page } = req.params
  const config = req.body

  await writeUIMetadata(page, config)

  res.status(200).send(config)
}

const parseComponentsData = async (req: Request, res: Response, components: UIComponent[]): Promise<UIComponentResponse[]> => {
  return Promise.all(components.map(async (component) => {
    // Validate that the UI has permissions to read this component
    const permissions = await validatePermissions(req, res, component.requiredPermissions)

    if (!permissions) {
      return {
        ...component,
        error: {
          code: 'NO_PERMISSIONS',
          name: 'No permissions to view component'
        }
      }
    }

    // Return the original config for layout component
    if (component.type === 'info' || component.type === 'heading') {
      return component
    }

    if (component.type === 'columns') {
      return {
        ...component,
        components: await parseComponentsData(req, res, component.components)
      }
    }

    if (component.type === 'tabs') {
      return {
        ...component,
        panels: await Promise.all(component.panels.map(async (panel) => ({
          ...panel,
          components: await parseComponentsData(req, res, panel.components)
        })))
      }
    }

    const cacheKey = generateCacheKey(component.query, req.query)
    req.logging.add(JSON.stringify({ ...component.query, ...req.query }))

    let data = JSON.parse(await getCache(cacheKey) || '""')

    if (!data) {
      try {
        data = await getData(component.query, req.query)
        await setCache(cacheKey, JSON.stringify(data))
      } catch (error: any) {
        logger.error(error)

        return {
          ...component,
          error: {
            code: 'ERROR',
            name: 'There was an problem loading the component',
            message: error.message
          }
        }
      }
    }

    return {
      ...component,
      data: formatComponentData(data, component),
      meta: await getMeta(component.query)
    }
  }))
}

const validateDateQuery = (query: any) => {
  const hasStartDate = Object.prototype.hasOwnProperty.call(query, 'startDate')
  const hasEndDate = Object.prototype.hasOwnProperty.call(query, 'endDate')
  if (hasStartDate && hasEndDate) {
    if (new Date(query.endDate) >= new Date(query.startDate)) return true
    return false
  } else if (hasStartDate || hasEndDate) return false
  return true
}
