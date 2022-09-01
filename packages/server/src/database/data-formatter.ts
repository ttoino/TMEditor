import fs from 'fs'
import { readCohortsConfigFile } from '@app/parsers/config-parser'
import { REDUCERS_PATH } from '@app/constants/config-file-paths'
import { ResponseUsers, DBConfig, DataComponent, ResponseData, ValueResponse } from '@types'
import { createCohortsMapByField, flattenObject } from '@app/utils/formatter'
import { round } from '@app/utils'

type TUserData = {
  __key: string,
  [key: string]: any
}

export const formatUserData = (data: TUserData[], dbConfig: DBConfig): ResponseUsers[] => {
  const { users: { labelField } } = dbConfig

  return data.map((user) => {
    const newUser = flattenObject<TUserData>(user)

    return {
      __label: labelField && newUser[labelField] ? newUser[labelField] : newUser.__key,
      __cohort: findCohortKey(data, newUser),
      ...newUser
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
      return data.map(row => flattenObject(row))
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

  return data.flatMap((row) => {
    const rowEntries = []

    for (const field in row) {
      const values = row[field]
      rowEntries.push(Object.entries(values).map(([op, value]: any) => ({
        field: `${field} (${op})`,
        value: typeof value === 'number' ? round(value, precision) : null
      })))
    }
    return rowEntries.flat()
  })
}

// The 'summaryReducer' is similar to the 'valueReducer', but with a different template for field
const summaryReducer = (data: ResponseData[], component: Omit<ValueResponse, 'error'>) => {
  const { precision } = component

  return data.flatMap((row) => {
    const rowEntries = []

    for (const field in row) {
      const values = row[field]
      rowEntries.push(Object.entries(values).map(([op, value]: any) => ({
        field: op,
        value: typeof value === 'number' ? round(value, precision) : null
      })))
    }
    return rowEntries.flat()
  })
}
