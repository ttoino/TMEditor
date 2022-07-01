import { getData, setupDatabases } from '@app/database/api'
import { readPlatformConfig } from '@app/parsers/config-parser'

const USER_MODEL_ATTRIBUTES = ['userId', 'name', 'age', 'gender']
const ACTIVITIES_MODEL_ATTRIBUTES = ['Date', 'StartTime', 'Duration', 'Activity', 'ActivityType', 'LogType', 'Steps', 'Distance', 'ElevationGain', 'Calories', 'SedentaryMinutes', 'LightlyActiveMinutes', 'FairlyActiveMinutes', 'VeryActiveMinutes', 'AverageHeartRate', 'OutOfRangeHeartRateMinutes', 'FatBurnHeartRateMinutes', 'CardioHeartRateMinutes', 'PeakHeartRateMinutes', 'UserId']

const DATABASE_IDS = readPlatformConfig()
  .databases.map(db => [db.id])
  .filter(p => p[0] !== 'hapi_fhir_test_api') // The following tests are not compatible with FHIR connector
// .filter(p => p[0] !== 'firebase_test_db')

beforeAll(() => {
  return setupDatabases()
})

test.each(DATABASE_IDS)('Get all data from a table >> %s', async databaseID => {
  const data = await getData({
    database: databaseID,
    tables: 'activityLogs'
  }, {})
  expect(data?.length).toBeGreaterThan(1)
})

test.each(DATABASE_IDS)('Field filters >> %s', async databaseID => {
  const query = {
    database: databaseID,
    tables: 'activityLogs',
    fields: ['activityLogs.Activity', 'activityLogs.Steps', 'activityLogs.Duration', 'activityLogs.StartTime']
  }

  const data = await getData(query, {})
  expect(data?.length).toBeGreaterThan(1)

  for (const row of data) {
    expect(new Set(Object.keys(row))).toEqual(new Set(query.fields))
  }
})

test.each(DATABASE_IDS)('Field filters in different format >> %s', async databaseID => {
  const query = {
    database: databaseID,
    tables: 'activityLogs',
    fields: [{ target: 'activityLogs.Steps' }, { target: 'activityLogs.Duration' }]
  }

  const data = await getData(query, {})
  expect(data?.length).toBeGreaterThan(1)

  for (const row of data) {
    expect(new Set(Object.keys(row))).toEqual(new Set(['activityLogs.Steps', 'activityLogs.Duration']))
  }
})

test.each(DATABASE_IDS)('Table inner join >> %s', async databaseID => {
  const query = {
    database: databaseID,
    tables: ['activityLogs', 'users']
  }

  const data = await getData(query, {})
  expect(data?.length).toBeGreaterThan(1)

  for (const row of data) {
    expect(new Set(Object.keys(row)))
      .toEqual(new Set([
        ...USER_MODEL_ATTRIBUTES.map(a => `users.${a}`),
        ...ACTIVITIES_MODEL_ATTRIBUTES.map(a => `activityLogs.${a}`)
      ]))
  }
})

// TODO: Refactor table joins
// test.each(DATABASE_IDS)('Table inner join w/ field filters >> %s', async databaseID => {
//   const query = {
//     database: databaseID,
//     tables: ['activityLogs', 'users'],
//     fields: ['activityLogs.Steps', 'users.name']
//   }

//   const data = await getData(query, {})
//   expect(data?.length).toBeGreaterThan(1)

//   for (const row of data) {
//     expect(new Set(Object.keys(row))).toEqual(new Set(query.fields))
//   }
// })


// ---------------------- GROUP BY -----------------------

