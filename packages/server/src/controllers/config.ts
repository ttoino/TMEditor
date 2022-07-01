import { Request, Response } from 'express'

import { ResponseSiteConfig } from '@types'
import { validatePermissions } from '@app/auth/keycloak-protect'
import { readPlatformConfig, readPagePermissions, getAllPages } from '@app/parsers/config-parser'

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = readPlatformConfig()
    const mainConfig: ResponseSiteConfig = {
      title,
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
