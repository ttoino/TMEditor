import Keycloak from 'keycloak-js'
import AuthTokenFetcher from '../utils/AuthTokenFetcher'

const keycloakConfigURL = process.env.KEYCLOAK_CONFIG_URL
const authEnabled = process.env.AUTH === 'KEYCLOAK'

export default function authenticate () {
  return new Promise((resolve, reject) => {
    if (authEnabled) {
      const keycloak = new Keycloak(keycloakConfigURL)
      keycloak.init({ onLoad: 'login-required', checkLoginIframe: false })
        .success(authenticated => {
          if (authenticated) {
            AuthTokenFetcher.setKeycloak(keycloak)
            resolve(keycloak)
          } else {
            reject(Error('Authentication failed!'))
          }
        })
        .error(error => reject(Error('Authentication failed! ' + error)))
    } else {
      resolve()
    }
  })
}