test.each(DATABASE_IDS)('Group by >> %s', async databaseID => {
  const data = await getData({
    database: databaseID,
    tables: 'activityLogs',
    fields: [{
      target: 'activityLogs.Steps',
      operator: ['avg', 'min', 'max', 'sum']
    },
    { target: 'activityLogs.Steps', operator: 'count' }],
    groupby: 'activityLogs.UserId'
  }, {})
  expect(data).toBeTruthy()
  expect(data.length).toBeGreaterThan(1)

  expect(data.every(d => Object.keys(d).length === 6)).toBe(true)
  for (const row of data) {
    for (const key in row) {
      expect(row[key]).toBeTruthy()
      expect(row[key] !== 'NA').toBeTruthy()
    }
    expect(row['activityLogs.Steps.avg'] * row['activityLogs.Steps.count']).toBeCloseTo(row['activityLogs.Steps.sum'])
    expect(row['activityLogs.Steps.max']).toBeGreaterThan(row['activityLogs.Steps.min'])
    expect(row['activityLogs.Steps.max']).toBeGreaterThanOrEqual(row['activityLogs.Steps.avg'])
    expect(row['activityLogs.Steps.min']).toBeLessThanOrEqual(row['activityLogs.Steps.avg'])
  }
})

// ---------------------- OPERATORS -----------------------

describe('Operator tests', () => {
  test.each(DATABASE_IDS)('Average operator >> %s', async databaseID => {
    const query = {
      database: databaseID,
      tables: 'activityLogs',
      fields: ['activityLogs.Steps']
    }
    const data = await getData(query, {})
    const aggregatedData = await getData({ ...query, fields: [{ target: 'activityLogs.Steps', operator: 'avg' }] }, {})

    expect(data?.length).toBeGreaterThan(1)
    expect(aggregatedData?.length).toEqual(1)
    expect(aggregatedData[0]['activityLogs.Steps.avg'])
      .toBeCloseTo(data
        .map(d => d['activityLogs.Steps'])
        .reduce(
          (avg, val, _, { length }) => avg + parseFloat(val) / length,
          0.0))
  })

  test.each(DATABASE_IDS)('Max operator >> %s', async databaseID => {
    const query = {
      database: databaseID,
      tables: 'activityLogs',
      fields: ['activityLogs.Steps']
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'activityLogs.Steps', operator: 'max' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0]['activityLogs.Steps.max'])
      .toEqual(Math.max(...allData.map(d => d['activityLogs.Steps'])))
  })

  test.each(DATABASE_IDS)('Min operator >> %s', async databaseID => {
    const query = {
      database: databaseID,
      tables: 'activityLogs',
      fields: ['activityLogs.Steps']
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'activityLogs.Steps', operator: 'min' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0]['activityLogs.Steps.min'])
      .toEqual(Math.min(...allData.map(d => d['activityLogs.Steps'])))
  })

  test.each(DATABASE_IDS)('Sum operator >> %s', async databaseID => {
    const query = {
      database: databaseID,
      tables: 'activityLogs',
      fields: ['activityLogs.Steps']
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'activityLogs.Steps', operator: 'sum' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0]['activityLogs.Steps.sum'])
      .toEqual(allData
        .map(d => d['activityLogs.Steps'])
        .reduce(
          (sum, val) => sum + parseFloat(val),
          0.0))
  })

  test.each(DATABASE_IDS)('Count operator >> %s', async databaseID => {
    const query = {
      database: databaseID,
      tables: 'activityLogs',
      fields: ['activityLogs.Steps']
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'activityLogs.Steps', operator: 'count' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0]['activityLogs.Steps.count'])
      .toEqual(allData.length)
  })
})

const getMaxSteps = async (databaseID: string) => (await getData({
  database: databaseID,
  tables: 'activityLogs',
  fields: [{ target: 'activityLogs.Steps', operator: 'max' }]
}, {}))[0]['activityLogs.Steps.max']

const getMinSteps = async (databaseID: string) => (await getData({
  database: databaseID,
  tables: 'activityLogs',
  fields: [{ target: 'activityLogs.Steps', operator: 'min' }]
}, {}))[0]['activityLogs.Steps.min']

const getRowCount = async (databaseID: string) => (await getData({
  database: databaseID,
  tables: 'activityLogs',
  fields: [{ target: 'activityLogs.Steps', operator: 'count' }]
}, {}))[0]['activityLogs.Steps.count']


// ---------------------- FILTERS -----------------------

