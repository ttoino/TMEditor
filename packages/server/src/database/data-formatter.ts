import fs from 'fs'
import { readCohortsConfigFile } from '@app/parsers/config-parser'
import { REDUCERS_PATH } from '@app/constants/config-file-paths'
import { ResponseUsers, DBConfig, DataComponent, ResponseData, ValueResponse } from '@types'
import { createCohortsMapByField } from '@app/utils/formatter'
import { round } from '@app/utils'

export const formatUserData = (data: any[], dbConfig: DBConfig): ResponseUsers[] => {
  const { users: { labelField } } = dbConfig

  return data.map((user) => {
    return {
      __label: labelField ? user[labelField] : user.__key,
      __cohort: findCohortKey(data, user),
      ...user
    }
  })
}

export const formatComponentData = (data: any[], component: DataComponent) => {
  return applyReducers(data, component)
}

const findCohortKey = (users: any[], user: any): string | undefined => {
  const { groupByField, map } = readCohortsConfigFile()
  const cohortsMap = map ?? (groupByField && createCohortsMapByField(users, groupByField))

  if (cohortsMap) {
    return Object.keys(cohortsMap).find(cohortKey => {
      return cohortsMap[cohortKey].some((__key: string) => __key === user.__key)
    })
  }

  return undefined
}

const applyReducers = (data: ResponseData[], component: DataComponent): ResponseData[] => {
  if (component.reducer) {
    const customReducers = loadCustomReducers()
    return customReducers && customReducers[component.reducer](data, component)
  }

  switch (component.type) {
    case 'value':
      return valueReducer(data, component)
    case 'summary':
      return summaryReducer(data, component)
    default:
      return data
  }
}

const loadCustomReducers = () => {
  if (fs.existsSync(`${REDUCERS_PATH}index.js`)) {
    return require(/* webpackIgnore: true */ `../${REDUCERS_PATH}index.js`)
  } else {
    throw new Error('File does not exist. Please export some function from config/reducers/index.js')
  }
}

const valueReducer = (data: ResponseData[], component: Omit<ValueResponse, 'error'>) => {
  const { precision } = component

  return Object.entries(data[0]).map(([field, value]) => {
    const [name, op] = field.split('.')

    return {
      field: `${name} (${op})`,
      value: round(value, precision)
    }
  })
}

const summaryReducer = (data: ResponseData[], component: Omit<ValueResponse, 'error'>) => {
  const { precision } = component

  return Object.entries(data[0]).map(([field, value]) => ({
    field: field.split('.').pop(),
    value: round(value, precision)
  }))
}
