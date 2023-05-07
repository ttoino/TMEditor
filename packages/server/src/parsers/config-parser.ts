import {
  AUTH_CONFIG_FILE, BLUEPRINTS_ENTRY_POINT, BLUEPRINTS_PAGE, CONFIG_COHORTS_PATH,
  UI_PAGE_CONFIG_FILE
} from '@app/constants/config-file-paths'

import { DBConfig, MainConfig, Page, PageName, CohortsConfig } from '@types'
import fs from 'fs'
import yaml from 'js-yaml'
import logger from '../utils/logger'

import { ERROR_LOADING_YAML } from '@app/constants/logger-messages'

export enum AuthProviderKey {
  keycloak = 'keycloak',
  firebase = 'firebase'
}

export type FirebaseAuthConfig = {
  provider: AuthProviderKey.firebase,
  config: any,
  serviceAccount: any
}

export type KeycloakAuthConfig = {
  provider: AuthProviderKey.keycloak,
  baseUrl: string,
  adminClientId: string,
  adminClientSecret: string,
  clientRealm: string,
  clientId: string,
  groups: { [groupName: string]: [permission: string] }
}

export type AuthDisabledConfig = {
  provider: undefined
}

export type AuthConfig = KeycloakAuthConfig | FirebaseAuthConfig | AuthDisabledConfig

/* Reads a file based on the file path passed by argument */
const readFile = (pathResolver: (extension: string) => string, reportError: boolean) => {
  let doc = null

  const extension = fs.existsSync(pathResolver('yaml'))
    ? 'yaml'
    : fs.existsSync(pathResolver('yml'))
      ? 'yml'
      : fs.existsSync(pathResolver('json')) && 'json'

  if (!extension) {
    if (reportError) {
      throw new Error('File does not exist >> ' + pathResolver('(extension)'))
    } else {
      return undefined
    }
  }

  const fileContent = fs.readFileSync(pathResolver(extension), 'utf8')

  if (extension === 'yaml' || extension === 'yml') {
    // Get document, or throw exception on error
    try {
      doc = yaml.load(fileContent)
    } catch (e) {
      if (reportError) {
        logger.error(ERROR_LOADING_YAML, e)
      }
    }
    return doc
  } else if (extension === 'json') {
    return JSON.parse(fileContent)
  }
}

const writeFile = (pathResolver: (extension: string) => string, content: unknown) => {
  const extension = fs.existsSync(pathResolver('yaml'))
    ? 'yaml'
    : fs.existsSync(pathResolver('yml'))
      ? 'yml'
      : 'json'

  let data = ''

  if (extension === 'yaml' || extension === 'yml') {
    data = yaml.dump(content)
  } else if (extension === 'json') {
    data = JSON.stringify(content)
  }

  fs.writeFileSync(pathResolver(extension), data, 'utf8')
}

const readFileWErrorReport = (pathResolver: (extension: string) => string) => {
  return readFile(pathResolver, true)
}

const writeFileWErrorReport = (pathResolver: (extension: string) => string, content: unknown) => {
  return writeFile(pathResolver, content)
}

/* Reads the UI metadata configuration based on the UI section */
export const readUIMetadata = (page: string): Page => {
  return readFileWErrorReport(UI_PAGE_CONFIG_FILE(page))
}

export const writeUIMetadata = (page: string, pageData: Page) => {
  return writeFileWErrorReport(UI_PAGE_CONFIG_FILE(page), pageData)
}

export const readPlatformConfig = (): MainConfig => {
  return readFileWErrorReport(BLUEPRINTS_ENTRY_POINT)
}

export const writePlatformConfig = (config: MainConfig) => {
  return writeFileWErrorReport(BLUEPRINTS_ENTRY_POINT, config)
}

/* Reads the database metadata configuration based on the name of the project */
export const readDBMetadata = (): DBConfig[] => {
  const { databases } = readFileWErrorReport(BLUEPRINTS_ENTRY_POINT)
  return databases
}

export const readDBInfoByID = (id: string): DBConfig => {
  const { databases } = readFileWErrorReport(BLUEPRINTS_ENTRY_POINT)
  const dbInfo = (Array.isArray(databases))
    ? ((!id) ? databases.shift() : databases.find(el => el.id === id))
    : databases

  if (!dbInfo) {
    throw new Error(`Database '${id}' is not properly configured`)
  }

  if (typeof dbInfo?.structure === 'string') {
    const refDB = databases.find((el: any) => el.id === dbInfo.structure)
    dbInfo.structure = refDB.structure
  }

  return dbInfo
}

export const readPagePermissions = (pageName: string) => {
  return readUIMetadata(pageName).requiredPermissions
}

export const readCohortsConfigFile = (): CohortsConfig => {
  return readFileWErrorReport(CONFIG_COHORTS_PATH) ?? {}
}

export const readAuthConfigFile = (): AuthConfig => {
  return readFileWErrorReport(AUTH_CONFIG_FILE) ?? {}
}

/**
 *
 * @returns Array with the pages definition for the frontend
 */
export const getAllPages = (): PageName[] => {
  const pages: PageName[] = []
  const ignoreHiddenFiles = (path: string) => !(/(^|\/)\.[^/.]/g).test(path)

  fs.readdirSync(BLUEPRINTS_PAGE).filter(ignoreHiddenFiles).forEach(page => {
    const fileName = page
      .split('.')
      .slice(0, -1)
      .join('.')

    const name = readUIMetadata(fileName).title
    pages.push({ fileName, name: name || fileName })
  })

  return pages
}
