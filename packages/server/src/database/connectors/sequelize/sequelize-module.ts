import { CONFIG_PATH } from '@app/constants/config-file-paths'
import { SUCCESSFULLY_CONNECTED_TO_DB } from '@app/constants/logger-messages'
import {
  defaultAsArray,
  defaultDatabaseID,
  defaultOperator
} from '@app/utils/default-values-generator'
import { concatStringsByDot } from '@app/utils/formatter'
import logger from '@app/utils/logger'
import { CohortsMap, DatabaseQuery, DBConfigSQL, FieldAggregationOperator, FiltersQuery, SearchParams } from '@types'
import { DataTypes, FindAttributeOptions, FindOptions, Includeable, ModelStatic, Op, ProjectionAlias, Sequelize, WhereOperators, WhereOptions } from 'sequelize'
import { containsAttribute, generateModels, getModelPrimaryKeys } from './model'
import { getUniqueKeys } from '@app/utils'

type IndexableSequelize = Sequelize & { [key: string]: ModelStatic<any> }
const databases: { [key: string]: IndexableSequelize } = {}
interface DefaultedDataAccessInfo {
  db: IndexableSequelize,
  tables: string[],
  filters?: FiltersQuery[],
  properties: (string | FieldAggregationOperator)[],
  groupby?: string
}

export const connectToDatabase = async (dbConfig: DBConfigSQL) => {
  const defaultOverallOptions = {
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }

  let sequelize
  if (typeof dbConfig.config === 'string') {
    sequelize = new Sequelize(dbConfig.config)
  } else if (dbConfig.config.storage) {
    sequelize = new Sequelize({
      ...dbConfig.config,
      storage: `${CONFIG_PATH}/${dbConfig.config.storage}`
    })
  } else {
    sequelize = new Sequelize(
      dbConfig.config.database,
      dbConfig.authentication.username,
      dbConfig.authentication.password,
      { ...defaultOverallOptions, ...dbConfig.config }
    )
  }
  sequelize.options.logging = false

  const id = defaultDatabaseID(dbConfig.id)

  // Generate database models
  const db = await generateModels(sequelize, id)

  databases[id] = db

  return sequelize
    .authenticate()
    .then(() => logger.info(SUCCESSFULLY_CONNECTED_TO_DB(id)))
    .catch((error: Error) => logger.error(error))
}

export const getUsers = async (dbInfo: DBConfigSQL) => {
  const db = databases[dbInfo.id]
  const { table, idField, fields, filters = [] } = dbInfo.users
  const attributesFilter = [
    ...(idField ? [idField] : []),
    ...(fields || [])
  ]
  const model = db[table]
  const queryFilters = await createQueryFilters(model, filters)
  const rawData = await model.findAll({
    raw: true,
    attributes: dbInfo.users.fields && attributesFilter,
    where: queryFilters
  })

  return rawData.map((user) => {
    const newUser: { [key: string]: any } = dbInfo.users.fields ? {} : user

    fields?.forEach((key: string) => {
      newUser[key] = user[key]
    })

    newUser.__key = user[idField]

    return newUser
  })
}

const retrieveTableAttr = async (model: ModelStatic<any>,
  properties: (string | FieldAggregationOperator)[],
  rename = true): Promise<(string | ProjectionAlias)[]> => {
  const consumedProperties: FindAttributeOptions = []
  const tableName = model.getTableName()

  for (const property of properties) {
    if (typeof property === 'string') {
      const splittedProperty = property.split('.')
      if (splittedProperty.length > 1 && splittedProperty[0] === tableName) {
        consumedProperties.push(rename
          ? [
              splittedProperty[1],
              splittedProperty[0] + '|' + splittedProperty[1]
            ]
          : splittedProperty[1])
      } else {
        const containsAttr = await containsAttribute(model, property)
        if (containsAttr) {
          consumedProperties.push(rename ? [property, property] : property)
        }
      }
    }
    // TODO: what to do for other cases?
  }
  return consumedProperties
}

const createQueryOp = (operator: string, value: any): WhereOperators | null => {
  const createOpObj = (sequelizeOp: keyof WhereOperators) => ({ [sequelizeOp]: value })

  switch (operator) {
    case '!=':
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
      throw new Error('Invalid operator >> ' + operator)
  }
}

