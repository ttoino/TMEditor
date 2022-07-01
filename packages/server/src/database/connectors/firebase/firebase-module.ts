import { NODATA_LABEL } from '@app/constants'
import { SIGN_IN_FAILED, SUCCESSFULLY_CONNECTED_TO_DB } from '@app/constants/logger-messages'
import { concatStringsByDot } from '@app/utils/formatter'
import logger from '@app/utils/logger'
import { CohortsMap, DatabaseQuery, DBConfigFirebase, SearchParams } from '@types'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { connectFirestoreEmulator, Firestore, getFirestore } from 'firebase/firestore'
import getDenormalizedData from './paradigms/denormalized-paradigm'
import { queryData } from './query/cloudfirestore'
import { defaultAsArray } from '../../../utils/default-values-generator'
import { getTimestampKey } from './helpers'

type DBInstances = { [key: string]: Firestore }

const databaseInstances: DBInstances = {}

export const connectToDatabase = async (dbConfig: DBConfigFirebase) => {
  const { config, authentication, id } = dbConfig

  // Initialize and save instance
  const firestoreApp = initializeApp(config, id)
  databaseInstances[id] = getFirestore(firestoreApp)

  if (process.env.FIREBASE_EMULATOR_HOST && process.env.FIREBASE_EMULATOR_PORT) {
    logger.info('Using firebase emulator')
    connectFirestoreEmulator(databaseInstances[id], process.env.FIREBASE_EMULATOR_HOST, parseInt(process.env.FIREBASE_EMULATOR_PORT))
  }

  // Currently only supports sign in with email and password
  if (authentication) {
    const auth = getAuth(firestoreApp)

    try {
      await signInWithEmailAndPassword(auth, authentication.email, authentication.password)

      logger.info(SUCCESSFULLY_CONNECTED_TO_DB(id))
    } catch (error: any) {
      logger.error(SIGN_IN_FAILED(error.code, error.message))
    }
  } else {
    logger.info(SUCCESSFULLY_CONNECTED_TO_DB(id))
  }
}

export const getUsers = async (dbConfig: DBConfigFirebase) => {
  const { users, id } = dbConfig
  const { fields, filters = [] } = users
  const dbInstance = getDatabase(id)

  const rawData = await queryData(dbInstance, users.table, filters)

  return Object.keys(rawData).map(userKey => {
    const user = rawData[userKey]
    const newUser: { [key: string]: any } = {}

    // Filter fields
    getUserFieldNames(user, fields).forEach((key: string) => {
      const fieldKey = concatStringsByDot(users.table, key)
      newUser[key] = user[fieldKey] ?? NODATA_LABEL
    })

    // Adds user key for internal use
    newUser.__key = userKey

    return newUser
  })
}

export const getData = async (query: DatabaseQuery, params: SearchParams, dbConfig: DBConfigFirebase, cohortsMap: CohortsMap) => {
  // TODO: Add support to firebase realtime and other data structure paradigms
  const firebaseDB = getDatabase(dbConfig.id)
  const rawData = await getDenormalizedData(firebaseDB, query, params, dbConfig, cohortsMap)

  return rawData
}

export const getMeta = async (query: DatabaseQuery, dbConfig: DBConfigFirebase) => {
  const table = defaultAsArray(query.tables)[0]

  return {
    timestamp: getTimestampKey(table, dbConfig)
  }
}

const getDatabase = (id: string) => databaseInstances[id]

const getUserFieldNames = (user: any, fields?: string[]) => {
  if (fields) return fields

  return Object.keys(user).map((key) => {
    return key.split('.')[1]
  })
}
