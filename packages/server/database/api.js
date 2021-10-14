const yamlInterpreter = require('../parsers/yaml-parser')
const couchdbModule = require('./modules/couchdb/couchdb-module')
const firebaseModule = require('./modules/firebase/firebase-module')
const fhirModule = require('./modules/fhir/fhir-module')
const sequelizeModule = require('./modules/sequelize/sequelize-module')
const { applyUserReducer } = require('../reducers/index')
const {
  defaultUsersTableName,
  defaultCohortFile,
  defaultCohortVisibilityProp,
  defaultAsArray
} = require('../utils/default-values-generator')
const logger = require('../config/logger.js')
const { isObject } = require('../utils/data-types-validation')

const getModule = moduleName => {
  switch (moduleName) {
    case 'couchdb':
      return couchdbModule
    case 'firebase':
      return firebaseModule
    case 'fhir':
      return fhirModule
    default:
      return sequelizeModule
  }
}

const getMappingUserTableAndAttr = usersField => {
  var isDefAsObject = isObject(usersField)
  return {
    table: isDefAsObject ? usersField.table : defaultUsersTableName(usersField),
    idAttribute: isDefAsObject && usersField.idAttribute ? usersField.idAttribute : null,
    nmAttributes: isDefAsObject && usersField.nmAttributes ? defaultAsArray(usersField.nmAttributes) : null,
    filters: isDefAsObject && usersField.filters ? defaultAsArray(usersField.filters) : [],
    map: isDefAsObject ? {} : null
  }
}

const connectToDatabase = projectDB => {
  var { type, config, authentication, id, users, uri } = projectDB
  var usersTableIdInfo = getMappingUserTableAndAttr(users)

  switch (type) {
    case 'firebase':
      return firebaseModule.connectToDatabase(
        config,
        authentication,
        usersTableIdInfo,
        id
      )
    case 'couchdb':
      return couchdbModule.connectToDatabase(
        config,
        authentication,
        usersTableIdInfo,
        id
      )
    case 'fhir':
      return fhirModule.connectToDatabase(
        config,
        projectDB.subtype,
        usersTableIdInfo.nmAttributes,
        id
      )
    default:
      return sequelizeModule.connectToDatabase(
        { ...config, dialect: type, uri },
        id,
        usersTableIdInfo
      )
  }
}

// Looks like this might be deprecated ?
/* exports.getDatabase = type => {
  return getModule(type).getDatabase()
} */

exports.setUpDatabase = async () => {
  var projectDBs = yamlInterpreter.readDBMetadata()
  var connectionPromises = []

  defaultAsArray(projectDBs).forEach(el => {
    connectionPromises.push(connectToDatabase(el))
  })

  return Promise.all(connectionPromises)
}

exports.getUsers = (dbLocation) => {
  var { databases, userMapping, cohorts } = yamlInterpreter.readPlatformConfig()
  var hasDBArray = Array.isArray(databases)
  var db, singleDB

  if (hasDBArray && databases.length === 1) {
    singleDB = databases[0]
  } else if (!hasDBArray) {
    singleDB = databases
  }

  var correspondingDB = yamlInterpreter.readDBInfoByID(dbLocation)
  if (!correspondingDB && databases.length > 1) {
    logger.error(
      'UserLocation field in site.yaml is either undefined or not referencing an existing database'
    )
  } else {
    db = correspondingDB || singleDB
  }

  var cohortDefinition = {
    file: defaultCohortFile(cohorts),
    visible: defaultCohortVisibilityProp(cohorts)
  }
  return getModule(db.type)
    .getUsers(db)
    .then(function (data) {
      return applyUserReducer(data, userMapping, cohortDefinition)
    })
}

exports.getData = (element, params) => {
  const { cohorts } = yamlInterpreter.readPlatformConfig()
  const cohortsFile = cohorts === true ? 'cohorts.yaml' : cohorts
  const cohortsData = yamlInterpreter.readCohortsConfigFile(cohortsFile)

  var databaseID = element.specifications.database
  var dbInfo = yamlInterpreter.readDBInfoByID(databaseID)
  return dbInfo
    ? getModule(dbInfo.type).getData(element, params, dbInfo, cohortsData)
    : Promise.resolve(null)
}
