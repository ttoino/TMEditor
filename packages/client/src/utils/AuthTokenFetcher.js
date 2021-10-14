var _kc = ''
var _interval
const refreshToken = () => _kc && _kc.updateToken(10)

export default {
  setKeycloak (keycloak) {
    _kc = keycloak

    if (_interval) clearInterval(_interval)
    if (_kc) {
      _interval = setInterval(refreshToken, 1000)
    }
  },

  fetch () {
    return _kc.token
  },

  getKeycloakInstance () {
    return _kc
  }
}
