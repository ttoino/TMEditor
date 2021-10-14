import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import authenticate from './auth/keycloak'

authenticate()
  .then(keycloak => {
    ReactDOM.render((<App />), document.getElementById('root'))
  })
  .catch(error => console.error('An error has ocurred', error))
