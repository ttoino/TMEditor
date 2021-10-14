const Sequelize = require('sequelize')
const Op = Sequelize.Op

const {
  defaultUsersTableName,
  defaultSQLSpecificationsArr,
  defaultAsArray,
  defaultDatabaseID,
  defaultOperator
} = require('../../../utils/default-values-generator')
const { submitToReducer, specifyMapXnY } = require('../../../reducers/index')
const yamlInterpreter = require('../../../parsers/yaml-parser')
const templateModel = require('./model/templateModel')
const { getModelPrimaryKeys, containsAttribute } = require('./model/reflection')
const { formatQueryResultData, formatUserQueryResultData } = require('./query-result-formatter')
const logger = require('../../../config/logger')
const { SUCCESSFULLY_CONNECTED_TO_DB } = require('../../../utils/constants/logger-messages')
const { concatStringsByDot } = require('../../../utils/formatter')
const reservedNames = require('../../../utils/constants/reserved-names').default

const databases = {}

exports.connectToDatabase = (config, id, usersTableIdInfo) => {
  var sequelize
  var defaultOverallOptions = {
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }

  if (config.uri) {
    sequelize = new Sequelize(config.uri)
  } else if (config.storage) {
    sequelize = new Sequelize({
      ...config,
      storage: `../../config/${config.storage}`
    })
  } else {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      { host: config.host, dialect: config.dialect, ...defaultOverallOptions }
    )
  }

  id = defaultDatabaseID(id)

  var { structure } = yamlInterpreter.readDBInfoByID(id)
  var db = {}
  defaultAsArray(structure).forEach(modelSpecs => {
    var modelName = Object.keys(modelSpecs)[0]
    const model = sequelize.import(modelName, (sequelize, DataTypes) =>
      templateModel(sequelize, DataTypes, modelName, modelSpecs[modelName])
    )
    db[model.name] = model
  })

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  db.usersTableIdInfo = usersTableIdInfo

  db.sequelize = sequelize
  databases[id] = db
  return sequelize
    .authenticate()
    .then(() => logger.info(SUCCESSFULLY_CONNECTED_TO_DB(id)))
    .catch(error => logger.error(error))
}

exports.getUsers = async dbInfo => {
  var db = databases[dbInfo.id]
  var { table, idAttribute, nmAttributes, map, filters } = db.usersTableIdInfo
  var attributesFilter =
    idAttribute || (nmAttributes && nmAttributes.length > 0) ? [] : null
  if (attributesFilter) {
    if (idAttribute) {
      attributesFilter.push(idAttribute)
    }

    if (nmAttributes) {
      nmAttributes.forEach(nmAttr => {
        attributesFilter.push(nmAttr)
      })
    }
  }

  var model = db[table]
  var queryFilters = await createQueryFilters(model, filters)
  var result = await model.findAll({
    raw: true,
    attributes: attributesFilter,
    where: queryFilters
  })
  var userPrimaryKey = await getModelPrimaryKeys(model)

  return formatUserQueryResultData(
    result,
    userPrimaryKey,
    idAttribute,
    nmAttributes,
    map
  )
}

const retrieveTableAttr = async (model, propsInfo, rename = true) => {
  var { properties, mappedAttributes } = propsInfo
  mappedAttributes = mappedAttributes || {}
  var consumedProperties = []
  var tableName = model.getTableName()

  var hasMappedAttributes = Object.entries(mappedAttributes).length !== 0
  for (var i = 0; i < properties.length; i++) {
    var property = properties[i]

    var mappedName = null
    if (
      hasMappedAttributes &&
      Object.prototype.hasOwnProperty.call(mappedAttributes, property)
    ) {
      mappedName = mappedAttributes[property]
    }

    var splittedProperty = property.split('.')
    if (splittedProperty.length > 1 && splittedProperty[0] === tableName) {
      if (
        hasMappedAttributes &&
        !mappedName &&
        Object.prototype.hasOwnProperty.call(
          mappedAttributes,
          splittedProperty[1]
        )
      ) {
        mappedName = mappedAttributes[splittedProperty[1]]
      }

      var pushEl = rename
        ? [
          splittedProperty[1],
          !mappedName
            ? splittedProperty[0] + '|' + splittedProperty[1]
            : mappedName
        ]
        : splittedProperty[1]
      consumedProperties.push(pushEl)
    } else {
      if (!mappedName) {
        mappedName = property
      }
      var containsAttr = await containsAttribute(model, property)
      if (containsAttr) {
        consumedProperties.push(rename ? [property, mappedName] : property)
      }
    }
  }
  return consumedProperties
}

const createQueryOp = (operator, value) => {
  const createOpObj = sequelizeOp => {
    return {
      [sequelizeOp]: value
    }
  }

  switch (operator) {
    case '!==':
      return createOpObj(Op.not)
    case '==':
      return createOpObj(Op.eq)
    case '>=':
      return createOpObj(Op.gte)
    case '>':
      return createOpObj(Op.gt)
    case '<=':
      return createOpObj(Op.lte)
    case '<':
      return createOpObj(Op.lt)
    default:
      return null
  }
}

