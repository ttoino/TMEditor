import { Request, Response } from 'express'

import { ResponseSiteConfig } from '@types'
import { validatePermissions } from '@app/auth/keycloak-protect'
import { readPlatformConfig, readPagePermissions, getAllPages, writePlatformConfig } from '@app/parsers/config-parser'

export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const config = readPlatformConfig()
    const mainConfig: ResponseSiteConfig = {
      ...config,
      pages: getAllPages()
    }

    // filter out pages without permissions
    mainConfig.pages = await Promise.all(
      mainConfig.pages.map((page) => validatePermissions(req, res, readPagePermissions(page.fileName))))
      .then(havePermissions => mainConfig.pages.filter((_, index) => havePermissions[index]))

    res.status(200).send(mainConfig)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export const put = async (req: Request, res: Response): Promise<void> => {
  try {
    const config = req.body

    writePlatformConfig(config)

    res.status(200).send()
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
