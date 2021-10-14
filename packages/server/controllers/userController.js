const databaseAPI = require('../database/api')

const logger = require('../config/logger')
const { ERROR_RETRIEVING_USERS } = require('../utils/constants/logger-messages')
const { getCacheValueByKey, storeCacheKeyValue } = require('../cache')
const {
  readPlatformConfig,
  readUsersMappingConfig
} = require('../parsers/yaml-parser')
const {
  defaultCohortFile,
  defaultCohortVisibilityProp
} = require('../utils/default-values-generator')
const { applyUserReducer } = require('../reducers/index')

exports.getAllUsers = function (req, res) {
  const selectedDB = req.query.database

  const sendErrorMessage = e => {
    res.status(500).send({
      error: 'ERROR_RETRIEVING_USERS',
      msg: ERROR_RETRIEVING_USERS
    })
    logger.error(ERROR_RETRIEVING_USERS)
    logger.error(e)
  }

  const reqAddtAttributes = (platformConfig, databases) => {
    var nmAttr
    var isArrayOfDBs = Array.isArray(databases)
    var targetDB =
      !isArrayOfDBs || (isArrayOfDBs && databases.length === 1)
        ? databases
        : databases.find(el => el.id === selectedDB)

    return (
      targetDB.users &&
      (nmAttr = targetDB.users.nmAttributes) &&
      nmAttr.length > 0
    )
  }

  getCacheValueByKey('users')
    .then(cachedUsers => {
      if (!cachedUsers || selectedDB) {
        // TODO: This will need some refatoring since now we allow the client to select the users table,
        // so cannot really cache the users like this

        const platformConfig = readPlatformConfig()
        const { userMapping, databases, cohorts } = platformConfig
        const docKeys = Object.keys(readUsersMappingConfig() || {})

        if (
          userMapping === 'file' &&
          docKeys.length >= 1 &&
          !reqAddtAttributes(platformConfig, databases)
        ) {
          var obj = {}
          docKeys.forEach(el => {
            obj[el] = null
          })

          var cohortDefinition = {
            file: defaultCohortFile(cohorts),
            visible: defaultCohortVisibilityProp(cohorts)
          }
          res
            .status(200)
            .send(applyUserReducer(obj, userMapping, cohortDefinition))
        } else {
          databaseAPI
            .getUsers(selectedDB)
            .then(data => {
              storeCacheKeyValue('users', data, 3600)
              res.status(200).send(data)
            })
            .catch(e => {
              sendErrorMessage(e)
            })
        }
      } else {
        res.status(200).send(cachedUsers)
      }
    })
    .catch(e => {
      sendErrorMessage(e)
    })
}
