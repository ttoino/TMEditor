// @flow
import axios from 'axios'
import AuthTokenFetcher from '../utils/AuthTokenFetcher'

const apiAuthInterceptor = ({ getState }: any, request: any) => {
  const token = process.env.AUTH === 'FIREBASE'
    ? getState().platformMainConfig.authToken : `Bearer ${AuthTokenFetcher.fetch()}`
  request.headers.Authorization = token

  return request
}

const apiClient = (baseURL) => (
  axios.create({
    baseURL: '',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
)

const clients = {
  default: {
    client: apiClient(),
    options: {
      interceptors: {
        request: [apiAuthInterceptor]
      }
    }
  }
}

export default clients
