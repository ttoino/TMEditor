const firebase = require('firebase')
const logger = require('../../../../config/logger')
const { ERROR_RETRIEVING_FIREBASE_DOCUMENT } = require('../../../../utils/constants/logger-messages')
const { concatStringsByDot } = require('../../../../utils/formatter')

const getCloudFirestoreCollectionData = (table, snapshot, isUser = false) => {
  const data = {}
  const tableKey = getTableKey(table)

  snapshot.forEach(doc => {
    const docData = doc.data()
    const formattedDocData = {}

    for (const key in docData) {
      let entry = docData[key]
      const insertKey = !isUser ? concatStringsByDot(tableKey, key) : key

      // Convert Firestore native timestamps
      if (entry instanceof firebase.firestore.Timestamp) {
        entry = entry.toDate()
      }

      // Concat keys by dot
      formattedDocData[insertKey] = entry
    }

    // Add doc key to the object
    formattedDocData[concatStringsByDot(tableKey, 'key')] = doc.id

    data[doc.id] = formattedDocData
  })
  return data
}

const getTableKey = (table) => {
  return table.includes('/') ? table.split('/')[1] : table
}

exports.query = (firestore, table, filters = [], val) => {
  const _createFirestoreRef = (actualRef, filtersArr) => {
    if (filtersArr.length === 0) {
      return actualRef
    }

    var { target, operator, value } = filtersArr.shift()
    var newRef = actualRef.where(target, operator, value)

    return _createFirestoreRef(newRef, filtersArr)
  }

  const tableKey = getTableKey(table)
  const collectionReq = table.includes('/') ? firestore.collectionGroup(tableKey) : firestore.collection(tableKey)

  var fullRef = _createFirestoreRef(collectionReq, filters)
  return fullRef.get().then(snapshot => {
    return getCloudFirestoreCollectionData(table, snapshot, val)
  })
}

exports.simpleQuery = (firestore, tableName, isUser) => {
  return firestore.collection(tableName).get().then(function (elem) {
    return getCloudFirestoreCollectionData(tableName, elem, isUser)
  }).catch(function (error) {
    logger.error(ERROR_RETRIEVING_FIREBASE_DOCUMENT(error))
  })
}
