// @flow
import type { MainConfigState } from '../types'

const INITIAL_STATE: MainConfigState = {
  title: '',
  abbreviation: '',
  pages: [],
  dashboard: {},
  usersLocation: [],
  isLoadingConfig: true,
  isAuthenticating: false,
  authenticated: false,
  authToken: null
}

export const GET_PLATFORM_CONFIG = 'GET_PLATFORM_CONFIG'
export const GET_PLATFORM_CONFIG_SUCCESS = 'GET_PLATFORM_CONFIG_SUCCESS'
export const GET_PLATFORM_CONFIG_FAIL = 'GET_PLATFORM_CONFIG_FAIL'

export const LOGIN_START = 'LOGIN_START'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAIL = 'LOGIN_FAIL'
export const UPDATE_TOKEN = 'UPDATE_TOKEN'

export default (state: MainConfigState = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case GET_PLATFORM_CONFIG_SUCCESS:
      return { ...state, ...action.payload.data, isLoadingConfig: false }
    case GET_PLATFORM_CONFIG_FAIL:
      return INITIAL_STATE
    case LOGIN_START:
      return { ...state, isAuthenticating: true }
    case LOGIN_SUCCESS:
      return { ...state, authenticated: true, isAuthenticating: false, authToken: action.token }
    case LOGIN_FAIL:
      return { ...state, isAuthenticating: false }
    case UPDATE_TOKEN:
      return { ...state, authToken: action.token }
    default:
      return state
  }
}
