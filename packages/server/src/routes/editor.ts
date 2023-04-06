import { Router } from 'express'
import { put as configController } from '@app/controllers/config'
import { put as pagesController } from '@app/controllers/pages'
import * as reducersController from '@app/controllers/reducers'

export default (router: Router) => {
  router.put('/config', configController)
  router.put('/pages/:page?', pagesController)
  router.get('/reducers', reducersController.get)
  router.put('/reducers', reducersController.put)
}
