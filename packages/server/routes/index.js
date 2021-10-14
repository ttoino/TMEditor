const express = require('express')
const authMiddleware = require('./authMiddleware')
const { configController, userController, cacheController } = require('../controllers')
const router = express.Router()

// Validate authentication
router.use('/', authMiddleware)

router.get('/config', configController.getPlatformConfig)
router.get('/config/pages/:page/users/:id?', configController.getUIPageConfig)
router.get('/users', userController.getAllUsers)
router.get('/cache', cacheController.resetCache)

module.exports = router
