import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getData, setupDatabases } from '@app/database/api'
import type { DatabaseQuery } from '@types'
import { searchInObject } from "@app/database/connectors/fhir/fhir-data-formatter";

const DATABASE_IDS = ['hapi_fhir_test_api']
const resource = 'Observation'
const hapiFhirAssets = '../../../assets/hapi-fhir'

let mock: MockAdapter;
const obs = require(`${hapiFhirAssets}/obs.json`)
const obs_weight = require(`${hapiFhirAssets}/obs-weight.json`)
const obs_eq173 = require(`${hapiFhirAssets}/obs-eq173.json`)
const obs_ne173 = require(`${hapiFhirAssets}/obs-ne173.json`)
const obs_gt50 = require(`${hapiFhirAssets}/obs-gt50.json`)
const obs_gt173 = require(`${hapiFhirAssets}/obs-gt173.json`)
const obs_lt50 = require(`${hapiFhirAssets}/obs-lt50.json`)
const obs_lt173 = require(`${hapiFhirAssets}/obs-lt173.json`)
const obs_ge50 = require(`${hapiFhirAssets}/obs-ge50.json`)
const obs_le173 = require(`${hapiFhirAssets}/obs-le173.json`)
const obs_ge173 = require(`${hapiFhirAssets}/obs-ge173.json`)
const obs_le50 = require(`${hapiFhirAssets}/obs-le50.json`)
const obs_user1 = require(`${hapiFhirAssets}/obs-user1.json`)
const obs_user1_2 = require(`${hapiFhirAssets}/obs-user1-2.json`)
const obs_date = require(`${hapiFhirAssets}/obs-date.json`)
const obs_date_user1 = require(`${hapiFhirAssets}/obs-date-user1.json`)
const obs_contains = require(`${hapiFhirAssets}/obs-contains.json`)
const obs_exact = require(`${hapiFhirAssets}/obs-exact.json`)
const obs_not = require(`${hapiFhirAssets}/obs-not.json`)
const obs_ap = require(`${hapiFhirAssets}/obs-ap.json`)

beforeAll(() => {
  mock = new MockAdapter(axios);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&').reply(200, obs);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&code=weight').reply(200, obs_weight);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&value-quantity=173').reply(200, obs_eq173);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&value-quantity=ne173').reply(200, obs_ne173);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&value-quantity=gt50').reply(200, obs_gt50);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&value-quantity=gt173').reply(200, obs_gt173);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&value-quantity=lt50').reply(200, obs_lt50);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&value-quantity=lt173').reply(200, obs_lt173);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&value-quantity=ge50').reply(200, obs_ge50);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&value-quantity=le173').reply(200, obs_le173);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&value-quantity=ge173').reply(200, obs_ge173);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&value-quantity=le50').reply(200, obs_le50);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&subject=Patient/1').reply(200, obs_user1);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&subject:eq=1,2').reply(200, obs_user1_2);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&date=ge2022-01-01&date=le2022-02-01').reply(200, obs_date);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&subject=Patient/1&date=ge2022-01-01&date=le2022-02-01').reply(200, obs_date_user1);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&code:contains=weight,height').reply(200, obs_contains);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&code:exact=weight,height').reply(200, obs_exact);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&code:not=weight').reply(200, obs_not);
  mock.onGet('http://localhost:8080/fhir/Observation?_count=500&value-quantity=ap80').reply(200, obs_ap);
  return setupDatabases()
})

test.each(DATABASE_IDS)('Get all data from a resource >> %s', async databaseID => {
  const data = await getData({
    database: databaseID,
    tables: resource,
    filters: [{ target: "code", operator: "==", value: "weight" }]
  }, {})

  expect(data?.length).toBeGreaterThan(1)

  for (const row of data) {
    expect(row.resourceType).toEqual(resource)
  }
})

