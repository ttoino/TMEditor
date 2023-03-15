import express, { json } from 'express'

import usersController from '@app/controllers/users'
import configController from '@app/controllers/config'
import pagesController from '@app/controllers/pages'
import { authMiddleware } from '@app/auth'

const router = express.Router()

// Validate authentication
router.use('/', authMiddleware, json())
router.get('/config', configController.get)
router.put('/config', configController.put)
router.get('/pages/:page?', pagesController.get)
router.put('/pages/:page?', pagesController.put)
router.get('/users', usersController)

export default router