const createQueryFilters = async (model, filters) => {
  var filteringTargets = filters.map(x => x.target)
  var attributes = await retrieveTableAttr(
    model,
    { properties: filteringTargets, mappedAttributes: {} },
    false
  )
  var queryFilters = {}
  attributes.forEach(el => {
    queryFilters[el] = {}
    filteringTargets
      .reduce((a, e, i) => (e.endsWith(el) ? a.concat(i) : a), [])
      .forEach(index => {
        const filter = filters[index]

        if (Array.isArray(filter.value)) {
          // In case of cohort we want to filter all the ids
          queryFilters[el] = {
            [Op.or]: filter.value
          }
        } else {
          queryFilters[el] = Object.assign(
            queryFilters[el],
            createQueryOp(filter.operator, filter.value)
          )
        }
      })
  })

  return queryFilters
}

const buildInnerJoinQuery = async (
  dataAccessInfo,
  ignoreAdditionalAttr = false
) => {
  var { db, tables, filters, properties, mappedAttributes } = dataAccessInfo

  const innerJoin = async (modelName, include = null) => {
    var model = db[modelName]
    var innerJoinObject = {
      model: model,
      required: true
    }
    if (include) {
      innerJoinObject.include = include
    }

    if (properties) {
      var attributes = await retrieveTableAttr(model, {
        properties,
        mappedAttributes
      })
      innerJoinObject.attributes = attributes.length ? attributes : []
    } else {
      if (ignoreAdditionalAttr) {
        innerJoinObject.attributes = []
      }
    }

    if (filters) {
      innerJoinObject.where = await createQueryFilters(model, filters)
    }

    return [innerJoinObject]
  }

  const recursiveQueryBuilder = async () => {
    if (tables.length === 1) {
      return innerJoin(tables[0])
    }

    var firstEl = tables.shift()
    return innerJoin(firstEl, await recursiveQueryBuilder())
  }

  var query = {
    include: await recursiveQueryBuilder()
  }
  return query
}

const createQueryOptions = (
  queryOptions,
  elementTypeAndUserInfo,
  dataAccessInfo
) => {
  var {
    db,
    tables,
    filters,
    properties,
    operator,
    firstEl,
    mappedAttributes
  } = dataAccessInfo
  var { elementTypeInfo, hasUserFilter } = elementTypeAndUserInfo

  const createFilterQueryOp = async filters => {
    if (filters) {
      queryOptions.where = await createQueryFilters(db[firstEl], filters)
    }
  }

  const createAttributesQueryOpt = async () => {
    function createGlobalAttributes (dataAccessInfo, isAggregationFun = false) {
      var { mirroredTables, properties, db, mappedAttributes } = dataAccessInfo
      mappedAttributes = mappedAttributes || {}
      var attributes = []
      properties.forEach(el => {
        var attribute
        var elSplitted = el.split('.')
        if (elSplitted.length > 1) {
          var tableName = elSplitted[0]
          var indexTarget = mirroredTables.indexOf(tableName)
          var attrPath = ''
          mirroredTables
            .filter((el, index) => {
              return indexTarget > index && index >= 0
            })
            .forEach(tablePathEl => {
              attrPath += tablePathEl + '->'
            })
          attribute = attrPath + el
        } else {
          attribute = el
        }
        var tmpAttr = attribute // value stored before changing to a Sequelize column
        attribute = isAggregationFun ? attribute : db.sequelize.col(attribute)
        var renamedArrayEl = tmpAttr.includes('.')
          ? [attribute, tmpAttr.replace('.', '|')]
          : attribute
        attributes.push(
          Object.prototype.hasOwnProperty.call(mappedAttributes, tmpAttr)
            ? [attribute, mappedAttributes[tmpAttr]]
            : !isAggregationFun
              ? renamedArrayEl
              : attribute
        )
      })
      return attributes
    }
    var attributes = null
    var mirroredTables = tables.slice(0)
    var { type, domain } = elementTypeInfo
    // In case it is a card component
    if (operator) {
      queryOptions.includeIgnoreAttributes = false
      const attribute = createGlobalAttributes(
        { mirroredTables, properties, db, mappedAttributes },
        true
      )[0]
      queryOptions.attributes = [
        [
          db.sequelize.fn(
            defaultOperator(operator),
            db.sequelize.col(attribute)
          ),
          attribute
        ]
      ]
    } else {
      if (hasUserFilter) {
        if (properties) {
          attributes = await retrieveTableAttr(db[firstEl], {
            properties,
            mappedAttributes
          })
          queryOptions.attributes = attributes.length ? attributes : []
        }
      } else if (!hasUserFilter) {
        queryOptions.includeIgnoreAttributes = false
        attributes = createGlobalAttributes({
          mirroredTables,
          properties,
          db,
          mappedAttributes
        })
        queryOptions.attributes = attributes
        if (
          type === 'timeseries' ||
          domain === 'temporal' ||
          type === 'histogram'
        ) {
          try {
            queryOptions.order = attributes[0].replace('.', '|') // ASC default
          } catch (e) {}
        }
      }
    }
  }

  createAttributesQueryOpt()
  createFilterQueryOp(filters)
}

