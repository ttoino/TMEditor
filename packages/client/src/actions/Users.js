import qs from 'query-string'
import { API_BASE_URL } from '../config/AccessPoint'

export const updateUsers = (payload) => {
  return {
    type: 'UPDATE_USERS',
    payload: payload
  }
}

export const getUsers = (database) => {
  const options = qs.stringify({ database })

  return {
    type: 'GET_USERS',
    payload: {
      request: {
        method: 'GET',
        url: `${API_BASE_URL}/api/users?${options}`
      }
    }
  }
}
