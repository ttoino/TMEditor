import { calculateAggregationObject, generateFiltersQuery, searchInObject } from '@app/database/connectors/fhir/fhir-data-formatter'

/**
 *
 * generateFiltersQuery tests.
 *
 */

test('generateFiltersQuery - Query with multiple filters', () => {
  expect(generateFiltersQuery([
    {
      target: 'value-quantity',
      operator: '>',
      value: 50
    }, {
      target: 'date',
      operator: '<=',
      value: "2020-04-12"
    }, {
      target: 'date',
      operator: '>',
      value: "2019-04-12"
    }, {
      target: 'gender',
      operator: '!=',
      value: "male"
    }
  ])).toEqual("value-quantity=gt50&date=le2020-04-12&date=gt2019-04-12&gender:not=male")
})

test('generateFiltersQuery - Filter by user', () => {
  expect(generateFiltersQuery([
    {
      target: 'subject',
      operator: '==',
      value: 'Patient/4401'
    }
  ])).toEqual("subject=Patient/4401")
})

// Number value ----------------------------------------------------------------------------------------------------------------------

test('generateFiltersQuery - Number value, == operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'value-quantity',
      operator: '==',
      value: 100
    }
  ])).toEqual("value-quantity=100")
})

test('generateFiltersQuery - Number value, < operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'value-quantity',
      operator: '<',
      value: 100.5
    }
  ])).toEqual("value-quantity=lt100.5")
})

test('generateFiltersQuery - Number value, <= operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'value-quantity',
      operator: '<=',
      value: 100.5
    }
  ])).toEqual("value-quantity=le100.5")
})

test('generateFiltersQuery - Number value, > operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'value-quantity',
      operator: '>',
      value: 100.5
    }
  ])).toEqual("value-quantity=gt100.5")
})

test('generateFiltersQuery - Number value, >= operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'value-quantity',
      operator: '>=',
      value: 100.5
    }
  ])).toEqual("value-quantity=ge100.5")
})

test('generateFiltersQuery - Number value, != operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'value-quantity',
      operator: '!=',
      value: 100.5
    }
  ])).toEqual("value-quantity=ne100.5")
})

test('generateFiltersQuery - Number value, +- operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'value-quantity',
      operator: '+-',
      value: 100.5
    }
  ])).toEqual("value-quantity=ap100.5")
})

// Date value ----------------------------------------------------------------------------------------------------------------------

test('generateFiltersQuery - Date value, == operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'date',
      operator: '==',
      value: "2020-04-12"
    }
  ])).toEqual("date=2020-04-12")
})

test('generateFiltersQuery - Date value, < operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'date',
      operator: '<',
      value: "2020-04-12"
    }
  ])).toEqual("date=lt2020-04-12")
})

test('generateFiltersQuery - Date value, <= operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'date',
      operator: '<=',
      value: "2020-04-12"
    }
  ])).toEqual("date=le2020-04-12")
})

test('generateFiltersQuery - Date value, > operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'date',
      operator: '>',
      value: "2020-04-12"
    }
  ])).toEqual("date=gt2020-04-12")
})

test('generateFiltersQuery - Date value, >= operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'date',
      operator: '>=',
      value: "2020-04-12"
    }
  ])).toEqual("date=ge2020-04-12")
})

test('generateFiltersQuery - Date value, != operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'date',
      operator: '!=',
      value: "2020-04-12"
    }
  ])).toEqual("date=ne2020-04-12")
})

test('generateFiltersQuery - Date value, +- operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'date',
      operator: '+-',
      value: "2020-04-12"
    }
  ])).toEqual("date=ap2020-04-12")
})

// String value ----------------------------------------------------------------------------------------------------------------------

test('generateFiltersQuery - String value, == operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'gender',
      operator: '==',
      value: "male"
    }
  ])).toEqual("gender=male")
})

test('generateFiltersQuery - String value, != operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'gender',
      operator: '!=',
      value: "male"
    }
  ])).toEqual("gender:not=male")
})

test('generateFiltersQuery - String value, contains operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'gender',
      operator: 'contains',
      value: "male"
    }
  ])).toEqual("gender:contains=male")
})

test('generateFiltersQuery - String value, exact operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'gender',
      operator: 'exact',
      value: "male"
    }
  ])).toEqual("gender:exact=male")
})

test('generateFiltersQuery - String value, in operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'gender',
      operator: 'in',
      value: "male"
    }
  ])).toEqual("gender:in=male")
})

// List of numbers value ----------------------------------------------------------------------------------------------------------------------

test('generateFiltersQuery - List of numbers value, == operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'code',
      operator: '==',
      value: "12,13,14"
    }
  ])).toEqual("code:eq=12,13,14")
})

// List of strings value ----------------------------------------------------------------------------------------------------------------------

test('generateFiltersQuery - List of strings value, == operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'code',
      operator: '==',
      value: "weight,height"
    }
  ])).toEqual("code=weight,height")
})

test('generateFiltersQuery - List of strings value, contains operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'code',
      operator: 'contains',
      value: "weight,height"
    }
  ])).toEqual("code:contains=weight,height")
})

test('generateFiltersQuery - List of strings value, exact operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'code',
      operator: 'exact',
      value: "weight,height"
    }
  ])).toEqual("code:exact=weight,height")
})

