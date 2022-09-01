import { FiltersQuery } from '@types'

// Get all the unique keys from an array of objects
export const getUniqueKeys = (data: any[]) => Object.keys(data.reduce((result, obj) => {
  return Object.assign(result, obj)
}, {}))

export const round = (value: number, precision = 2): number => {
  if (typeof value !== 'number') {
    return value
  }

  const exp = Math.pow(10, precision)

  return Math.round((value + Number.EPSILON) * exp) / exp
}

/**
 * Compare two values based on filter
 */
export const compareFilterFunction = (row: any, filter: FiltersQuery) => {
  const compareMap: { [key: string]: (a: string, b: string) => void } = {
    '>': (a: any, b: any) => a > b,
    '>=': (a: any, b: any) => a >= b,
    '<': (a: any, b: any) => a < b,
    '<=': (a: any, b: any) => a <= b,
    '==': (a: any, b: any) => a === b,
    '!=': (a: any, b: any) => a !== b
  }
  return compareMap[filter.operator](row[filter.target], filter.value)
}

export const defaultAsArray = <T>(val?: T | T[]): T[] =>
  !Array.isArray(val)
    ? (val ? [val] : [])
    : val
