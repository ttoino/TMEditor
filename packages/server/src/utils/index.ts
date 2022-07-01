// Get all the unique keys from an array of objects
export const getUniqueKeys = (data: any[]) => Object.keys(data.reduce((result, obj) => {
  return Object.assign(result, obj)
}, {}))

export const round = (value: number, precision = 2): number => {
  const exp = Math.pow(10, precision)

  return Math.round((value + Number.EPSILON) * exp) / exp
}