test('generateFiltersQuery - List of strings value, in operator', () => {
  expect(generateFiltersQuery([
    {
      target: 'code',
      operator: 'in',
      value: "weight,height"
    }
  ])).toEqual("code:in=weight,height")
})


/**
 *
 * searchInObject tests.
 *
 */

test('searchInObject - Simple key', () => {
  expect(searchInObject(
    {
      "keyA": "valueA",
      "keyB": "valueB",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-019T10:31:25.513+00:00",
        "source": "#zr1twgFjQgaHmFRK"
      },
    },
    'keyA'
  )).toEqual("valueA")
})

test('searchInObject - Key with 1 child', () => {
  expect(searchInObject(
    {
      "keyA": "valueA",
      "keyB": {
        "childKeyA": "valueChildA",
        "childKeyB": "valueChildB"
      },
    },
    'keyB.childKeyB'
  )).toEqual("valueChildB")
})

test('searchInObject - Key with 2 child', () => {
  expect(searchInObject(
    {
      "keyA": "valueA",
      "keyB": {
        "childKeyA": {
          "2childKey": "2childValue"
        },
        "childKeyB": "valueChildB"
      },
    },
    'keyB.childKeyA.2childKey'
  )).toEqual("2childValue")
})

test('searchInObject - No value for given key', () => {
  expect(searchInObject(
    {
      "keyA": "valueA",
      "keyB": {
        "childKeyA": "valueChildA",
        "childKeyB": "valueChildB"
      },
    },
    'keyB.childKeyA.2childKey'
  )).toEqual(null)
})

test('searchInObject - Number value', () => {
  expect(searchInObject(
    {
      "keyA": "valueA",
      "keyB": {
        "childKeyA": "valueChildA",
        "childKeyB": 12
      },
    },
    'keyB.childKeyB'
  )).toEqual(12)
})


/**
 *
 * calculateAggregationObject tests.
 *
 */

const objectsArray = [
  { value: 10.5 },
  { value: 39 },
  { value: 15 },
  { value: 23.1 }
]
const avgResult = 21.9
const maxResult = 39
const minResult = 10.5
const sumResult = 87.6
const countResult = 4

test('calculateAggregationObject - one field & one operator w/ custom name', () => {
  expect(calculateAggregationObject(
    objectsArray, [
    {
      target: "value",
      name: "weight",
      operator: "avg"
    }
  ]))
    .toEqual({
      "weight.avg": avgResult
    })
})

test('calculateAggregationObject - one field & one operator w/o custom name', () => {
  expect(calculateAggregationObject(
    objectsArray, [
    {
      target: "value",
      operator: "avg"
    }
  ]))
    .toEqual({
      "value.avg": avgResult
    })
})

test('calculateAggregationObject - one field & multiple operators w/ custom name', () => {
  expect(calculateAggregationObject(
    objectsArray, [
    {
      target: "value",
      name: "weight",
      operator: ["avg", "min", "max", "sum", "count"]
    }
  ]))
    .toEqual({
      "weight.avg": avgResult,
      "weight.min": minResult,
      "weight.max": maxResult,
      "weight.sum": sumResult,
      "weight.count": countResult
    })
})

test('calculateAggregationObject - one field & multiple operators w/o custom name', () => {
  expect(calculateAggregationObject(
    objectsArray, [
    {
      target: "value",
      operator: ["avg", "min", "max", "sum", "count"]
    }
  ]))
    .toEqual({
      "value.avg": avgResult,
      "value.min": minResult,
      "value.max": maxResult,
      "value.sum": sumResult,
      "value.count": countResult
    })
})

test('calculateAggregationObject - one field & one operator w/ custom name & resourceType', () => {
  expect(calculateAggregationObject(
    objectsArray, [
    {
      target: "value",
      name: "weight",
      operator: "avg"
    }
  ], "Observation"))
    .toEqual({
      "Observation.weight.avg": avgResult
    })
})

test('calculateAggregationObject - one field & one operator w/o custom name w/ resourceType', () => {
  expect(calculateAggregationObject(
    objectsArray, [
    {
      target: "value",
      operator: "avg"
    }
  ], "Observation"))
    .toEqual({
      "Observation.value.avg": avgResult
    })
})

test('calculateAggregationObject - one field & multiple operators w/ custom name & resourceType', () => {
  expect(calculateAggregationObject(
    objectsArray, [
    {
      target: "value",
      name: "weight",
      operator: ["avg", "min", "max", "sum", "count"]
    }
  ], "Observation"))
    .toEqual({
      "Observation.weight.avg": avgResult,
      "Observation.weight.min": minResult,
      "Observation.weight.max": maxResult,
      "Observation.weight.sum": sumResult,
      "Observation.weight.count": countResult
    })
})

test('calculateAggregationObject - one field & multiple operators w/o custom name w/ resourceType', () => {
  expect(calculateAggregationObject(
    objectsArray, [
    {
      target: "value",
      operator: ["avg", "min", "max", "sum", "count"]
    }
  ], "Observation"))
    .toEqual({
      "Observation.value.avg": avgResult,
      "Observation.value.min": minResult,
      "Observation.value.max": maxResult,
      "Observation.value.sum": sumResult,
      "Observation.value.count": countResult
    })
})

test('calculateAggregationObject - invalid fields', () => {
  expect(calculateAggregationObject(
    objectsArray, [
    {
      target: "value",
      name: "weight"
    }
  ]))
    .toEqual({})
})