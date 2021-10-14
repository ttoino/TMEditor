// Libs
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('./config/logger.js')
const cors = require('cors')
const http = require('http')
require('dotenv').config({ path: path.resolve(__dirname, 'config/.env') })
require('./utils/object-extended')

const { initializeCache } = require('./cache')
const { STARTED_LISTENING } = require('./utils/constants/logger-messages')
const databaseAPI = require('./database/api')
const router = require('./routes/index.js')

const API_BASE_URL = process.env.PUBLIC_URL || ''
const PORT = process.env.BACKEND_PORT || process.env.NODE_ENV === 'production' ? process.env.BACKEND_PORT || 80 : 3001

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(`${API_BASE_URL}/api`, router)

initializeCache()
databaseAPI.setUpDatabase().then(() => {
  http.createServer(app).listen(PORT, () => {
    logger.info('Listening in /' + API_BASE_URL)
    logger.info(STARTED_LISTENING(PORT))
  })
})

module.exports = app