describe('Filter tests', () => {
  test.each(DATABASE_IDS)('== filter >> %s', async databaseID => {
    const maxStepsValue = await getMaxSteps(databaseID)
    const data = await getData({
      database: databaseID,
      tables: 'activityLogs',
      filters: [{
        operator: '==',
        target: 'activityLogs.Steps',
        value: maxStepsValue
      }]
    }, {})

    expect(data?.length).toEqual(1)
  })

  test.each(DATABASE_IDS)('!= filter >> %s', async databaseID => {
    const totalCount = await getRowCount(databaseID)
    const maxValue = await getMaxSteps(databaseID)
    const data = await getData({
      database: databaseID,
      tables: 'activityLogs',
      filters: [{
        operator: '!=',
        target: 'activityLogs.Steps',
        value: maxValue
      }]
    }, {})

    expect(data?.length).toEqual(totalCount - 1)
  })

  test.each(DATABASE_IDS)('> filter >> %s', async databaseID => {
    const totalCount = await getRowCount(databaseID)
    const maxValue = await getMaxSteps(databaseID)
    const minValue = await getMinSteps(databaseID)
    expect((await getData({
      database: databaseID,
      tables: 'activityLogs',
      filters: [{
        operator: '>',
        target: 'activityLogs.Steps',
        value: minValue
      }]
    }, {})).length).toEqual(totalCount - 1)
    expect((await getData({
      database: databaseID,
      tables: 'activityLogs',
      filters: [{
        operator: '>',
        target: 'activityLogs.Steps',
        value: maxValue
      }]
    }, {})).length).toEqual(0)
  })

  test.each(DATABASE_IDS)('< filter >> %s', async databaseID => {
    const totalCount = await getRowCount(databaseID)
    const maxValue = await getMaxSteps(databaseID)
    const minValue = await getMinSteps(databaseID)
    expect((await getData({
      database: databaseID,
      tables: 'activityLogs',
      filters: [{
        operator: '<',
        target: 'activityLogs.Steps',
        value: maxValue
      }]
    }, {})).length).toEqual(totalCount - 1)
    expect((await getData({
      database: databaseID,
      tables: 'activityLogs',
      filters: [{
        operator: '<',
        target: 'activityLogs.Steps',
        value: minValue
      }]
    }, {})).length).toEqual(0)
  })

  test.each(DATABASE_IDS)('>= filter >> %s', async databaseID => {
    const totalCount = await getRowCount(databaseID)
    const maxValue = await getMaxSteps(databaseID)
    const minValue = await getMinSteps(databaseID)
    expect((await getData({
      database: databaseID,
      tables: 'activityLogs',
      filters: [{
        operator: '>=',
        target: 'activityLogs.Steps',
        value: minValue
      }]
    }, {})).length).toEqual(totalCount)
    expect((await getData({
      database: databaseID,
      tables: 'activityLogs',
      filters: [{
        operator: '>=',
        target: 'activityLogs.Steps',
        value: maxValue
      }]
    }, {})).length).toEqual(1)
  })

  test.each(DATABASE_IDS)('<= filter >> %s', async databaseID => {
    const totalCount = await getRowCount(databaseID)
    const maxValue = await getMaxSteps(databaseID)
    const minValue = await getMinSteps(databaseID)
    expect((await getData({
      database: databaseID,
      tables: 'activityLogs',
      filters: [{
        operator: '<=',
        target: 'activityLogs.Steps',
        value: maxValue
      }]
    }, {})).length).toEqual(totalCount)
    expect((await getData({
      database: databaseID,
      tables: 'activityLogs',
      filters: [{
        operator: '<=',
        target: 'activityLogs.Steps',
        value: minValue
      }]
    }, {})).length).toEqual(1)
  })
})

// ---------------------- SEARCH PARAMS FILTERS -----------------------