test.each(DATABASE_IDS)('Field filters >> %s', async databaseID => {
  const query: DatabaseQuery = {
    database: databaseID,
    tables: 'Observation',
    fields: ['valueQuantity.value', 'effectiveDateTime'],
    filters: [{ target: "code", operator: "==", value: "weight" }]
  }

  const data = await getData(query, {})
  expect(data?.length).toBeGreaterThan(1)

  for (const row of data) {
    expect(new Set(Object.keys(row))).toEqual(new Set(query.fields?.map(f => `${resource}.${f}`)))
  }
})

test.each(DATABASE_IDS)('Field filters in different format >> %s', async databaseID => {
  const query: DatabaseQuery = {
    database: databaseID,
    tables: 'Observation',
    fields: [{ target: 'valueQuantity.value' }, { target: 'effectiveDateTime' }],
    filters: [{ target: "code", operator: "==", value: "weight" }]
  }

  const data = await getData(query, {})
  expect(data?.length).toBeGreaterThan(1)

  for (const row of data) {
    expect(new Set(Object.keys(row))).toEqual(new Set(['Observation.valueQuantity.value', 'Observation.effectiveDateTime']))
  }
})


// ---------------------- GROUP BY -----------------------

test.each(DATABASE_IDS)('Group by >> %s', async databaseID => {
  const data = await getData({
    database: databaseID,
    tables: 'Observation',
    fields: [{
      target: 'valueQuantity.value',
      operator: ['avg', 'min', 'max', 'sum']
    },
    { target: 'valueQuantity.value', operator: 'count' }],
    groupby: 'subject.reference',
    filters: [{ target: "code", operator: "==", value: "weight" }]
  }, {})
  expect(data).toBeTruthy()
  expect(data.length).toBeGreaterThan(1)

  expect(data.every(d => Object.keys(d).length === 6)).toBe(true)
  for (const row of data) {
    for (const key in row) {
      expect(row[key]).toBeTruthy()
      expect(row[key] !== 'NA').toBeTruthy()
    }
    expect(row['Observation.valueQuantity.value.avg'] * row['Observation.valueQuantity.value.count']).toBeCloseTo(row['Observation.valueQuantity.value.sum'])
    expect(row['Observation.valueQuantity.value.max']).toBeGreaterThanOrEqual(row['Observation.valueQuantity.value.min'])
    expect(row['Observation.valueQuantity.value.max']).toBeGreaterThanOrEqual(row['Observation.valueQuantity.value.avg'])
    expect(row['Observation.valueQuantity.value.min']).toBeLessThanOrEqual(row['Observation.valueQuantity.value.avg'])
  }
})


// ---------------------- OPERATORS -----------------------

describe('Operator tests', () => {
  test.each(DATABASE_IDS)('Average operator >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation',
      fields: ['valueQuantity.value'],
      filters: [{ target: "code", operator: "==", value: "weight" }]
    }
    const data = await getData(query, {})
    const aggregatedData = await getData({ ...query, fields: [{ target: 'valueQuantity.value', operator: 'avg' }] }, {})

    expect(data?.length).toBeGreaterThan(1)
    expect(aggregatedData?.length).toEqual(1)
    expect(aggregatedData[0]['Observation.valueQuantity.value.avg'])
      .toBeCloseTo(data
        .map(d => d['Observation.valueQuantity.value'])
        .reduce(
          (avg, val, _, { length }) => avg + parseFloat(val) / length,
          0.0))
  })

  test.each(DATABASE_IDS)('Max operator >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation',
      fields: ['valueQuantity.value'],
      filters: [{ target: "code", operator: "==", value: "weight" }]
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'valueQuantity.value', operator: 'max' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0]['Observation.valueQuantity.value.max'])
      .toEqual(Math.max(...allData.map(d => d['Observation.valueQuantity.value'])))
  })

  test.each(DATABASE_IDS)('Min operator >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation',
      fields: ['valueQuantity.value'],
      filters: [{ target: "code", operator: "==", value: "weight" }]
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'valueQuantity.value', operator: 'min' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0]['Observation.valueQuantity.value.min'])
      .toEqual(Math.min(...allData.map(d => d['Observation.valueQuantity.value'])))
  })

  test.each(DATABASE_IDS)('Sum operator >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation',
      fields: ['valueQuantity.value'],
      filters: [{ target: "code", operator: "==", value: "weight" }]
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'valueQuantity.value', operator: 'sum' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0]['Observation.valueQuantity.value.sum'])
      .toEqual(allData
        .map(d => d['Observation.valueQuantity.value'])
        .reduce(
          (sum, val) => sum + parseFloat(val),
          0.0))
  })

  test.each(DATABASE_IDS)('Count operator >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation',
      fields: ['valueQuantity.value'],
      filters: [{ target: "code", operator: "==", value: "weight" }]
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'valueQuantity.value', operator: 'count' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0]['Observation.valueQuantity.value.count'])
      .toEqual(allData.length)
  })
})


