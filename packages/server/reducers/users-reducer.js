const yamlInterpreter = require('../parsers/yaml-parser')
const logger = require('../config/logger')
try {
  var userMappingFunc = require('../../../config/user-mapping/config-function')
    .default
} catch (error) {
  logger.warn('No user-mapping file')
}
const { isObject } = require('../utils/data-types-validation')

const mapByID = data => {
  var usersIdentifiers = []
  for (const userID in data) {
    var user = { key: userID, id: userID, ...data[userID] }
    usersIdentifiers.push(user)
  }
  return usersIdentifiers
}

const mapByFunction = data => {
  return userMappingFunc ? userMappingFunc(data) : data
}

const mappingFile = () => {
  return yamlInterpreter.readUsersMappingConfig()
}

const mapByFile = (doc, data) => {
  const isOrganizedByCohorts = element => {
    return isObject(element)
  }

  var userKeys = Object.keys(data)

  var usersIdentifiers = []
  for (const key in doc) {
    if (isOrganizedByCohorts(doc[key])) {
      var user = doc[key]
      for (const userID in user) {
        if (userKeys.includes(userID)) {
          usersIdentifiers.push({
            key: userID,
            id: user[userID],
            ...data[userID]
          })
        }
      }
    } else {
      if (userKeys.includes(key)) {
        usersIdentifiers.push({ key: key, id: doc[key], ...data[key] })
      }
    }
  }

  return usersIdentifiers
}

const applyUserMapping = (data, type) => {
  switch (type) {
    case 'file':
      return mapByFile(mappingFile(), data)
    case 'function':
      return mapByFunction(data)
    default:
      return mapByID(data)
  }
}

const groupByCohort = (usersIdentifiers, cohortsConfig) => {
  // Use the cohorts.yaml by default but allow users to configure this
  const cohortsFile = cohortsConfig === true ? 'cohorts.yaml' : cohortsConfig
  const cohorts = yamlInterpreter.readCohortsConfigFile(cohortsFile)

  return usersIdentifiers.map((user) => {
    const cohortKey = Object.keys(cohorts).find(key => {
      return cohorts[key].some(id => id.toString() === user.key)
    })

    return {
      ...user,
      cohort: cohortKey || 'Other'
    }
  })
}

exports.default = (data, userMappingMethod) => {
  const { cohorts } = yamlInterpreter.readPlatformConfig()
  let usersIdentifiers = []

  if (userMappingMethod) {
    usersIdentifiers = applyUserMapping(data, userMappingMethod)
  } else {
    var doc = null
    if ((doc = mappingFile()) && Object.keys(doc).length >= 1) {
      usersIdentifiers = mapByFile(doc, data)
    } else {
      try {
        usersIdentifiers = mapByFunction(data)
      } catch (error) {
        // user mapping function was not specified by the user
        // Uses the database IDs as the user identifiers
        usersIdentifiers = mapByID(data)
      }
    }
  }

  if (cohorts) {
    usersIdentifiers = groupByCohort(usersIdentifiers, cohorts)
  }

  return usersIdentifiers
}
