import type { Warning } from '@types'

export default function useWarning (value: any, warning?: Warning) {
  if (!warning?.operator && !warning?.threshold) {
    return [false, null]
  }

  const showWarning = ComparisonMap[warning.operator](value, warning.threshold)
  const symbol = getComparisonSymbol(warning.operator)

  return [showWarning, symbol]
}

const ComparisonMap: any = {
  '>': (a: any, b: any) => a > b,
  '>=': (a: any, b: any) => a >= b,
  '<': (a: any, b: any) => a < b,
  '<=': (a: any, b: any) => a <= b,
  '==': (a: any, b: any) => a === b
}

const getComparisonSymbol = (value: string) => {
  switch (value) {
  case '>=':
    return '≥'
  case '<=':
    return '≤'
  case '==':
    return '='
  default:
    return value
  }
}