// ---------------------- FILTERS -----------------------


const getMaxValue = async (databaseID: string) => (await getData({
  database: databaseID,
  tables: 'Observation',
  fields: [{ target: 'valueQuantity.value', operator: 'max' }]
}, {}))[0]['Observation.valueQuantity.value.max']

const getMinValue = async (databaseID: string) => (await getData({
  database: databaseID,
  tables: 'Observation',
  fields: [{ target: 'valueQuantity.value', operator: 'min' }]
}, {}))[0]['Observation.valueQuantity.value.min']

const getRowCount = async (databaseID: string) => (await getData({
  database: databaseID,
  tables: 'Observation',
  fields: [{ target: 'valueQuantity.value', operator: 'count' }]
}, {}))[0]['Observation.valueQuantity.value.count']

describe('Filter tests', () => {
  test.each(DATABASE_IDS)('== filter >> %s', async databaseID => {
    const maxValue = await getMaxValue(databaseID)
    const data = await getData({
      database: databaseID,
      tables: 'Observation',
      filters: [{
        operator: '==',
        target: 'value-quantity',
        value: maxValue
      }]
    }, {})

    expect(data?.length).toEqual(1)
  })

  test.each(DATABASE_IDS)('!= filter >> %s', async databaseID => {
    const totalCount = await getRowCount(databaseID)
    const maxValue = await getMaxValue(databaseID)
    const data = await getData({
      database: databaseID,
      tables: 'Observation',
      filters: [{
        operator: '!=',
        target: 'value-quantity',
        value: maxValue
      }]
    }, {})

    expect(data?.length).toEqual(totalCount - 1)
  })

  test.each(DATABASE_IDS)('> filter >> %s', async databaseID => {
    const totalCount = await getRowCount(databaseID)
    const maxValue = await getMaxValue(databaseID)
    const minValue = await getMinValue(databaseID)
    expect((await getData({
      database: databaseID,
      tables: 'Observation',
      filters: [{
        operator: '>',
        target: 'value-quantity',
        value: minValue
      }]
    }, {})).length).toEqual(totalCount - 1)
    expect((await getData({
      database: databaseID,
      tables: 'Observation',
      filters: [{
        operator: '>',
        target: 'value-quantity',
        value: maxValue
      }]
    }, {})).length).toEqual(0)
  })

  test.each(DATABASE_IDS)('< filter >> %s', async databaseID => {
    const totalCount = await getRowCount(databaseID)
    const maxValue = await getMaxValue(databaseID)
    const minValue = await getMinValue(databaseID)
    expect((await getData({
      database: databaseID,
      tables: 'Observation',
      filters: [{
        operator: '<',
        target: 'value-quantity',
        value: maxValue
      }]
    }, {})).length).toEqual(totalCount - 1)
    expect((await getData({
      database: databaseID,
      tables: 'Observation',
      filters: [{
        operator: '<',
        target: 'value-quantity',
        value: minValue
      }]
    }, {})).length).toEqual(0)
  })

  test.each(DATABASE_IDS)('>= filter >> %s', async databaseID => {
    const totalCount = await getRowCount(databaseID)
    const maxValue = await getMaxValue(databaseID)
    const minValue = await getMinValue(databaseID)
    expect((await getData({
      database: databaseID,
      tables: 'Observation',
      filters: [{
        operator: '>=',
        target: 'value-quantity',
        value: minValue
      }]
    }, {})).length).toEqual(totalCount)
    expect((await getData({
      database: databaseID,
      tables: 'Observation',
      filters: [{
        operator: '>=',
        target: 'value-quantity',
        value: maxValue
      }]
    }, {})).length).toEqual(1)
  })

  test.each(DATABASE_IDS)('<= filter >> %s', async databaseID => {
    const totalCount = await getRowCount(databaseID)
    const maxValue = await getMaxValue(databaseID)
    const minValue = await getMinValue(databaseID)
    expect((await getData({
      database: databaseID,
      tables: 'Observation',
      filters: [{
        operator: '<=',
        target: 'value-quantity',
        value: maxValue
      }]
    }, {})).length).toEqual(totalCount)
    expect((await getData({
      database: databaseID,
      tables: 'Observation',
      filters: [{
        operator: '<=',
        target: 'value-quantity',
        value: minValue
      }]
    }, {})).length).toEqual(1)
  })

  test.each(DATABASE_IDS)('+- filter >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation'
    }

    const data = await getData(query, {})
    const filteredData = await getData({ ...query, filters: [{ target: 'value-quantity', operator: '+-', value: 80 }] }, {})

    const minAp = 80 - (80 * 0.1)
    const maxAp = 80 + (80 * 0.1)

    expect(filteredData?.length).toBeGreaterThanOrEqual(1)
    expect(data.filter(entry => searchInObject(entry, 'valueQuantity.value') >= minAp && searchInObject(entry, 'valueQuantity.value') <= maxAp).length).toEqual(filteredData.length)
  })

  test.each(DATABASE_IDS)('contains filter >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation'
    }

    const data = await getData(query, {})
    const filteredData = await getData({ ...query, filters: [{ target: 'code', operator: 'contains', value: "weight,height" }] }, {})

    expect(filteredData?.length).toBeGreaterThanOrEqual(1)
    expect(data.filter(entry => searchInObject(entry, 'code.coding.code') === 'weight' || searchInObject(entry, 'code.coding.code') === 'height').length).toEqual(filteredData.length)
  })

  test.each(DATABASE_IDS)('exact filter >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation'
    }

    const data = await getData(query, {})
    const filteredData = await getData({ ...query, filters: [{ target: 'code', operator: 'exact', value: "weight,height" }] }, {})

    expect(filteredData?.length).toBeGreaterThanOrEqual(1)
    expect(data.filter(entry => searchInObject(entry, 'code.coding.code') === 'weight' || searchInObject(entry, 'code.coding.code') === 'height').length).toEqual(filteredData.length)
  })

  test.each(DATABASE_IDS)('not filter >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation'
    }

    const data = await getData(query, {})
    const filteredData = await getData({ ...query, filters: [{ target: 'code', operator: '!=', value: "weight" }] }, {})

    expect(filteredData?.length).toBeGreaterThanOrEqual(1)
    expect(data.filter(entry => searchInObject(entry, 'code.coding.code') !== 'weight').length).toEqual(filteredData.length)
  })
})

