import { createClient } from 'redis'
import logger from '@app/utils/logger'
import { ERROR_CACHE, CACHE_CONNECTED, CACHE_NOT_CONNECTED } from '@app/constants/logger-messages'
import { readPlatformConfig } from '@app/parsers/config-parser'
import { SearchParams, DatabaseQuery } from '@types'

const { cache } = readPlatformConfig() || {}

const RECONNECTION_ATTEMPS = 2
const RECONNECTION_WAIT_TIME = 3000 // milliseconds
const CACHE_EXPIRE_TIME = cache?.expireTime || 300 // seconds

let CACHE_ENABLED = false

const reconnectStrategy = (retries: number) => {
  if (retries >= RECONNECTION_ATTEMPS) {
    return new Error('Could not connect to Redis socket')
  }
  return RECONNECTION_WAIT_TIME
}

const client = createClient({
  socket: {
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    host: process.env.REDIS_HOST || 'localhost',
    reconnectStrategy: reconnectStrategy
  },
  password: process.env.REDIS_PASSWORD
})

export const initializeCache = () => {
  client.connect().then(() => {
    CACHE_ENABLED = true
    logger.info(CACHE_CONNECTED)
  }).catch(err => {
    CACHE_ENABLED = false
    logger.warn(CACHE_NOT_CONNECTED(err.message))
  })
}
export const setCache = async (key: string, value: string) => {
  if (!CACHE_ENABLED) return null

  try {
    await client.set(key, value, {
      EX: CACHE_EXPIRE_TIME,
      NX: true
    })
  } catch (error) {
    logger.error(ERROR_CACHE(error))
    return null
  }
}

export const getCache = async (key: string) => {
  if (!CACHE_ENABLED) return null

  try {
    return await client.get(key)
  } catch (error) {
    logger.error(ERROR_CACHE(error))
    return null
  }
}

export const generateCacheKey = (componentQuery: DatabaseQuery, reqQuery: SearchParams) => {
  return JSON.stringify(sortObject({ ...componentQuery, ...reqQuery }))
}

// Sort objects by keys and their values (arrays and objects recursively)
const sortObject = (object: any) => {
  const sortedObject: { [x: string]: any } = {}
  Object.keys(object)
    .sort()
    .forEach(function (v, i) {
      let value = (object as any)[v]
      if (Array.isArray(value)) {
        value = value.map(sortObject)
      } else if (typeof value === 'object' && value !== null) {
        value = sortObject(value)
      }
      sortedObject[v] = value
    })
  return sortedObject
}
