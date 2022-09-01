import { Op, WhereOperators, WhereOptions } from 'sequelize'
import type { FiltersQuery } from '@types'

export const createQueryFilters = (filters: FiltersQuery[] = []): WhereOptions => {
  const queryFilters: WhereOptions = {}

  filters.forEach(filter => {
    queryFilters[filter.target] = createQueryOp(filter.operator, filter.value)
  })

  return queryFilters
}

export const createQueryOp = (operator: string, value: any): WhereOperators | null => {
  const createOpObj = (sequelizeOp: keyof WhereOperators) => ({ [sequelizeOp]: value })

  switch (operator) {
    case '!=':
      return createOpObj(Op.not)
    case '==':
      return createOpObj(Op.eq)
    case '>=':
      return createOpObj(Op.gte)
    case '>':
      return createOpObj(Op.gt)
    case '<=':
      return createOpObj(Op.lte)
    case '<':
      return createOpObj(Op.lt)
    default:
      throw new Error('Invalid operator >> ' + operator)
  }
}
