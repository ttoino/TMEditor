import _ from 'lodash'

export const defaultAsArray = <T>(val?: T | T[]): T[] =>
  !Array.isArray(val)
    ? (val ? [val] : [])
    : val

export const defaultDatabaseID = (val: any) => (!val ? 'default' : val)

export const defaultOperator = (val: any) => (val ? val.toLowerCase() : 'avg')
