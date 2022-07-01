import React, { createContext, useContext, useEffect, useReducer } from 'react'
import axios from 'axios'

import FirebaseProvider from './firebase'
import KeycloakProvider from './keycloak'
import { useUIConfig } from '../config-provider'

interface IAuthContext {
  hasAuth?: boolean,
  isAuthenticating: boolean,
  authenticated: boolean,
  hasOwnLoginPage: boolean,
  authToken?: string,
  authenticate(options: any): any,
  signOut(): any
}

type TAuthCredentials = {
  email: string,
  password: string
}

export type TAuthProvider = {
  hasOwnLoginPage(): boolean,
  init(config: any, onTokenChange: (token: string) => void): void,
  authenticate(credentials?: TAuthCredentials): Promise<string | undefined>,
  signOut(): void
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export default AuthContext

const defaultState = {
  isAuthenticating: true,
  authenticated: false,
  authToken: null,
  isInitializing: true
}

const reducer = (prevState = defaultState, action: any) => {
  switch (action.type) {
  case 'INITIALIZED':
    return { ...prevState, isInitializing: false }
  case 'SIGN_IN':
    return { ...prevState, authenticated: true, isAuthenticating: false, authToken: action.authToken }
  case 'SIGN_OUT':
    return { ...prevState, authenticated: false, authToken: undefined }
  case 'UPDATE_TOKEN':
    return { ...prevState, authenticated: true, authToken: action.authToken }
  default:
    return prevState
  }
}

const providersMap: { [provider: string]: TAuthProvider } = {
  firebase: FirebaseProvider,
  keycloak: KeycloakProvider
}

const setInterceptorHeaders = (token: string) => {
  axios.interceptors.request.use(config => {
    if (config.headers) {
      config.headers.Authorization = token
    }
    return config
  })
}

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState)
  const uiConfig = useUIConfig()

  const AuthProvider = uiConfig?.auth?.provider && providersMap[uiConfig.auth.provider]

  useEffect(() => {
    if (uiConfig) {
      if (AuthProvider) {
        AuthProvider.init(uiConfig.auth.config, (token: string) => setInterceptorHeaders(token))
          .then((authToken?: string) => {
            if (authToken) {
              dispatch({ type: 'SIGN_IN', authToken })
              setInterceptorHeaders(authToken)
            }
          })
          .finally(() => dispatch({ type: 'INITIALIZED' }))
      } else {
        dispatch({ type: 'INITIALIZED' })
      }
    }
  }, [uiConfig, AuthProvider])

  const authContext = React.useMemo((): IAuthContext => ({
    hasAuth: !!uiConfig?.auth?.provider,
    authToken: state?.authToken,
    isAuthenticating: !!state?.isAuthenticating,
    authenticated: !!state?.authenticated,
    hasOwnLoginPage: !!AuthProvider?.hasOwnLoginPage(),
    authenticate: async ({ email, password }) => {
      const token = await AuthProvider?.authenticate({ email, password })

      setInterceptorHeaders(token)

      dispatch({ type: 'SIGN_IN', authToken: token })
    },
    signOut: async () => {
      await AuthProvider?.signOut()
      dispatch({ type: 'SIGN_OUT' })
    }
  }), [state, uiConfig, AuthProvider])

  return (
    <AuthContext.Provider value={authContext}>
      {!state?.isInitializing && children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  return useContext(AuthContext)
}