// ---------------------- SEARCH PARAMS FILTERS -----------------------

describe('Search params tests', () => {
  const cohortsMap = {
    PT: [1, 2],
    USA: [3]
  }

  test.each(DATABASE_IDS)('Filter by user ID >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation'
    }
    const data = await getData(query, {})
    const singleUser = await getData(query, { user: '1' })

    expect(singleUser?.length).toBeGreaterThanOrEqual(1)
    expect(data.filter(entry => searchInObject(entry, 'subject.reference') === 'Patient/1').length).toEqual(singleUser.length)
  })

  test.each(DATABASE_IDS)('Filter by cohort >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation'
    }
    const data = await getData(query, {})
    const cohortsData = await getData(query, { cohort: 'PT' })

    expect(cohortsData?.length).toBeGreaterThan(1)
    expect(data.filter(entry => cohortsMap.PT.includes(Number(searchInObject(entry, 'subject.reference')?.slice(8)))).length).toEqual(cohortsData.length)
  })

  test.each(DATABASE_IDS)('Filter by date >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation'
    }
    const data = await getData(query, {})
    const rangeData = await getData(query, { startDate: '2022-01-01', endDate: '2022-02-01' })

    const filterByDate = (entry: any) => {
      return new Date(entry['effectiveDateTime']).valueOf() >= new Date('2022-01-01').valueOf() &&
        new Date(entry['effectiveDateTime']).valueOf() <= new Date('2022-02-02').valueOf()
    }

    expect(rangeData?.length).toBeGreaterThan(1)
    expect(data.filter(filterByDate).length).toEqual(rangeData.length)
  })

  test.each(DATABASE_IDS)('Filter by date & ID >> %s', async databaseID => {
    const query: DatabaseQuery = {
      database: databaseID,
      tables: 'Observation'
    }
    const data = await getData(query, {})
    const rangeData = await getData(query, { startDate: '2022-01-01', endDate: '2022-02-01', user: '1' })

    const filterByDate = (entry: any) => {
      return new Date(entry['effectiveDateTime']).valueOf() >= new Date('2022-01-01').valueOf() &&
        new Date(entry['effectiveDateTime']).valueOf() <= new Date('2022-02-02').valueOf() &&
        searchInObject(entry, 'subject.reference') === 'Patient/1'
    }

    expect(rangeData?.length).toBeGreaterThanOrEqual(1)
    expect(data.filter(filterByDate).length).toEqual(rangeData.length)
  })
})


