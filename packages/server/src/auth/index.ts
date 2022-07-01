import { NextFunction, Request, Response, Express } from 'express'

import { AuthProviderKey, readAuthConfigFile } from '@app/parsers/config-parser'
import { keycloak, keycloakAuthEnabled } from '../auth/keycloak-protect'
import { firebaseProvider } from '../auth/firebase-provider'

import * as keycloakProtect from './keycloak-protect'
import * as keycloakAdmin from './keycloak-admin'

const { provider } = readAuthConfigFile() ?? {}

export const initAuth = async (app: Express) => {
  if (keycloakAuthEnabled) {
    return await keycloakAdmin.setupRealm().then(() => {
      keycloakProtect.init(app)
    })
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (provider === AuthProviderKey.firebase) {
    return firebaseProvider(req, res, next)
  } else if (keycloakAuthEnabled) {
    return keycloak?.protect()(req, res, next)
  } else {
    next()
  }
}
