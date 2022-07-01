import crypto from 'crypto'
import * as express from 'express'
import session, { MemoryStore } from 'express-session'
import type KeycloakConnect from 'keycloak-connect'
import Keycloak from 'keycloak-connect'
import { AuthProviderKey, KeycloakAuthConfig, readAuthConfigFile } from '../parsers/config-parser'
import logger from '../utils/logger'

const config = readAuthConfigFile()

const kcAuthEnabled = config?.provider === AuthProviderKey.keycloak
let memoryStore: MemoryStore

let kc: KeycloakConnect.Keycloak | null = null
if (kcAuthEnabled) {
  logger.info('Keycloak auth is enabled')
  const keycloakConfig = config as KeycloakAuthConfig
  memoryStore = new session.MemoryStore()
  kc = new Keycloak({ store: memoryStore }, {
    realm: keycloakConfig.clientRealm,
    'bearer-only': true,
    resource: keycloakConfig.clientId,
    'auth-server-url': keycloakConfig.baseUrl,
    'ssl-required': '',
    'confidential-port': 0
  })
}

export const init = (app: express.Application) => {
  if (kc) {
    logger.info('Keycloak is being initialized')
    app.use(session({
      secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
      resave: false,
      saveUninitialized: true,
      store: memoryStore
    }))
    app.set('trust proxy', true)
    app.use(kc.middleware())
  }
}

export const validatePermissions =
  async (req: express.Request, res: express.Response, permissions?: string[] | string): Promise<boolean> => {
    if (!kcAuthEnabled || !permissions || permissions.length === 0) return true

    if (!Array.isArray(permissions)) {
      permissions = [permissions]
    }

    const grant = await kc?.getGrant(req, res)
    return permissions.some(permission => grant?.access_token?.hasApplicationRole(config.clientId, permission))
  }

export const keycloak = kc
export const keycloakAuthEnabled = kcAuthEnabled
