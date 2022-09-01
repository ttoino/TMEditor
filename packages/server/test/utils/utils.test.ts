import { defaultAsArray, getUniqueKeys, round } from '@app/utils'

// getUniqueKeys
test('getUniqueKeys', () => {
  expect(getUniqueKeys([{ a: 1 }, { a: 2 }, { a: 1 }])).toEqual(['a'])
  expect(getUniqueKeys([{ a: 1 }, { b: 2 }, { a: 1 }])).toEqual(['a', 'b'])
  expect(getUniqueKeys([{ a: 1 }, { b: 2, c: 3 }, { a: 1 }])).toEqual(['a', 'b', 'c'])
})

test('getUniqueKeys - Single property', () => {
  expect(getUniqueKeys([{ a: 1 }])).toEqual(['a'])
})

test('getUniqueKeys - Empty object', () => {
  expect(getUniqueKeys([{ }])).toEqual([])
})

test('getUniqueKeys - No object', () => {
  expect(getUniqueKeys([])).toEqual([])
})

// round
test('round - default precision', () => {
  expect(round(1)).toEqual(1)
  expect(round(1.2)).toEqual(1.2)
  expect(round(1.20)).toEqual(1.2)

  expect(round(1.2321)).toEqual(1.23)
  expect(round(1.2821)).toEqual(1.28)
})

test('round - precision', () => {
  expect(round(1.2321, 0)).toEqual(1)
  expect(round(1.005, 2)).toEqual(1.01)
  expect(round(1.2321, 3)).toEqual(1.232)
})

// defaultAsArray
test('defaultAsArray - Numeric value', () => {
  expect(defaultAsArray(1)).toEqual([1])
})

test('defaultAsArray - Array of numeric values', () => {
  expect(defaultAsArray([1, 2])).toEqual([1, 2])
})

test('defaultAsArray - String value', () => {
  expect(defaultAsArray('string')).toEqual(['string'])
})

test('defaultAsArray - Array of string values', () => {
  expect(defaultAsArray(['stringA', 'stringB'])).toEqual(['stringA', 'stringB'])
})

test('defaultAsArray - Null value', () => {
  expect(defaultAsArray(null)).toEqual([])
})

test('defaultAsArray - Undefined value', () => {
  expect(defaultAsArray(undefined)).toEqual([])
})

test('defaultAsArray - Empty string value', () => {
  expect(defaultAsArray('')).toEqual([])
})

test('defaultAsArray - Empty array value', () => {
  expect(defaultAsArray([])).toEqual([])
})
