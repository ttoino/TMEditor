const yaml = require('js-yaml')
const fs = require('fs')

const { BLUEPRINTS_PAGE, USER_MAPPING_CONFIG_FILE, BLUEPRINTS_ENTRY_POINT, CONFIG_PATH, DASHBOARD_ENTRY_POINT } = require('../utils/constants/config-file-paths')
const { ERROR_LOADING_YAML } = require('../utils/constants/logger-messages')
const logger = require('../config/logger')

const fileExtension = '.yaml'

/* Reads a file based on the file path passed by argument */
const readFile = (path, reportError) => {
  var doc = null
  // Get document, or throw exception on error
  try {
    doc = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
  } catch (e) {
    if (reportError) {
      logger.error(ERROR_LOADING_YAML)
    }
  }
  return doc
}

const readFileWErrorReport = (path) => {
  return readFile(path, true)
}

const readFileWOErrorReport = (path) => {
  return readFile(path, false)
}

/* Reads the UI metadata configuration based on the UI section */
exports.readUIMetadata = (page) => {
  return readFileWErrorReport(BLUEPRINTS_PAGE + page + fileExtension)
}

exports.readPlatformConfig = () => {
  return readFileWErrorReport(BLUEPRINTS_ENTRY_POINT)
}

/* Reads the database metadata configuration based on the name of the project */
exports.readDBMetadata = () => {
  var { databases } = readFileWErrorReport(BLUEPRINTS_ENTRY_POINT)
  return databases
}

exports.readDBInfoByID = (id) => {
  var { databases } = readFileWErrorReport(BLUEPRINTS_ENTRY_POINT)
  const dbInfo = (Array.isArray(databases))
    ? ((!id) ? databases.shift() : databases.find(el => el.id === id))
    : databases

  if (typeof dbInfo.structure === 'string') {
    const refDB = databases.find(el => el.id === dbInfo.structure)
    dbInfo.structure = refDB.structure
  }

  return dbInfo
}

exports.readPlatformMainConfig = () => {
  var { title, abbreviation, usersLocation } = readFileWErrorReport(BLUEPRINTS_ENTRY_POINT)
  return { title, abbreviation, usersLocation }
}

exports.readDashboardEntryPoint = () => {
  return readFileWOErrorReport(DASHBOARD_ENTRY_POINT)
}

exports.readUsersMappingConfig = () => {
  return readFileWOErrorReport(USER_MAPPING_CONFIG_FILE)
}

exports.readPageName = (dir, pageName) => {
  return readFileWErrorReport(dir + '/' + pageName).title
}

exports.readCohortsConfigFile = (name) => {
  return readFileWErrorReport(CONFIG_PATH + name)
}
