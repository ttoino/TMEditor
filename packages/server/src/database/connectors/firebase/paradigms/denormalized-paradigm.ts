import { NODATA_LABEL } from '@app/constants'
import { Firestore } from 'firebase/firestore'
import { compareFilterFunction, getUniqueKeys, defaultAsArray } from '@app/utils'
import {
  CohortsMap, DatabaseQuery, DBConfigFirebase, FieldAggregation, FieldAggregationOperator,
  FirebaseFiltersQuery, SearchParams, TimestampNoSQL
} from '@types'
import { calculateAggregation } from '@app/utils/formatter'
import { queryData } from '../query/cloudfirestore'
import { buildIncludeQuery, filterObjectByKeys, getTimestampKey, parseFieldsAttribute, recursiveMerge } from '../helpers'
import { getUsers } from '../firebase-module'

type TFields = (string | FieldAggregation | FieldAggregationOperator)[] | undefined

export default async function (db: Firestore, query: DatabaseQuery, params: SearchParams, dbConfig: DBConfigFirebase, cohortsMap: CohortsMap) {
  const { users, structure } = dbConfig
  const { table } = query

  const { timestampField } = structure[table] ?? {}
  const tableTimestamp = timestampField ?? dbConfig.timestampField
  const timestampKey = getTimestampKey(table, dbConfig)

  const filters: FirebaseFiltersQuery[] = []

  // Add user filter from the component
  if (params.user) {
    filters.push({ target: dbConfig.users.idField, operator: '==', value: params.user })
  }

  // Add cohorts filter
  if (params.cohort) {
    const cohortUsers: string[] = cohortsMap[params.cohort]

    filters.push({ target: dbConfig.users.idField, operator: 'in', value: cohortUsers })
  }

  // Filter according to frontend date picker
  if (timestampKey && params.startDate && params.endDate) {
    filters.push({
      target: timestampKey,
      operator: '>=',
      value: getTimestampValue(params.startDate, tableTimestamp)
    })

    filters.push({
      target: timestampKey,
      operator: '<=',
      value: getTimestampValue(params.endDate, tableTimestamp)
    })
  }

  // Add user filters
  if (users.filters) {
    const usersList = await (await getUsers(dbConfig)).map((user: any) => user.__key)

    filters.push({ target: dbConfig.users.idField, operator: 'in', value: usersList })
  }

  // Retrieve main table data
  const rawData = await queryData(db, table, filters)

  // Retrieve included tables
  const incData = await buildIncludeQuery(query.include, db)

  // Join data of the multiple documents
  const uniqueKeys = getUniqueKeys(Object.values(rawData))
  const mergedData = Object.entries(rawData).reduce<any[]>((acc, [key, row]) => {
    const docFields = query.fields ?? uniqueKeys

    // ensure the group by field is included in the results
    if (query.groupby && !query.fields?.some(f => f === query.groupby)) {
      docFields.push(query.groupby)
    }

    // Filter fields according to the query
    // We need to filter this here because Firestore doesn't support where filters on multiple fields
    const validFilters = query.filters?.every(filter =>
      compareFilterFunction(row, filter)
    ) ?? true

    if (validFilters) {
      const cleanDoc: any = filterObjectByKeys(rawData[key], docFields)

      docFields.forEach((docKey) => {
        const [key, namedKey] = parseFieldsAttribute(docKey)

        cleanDoc[namedKey] = row[key] ?? NODATA_LABEL
      })

      const newUser = recursiveMerge(query, incData, dbConfig, cleanDoc)

      return [...acc, newUser]
    }

    return acc
  }, [])

  return aggregateData(mergedData, query)
}

const aggregateData = (data: any[], query: DatabaseQuery) => {
  if (query.groupby) {
    const dataFields = query.fields?.filter(field => field !== query.groupby)
    const groupedData = data.reduce(
      (acc: any, row: any) => ({
        ...acc,
        [row[query.groupby ?? '']]: [...(acc[row[query.groupby ?? '']] || []), row]
      }), {})

    const aggregatedData = Object.keys(groupedData).map((key) => {
      const aggregation = calculateArrayAggregation(groupedData[key], dataFields)

      const aggregationObj = aggregation.reduce((acc, key) => {
        const currKey = Object.keys(key)[0]
        const values = Object.values(key)[0]

        return {
          ...acc,
          [currKey]: !acc[currKey] ? values : { ...acc[currKey], ...values }
        }
      }, {})

      return {
        [query.groupby ?? '']: key,
        ...aggregationObj
      }
    })

    return Object.values(aggregatedData)
  } else if (query.fields?.length) {
    // check if any field is an aggregation, otherwise just filter the fields
    if (query.fields.some(field => typeof field !== 'string' && field.operator?.length)) {
      return calculateArrayAggregation(data, query.fields)
    } else if (query.fields.some(field => typeof field !== 'string' && field.name && !field.operator)) {
      return data
    }
  }

  // Return the original array if the fields property is not defined
  return data
}

const calculateArrayAggregation = (data: any[], fields: TFields, groupby?: string) => {
  if (!fields) {
    throw new Error('The \'fields\' property must be defined')
  }

  return fields?.map(field => {
    if (typeof field === 'string' || !field.operator) {
      throw new Error('The \'operator\' property must be defined')
    }

    const fieldKey = field.name ?? field.target
    const results = defaultAsArray(field.operator).map(operator => {
      return [operator, calculateAggregation(data.map(r => r[fieldKey]), operator)]
    })

    // Add groupby field to array
    if (groupby) {
      results.unshift([groupby, data[0][groupby]])
    }

    return {
      [fieldKey]: Object.fromEntries(results)
    }
  })
}

const getTimestampValue = (date: string, timestampField?: TimestampNoSQL) => {
  const type = typeof timestampField === 'object' && timestampField.type

  switch (type) {
    case 'FirebaseTimestamp':
      return new Date(date)
    default:
      return Math.floor(new Date(date).valueOf() / 1000)
  }
}
