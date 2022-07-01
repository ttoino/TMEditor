import { NODATA_LABEL } from '@app/constants'
import { getUniqueKeys } from '@app/utils'
import { defaultAsArray } from '@app/utils/default-values-generator'
import { CohortsMap, DatabaseQuery, DBConfigFirebase, FieldAggregationOperator, FirebaseFiltersQuery, SearchParams, TimestampNoSQL } from '@types'
import { calculateAggregation } from '@app/utils/formatter'
import { Firestore } from 'firebase/firestore'
import { queryData } from '../query/cloudfirestore'
import { getTimestampKey } from '../helpers'

type TKeyValue = { [key: string]: any }

export default async function (db: Firestore, query: DatabaseQuery, params: SearchParams, dbConfig: DBConfigFirebase, cohortsMap: CohortsMap) {
  const { users, structure } = dbConfig
  const tables: string[] = defaultAsArray(query.tables)
  const queryFilters: FirebaseFiltersQuery[] = query.filters ? defaultAsArray(query.filters) : []

  const allData: TKeyValue = {}

  // Request user data if necessary
  if (users.filters) {
    const usersData = await queryData(db, users.table, users.filters)

    allData[users.table] = usersData
  }

  // Retrieve data from each table
  for await (const table of tables) {
    const { timestampField, FK } = structure[table]
    const tableTimestamp = timestampField ?? dbConfig.timestampField
    const timestampKey = getTimestampKey(table, dbConfig)

    const filters: FirebaseFiltersQuery[] = []

    // Add component filters
    if (queryFilters?.length) {
      // Accept targets with and without '.'
      filters.push(...queryFilters
        .filter(f => f.target.match(/\./) ? f.target.split('.')[0] === table : f.target)
        .map(f => ({ ...f, target: f.target.match(/\./) ? f.target.split('.').slice(1).join('.') : f.target }))
      )
    }

    // Add user filter from the component
    if (params.user) {
      if (FK.target === dbConfig.users.table) {
        filters.push({ target: FK.field, operator: '==', value: params.user })
      }
    }

    // Add cohorts filter
    if (params.cohort) {
      const cohortUsers: string[] = cohortsMap[params.cohort]

      filters.push({ target: FK.field, operator: 'in', value: cohortUsers })
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
    if (allData[users.table] && FK?.target === users.table) {
      Object.keys(allData[users.table]).forEach(userKey => {
        filters.push({ target: users.idField, operator: '==', value: userKey })
      })
    }

    allData[table] = await queryData(db, table, filters)
  }

  // Join data of the multiple documents
  let mergedData = Object.keys(allData).reduce<any>((acc, table) => {
    const currData = allData[table]

    if (Object.keys(acc).length === 0) {
      return Object.values(currData)
    }

    return acc.reduce((innerJoinedRows: any[], leftRow: any) => {
      const { linkedKey, refTableKey } = getLinkedKeys(dbConfig, table, leftRow)
      // TODO: when __key performance may be improved by accessing key directly
      return [
        ...innerJoinedRows,
        Object.values(currData)
          .filter((rightRow: any) => leftRow[refTableKey] === rightRow[linkedKey])
          .map((rightRow: any) => ({ ...leftRow, ...rightRow }))
      ]
    }, []).flat()
  }, {})

  if (query.groupby) {
    // ensure the group by field is included in the results
    if (!query.fields?.some(f => (f?.name ?? f?.target ?? f) === query.groupby)) {
      query?.fields?.push(query.groupby)
    }

    // group by
    const groupedData = mergedData.reduce(
      (acc: any, row: any) => ({
        ...acc,
        [row[query.groupby ?? '']]: [...(acc[row[query.groupby ?? '']] || []), row]
      }), {})

    mergedData = groupedData

    // TODO: apply aggregations or return first member of each group if none is defined
    const aggregatedData = Object.keys(mergedData).reduce((groupAcc, key) => ({
      ...groupAcc,
      [key]: query?.fields?.length
        ? calculateArrayAggregation(mergedData[key], query.fields)
        : mergedData[key][0]
    }), {})

    mergedData = Object.values(aggregatedData)
  } else if (query.fields?.length) {
    // check if any field is an aggregation, otherwise just filter the fields
    if (query.fields.some(field => typeof field !== 'string' && field.operator?.length)) {
      mergedData = [calculateArrayAggregation(mergedData, query.fields)]
    } else if (query.fields.some(field => typeof field !== 'string' && field.name && !field.operator)) {
      mergedData = mergedData.map((entry: any) => {
        let newObj = {}
        for (const field of query.fields) {
          newObj[field.name] = entry[field.target]
        }
        return newObj
      })
    }
  }

  return formatData(mergedData, query.fields ?? [], query.groupby)
}

const calculateArrayAggregation = (array: TKeyValue[], fields: (string | FieldAggregationOperator)[]) => ({
  ...fields.reduce((aggAcc, field) =>
    !field?.operator?.length // non empty string or array
      ? {
        ...aggAcc,
        [typeof field === 'string'
          ? field
          : field.name ?? field.target]: array[0][typeof field === 'string' ? field : field.target]
      }
      : {
        ...aggAcc,
        ...Object.assign(
          ...(
            defaultAsArray(field.operator)
              .map((operator: string) => ({
                [`${field.name ?? field.target}.${operator}`]: calculateAggregation(array.map(e => e[field.target]), operator)
              }))
          )
        )
      }
    , {})
})

const getLinkedKeys = (dbConfig: DBConfigFirebase, table: string, acc: TKeyValue) => {
  const { structure, users } = dbConfig

  if (structure) {
    if (table === users.table) {
      const linkedTables = Object.keys(structure).filter(key => {
        const spec = structure[key]
        return spec.FK?.target === users.table
      })

      const refTableKey = linkedTables.find(t => Object.keys(acc).some(k => k.startsWith(t)))

      return {
        linkedKey: `${table}.__key`,
        refTableKey: `${refTableKey}.${users.idField}`
      }
    }

    return {
      linkedKey: `${table}.${structure[table].FK.field}`,
      refTableKey: `${structure[table].FK.target}.__key`
    }
  } else {
    throw new Error('Please configure the \'structure\' property')
  }
}

const getPropertiesNames = (data: any[], definedProperties: (string | FieldAggregationOperator)[], groupby?: string) => {
  const uniqueKeys: string[] = getUniqueKeys(data)

  // Remove internal use properties
  if (definedProperties.length === 0) {
    return uniqueKeys.filter(key => !key.endsWith('__key'))
  }

  return [...definedProperties, groupby]
    .filter(p => p)
    .flatMap(defProperty =>
      !defProperty?.operator?.length
        ? typeof defProperty === 'string' ? defProperty : defProperty?.name ?? defProperty?.target
        : defaultAsArray(defProperty.operator)
          .map((operator: string) => `${defProperty.name ?? defProperty.target}.${operator}`)
    )
}

/**
 * Picks properties defined in the component
 * Adds NA to missing properties
 */
const formatData = (data: any[], properties: (string | FieldAggregationOperator)[], groupby?: string) => {
  const newProperties = getPropertiesNames(data, properties, groupby)

  return data.map((entry) => {
    const newObj: TKeyValue = {}

    newProperties.forEach((prop) => {
      const newKey = Object.keys(entry).find(k => k === prop) ??
        Object.keys(entry).find(key => key.match(new RegExp(`.*\\.${prop}`)))

      if (newKey) {
        if (Object.prototype.hasOwnProperty.call(entry, newKey)) {
          newObj[newKey] = Number.isNaN(entry[newKey]) ? entry[newKey].toString() : entry[newKey]
        } else {
          newObj[newKey] = NODATA_LABEL
        }
      } else {
        newObj.INVALID = 'Invalid field name'
      }
    })

    return newObj
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
