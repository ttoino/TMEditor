import axios from 'axios'
import { endOfToday, format, startOfToday, subDays } from 'date-fns'
import type { PageResponse, ResponseSiteConfig } from '@types'

const NODE_ENV = `${import.meta.env.NODE_ENV}`
const API_URL = `${import.meta.env.API_URL}`

const getApiUrl = (apiUrl?: string) => {
  if (NODE_ENV !== 'production') return API_URL
  return apiUrl || API_URL
}

export const getUIConfig = async () => {
  const response = await axios.get('/ui-config.json')
  return response.data
}

export const getConfig = async (apiUrl?: string): Promise<ResponseSiteConfig> => {
  const response = await axios.get(`${getApiUrl(apiUrl)}/config`)

  return response.data
}

export const getParticipants = async (apiUrl?: string): Promise<any[]> => {
  const response = await axios.get(`${getApiUrl(apiUrl)}/users`)

  return response.data
}

export const getPage = async (page: string | undefined, searchParams: URLSearchParams, apiUrl?: string): Promise<PageResponse> => {
  // Set default date filters
  if (!searchParams.get('startDate')) {
    searchParams.set('startDate', format(subDays(startOfToday(), 7), 'yyyy-MM-dd'))
    searchParams.set('endDate', format(endOfToday(), 'yyyy-MM-dd'))
  }

  const response = await axios.get(`${getApiUrl(apiUrl)}/pages/${page}?${searchParams.toString()}`)

  return response.data
}
