const firebase = require('firebase')
require('firebase/firestore')
const pick = require('lodash.pick')
const getNoSQLRealtimeData = require('./paradigms/realtime-no-sql-paradigm').default
const getDenormalizedData = require('./paradigms/denormalized-paradigm').default
const {
  defaultFirebaseDBSubType,
  defaultDatabaseID,
  defaultUsersTableName,
  defaultParadigm
} = require('../../../utils/default-values-generator')
const realtime = require('./query/realtime')
const cloudfirestore = require('./query/cloudfirestore')
const {
  createObjWithDefaultPropsValues,
  dupObj
} = require('../../../utils/formatter')
const { compareAttributes } = require('../../../utils/comparison-evaluator')
const logger = require('../../../config/logger')
const {
  AUTHENTICATION_REQUIRED,
  SIGN_IN_FAILED,
  SIGN_IN_SUCCESSFUL,
  SUCCESSFULLY_CONNECTED_TO_DB
} = require('../../../utils/constants/logger-messages')

var databaseInstance = {}
var usersTableIdInfoMap = {}
var isFirst = true

const getQueryModule = subtype => {
  return subtype === 'realtime' ? realtime : cloudfirestore
}

const simpleQueryBasedOnModule = async (db, subtype, tableRef, isUser) => {
  return getQueryModule(subtype).simpleQuery(db, tableRef, isUser)
}

const formatCFUsersData = (data, attributes) => {
  for (var key in data) {
    data[key] = pick(data[key], attributes)
  }
  return data
}

exports.connectToDatabase = async (config, authentication, usersTableIdInfo, id = '') => {
  if (isFirst) {
    isFirst = false
    databaseInstance[defaultDatabaseID(id)] = firebase.initializeApp(config)
  } else {
    databaseInstance[id] = firebase.initializeApp(config, id)
  }

  usersTableIdInfoMap[id] = usersTableIdInfo

  // Currently only supports sign in with email and password
  if (authentication) {
    logger.info(AUTHENTICATION_REQUIRED(id))
    firebase.auth()
      .signInWithEmailAndPassword(authentication.email, authentication.password)
      .then(() => {
        logger.info(SIGN_IN_SUCCESSFUL)
        logger.info(SUCCESSFULLY_CONNECTED_TO_DB(defaultDatabaseID(id)))
      })
      .catch((error) => {
        logger.error(SIGN_IN_FAILED(error.code, error.message))
      })
  } else {
    logger.info(SUCCESSFULLY_CONNECTED_TO_DB(defaultDatabaseID(id)))
  }
}

exports.getDatabase = (subtype, id) => {
  return subtype === 'realtime'
    ? firebase.database(databaseInstance[id])
    : firebase.firestore(databaseInstance[id])
}

const filterUsers = async (subtype, db, userTableName, filters) => {
  if (subtype !== 'realtime') {
    return cloudfirestore.query(db, userTableName, filters, true)
  } else {
    var data = await simpleQueryBasedOnModule(db, subtype, userTableName, true)
    filters.forEach(({ target, operator, value }) => {
      data = Object.filter(data, user => {
        return compareAttributes(user[target], operator, value)
      })
    })
  }
  return data
}

exports.getUsers = async dbInfo => {
  var userTableName = defaultUsersTableName(dbInfo.users)
  var id = defaultDatabaseID(dbInfo.id)

  var { subtype } = dbInfo
  var { idAttribute, map, nmAttributes, filters } = usersTableIdInfoMap[id]

  filters = filters.slice(0) // duplicate array

  subtype = defaultFirebaseDBSubType(subtype)
  var db = this.getDatabase(subtype, id)
  var users = filters.length
    ? await filterUsers(subtype, db, userTableName, filters)
    : await simpleQueryBasedOnModule(db, subtype, userTableName, true)

  var notDefinedAttributesObj = createObjWithDefaultPropsValues(nmAttributes)

  if (nmAttributes) {
    users = formatCFUsersData(users, nmAttributes)
  }

  var newUsers = {}
  for (var userID in users) {
    var el = users[userID]
    var elAttrVal = idAttribute ? el[idAttribute] : userID
    if (idAttribute) {
      newUsers[elAttrVal] = el
      map[elAttrVal] = userID
    }
    newUsers[elAttrVal] = nmAttributes
      ? nmAttributes.length > 0
        ? Object.assign(
          dupObj(notDefinedAttributesObj),
          pick(users[userID], nmAttributes)
        )
        : newUsers[elAttrVal]
      : null
  }
  return newUsers
}

const getFollowedParadigmAndData = info => {
  var {
    element,
    subtype,
    paradigm,
    firebaseDB,
    specifications,
    params,
    dbInfo
  } = info
  if (subtype === 'realtime' && paradigm === 'NoSQL') {
    return getNoSQLRealtimeData(firebaseDB, specifications, params, dbInfo)
  } else {
    return getDenormalizedData(firebaseDB, element, params, dbInfo)
  }
}

exports.getData = async (element, params, dbInfo) => {
  // const filterByAttr = (data, attribute, val) => {
  //   for (var key in data) {
  //     if (Object.prototype.hasOwnProperty.call(data[key], attribute)) {
  //       if (data[key][attribute] === val) {
  //         return key
  //       }
  //     }
  //   }
  // }

  var { specifications } = element
  var paradigm = defaultParadigm(dbInfo.paradigm)
  var subtype = defaultFirebaseDBSubType(dbInfo.subtype)
  var databaseID = defaultDatabaseID(dbInfo.id)

  var firebaseDB = this.getDatabase(subtype, databaseID)

  // TODO Not sure if this is needed since the structure of the params property was changed
  // if(params[0]) {
  //   var userPkVal = params[0];
  //   var { table, idAttribute, map } = usersTableIdInfoMap[databaseID];
  //   if (map) {
  //     if(idAttribute && !map.hasOwnProperty(idAttribute)) {
  //       db, subtype, tableRef, isUser
  //       userPkVal = filterByAttr(await simpleQueryBasedOnModule(firebaseDB, subtype, table), idAttribute, userPkVal);
  //       map[params[0]] = userPkVal;
  //     } else if(idAttribute) {
  //       userPkVal = map[idAttribute];
  //     }
  //   }
  //   var paramsDup = params.slice(0);
  //   paramsDup.shift();
  //   params = [userPkVal, paramsDup.toFlat(1)];
  // }

  return getFollowedParadigmAndData({
    subtype,
    paradigm,
    firebaseDB,
    specifications,
    element,
    params,
    dbInfo
  })
}