// ---------------------- FIELDS CUSTOM NAMES -----------------------

test.each(DATABASE_IDS)('Custom name >> %s', async databaseID => {
  const ops = ['min', 'max'] as any[]
  const query: DatabaseQuery = {
    database: databaseID,
    tables: 'Observation',
    fields: ['valueQuantity.value']
  }
  const data = await getData(query, {})
  const aggregatedData = await getData({ ...query, fields: [{ target: 'valueQuantity.value', operator: ops, name: 'Custom name' }] }, {})

  expect(data?.length).toBeGreaterThan(1)
  expect(aggregatedData?.length).toEqual(1)

  ops.forEach((op, index) => {
    expect(Object.keys(aggregatedData[0])[index]).toEqual(`Observation.Custom name.${op}`)
  })
})

test.each(DATABASE_IDS)('Custom name (string) >> %s', async databaseID => {
  const query: DatabaseQuery = {
    database: databaseID,
    tables: 'Observation',
    fields: ['valueQuantity.value']
  }
  const data = await getData(query, {})
  const aggregatedData = await getData({ ...query, fields: [{ target: 'valueQuantity.value', operator: 'min', name: 'Custom name' }] }, {})

  expect(data?.length).toBeGreaterThan(1)
  expect(aggregatedData?.length).toEqual(1)
  expect(Object.keys(aggregatedData[0])[0]).toEqual('Observation.Custom name.min')
})

test.each(DATABASE_IDS)('Custom name w/o operator (string) >> %s', async databaseID => {
  const query: DatabaseQuery = {
    database: databaseID,
    tables: 'Observation',
    fields: ['valueQuantity.value']
  }
  const data = await getData(query, {})
  const aggregatedData = await getData({ ...query, fields: [{ target: 'valueQuantity.value', name: 'Custom name' }] }, {})

  expect(data?.length).toBeGreaterThan(1)
  expect(aggregatedData?.length).toEqual(data?.length)
  expect(Object.keys(aggregatedData[0])[0]).toEqual('Observation.Custom name')
})