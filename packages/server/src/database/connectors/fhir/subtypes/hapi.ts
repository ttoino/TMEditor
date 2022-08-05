import logger from '@app/utils/logger'
import { DBConfigFhir, DBHapiFhir, UsersConfig, BundleEntry, HapiFhirDatabaseQuery, SearchParams, CohortsMap } from '@types'
import { defaultAsArray } from '@app/utils/default-values-generator'
import axios from 'axios'
import { ERROR_FETCHING_FHIR_DATA } from '@app/constants/logger-messages'
import { formatData, formatUsersData, generateFiltersQuery } from '../fhir-data-formatter'
import { formatDate } from '@app/utils/formatter'

const connectToDatabase = (dbConfig: DBConfigFhir): DBHapiFhir => {
  const { config, authentication } = dbConfig
  return {
    url: config.url,
    authentication
  }
}

const getUsers = async (dbInstance: DBHapiFhir, usersConfig: UsersConfig) => {
  const { fields, filters = [], idField } = usersConfig

  let users: object[] = []
  const requestData: BundleEntry[] = await fetchData(dbInstance, 'Patient', generateFiltersQuery(filters))
  if (requestData) {
    users = formatUsersData(requestData, defaultAsArray(fields), idField)
  }

  return users
}

const getData = async (dbInstance: DBHapiFhir, query: HapiFhirDatabaseQuery, params: SearchParams, cohorts: CohortsMap) => {
  const { user, startDate, endDate, cohort } = params

  const filters = defaultAsArray(query.filters)
  if (user) filters.push({ target: 'subject', operator: '==', value: `Patient/${user}` })
  if (startDate) filters.push({ target: 'date', operator: '>=', value: formatDate(startDate) })
  if (endDate) filters.push({ target: 'date', operator: '<=', value: formatDate(endDate) })

  if (cohort && Object.prototype.hasOwnProperty.call(cohorts, cohort)) {
    const cohortUsers: string[] = cohorts[cohort]
    filters.push({ target: 'subject', operator: 'in', value: cohortUsers.join(',') })
  }

  const requestData: BundleEntry[] = await fetchData(dbInstance, query.tables, generateFiltersQuery(filters))

  return formatData(requestData, defaultAsArray(query.fields), query.groupby)
}

const fetchData = async (dbInstance: DBHapiFhir, resource: string, filters: string): Promise<BundleEntry[]> => {
  const { url, authentication } = dbInstance

  let data: BundleEntry[] = []
  try {
    let headers: any
    if (authentication && 'bearer' in authentication) {
      headers = { Authorization: `Bearer ${authentication.bearer}` }
    } else if (authentication && 'username' in authentication && 'password' in authentication) {
      headers = { Authorization: `Basic ${authentication.username}:${authentication.password}` }
    }

    // Hapi Fhir only allows to query a max of 500 entries
    const response = await axios(`${url}/${resource}?_count=500&${filters}`, { headers })
    if (response) {
      data = data.concat(response.data.entry || [])

      // Recursively get all entries
      let tempResponse = response
      while (tempResponse.data.link.length > 1 && tempResponse.data.link[1].relation === 'next') {
        const nextUrl = tempResponse.data.link[1].url
        tempResponse = await axios(nextUrl, { headers })
        if (tempResponse) {
          data = data.concat(tempResponse.data.entry)
        }
      }
    }
  } catch (err: any) {
    logger.error(ERROR_FETCHING_FHIR_DATA(err.message))
  }

  return data
}

export default { connectToDatabase, getUsers, getData }
