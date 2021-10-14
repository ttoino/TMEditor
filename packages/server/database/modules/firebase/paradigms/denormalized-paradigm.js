const pick = require('lodash.pick')
const meanBy = require('lodash.meanby')
const maxBy = require('lodash.maxby')
const minBy = require('lodash.minby')
const sumBy = require('lodash.sumby')

const {
  defaultFirebaseDBSubType,
  defaultAsArray,
  defaultUsersTableName,
  defaultOperator
} = require('../../../../utils/default-values-generator')
const { submitToReducer, specifyMapXnY } = require('../../../../reducers/index')
const { selectQueryModule } = require('../query/selector')
const logger = require('../../../../config/logger')
const {
  ERROR_REFERRING_TABLE
} = require('../../../../utils/constants/logger-messages')
const {
  concatStringsByDot,
  applyAggregation,
  renameKeys
} = require('../../../../utils/formatter')
const { getUniqueKeys } = require('../../../../utils')
const reservedNames = require('../../../../utils/constants/reserved-names').default

const paradigm = 'denormalized'

const getPropertiesNames = (data, definedProperties) => {
  const properties = []
  const uniqueKeys = getUniqueKeys(data)

  definedProperties.forEach(defProperty => {
    const prop = uniqueKeys.find(dataProperty => dataProperty.endsWith(defProperty))

    if (prop) {
      properties.push(prop)
    }
  })
  return properties
}

const formatData = (data, properties) => {
  if (!properties || properties.length === 0) {
    return data
  }

  var newproperties = getPropertiesNames(data, properties)
  return data.reduce((arr, el) => {
    arr.push(pick(el, newproperties))
    return arr
  }, [])
}

const createIterableFKArr = FKs => {
  return Array.isArray(FKs) ? FKs : new Array(FKs)
}

const getReferringAndReferencedTables = (tables, t2, dbStructure) => {
  const validateReference = (table, ref) => {
    var FKs = dbStructure[table].FK
    if (FKs) {
      var foundkey = createIterableFKArr(FKs).find(el => {
        return el.reference === ref
      })
      return foundkey
        ? { referring: table, beingReferenced: foundkey.reference }
        : null
    }
  }

  const referringError = () => {
    logger.error(ERROR_REFERRING_TABLE)
  }

  const refSingularTable = (t1, t2) => {
    var result = validateReference(t1, t2) || validateReference(t2, t1) // one of functions will return either null or undefined
    return result
  }

  const refMultipleTable = (tables, t2) => {
    for (var i = 0; i < tables.length; i++) {
      var tmp = refSingularTable(tables[i], t2)
      if (tmp) {
        return tmp
      }
    }
  }
  var result = Array.isArray(tables)
    ? refMultipleTable(tables, t2)
    : refSingularTable(tables, t2)
  if (!result) {
    // TODO: This needs a lot of refactoring
    // referringError()
    // Include tables without data
    result = { referring: t2 }
  }

  return result
}

const getAppliableFilters = (filters, table, dbStructure) => {
  var FKs = dbStructure[table].FK
  FKs = FKs ? defaultAsArray(FKs) : []

  var attributes = dbStructure[table].attributes
  attributes = attributes ? defaultAsArray(attributes) : []

  var totalAttributes = attributes.concat(FKs.map(FK => FK.name))

  return filters
    .filter(filterEl => {
      for (var i = 0; i < totalAttributes.length; i++) {
        if (
          filterEl.target === totalAttributes[i] ||
          filterEl.target === concatStringsByDot(table, totalAttributes[i])
        ) {
          return true
        }
      }
      return false
    })
    .map(filterEl => {
      var { target, operator, value } = filterEl
      var formattedTarget = target.split('.').pop()
      return { target: formattedTarget, operator, value }
    })
}

const innerJoinSQL = async (db, t1, t2, dbInfo, specifications, data = null) => {
  const getReferenceID = (referringTable, beingReferencedTable) => {
    if (beingReferencedTable === undefined) return referringTable

    var FKs = structure[referringTable].FK
    return createIterableFKArr(FKs).find(el => {
      return Array.isArray(beingReferencedTable)
        ? beingReferencedTable.includes(el.reference)
        : el.reference === beingReferencedTable
    }).name
  }

  var { structure, subtype } = dbInfo
  var { filters } = specifications
  subtype = defaultFirebaseDBSubType(subtype)
  var { referring, beingReferenced } = getReferringAndReferencedTables(
    t1,
    t2,
    structure
  )
  var combinedObj = []

  var appliableFilters
  if (!data) {
    appliableFilters = getAppliableFilters(filters, t1, structure)
    var tmpData = await selectQueryModule(subtype).query(
      db,
      t1,
      appliableFilters
    )
    data = Object.values(tmpData)
  }

  appliableFilters = getAppliableFilters(filters, t2, structure)
  return selectQueryModule(subtype)
    .query(db, t2, appliableFilters)
    .then(function (snapshot1) {
      var dataBeingReferenced = beingReferenced === t2 ? snapshot1 : data
      var referringData = beingReferenced === t2 ? data : snapshot1
      var referenceID = getReferenceID(referring, beingReferenced)

      for (var key in referringData) {
        var element = referringData[key]
        // Support subcollections with the /
        const refKey = referring.includes('/') ? referring.split('/')[1] : referring

        var referenceValue = element[concatStringsByDot(refKey, referenceID)]
        if (Array.isArray(dataBeingReferenced)) {
          dataBeingReferenced
            .filter(dataBgRefEl => {
              return dataBgRefEl[concatStringsByDot(beingReferenced, 'key')] === referenceValue
            })
            .forEach(filteredEl => {
              combinedObj.push({ ...element, ...filteredEl })
            })
        } else {
          if (Object.prototype.hasOwnProperty.call(dataBeingReferenced, referenceValue)) {
            combinedObj.push({
              ...element,
              ...dataBeingReferenced[referenceValue]
            })
          }
        }
      }

      // Append data without user references into the response array
      // This will be used in custom reducers
      if (!beingReferenced) {
        combinedObj = dataBeingReferenced.map(object => ({
          ...object,
          [t2]: referringData
        }))
      }
      return combinedObj
    })
}

