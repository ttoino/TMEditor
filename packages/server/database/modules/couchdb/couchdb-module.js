const { defaultDatabaseID, defaultCouchDBUsersTableName } = require('../../../utils/default-values-generator')
const logger = require('../../../config/logger')
const {
  ERROR_INEXISTENT_DATABASE, SIGN_IN_FAILED, SIGN_IN_SUCCESSFUL,
  SUCCESSFULLY_CONNECTED_TO_DB, WARN_NO_DOCUMENT_IN_USER
} = require('../../../utils/constants/logger-messages')
const { submitToReducer } = require('../../../reducers')
const { compareAttributes } = require('../../../utils/comparison-evaluator')
const { jsonConcat } = require('../../../utils/formatter')

var databases = {}

exports.connectToDatabase = async (config, authentication, usersTableIdInfo, id = '') => {
  const url = config.protocol +
    '://' + config.username +
    ':' + config.password +
    '@' + config.host +
    ':' + config.port
  const couchdb = require('nano')(url)

  couchdb
    .session()
    .then(session => {
      logger.info(SIGN_IN_SUCCESSFUL)
      databases[id] = couchdb
      logger.info(SUCCESSFULLY_CONNECTED_TO_DB(defaultDatabaseID(id)))
    })
    .catch(function (error) {
      logger.error(SIGN_IN_FAILED(error.statusCode, error.message))
    })
}

exports.getDatabase = id => {
  return Object.prototype.hasOwnProperty.call(databases, id)
    ? databases[id]
    : null
}

exports.getDatabaseServerApi = id => {
  // for Futon servers change to the next line
  // return this.getDatabase(defaultDatabaseID(dbInfo.id)).server.db;
  return this.getDatabase(defaultDatabaseID(id)).db
}

exports.getUsers = async dbInfo => {
  const couchdb = this.getDatabaseServerApi(dbInfo.id)
  const userTableName = defaultCouchDBUsersTableName(dbInfo.users.table)

  try {
    const database = couchdb.use(userTableName)
    const list = await database.list()

    const promises = list.rows.map(async element => {
      if (element.key !== '_design/_auth') {
        let user = {}
        let docData = null
        if (dbInfo.users.idAttribute || dbInfo.users.nmAttributes) {
          docData = await this.getDocumentData(
            couchdb,
            userTableName,
            element.key
          )
        }

        // Filtering users
        if (
          dbInfo.users.filters !== undefined &&
          dbInfo.users.filters !== null &&
          !filterUsers(docData, dbInfo.users.filters)
        ) {
          return
        }

        user.key = element.key
        // Setting user key = idAttribute
        if (!dbInfo.users.idAttribute) {
          user.id = element.key.replace('org.couchdb.user:', '')
        } else {
          user.id = this.getAttributeData(
            docData,
            dbInfo.users.idAttribute
          )
        }

        // Setting user nmAttributes
        if (!dbInfo.users.nmAttributes) {
          user = jsonConcat(user, docData)
        } else {
          dbInfo.users.nmAttributes.forEach(attr => {
            user[attr] = this.getAttributeData(docData, attr)
          })
        }

        return user
      }
    })

    return Promise.all(promises)
  } catch (error) {
    if (error.reason === 'Database does not exist.') {
      logger.error(ERROR_INEXISTENT_DATABASE(userTableName))
    } else {
      logger.error(error.reason)
    }
  }
}

exports.getDocumentData = async (couchdb, dbName, docName) => {
  let docData = null

  try {
    const database = couchdb.use(dbName)

    await database
      .get(docName)
      .then(body => {
        docData = body
      })
      .catch(() => {
        logger.warn(WARN_NO_DOCUMENT_IN_USER(docName))
        docData = null
      })
  } catch (error) {
    if (error.reason === 'Database does not exist.') {
      logger.error(ERROR_INEXISTENT_DATABASE(dbName))
    } else {
      logger.error(error.reason)
    }
  }

  return docData
}

exports.getAttributeData = (data, attr) => {
  const attrs = attr.split('.')

  for (let i = 0; i < attrs.length; i++) {
    const currAttr = attrs[i].trim()
    if (Object.prototype.hasOwnProperty.call(data, currAttr)) {
      data = data[currAttr]
    } else {
      data = 'NaN'
      break
    }
  }

  if (data === '') {
    return 'NaN'
  }

  return data
}

exports.getData = async (element, params, dbInfo) => {
  const { document, x } = element.specifications
  const dbName = element.specifications.database_name
  const couchdb = this.getDatabaseServerApi(dbInfo.id)

  const database = couchdb.use(document)
  const list = await database.list()

  const promises = list.rows.map(async doc => {
    const docData = await this.getDocumentData(couchdb, dbName, doc.key)
    let filteredData = docData

    if (x) {
      filteredData = Object.keys(docData)
        .filter(key => x.includes(key))
        .reduce((res, key) => ({
          ...res,
          [key]: docData[key]
        }), {})
    }

    return filteredData
  })

  const data = await Promise.all(promises)

  return submitToReducer(element.specifications.map, data, 'couchdb')
}

const filterUsers = (user, filters) => {
  let flag = true
  filters.forEach(({ target, operator, value }) => {
    if (
      this.getAttributeData(user, target) &&
      !compareAttributes(user[target], operator, value)
    ) {
      flag = false
    }
  })
  return flag
}
