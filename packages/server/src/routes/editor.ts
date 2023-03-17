import { Router } from 'express'
import { put as configController } from '@app/controllers/config'
import { put as pagesController } from '@app/controllers/pages'

export default (router: Router) => {
  router.put('/config', configController)
  router.put('/pages/:page?', pagesController)
}
