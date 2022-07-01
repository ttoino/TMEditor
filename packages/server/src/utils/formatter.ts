import { AggregationOperator, CohortsMap } from '@types'

export const concatStringsByDot = (s1: string, s2: string) => {
  return s1 + '.' + s2
}

export const replaceNullObjProps = (obj: any, value: any) => {
  Object.keys(obj).forEach(function (key) {
    if (!obj[key]) {
      obj[key] = value
    }
  })
  return obj
}

export const renameKeys = (data: any[]) => {
  return data.map(row => {
    const newObj: { [key: string]: any } = {}

    for (const key in row) {
      const keyEnd = key.split('.').pop()

      if (keyEnd) {
        newObj[keyEnd] = row[key]
      }
    }
    return newObj
  })
}

export const createCohortsMapByField = (users: any[], groupByField: string): CohortsMap => {
  return users.reduce<{ [key: string]: any[] }>((acc, curr) => {
    const key = curr[groupByField]
    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(curr.__key)

    return acc
  }, {})
}

/**
 * Aggregates values from @values array using an @operator .
 *
 * @param values    An array of values to be aggregated.
 * @param operator  The operator used to aggregate values (avg, max, min, sum, count).
 * @returns         The resulting value of the aggregation
 */
export const calculateAggregation = (values: any[], operator: AggregationOperator) => {
  switch (operator) {
    case 'avg':
      return values.reduce(
        (avg, val, _, { length }) => avg + parseFloat(val) / length,
        0.0)
    case 'max':
      return Math.max(...values)
    case 'min':
      return Math.min(...values)
    case 'sum':
      return values.reduce((sum, val) => sum + parseFloat(val), 0.0)
    case 'count':
      return values.length
  }
}

/**
 * Validates and returns a @date in the YYYY-MM-DD format.
 *
 * @param date    An instance of Date or a string in YYYY-MM-DD format.
 * @returns       The date in the format YYYY-MM-DD or throws an error.
 */
export const formatDate = (date: any) => {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10)
  } else if (typeof date === 'string' && regEx.test(date)) {
    return date
  } else {
    throw new Error(`Invalid date: ${date}`)
  }
}