describe('Search params tests', () => {
  const cohortsMap = {
    PT: [1, 2, "1", "2"],
    USA: [3, "3"]
  }

  test.each(DATABASE_IDS)('Filter by user ID >> %s', async databaseID => {
    const query = {
      database: databaseID,
      tables: 'activityLogs'
    }
    const data = await getData(query, {})
    const singleUser = await getData(query, { user: '1' })

    expect(singleUser?.length).toBeGreaterThan(1)
    // NOTE: We are using loose equality since the testing databases use different data types
    expect(data.filter(entry => entry['activityLogs.UserId'] == 1).length).toEqual(singleUser.length)
  })

  test.each(DATABASE_IDS)('Filter by cohort >> %s', async databaseID => {
    const query = {
      database: databaseID,
      tables: 'activityLogs'
    }
    const data = await getData(query, {})
    const cohortsData = await getData(query, { cohort: 'PT' })

    expect(cohortsData?.length).toBeGreaterThan(1)
    expect(data.filter(entry => cohortsMap.PT.includes(entry['activityLogs.UserId'])).length).toEqual(cohortsData.length)
  })

  test.each(DATABASE_IDS)('Filter by date >> %s', async databaseID => {
    const query = {
      database: databaseID,
      tables: 'activityLogs'
    }
    const data = await getData(query, {})
    const rangeData = await getData(query, { startDate: '2022-01-01', endDate: '2022-02-01' })

    const filterByDate = (entry: any) => {
      return new Date(entry['activityLogs.Date']).valueOf() >= new Date('2022-01-01').valueOf() &&
        new Date(entry['activityLogs.Date']).valueOf() < new Date('2022-02-01').valueOf()
    }

    expect(rangeData?.length).toBeGreaterThan(1)
    expect(data.filter(filterByDate).length).toEqual(rangeData.length)
  })

  test.each(DATABASE_IDS)('Filter by date & ID >> %s', async databaseID => {
    const query = {
      database: databaseID,
      tables: 'activityLogs'
    }
    const data = await getData(query, {})
    const rangeData = await getData(query, { startDate: '2022-01-01', endDate: '2022-02-01', user: '1' })

    const filterByDate = (entry: any) => {
      return new Date(entry['activityLogs.Date']).valueOf() >= new Date('2022-01-01').valueOf() &&
        new Date(entry['activityLogs.Date']).valueOf() < new Date('2022-02-01').valueOf() &&
        entry['activityLogs.UserId'] == 1
    }

    expect(rangeData?.length).toBeGreaterThan(1)
    expect(data.filter(filterByDate).length).toEqual(rangeData.length)
  })
})


// ---------------------- FIELDS CUSTOM NAMES -----------------------

test.each(DATABASE_IDS)('Custom name >> %s', async databaseID => {
  const ops = ['min', 'max'] as any[]
  const query = {
    database: databaseID,
    tables: 'activityLogs',
    fields: ['activityLogs.Steps']
  }
  const data = await getData(query, {})
  const aggregatedData = await getData({ ...query, fields: [{ target: 'activityLogs.Steps', operator: ops, name: 'Custom name' }] }, {})

  expect(data?.length).toBeGreaterThan(1)
  expect(aggregatedData?.length).toEqual(1)

  ops.forEach((op, index) => {
    expect(Object.keys(aggregatedData[0])[index]).toEqual(`Custom name.${op}`)
  })
})

test.each(DATABASE_IDS)('Custom name (string) >> %s', async databaseID => {
  const query = {
    database: databaseID,
    tables: 'activityLogs',
    fields: ['activityLogs.Steps']
  }
  const data = await getData(query, {})
  const aggregatedData = await getData({ ...query, fields: [{ target: 'activityLogs.Steps', operator: 'min', name: 'Custom name' }] }, {})

  expect(data?.length).toBeGreaterThan(1)
  expect(aggregatedData?.length).toEqual(1)
  expect(Object.keys(aggregatedData[0])[0]).toEqual('Custom name.min')
})

// TODO: Fix this test
// test.each(DATABASE_IDS)('Custom name w/o operator (string) >> %s', async databaseID => {
//   const query = {
//     database: databaseID,
//     tables: 'activityLogs',
//     fields: ['activityLogs.Steps']
//   }
//   const data = await getData(query, {})
//   const aggregatedData = await getData({ ...query, fields: [{ target: 'activityLogs.Steps', name: 'Custom name' }] }, {})

//   expect(data?.length).toBeGreaterThan(1)
//   expect(aggregatedData?.length).toEqual(data?.length)
//   expect(Object.keys(aggregatedData[0])[0]).toEqual('Custom name')
// })