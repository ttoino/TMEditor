import logger from '@app/utils/logger'
import { HapiFhirDatabaseQuery, DBConfigFhir, DBHapiFhir, SearchParams, CohortsMap } from '@types'
import { SUCCESSFULLY_CONNECTED_TO_DB, INVALID_FHIR_SUBTYPE } from '@app/constants/logger-messages'
import hapi from './subtypes/hapi'

type DBInstances = { [key: string]: DBHapiFhir }

const databaseInstances: DBInstances = {}

export const connectToDatabase = async (dbConfig: DBConfigFhir) => {
  const { subtype, id } = dbConfig

  switch (subtype) {
    case 'hapi':
      databaseInstances[id] = hapi.connectToDatabase(dbConfig)
      logger.info(SUCCESSFULLY_CONNECTED_TO_DB(id))
      return
    default:
      logger.error(INVALID_FHIR_SUBTYPE(id))
  }
}

export const getUsers = async (dbConfig: DBConfigFhir) => {
  const { subtype, users, id } = dbConfig

  const dbInstance = databaseInstances[id]

  switch (subtype) {
    case 'hapi':
      return await hapi.getUsers(dbInstance, users)
    default:
      logger.error(INVALID_FHIR_SUBTYPE(id))
  }
}

export const getData = async (query: HapiFhirDatabaseQuery, params: SearchParams, dbConfig: DBConfigFhir, cohorts: CohortsMap) => {
  const { subtype, id } = dbConfig

  const dbInstance = databaseInstances[id]

  switch (subtype) {
    case 'hapi':
      return await hapi.getData(dbInstance, query, params, cohorts)
    default:
      logger.error(INVALID_FHIR_SUBTYPE(id))
  }
}

export const getMeta = async (query: HapiFhirDatabaseQuery, dbConfig: DBConfigFhir) => {
  const { subtype, id } = dbConfig

  switch (subtype) {
    case 'hapi':
      return {
        timestamp: 'date' // Hapi Fhir can only be filters by date using 'date' property
      }
    default:
      logger.error(INVALID_FHIR_SUBTYPE(id))
  }
}
