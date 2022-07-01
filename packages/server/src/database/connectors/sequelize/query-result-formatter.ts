import { replaceNullObjProps } from '@app/utils/formatter'
import { FieldAggregationOperator } from '@types'
import pick from 'lodash.pick'

type TAuxKeys = { [key: string]: number }
type TKeyMap = { [key: string]: string }

export const formatQueryResultData = (result: any[], fields: (string | FieldAggregationOperator)[]) => {
  const properties: string[] = fields.map(f => (f as FieldAggregationOperator)?.target ?? f)

  if (result?.length === 0) return result

  const guaranteePropOrder = (prevFormatted: any[]) => {
    if (!prevFormatted.length) {
      return
    }
    let keys = Object.keys(prevFormatted[0])
    const auxKeys: TAuxKeys = {}

    keys.forEach((el: string) => {
      auxKeys[el] = properties.findIndex(prop => el.endsWith(prop))
    })

    keys = keys.sort(function (a, b) {
      return auxKeys[a] - auxKeys[b]
    })

    const finalData = prevFormatted.map(el => {
      const newObj: TKeyMap = {}
      keys.forEach(key => {
        newObj[key] = el[key]
      })
      return newObj
    })

    return finalData
  }

  const auxProps: TKeyMap = {}
  const formKeys = Object.keys(result[0]).filter(rowKey => {
    const splittedRowKey = rowKey
      ?.split('.')
      ?.pop()
      ?.split('|')
      .pop()
    return properties.findIndex(prop => prop.endsWith(splittedRowKey)) !== -1
  })

  formKeys.forEach(el => {
    auxProps[el] = properties.find(prop => prop.endsWith(el))
  })

  if (properties.length > 0) {
    result = result.map((el: string) => {
      const formattedEl = {}
      formKeys.forEach(key => {
        const splittedKey = key.split('.')
        let formattedKey
        if (splittedKey.length === 1) {
          formattedKey = splittedKey.shift().replace('|', '.')
        } else {
          const lastEl = splittedKey.pop()
          formattedKey = lastEl.includes('|')
            ? lastEl.replace('|', '.')
            : lastEl
        }
        if (!Object.prototype.hasOwnProperty.call(formattedEl, formattedKey)) {
          formattedEl[formattedKey] = el[key]
        }
      })
      return formattedEl
    })
  }

  return guaranteePropOrder(result)
}

export const formatUserQueryResultData = <T extends { [key: string]: any }>(
  result: Array<T>,
  PkKey: string,
  idField: string,
  fields?: string[]
) => result.reduce((acc, el: T) => ({
    ...acc,
    [el[idField || PkKey]]: fields && fields.length > 0
      ? pick(replaceNullObjProps(el, 'N/D'), fields)
      : null
  }), {})
