import KcAdminClient from '@keycloak/keycloak-admin-client'
import type ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation'
import { RoleMappingPayload } from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation'
import type { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth'
import logger from '../utils/logger'
import { KeycloakAuthConfig, readAuthConfigFile } from '../parsers/config-parser'

const config: KeycloakAuthConfig = readAuthConfigFile() as KeycloakAuthConfig
logger.trace('Read auth config file')

export const setupRealm = async function () {
  try {
    const kcAdminClient = new KcAdminClient({ baseUrl: config.baseUrl })
    const credentials: Credentials = {
      grantType: 'client_credentials',
      clientId: config.adminClientId ?? '',
      clientSecret: config.adminClientSecret
    }

    await kcAdminClient.auth(credentials)

    await createRealm(kcAdminClient, credentials)

    kcAdminClient.setConfig({
      realmName: config.clientRealm
    })
    const client = await getOrCreateClient(kcAdminClient)

    await createClientRoles(kcAdminClient, client)
    await createGroups(kcAdminClient, client)
  } catch (e) {
    console.error(e)
    throw e
  }
}

const createRealm = async (kcAdminClient: KcAdminClient, credentials: Credentials) => {
  const realm = await kcAdminClient.realms.findOne({ realm: config.clientRealm })

  if (!realm) {
    logger.debug('The realm does not exist yet, creating')

    const createdRealm = await kcAdminClient.realms.create({
      id: config.clientRealm,
      realm: config.clientRealm,
      enabled: true
    })

    logger.info('Created realmn >> ', createdRealm)

    // we need to reauthenticate for some reason after creating the realmn
    await kcAdminClient.auth(credentials)
  }
}

const getOrCreateClient = async (kcAdminClient: KcAdminClient) => {
  let client

  client = await kcAdminClient.clients.find({ clientId: config.clientId })
  client = client.length === 1 ? client[0] : undefined

  if (!client) {
    logger.debug('Client does not exist yet, creating')
    client = await kcAdminClient.clients.create({
      clientId: config.clientId,
      bearerOnly: true
    })
    logger.info('Created client >> ', client)
  }
  return client
}

const createClientRoles = async (kcAdminClient: KcAdminClient, client: ClientRepresentation) => {
  const allClientRoles = [...new Set(Object.values(config.groups).flatMap(array => array))]

  const roles = await kcAdminClient.clients.listRoles({ id: client.id! })
  logger.trace('These are the currently created client roles >> ', roles)

  for (const role of allClientRoles.filter(role => !roles.find(r => r.name === role))) {
    logger.debug('Creating new client role >> ', role)
    await kcAdminClient.clients.createRole({
      id: client.id,
      name: role
    })
  }
}

const createGroups = async (kcAdminClient: KcAdminClient, client: ClientRepresentation) => {
  const allGroups = Object.keys(config.groups)

  const createdGroups = await kcAdminClient.groups.find()
  for (const group of allGroups) {
    let createdGroup = createdGroups.find(g => g.name === group)
    if (!createdGroup) {
      console.log('Creating group: ', group)
      createdGroup = await kcAdminClient.groups.create({
        name: group
      })
    }

    const groupClientRoles = config.groups[group]
    const currentRoles = await kcAdminClient.groups.listClientRoleMappings({
      id: createdGroup.id!,
      clientUniqueId: client.id!
    })
    const rolesToDelete = currentRoles.filter(r => !groupClientRoles.includes(r.name!)) as RoleMappingPayload[]
    if (rolesToDelete.length > 0) {
      console.log('Deleting roles >> ', rolesToDelete)
      await kcAdminClient.groups.delClientRoleMappings({
        id: createdGroup.id!,
        clientUniqueId: client.id!,
        roles: rolesToDelete
      })
    }

    const availableRoles = await kcAdminClient.groups.listAvailableClientRoleMappings({
      id: createdGroup.id!,
      clientUniqueId: client.id!
    }) as RoleMappingPayload[]

    console.log('Available roles for group: ', group, ' >> ', availableRoles)

    // TODO: delete assignment for other roles not on the list (these may have changed)

    const newRoles = availableRoles.filter(a => groupClientRoles.find(r => r === a.name))
    if (newRoles.length > 0) {
      console.log('Assigning roles to group: ', newRoles, ' >> ', group)
      await kcAdminClient.groups.addClientRoleMappings({
        id: createdGroup.id!,
        clientUniqueId: client.id!,
        roles: newRoles
      })
    }
  }
}
