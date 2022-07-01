import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http'

import router from './routes'
import logger from './utils/logger'
import { STARTED_LISTENING } from './constants/logger-messages'
import * as databaseAPI from './database/api'
import { initializeCache } from './utils/cache'
import { initAuth } from './auth'

const API_BASE_URL = process.env.PUBLIC_URL || ''

const PORT = process.env.BACKEND_PORT ? parseInt(process.env.BACKEND_PORT) : (process.env.NODE_ENV === 'production' ? 80 : 3001)

const app = express()

initAuth(app).then(() => {
  app.use(express.json())
  app.use(cors())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())

  app.use(`${API_BASE_URL}/api`, router)

  databaseAPI.setupDatabases().then(() => {
    http.createServer(app).listen(PORT, () => {
      initializeCache()
      logger.info('Listening in /' + API_BASE_URL)
      logger.info(STARTED_LISTENING(PORT))
    })
  })
})

export default app
