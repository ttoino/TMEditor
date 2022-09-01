import { Firestore } from 'firebase/firestore'
import { NODATA_LABEL } from '@app/constants'
import { DBConfigFirebase, IncludeQuery, FieldAggregation, FieldAggregationOperator, DatabaseQuery, UsersConfig } from '@types'
import { queryData } from './query/cloudfirestore'

type TKeyValue = { [key: string]: any }
type TFields = string | FieldAggregation | FieldAggregationOperator

/**
 * Gets the timestamp key from the config
 * @returns string
 */
export const getTimestampKey = (table: string, dbConfig: DBConfigFirebase) => {
  const timestampField = dbConfig.structure[table] && 'timestampField' in dbConfig.structure[table]
    ? dbConfig.structure[table].timestampField
    : dbConfig.timestampField

  if (!timestampField) {
    return undefined
  }

  return typeof timestampField === 'object' ? timestampField.name : timestampField
}

/**
 * Appends the includes data to the main object as nested properties
 * @returns { key: value, nested: { key: value} }
 */
export const recursiveMerge = (tableConfig: DatabaseQuery | UsersConfig | IncludeQuery, includesData: TKeyValue | null, dbConfig: DBConfigFirebase, result: TKeyValue) => {
  const { structure } = dbConfig
  const { table, include } = tableConfig

  if (!structure) {
    throw new Error('The \'structure\' property is required when joining collections')
  }

  if (!include || !includesData) {
    return result
  }

  include.forEach((inc) => {
    if (!structure[table]) {
      throw new Error(`Please define the relations between the '${table}' and '${inc.table}' collections`)
    }

    const incData = includesData[inc.table]
    const toMergeData = Object.values(incData).find((row: any) => {
      const mergeKey = structure[table].relations[inc.table]

      return row[mergeKey] === result.userId
    })

    result[inc.table] = filterObjectByKeys(toMergeData ?? {}, inc.fields)

    if (inc.include) {
      recursiveMerge(inc, includesData, dbConfig, result[inc.table])
    }
  })

  return result
}

/**
 * Returns a new object with only the keys from the fields array
 * @returns { key: value }
 */
export const filterObjectByKeys = (obj: any, fields?: TFields[]) => {
  const newObj: TKeyValue = {}
  const fieldsProps = fields ?? Object.keys(obj)

  fieldsProps.forEach((field) => {
    const [key, namedKey] = parseFieldsAttribute(field)

    newObj[namedKey] = obj[key] ?? NODATA_LABEL
  })

  return newObj
}

export const buildIncludeQuery = async (incQuery: IncludeQuery[] | undefined, db: Firestore, incResponse: TKeyValue = {}) => {
  if (!incQuery) {
    return null
  }

  for (const inc of incQuery) {
    incResponse[inc.table] = await queryData(db, inc.table, [])

    if (inc.include) {
      await buildIncludeQuery(inc.include, db, incResponse)
    }
  }
  return incResponse
}

export const parseFieldsAttribute = (field: TFields) => {
  if (typeof field === 'string') {
    return [field, field]
  }

  return [field.target, field.name ?? field.target]
}
