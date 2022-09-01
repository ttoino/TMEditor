import type {
  FieldAggregation, CohortsMap, DatabaseQuery, DBConfigSQL, FieldAggregationOperator,
  SearchParams, IncludeQuery
} from '@types'
import { DataTypes, FindAttributeOptions, Includeable, ModelStatic, Op, Sequelize, WhereOptions } from 'sequelize'
import { CONFIG_PATH } from '@app/constants/config-file-paths'
import { SUCCESSFULLY_CONNECTED_TO_DB } from '@app/constants/logger-messages'
import logger from '@app/utils/logger'
import { generateModels } from './model'
import { createQueryFilters, createQueryOp } from './helpers'

type IndexableSequelize = Sequelize & { [key: string]: ModelStatic<any> }
const databases: { [key: string]: IndexableSequelize } = {}

export const connectToDatabase = async (dbConfig: DBConfigSQL) => {
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
      { host: dbConfig.config.host, dialect: dbConfig.config.dialect }
    )
  }
  sequelize.options.logging = false

  // Generate database models
  const db = await generateModels(sequelize, dbConfig.id)

  databases[dbConfig.id] = db

  return sequelize
    .authenticate()
    .then(() => logger.info(SUCCESSFULLY_CONNECTED_TO_DB(dbConfig.id)))
    .catch((error: Error) => logger.error(error))
}

export const getUsers = async (dbConfig: DBConfigSQL) => {
  const db = databases[dbConfig.id]
  const { table, idField, fields, filters = [] } = dbConfig.users
  const model = db[table]

  if (!model) {
    throw new Error(`No model found for ${table}`)
  }

  const rawData = await model.findAll({
    raw: true,
    nest: true,
    attributes: fields ? [idField, ...(fields ?? [])] : undefined,
    where: createQueryFilters(filters),
    include: buildIncludeQuery(dbConfig.users.include, db)
  })

  return rawData.map((user) => {
    user.__key = user[idField]

    return user
  })
}

export const getData = async (query: DatabaseQuery, params: SearchParams, dbConfig: DBConfigSQL, cohortsData?: CohortsMap) => {
  const { filters = [], fields, groupby, include } = query
  const userTableName = dbConfig.users.table
  const databaseID = dbConfig.id
  const db = databases[databaseID]
  const userModel = db[userTableName]
  const tableName = query.table
  const table = db[query.table]

  if (!table) {
    throw new Error(`Table '${query.table}' doesn't exist`)
  }

  const allFields = groupby ? [groupby, ...(fields ?? [])] : fields // ensure group by field is included in the results
  const includables: Includeable[] = buildIncludeQuery(include, db)
  const whereFilters: WhereOptions<any> = {}

  // Add frontend timestamp filter
  if (params.startDate && params.endDate) {
    const timestampField = getTimestampField(query, dbConfig)

    if (timestampField) {
      const type = db[tableName].getAttributes()[timestampField].type
      const typeKey = typeof type === 'string' ? type : type.key

      whereFilters[timestampField] = {
        [Op.and]: {
          [Op.gte]: typeKey === DataTypes.DATE.key ? new Date(params.startDate) : params.startDate,
          [Op.lte]: typeKey === DataTypes.DATE.key ? new Date(params.endDate) : params.endDate
        }
      }
    }
  }

  // Add user filter
  if (params.user) {
    whereFilters[userModel.associations[tableName].foreignKey] = params.user
  }

  // Add cohort filter
  if (params.cohort && cohortsData) {
    whereFilters[userModel.associations[tableName].foreignKey] = {
      [Op.or]: cohortsData[params.cohort]
    }
  }

  // Add user filters defined on the site.yaml
  if (dbConfig.users.filters) {
    // FIXME: Handle cases where we are including the users table
    dbConfig.users.filters.forEach(filter => {
      includables.push({
        model: userModel,
        where: {
          [filter.target]: createQueryOp(filter.operator, filter.value)
        },
        attributes: []
      })
    })
  }

  const queryResult = await table.findAll({
    raw: true,
    nest: true,
    attributes: createQueryOptions(allFields),
    where: { ...whereFilters, ...createQueryFilters(filters) },
    include: includables,
    // logging: console.log,
    group: groupby
  })

  return queryResult
}

export const getMeta = (query: DatabaseQuery, dbInfo: DBConfigSQL) => {
  return {
    timestamp: getTimestampField(query, dbInfo)
  }
}

const createQueryOptions = (fields: (string | FieldAggregation | FieldAggregationOperator)[] | undefined): FindAttributeOptions | undefined => {
  return fields?.flatMap<any>((field) => {
    if (typeof field === 'string') {
      return field
    }

    if (Object.prototype.hasOwnProperty.call(field, 'operator')) {
      const operators = field.operator && typeof field.operator === 'string' ? [field.operator] : field.operator

      return operators?.map((operator) => [
        Sequelize.cast(Sequelize.fn(operator, Sequelize.col(field.target)), 'FLOAT'),
        field.name ? `${field.name}.${operator}` : `${field.target}.${operator}`
      ])
    }

    return [[field.target, field.name ?? field.target]]
  })
}

const buildIncludeQuery = (include: IncludeQuery[] | undefined = [], db: IndexableSequelize): Includeable[] => {
  return include.map(inc => ({
    model: db[inc.table],
    required: false,
    attributes: inc.fields,
    where: createQueryFilters(inc.filters),
    include: buildIncludeQuery(inc.include, db)
  }))
}

const getTimestampField = (query: DatabaseQuery, dbInfo: DBConfigSQL) => {
  const db = databases[query.database]
  const timestampField = (dbInfo?.structure && dbInfo?.structure[query.table]?.timestampField) ?? dbInfo.timestampField

  if (timestampField) {
    const tableHasColumn = Object.keys(db[query.table].getAttributes()).includes(timestampField)

    return tableHasColumn ? timestampField : undefined
  }

  return undefined
}
