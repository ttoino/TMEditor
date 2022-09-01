import { formatComponentData } from '@app/database/data-formatter'

test('formatComponentData (value) - One field', () => {
  const data = [{ Calories: { avg: 126.5 } }]
  const component = {
    type: 'value'
  }

  expect(formatComponentData(data, component)).toEqual([{
    field: 'Calories (avg)',
    value: 126.5
  }])
})

test('formatComponentData (value) - Two fields', () => {
  const data = [{ Calories: { avg: 126.5 }, Steps: { avg: 1466.5 } }]
  const component = {
    type: 'value'
  }

  expect(formatComponentData(data, component)).toEqual([{
    field: 'Calories (avg)',
    value: 126.5
  }, {
    field: 'Steps (avg)',
    value: 1466.5
  }])
})

test('formatComponentData (value) - Multiple calculation', () => {
  const data = [{ Calories: { avg: 126.5, count: 231.1 }, Steps: { avg: 1466.5 } }]
  const component = {
    type: 'value'
  }

  expect(formatComponentData(data, component)).toEqual([{
    field: 'Calories (avg)',
    value: 126.5
  }, {
    field: 'Calories (count)',
    value: 231.1
  }, {
    field: 'Steps (avg)',
    value: 1466.5
  }])
})

test('formatComponentData (value) - No data', () => {
  const data = [{ Calories: { avg: null }, Steps: { avg: null } }]
  const component = {
    type: 'value'
  }

  expect(formatComponentData(data, component)).toEqual([{
    field: 'Calories (avg)',
    value: null
  }, {
    field: 'Steps (avg)',
    value: null
  }])
})

test('formatComponentData (summary) - One field', () => {
  const data = [{ Calories: { avg: 126.5 } }]
  const component = {
    type: 'summary'
  }

  expect(formatComponentData(data, component)).toEqual([{
    field: 'avg',
    value: 126.5
  }])
})

test('formatComponentData (summary) - No data', () => {
  const data = [{ Calories: { avg: null } }]
  const component = {
    type: 'summary'
  }

  expect(formatComponentData(data, component)).toEqual([{
    field: 'avg',
    value: null
  }])
})
