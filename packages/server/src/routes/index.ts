import express from 'express'

import usersController from '@app/controllers/users'
import configController from '@app/controllers/config'
import pagesController from '@app/controllers/pages'
import { authMiddleware } from '@app/auth'

const router = express.Router()

// Validate authentication
router.use('/', authMiddleware)
router.get('/config', configController)
router.get('/pages/:page?', pagesController)
router.get('/users', usersController)

export default router
