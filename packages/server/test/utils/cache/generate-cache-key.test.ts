import { generateCacheKey } from '@app/utils/cache'

test('Equal objects', () => {
  expect(generateCacheKey({
    database: 'lifanaMySQL',
    tables: ['MealPlan', 'WeekPlan'],
    fields: ['mealOfDay', 'IS_COUNT'],
    groupby: 'day'
  }, {})).toEqual(generateCacheKey({
    database: 'lifanaMySQL',
    tables: ['MealPlan', 'WeekPlan'],
    fields: ['mealOfDay', 'IS_COUNT'],
    groupby: 'day'
  }, {}))
})

test('Different order of parameters', () => {
  expect(generateCacheKey({
    database: 'lifanaMySQL',
    tables: ['MealPlan', 'WeekPlan'],
    fields: ['mealOfDay', 'IS_COUNT'],
    groupby: 'day'
  }, {})).toEqual(generateCacheKey({
    database: 'lifanaMySQL',
    tables: ['MealPlan', 'WeekPlan'],
    groupby: 'day',
    fields: ['mealOfDay', 'IS_COUNT']
  }, {}))
})

test('Arrays with different order of values', () => {
  expect(generateCacheKey({
    database: 'lifanaMySQL',
    tables: ['MealPlan', 'WeekPlan'],
    fields: ['mealOfDay', 'IS_COUNT'],
    groupby: 'day'
  }, {}))
    .not.toEqual(generateCacheKey({
      database: 'lifanaMySQL',
      tables: ['WeekPlan', 'MealPlan'],
      groupby: 'day',
      fields: ['mealOfDay', 'IS_COUNT']
    }, {}))
})

test('Arrays with equal objects', () => {
  expect(generateCacheKey({
    database: 'lifanaMySQL',
    tables: ['MealPlan', 'WeekPlan'],
    fields: ['mealOfDay', 'IS_COUNT'],
    groupby: 'day',
    filters: [{ operator: '==', target: 'mealOfDay', value: 2 }]
  }, {}))
    .toEqual(generateCacheKey({
      database: 'lifanaMySQL',
      tables: ['MealPlan', 'WeekPlan'],
      fields: ['mealOfDay', 'IS_COUNT'],
      groupby: 'day',
      filters: [{ target: 'mealOfDay', operator: '==', value: 2 }]
    }, {}))
})

test('Arrays with different objects', () => {
  expect(generateCacheKey({
    database: 'lifanaMySQL',
    tables: ['MealPlan', 'WeekPlan'],
    fields: ['mealOfDay', 'IS_COUNT'],
    groupby: 'day',
    filters: [{ operator: '==', target: 'mealOfDay', value: 2 }]
  }, {}))
    .not.toEqual(generateCacheKey({
      database: 'lifanaMySQL',
      tables: ['MealPlan', 'WeekPlan'],
      fields: ['mealOfDay', 'IS_COUNT'],
      groupby: 'day',
      filters: [{ operator: '==', target: 'mealOfDay', value: 5 }]
    }, {}))
})
