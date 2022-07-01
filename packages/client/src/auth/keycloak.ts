import Keycloak from 'keycloak-js'
import type { TAuthProvider } from '.'

type TKeycloakProvider = TAuthProvider & {
  keycloak?: Keycloak.KeycloakInstance,
  _interval?: number
}

const formatToken = (token: string) => `Bearer ${token}`

export default {
  keycloak: undefined,

  init: async function (config: Keycloak.KeycloakConfig, onTokenChange) {
    const kc = this.keycloak = Keycloak(config)
    const authenticated = await kc.init({ onLoad: 'login-required', checkLoginIframe: false })
    if (!authenticated) throw new Error('There was a problem authenticating user')
    onTokenChange(formatToken(kc.token!))

    clearInterval(this._interval)
    this._interval = setInterval(() => {
      kc.updateToken(30)
        .then(refreshed => refreshed && onTokenChange(formatToken(kc.token!)))
    }, 1000)

    return formatToken(kc.token!)
  },

  authenticate: async function () { },

  hasOwnLoginPage: () => true,

  signOut: async function () {
    return await this.keycloak?.logout()
  }
} as TKeycloakProvider