const queryDenormalizedData = async (db, dbInfo, specifications) => {
  var data = null
  var { tables } = specifications
  if (Array.isArray(tables)) {
    // Set default users table if not defined
    if (tables.length === 1) {
      tables.unshift(dbInfo.users.table)
    }

    // multiple tables
    var numIterations = tables.length - 1
    for (var i = 0; i < numIterations; i++) {
      var tableSubset = tables.slice(0, i + 1)
      var t1 = tableSubset.length === 1 ? tableSubset[0] : tableSubset
      var t2 = tables[i + 1]
      data = await innerJoinSQL(db, t1, t2, dbInfo, specifications, data)
    }
  } else {
    throw new Error('A target table must be defined for retrieving data.')
  }
  return data
}

const createUserFilter = (keyName, userID) => {
  return { target: keyName, operator: '==', value: userID }
}

const createSelectedUserFilters = (
  userTableName,
  userID,
  tables,
  dbInfo,
  filters
) => {
  tables = defaultAsArray(tables)
  tables.forEach(table => {
    var FKs = dbInfo.structure[table].FK
    if (FKs) {
      FKs = defaultAsArray(FKs)
      var foundKey = FKs.find(FK => {
        return FK.reference === userTableName
      })
      if (foundKey) {
        filters.push(
          createUserFilter(concatStringsByDot(table, foundKey.name), userID)
        )
      }
    }
  })
  return filters
}

const createSpecificedUserFilters = (allFilters, userFilters) => {
  userFilters.forEach(userFilter => {
    allFilters.push(userFilter)
  })
}

const applyAggreOperation = (data, operator) => {
  var singleKey = Object.keys(data[0]).shift()
  operator = defaultOperator(operator)
  return applyAggregation(operator, [
    { [singleKey]: meanBy(data, el => el[singleKey]) },
    maxBy(data, el => el[singleKey]),
    minBy(data, el => el[singleKey]),
    { [singleKey]: sumBy(data, el => el[singleKey]) },
    { [singleKey]: data.length }
  ])
}

const replaceProperties = (attributes, mappedAttributes = {}) => {
  return attributes.map(el =>
    Object.prototype.hasOwnProperty.call(mappedAttributes, el)
      ? mappedAttributes[el]
      : el
  )
}

exports.default = (db, element, params, dbInfo) => {
  var mappedAttributes = element.mappedAttributes || {}
  var specifications = element.specifications
  var { filters, x, y, map, operator } = specifications
  var tables = specifications.tables || specifications.table
  var userTableName = defaultUsersTableName(dbInfo.users)
  filters = filters ? defaultAsArray(filters) : []
  var properties = element.specifications.attributes || []
  if (x || y) {
    x = x ? defaultAsArray(x) : []
    var hasReservedName = reservedNames.includes(y)
    var concatEl = []
    if (!hasReservedName) {
      y = y ? defaultAsArray(y) : []
      concatEl = y
    }
    properties.push(...x.concat(concatEl))
  }
  tables = defaultAsArray(tables)
  properties = defaultAsArray(properties)

  var userFilters = (dbInfo.users || {}).filters
  if (userFilters) {
    createSpecificedUserFilters(filters, defaultAsArray(userFilters))
    if (!tables.includes(userTableName)) {
      tables.push(userTableName)
    }
  }

  // Filter according to frontend date picker
  const timestampKey = (dbInfo.timestamp && dbInfo.timestamp.name) || (typeof dbInfo.timestamp === 'string' && dbInfo.timestamp) || 'timestamp'
  if (params.from && params.to) {
    filters = [
      ...filters,
      {
        target: timestampKey,
        operator: '>=',
        value: (dbInfo.timestamp && dbInfo.timestamp.type) === 'FirebaseTimestamp'
          ? new Date(params.from) : new Date(params.from).valueOf().toString()
      },
      {
        target: timestampKey,
        operator: '<=',
        value: (dbInfo.timestamp && dbInfo.timestamp.type) === 'FirebaseTimestamp'
          ? new Date(params.to) : new Date(params.to).valueOf().toString()
      }
    ]
  }

  if (params.id) {
    createSelectedUserFilters(userTableName, params.id, tables, dbInfo, filters)
  }

  return queryDenormalizedData(db, dbInfo, {
    tables,
    properties,
    filters
  }).then(function (data) {
    data = data.map(el => renameKeys(mappedAttributes, el))
    var replacedProperties = replaceProperties(properties, mappedAttributes)
    var formattedData = formatData(data, replacedProperties)
    var finalData = operator
      ? applyAggreOperation(formattedData, operator)
      : formattedData
    specifyMapXnY(map, x, y)
    return submitToReducer(map, finalData, 'firebase', paradigm)
  })
}