const createQueryFilters = async (model: ModelStatic<any>, filters: FiltersQuery[]): Promise<WhereOptions> => {
  const filteringTargets = filters.map(x => x.target)
  const attributes = await retrieveTableAttr(
    model,
    filteringTargets,
    false
  )
  const queryFilters: WhereOptions = {}
  attributes.forEach(el => {
    queryFilters[el] = {}
    filteringTargets
      .reduce((a: number[], e, i) => (e.endsWith(el) ? a.concat(i) : a), [])
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
  dataAccessInfo: DefaultedDataAccessInfo,
  ignoreAdditionalAttr = false
): Promise<FindOptions> => {
  const { db, tables, filters, properties } = dataAccessInfo

  const innerJoin = async (modelName: string, include?: Includeable[]) => {
    const model = db[modelName]
    const innerJoinObject: Includeable = {
      model,
      required: true
    }
    if (include?.length) {
      innerJoinObject.include = include
    }

    if (properties?.length) {
      const attributes = await retrieveTableAttr(model, properties)
      innerJoinObject.attributes = attributes.length ? attributes : []
    } else {
      if (ignoreAdditionalAttr) {
        innerJoinObject.attributes = []
      }
    }

    if (filters?.length) {
      innerJoinObject.where = await createQueryFilters(model, filters)
    }

    return [innerJoinObject]
  }

  const recursiveQueryBuilder = async (): Promise<Includeable[] | undefined> => {
    if (tables.length === 1) {
      return innerJoin(tables[0])
    }

    const firstEl = <string>tables.shift()
    return innerJoin(firstEl, await recursiveQueryBuilder())
  }

  const query: FindOptions = {
    include: await recursiveQueryBuilder()
  }
  return query
}

const getFieldNameConsideringJoins = (fieldName: string, tables: string[]) => {
  const splittedFieldName = fieldName.split('.')
  if (splittedFieldName?.length) {
    const tableName = splittedFieldName[0]
    const tableIndex = tables.indexOf(tableName)
    return [...(tables.slice(0, tableIndex)), fieldName].join('->')
  }
  return fieldName
}

const createQueryOptions = async (
  hasUserFilter: boolean,
  { db, tables, filters, properties: fields, firstEl }: DefaultedDataAccessInfo & { firstEl: string }
): Promise<FindOptions> => {
  const attributes: (string | ProjectionAlias)[] = fields.flatMap(field => {
    if (typeof field === 'string') {
      return [getFieldNameConsideringJoins(field, tables)]
    }

    if (!field.hasOwnProperty('operator') && !field.hasOwnProperty('name')) {
      return [getFieldNameConsideringJoins(field.target, tables)]
    }

    const operators = field.operator && typeof field.operator === 'string' ? [field.operator] : field.operator
    if (operators?.length) {
      return operators.map(operator => [
        Sequelize.fn(
          defaultOperator(operator),
          Sequelize.col(field.target)),
        field.name ? `${field.name}.${operator}` : `${field.target}.${operator}`
      ])
    }

    return [[getFieldNameConsideringJoins(field.target, tables), field.name ?? field.target].filter(e => e)]
  })
  return {
    attributes: attributes?.length ? attributes : undefined,
    where: filters?.length ? await createQueryFilters(db[firstEl], filters) : undefined
  }
}

const buildQueryAndExec = async (
  userInfo: { hasUserFilter: boolean, userTableName: string },
  dataAccessInfo: DefaultedDataAccessInfo
) => {
  const { hasUserFilter, userTableName } = userInfo
  const { db, tables } = dataAccessInfo

  const firstEl = tables.shift()
  if (!firstEl) throw new Error('Tables attribute is empty')
  const queryOptions = await createQueryOptions(
    hasUserFilter,
    { ...dataAccessInfo, firstEl }
  )

  let innerJoinContent = {}
  if (hasUserFilter && !tables.length) {
    if (!tables.includes(userTableName) && firstEl !== userTableName) {
      tables.push(userTableName)
    }
    innerJoinContent = await buildInnerJoinQuery(dataAccessInfo, true)
  } else if (tables.length) {
    innerJoinContent = await buildInnerJoinQuery(dataAccessInfo)
  }

  // console.log('Running query >> ', queryOptions, innerJoinContent, dataAccessInfo?.groupby)

  const queryResult = await db[firstEl].findAll({
    raw: true,
    ...queryOptions,
    ...innerJoinContent,
    group: dataAccessInfo?.groupby || undefined
  })

  // console.log('Query result >> ', queryResult)

  return queryResult
}

export const getData = async (query: DatabaseQuery, params: SearchParams, dbInfo: DBConfigSQL, cohortsData?: CohortsMap) => {
  const { filters: configFilters, fields, groupby } = query
  const tables = defaultAsArray(query.tables)

  const userTableName = dbInfo.users.table
  const databaseID = defaultDatabaseID(dbInfo.id)
  const db = databases[databaseID]
  const userModel = db[userTableName]
  const userPK = await getModelPrimaryKeys(userModel)
  let hasUserFilter = !!params.user

  const properties = fields || []

  const filters = (configFilters && defaultAsArray(configFilters)) || []

  // ensure group by field is included in the results
  if (groupby && fields?.length) {
    properties.push(groupby)
  }

  // Include cohort filter
  if (params.cohort && cohortsData) {
    hasUserFilter = true

    filters.push({
      target: userPK,
      operator: '==',
      value: cohortsData[params.cohort]
    })
  }

  // Include frontend timestamp filter
  if (params.startDate && params.endDate) {
    for (const table of tables) {
      const timestampField = getTimestampField(query, dbInfo)

      if (timestampField) {
        const type = db[table].getAttributes()[timestampField].type
        const typeKey = typeof type === 'string' ? type : type.key

        filters.push({
          target: `${table}.${timestampField}`,
          operator: '>=',
          value: typeKey === DataTypes.DATE.key ? new Date(params.startDate) : params.startDate
        }, {
          target: `${table}.${timestampField}`,
          operator: '<=',
          value: typeKey === DataTypes.DATE.key ? new Date(params.endDate) : params.endDate
        })
      }
    }
  }

  if (params.user) {
    filters.push({ target: userPK, operator: '==', value: params.user })
  } else {
    // Adds user filters defined on the site.yaml
    const userFilters = dbInfo.users?.filters ? defaultAsArray(dbInfo.users.filters) : []
    userFilters.forEach(userFilter => {
      userFilter.target = concatStringsByDot(userTableName, userFilter.target) // in case the target attribute repeats itself among tables
      filters.push(userFilter)
    })
    if (userFilters.length && !tables.includes(userTableName)) {
      tables.push(userTableName)
    }
  }

  return await formatResults(await buildQueryAndExec(
    { hasUserFilter, userTableName },
    { db, tables: tables.slice(), filters, properties, groupby }
  ), db, tables)
}

export const getMeta = (query: DatabaseQuery, dbInfo: DBConfigSQL) => {
  return {
    timestamp: getTimestampField(query, dbInfo)
  }
}

const getTimestampField = (query: DatabaseQuery, dbInfo: DBConfigSQL) => {
  const table = defaultAsArray(query.tables)[0]
  const db = databases[query.database]
  const timestampField = (dbInfo?.structure && dbInfo?.structure[table]?.timestampField) ?? dbInfo.timestampField

  if (timestampField) {
    const tableHasColumn = Object.keys(db[table].getAttributes()).includes(timestampField)

    return tableHasColumn ? timestampField : undefined
  }

  return undefined
}

const formatResults = async (data: any[], db: IndexableSequelize, tables: string[]) => {
  const columnRenames: [string, string][] = []
  const rowKeys = getUniqueKeys(data)

  for (const index in tables) {
    const table = tables[index]
    const model = db[table]
    const columns = Object.keys(await db[table].describe())

    if (index === '0') {
      columns.forEach(column => columnRenames.push([column, `${table}.${column}`]))
    } else {
      // some column names will have the singular name in the attribute name, rename to table names
      for (const rowKey of rowKeys) {
        if (model.options.name?.singular && rowKey.startsWith(`${model.options.name?.singular}.`)) {
          columnRenames.push([rowKey, rowKey.replace(`${model.options.name?.singular}.`, `${table}.`)])
        }
      }
    }
  }

  data.forEach(row => {
    for (const [oldName, newName] of columnRenames) {
      if (oldName in row) {
        row[newName] = row[oldName]
        delete row[oldName]
      }
    }
  })

  return data
}

export const getDatabase = (id: string) => {
  return Object.prototype.hasOwnProperty.call(databases, id) ? databases[id] : null
}