const buildQueryAndExec = async (elementTypeInfo, userInfo, dataAccessInfo) => {
  var { hasUserFilter, userTableName } = userInfo
  var { db, tables, filters, properties, mappedAttributes } = dataAccessInfo

  var firstEl = tables.shift()
  var queryOptions = {}

  createQueryOptions(
    queryOptions,
    { elementTypeInfo, hasUserFilter },
    { ...dataAccessInfo, firstEl }
  )

  var innerJoinContent = {}
  if (hasUserFilter && !tables.length) {
    tables.push(userTableName)
    innerJoinContent = await buildInnerJoinQuery(
      { db, tables, filters, properties, mappedAttributes },
      true
    )
  } else if (tables.length) {
    innerJoinContent = await buildInnerJoinQuery({
      db,
      tables,
      filters,
      properties,
      mappedAttributes
    })
  }

  if (queryOptions.attributes.length === 0) {
    delete queryOptions.attributes
  }

  var test = await db[firstEl].findAll({
    raw: true,
    ...queryOptions,
    ...innerJoinContent
  })
  return test
}

const replaceProperties = (attributes, mappedAttributes = {}) => {
  return attributes.map(el =>
    Object.prototype.hasOwnProperty.call(mappedAttributes, el)
      ? mappedAttributes[el]
      : el
  )
}

exports.getData = async (element, params, dbInfo, cohortsData) => {
  const formatUserPkVal = (data, userPK) => {
    return data.shift()[userPK]
  }

  var { type, domain, specifications, mappedAttributes } = element
  var { x, y, map, filters, operator, attributes } = specifications
  const tables = defaultSQLSpecificationsArr(specifications.tables || specifications.table)

  var elementTypeInfo = { type, domain }

  var properties
  if (x || y) {
    x = x ? defaultAsArray(x) : []
    var hasReservedName = reservedNames.includes(y)
    var concatEl = []
    if (!hasReservedName) {
      y = y ? defaultAsArray(y) : []
      concatEl = y
    }

    properties = x.concat(concatEl)
  }

  // Allow additional attributes for reducers
  if (attributes) {
    properties = [...properties, ...attributes]
  }

  properties = defaultAsArray(properties)
  var userTableName = defaultUsersTableName(dbInfo.users)
  var databaseID = defaultDatabaseID(dbInfo.id)
  var db = databases[databaseID]
  var userModel = db[userTableName]
  var userPK = await getModelPrimaryKeys(userModel)
  var hasUserFilter = !!params.id

  filters = filters ? defaultAsArray(filters) : []

  // Include cohort filter
  if (params.cohort) {
    filters = [
      ...filters,
      {
        target: userPK,
        operator: '==',
        value: cohortsData[params.cohort]
      }
    ]
  }

  // Include frontend timestamp filter
  if (params.from && params.to) {
    const table = Array.isArray(tables) ? tables[0] : tables
    const { timestamp } = dbInfo.structure.find(k => k[table])[table]

    if (timestamp) {
      filters = [
        ...filters,
        {
          target: `${table}.${timestamp}`,
          operator: '>=',
          value: new Date(params.from)
        },
        {
          target: `${table}.${timestamp}`,
          operator: '<=',
          value: new Date(params.to)
        }
      ]
    }
  }

  if (params.id) {
    var { table, idAttribute } = db.usersTableIdInfo
    var dbMap = db.usersTableIdInfo.map
    var userPkVal = params.id

    if (dbMap) {
      if (!Object.prototype.hasOwnProperty.call(dbMap, idAttribute)) {
        userPkVal = formatUserPkVal(
          await db[table].findAll({
            raw: true,
            attributes: [userPK],
            where: { [idAttribute]: userPkVal }
          }),
          userPK
        )
        dbMap[params.id] = userPkVal
      } else {
        userPkVal = dbMap[idAttribute]
      }
    }
    filters.push({ target: userPK, operator: '==', value: userPkVal })
  } else {
    var userFilters = dbInfo.users && dbInfo.users.filters ? defaultAsArray(dbInfo.users.filters) : []
    userFilters.forEach(userFilter => {
      userFilter.target = concatStringsByDot(userTableName, userFilter.target) // in case the target attribute repeats itself among tables
      filters.push(userFilter)
    })
    tables.push(userTableName)
  }

  var replacedProperties = replaceProperties(properties, mappedAttributes)
  var formattedData = formatQueryResultData(
    await buildQueryAndExec(
      elementTypeInfo,
      { hasUserFilter, userTableName },
      { db, tables, filters, properties, operator, mappedAttributes }
    ),
    replacedProperties
  )
  specifyMapXnY(map, x, y)
  return submitToReducer(map, formattedData, 'sequelize')
}

exports.getDatabase = id => {
  return Object.prototype.hasOwnProperty.call(databases, id) ? databases[id] : null
}
