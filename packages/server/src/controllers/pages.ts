import { Request, Response } from 'express'

import { validatePermissions } from '@app/auth/keycloak-protect'
import { readPagePermissions, readUIMetadata } from '@app/parsers/config-parser'
import { getData, getMeta } from '@app/database/api'
import { UIComponent, UIComponentResponse } from '@types'
import { generateCacheKey, getCache, setCache } from '@app/utils/cache'
import { formatComponentData } from '@app/database/data-formatter'
import logger from '@app/utils/logger'

export default async function (req: Request, res: Response): Promise<void> {
  const { page } = req.params

  if (await validatePermissions(req, res, readPagePermissions(page))) {
    try {
      const { components, title } = await readUIMetadata(page)

      res.status(200).send({
        title,
        components: await parseComponentsData(req, res, components)
      })
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
  } else {
    res.status(403).send('No permission to view page')
  }
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
