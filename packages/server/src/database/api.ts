import * as sequelizeModule from './connectors/sequelize/sequelize-module'
import * as firebaseModule from './connectors/firebase/firebase-module'
import * as fhirModule from './connectors/fhir/fhir-module'
import { ResponseData, ResponseUsers, SearchParams, DatabaseQuery, QueryMeta, CohortsMap } from '@types'
import { readDBInfoByID, readCohortsConfigFile, readDBMetadata, readPlatformConfig } from '@app/parsers/config-parser'
import { formatUserData } from './data-formatter'
import { createCohortsMapByField } from '@app/utils/formatter'

const getModule = (moduleName: string): any => {
  switch (moduleName) {
    case 'firebase':
      return firebaseModule
    case 'fhir':
      return fhirModule
    default: // sequelize
      return sequelizeModule
  }
}

/**
 * Initialize databases
 * @returns Promise
 */
export const setupDatabases = async () => {
  const databasesConfigs = readDBMetadata()
  const connectionPromises: Promise<void>[] = []

  databasesConfigs.forEach((config) => {
    connectionPromises.push(getModule(config.type).connectToDatabase(config))
  })

  return Promise.all(connectionPromises)
}

/**
 *
 * @param dbLocation DB identifier
 * @returns An array of objects that holds participants data
 *
 * [{ username: john, age: 56, gender: 'M' }, { username: 'Steve', age: 43, gender: 'M' }]
 */
export const getUsers = async (dbLocation?: string): Promise<ResponseUsers[]> => {
  const { databases, usersDB } = readPlatformConfig()
  const dbConfig = readDBInfoByID(dbLocation ?? (usersDB || databases[0].id)) // Use the first db if not defined

  const rawData = await getModule(dbConfig.type).getUsers(dbConfig)

  // TODO: Currently the rawData is an object in which the keys are the user ids, perhaps this it easier for Firebase...
  // Check if it's better to keep this structure or use an array of objects. In any case the response should be an array of object to match the frontend
  return formatUserData(rawData, dbConfig)
}

/**
 *
 * @param DatabaseQuery to execute
 * @param params Search params from the frontend (startDate, endDate, user, cohort)
 * @returns An array of objects with the data. It might aggregate data from multiple tables/docs
 *
 * * [{ value: 2, type: 'A', userId: 1 }, { value: 20, type: 'B', userId: 2 }]
 */
export const getData = async (query: DatabaseQuery, params: SearchParams): Promise<ResponseData[]> => {
  const dbInfo = readDBInfoByID(query.database)
  const cohortsData = await getCohortsMap(query.database)

  return await getModule(dbInfo.type).getData(query, params, dbInfo, cohortsData)
}

export const getMeta = async (query: DatabaseQuery): Promise<QueryMeta> => {
  const dbInfo = readDBInfoByID(query.database)
  return await getModule(dbInfo.type).getMeta(query, dbInfo)
}

/**
 * Transforms cohorts file info to a CohortsMap
 * @param dbLocation DB identifier
 * @returns A cohorts map
 */
const getCohortsMap = async (dbLocation: string): Promise<CohortsMap | undefined> => {
  const { groupByField, map } = readCohortsConfigFile()
  const { usersDB } = readPlatformConfig()

  // If cohorts are created manually just return that map
  if (map) return map

  if (groupByField) {
    const users = await getUsers(usersDB ?? dbLocation)
    return createCohortsMapByField(users, groupByField)
  }

  return undefined
}