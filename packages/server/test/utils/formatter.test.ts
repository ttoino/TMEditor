import { replaceNullObjProps, renameKeys, createCohortsMapByField, calculateAggregation, formatDate } from '@app/utils/formatter'

test('renameKeys - On same object', () => {
  expect(renameKeys([{
    'tableName.fieldNameA': 'valueA',
    'tableName.fieldNameB': 'valueB'
  }])).toEqual([{
    fieldNameA: 'valueA',
    fieldNameB: 'valueB'
  }])
})

test('renameKeys - On different objects', () => {
  expect(renameKeys([{
    'tableName.fieldNameA': 'valueA'
  }, {
    'tableName.fieldNameB': 'valueB'
  }])).toEqual([{
    fieldNameA: 'valueA'
  }, {
    fieldNameB: 'valueB'
  }])
})

test('renameKeys - Two fields', () => {
  expect(renameKeys([{ 'tableName.fieldNameA.fieldNameB': 'value' }]))
    .toEqual([{
      fieldNameB: 'value'
    }])
})

test('replaceNullObjProps - Replace null value', () => {
  expect(replaceNullObjProps({
    key: null
  }, 'N/D')).toEqual({
    key: 'N/D'
  })
})

test('replaceNullObjProps - Replace empty string value', () => {
  expect(replaceNullObjProps({
    key: ''
  }, 'N/D')).toEqual({
    key: 'N/D'
  })
})

test('replaceNullObjProps - Replace undefined value', () => {
  expect(replaceNullObjProps({
    key: undefined
  }, 'N/D')).toEqual({
    key: 'N/D'
  })
})

test('replaceNullObjProps - Do not replace non-empty string value', () => {
  expect(replaceNullObjProps({
    key: 'value'
  }, 'N/D')).toEqual({
    key: 'value'
  })
})

test('replaceNullObjProps - Do not replace numeric value', () => {
  expect(replaceNullObjProps({
    key: 12
  }, 'N/D')).toEqual({
    key: 12
  })
})

test('replaceNullObjProps - Multiple keys', () => {
  expect(replaceNullObjProps({
    keyA: 'value',
    keyB: 12,
    keyC: null,
    keyD: '',
    keyE: undefined
  }, 'N/D')).toEqual({
    keyA: 'value',
    keyB: 12,
    keyC: 'N/D',
    keyD: 'N/D',
    keyE: 'N/D'
  })
})

test('createCohortsMapByField', () => {
  const users = [
    { __key: 1, gender: 'F' },
    { __key: 2, gender: 'F' },
    { __key: 3, gender: 'M' }
  ]

  const map = createCohortsMapByField(users, 'gender')

  expect(Object.keys(map).length).toBe(2)
  expect(map.F).toStrictEqual([1, 2])
})

const valuesArray = [10.5, 39, 15, 23.1]
test('calculateAggregation - avg operator', () => {
  expect(calculateAggregation(valuesArray, 'avg')).toEqual(21.9)
})

test('calculateAggregation - max operator', () => {
  expect(calculateAggregation(valuesArray, 'max')).toEqual(39)
})

test('calculateAggregation - min operator', () => {
  expect(calculateAggregation(valuesArray, 'min')).toEqual(10.5)
})

test('calculateAggregation - sum operator', () => {
  expect(calculateAggregation(valuesArray, 'sum')).toEqual(87.6)
})

test('calculateAggregation - count operator', () => {
  expect(calculateAggregation(valuesArray, 'count')).toEqual(4)
})

test('formatDate - Date instance', () => {
  expect(formatDate(new Date('2022-01-1'))).toEqual('2022-01-01')
})

test('formatDate - string date', () => {
  expect(formatDate('2022-01-01')).toEqual('2022-01-01')
})

test('formatDate - invalid date', () => {
  try {
    formatDate('2022-01-1')
  } catch (e: any) {
    expect(e.message).toEqual('Invalid date: 2022-01-1')
  }
})