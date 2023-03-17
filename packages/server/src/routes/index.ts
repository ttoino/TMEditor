import express from 'express'

import usersController from '@app/controllers/users'
import { get as configController } from '@app/controllers/config'
import { get as pagesController } from '@app/controllers/pages'
import { authMiddleware } from '@app/auth'

const router = express.Router()

// Validate authentication
router.use('/', authMiddleware)
router.get('/config', configController)
router.get('/pages/:page?', pagesController)
router.get('/users', usersController)

if (process.env.NODE_ENV !== 'production') {
  import('./editor').then(f => f.default(router))
}

export default router
