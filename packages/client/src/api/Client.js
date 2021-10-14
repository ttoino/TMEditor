import axios from 'axios'
import { API_BASE_URL } from '../config/AccessPoint'
import qs from 'query-string'
import AuthTokenFetcher from '../utils/AuthTokenFetcher'

axios.interceptors.request.use(request => {
  if(AuthTokenFetcher.getKeycloakInstance()) {
    request.headers['Authorization'] = `Bearer ${AuthTokenFetcher.fetch()}`
  }
  return request
})

export const getUsers = (database) => {
  const options = qs.stringify({ database })
  return axios.get(`${API_BASE_URL}/api/users?${options}`)
}

export const getPlatformMainConfig = () => {
  return axios.get(API_BASE_URL + '/api/config')
}
