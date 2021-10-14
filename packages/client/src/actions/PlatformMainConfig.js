// @flow
import { API_BASE_URL } from '../config/AccessPoint'
import { getUsers } from './Users'
import { updateCohorts } from './Cohorts'
import { auth } from '../auth/firebase'
import { LOGIN_START, LOGIN_SUCCESS, UPDATE_TOKEN, LOGIN_FAIL } from '../reducers/PlatformMainConfig'

export const getPlatformConfig = () => ({
  type: 'GET_PLATFORM_CONFIG',
  payload: {
    request: {
      method: 'GET',
      url: `${API_BASE_URL}/api/config`
    }
  }
})

export const setupPlatform = () => (dispatch: any, getState: Function) => {
  dispatch(getPlatformConfig()).then(response => {
    if (!response.error) {
      const currentDB = response.payload.data[0]

      dispatch(getUsers(currentDB)).then((users) => {
        if (users.payload?.data && users.payload?.data.length > 0) {
          dispatch(updateCohorts(users.payload.data))
        }
      })
    }
  })
}

export const authenticateWithFirebase = (email: string, password: string) => (dispatch: any) => {
  dispatch({ type: LOGIN_START })

  return auth.signInWithEmailAndPassword(email, password)
    .then(async (response) => {
      const token = await auth.currentUser.getIdToken()

      dispatch({
        type: LOGIN_SUCCESS,
        token
      })
    }).catch((error) => {
      dispatch({ type: LOGIN_FAIL })

      return error
    })
}

export const updateToken = (token: string) => ({
  type: UPDATE_TOKEN,
  token
})
