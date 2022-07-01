import { defaultAsArray, defaultDatabaseID, defaultOperator } from '@app/utils/default-values-generator'

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

test('defaultDatabaseID - String value', () => {
  expect(defaultDatabaseID('database_id')).toEqual('database_id')
})

test('defaultDatabaseID - Empty string value', () => {
  expect(defaultDatabaseID('')).toEqual('default')
})

test('defaultDatabaseID - Null value', () => {
  expect(defaultDatabaseID(null)).toEqual('default')
})

test('defaultDatabaseID - Undefined value', () => {
  expect(defaultDatabaseID(undefined)).toEqual('default')
})

test('defaultOperator - String value', () => {
  expect(defaultOperator('SUM')).toEqual('sum')
})

test('defaultOperator - Empty string value', () => {
  expect(defaultOperator('')).toEqual('avg')
})

test('defaultOperator - Null value', () => {
  expect(defaultOperator(null)).toEqual('avg')
})

test('defaultOperator - Undefined value', () => {
  expect(defaultOperator(undefined)).toEqual('avg')
})
