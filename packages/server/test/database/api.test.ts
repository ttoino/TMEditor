import { getData, setupDatabases } from '@app/database/api'
import { readPlatformConfig } from '@app/parsers/config-parser'

const ACTIVITIES_MODEL_ATTRIBUTES = ['Id', 'Date', 'EndTime', 'ElevationGain', 'UserId', 'Calories', 'Distance', 'Steps', 'ActivityTypesId']
const ACTIVITY_TYPES_ATTRIBUTES = ['Id', 'Description', 'DifficultyDetailsId']
const DIFFICULTY_DETAILS_ATTRIBUTES = ['Id', 'Description']

const DATABASE_IDS = readPlatformConfig()
  .databases.map(db => [db.id])
  .filter(p => p[0] !== 'hapi_fhir_test_api') // The following tests are not compatible with FHIR connector
  // .filter(p => p[0] === 'firebase_test_db')

beforeAll(() => {
  return setupDatabases()
})

test.each(DATABASE_IDS)('Get all data from a table >> %s', async databaseID => {
  const data = await getData({
    database: databaseID,
    table: 'activityLogs'
  }, {})
  expect(data?.length).toBeGreaterThan(1)
})

test.each(DATABASE_IDS)('Field filters >> %s', async databaseID => {
  const query = {
    database: databaseID,
    table: 'activityLogs',
    fields: ['Steps', 'Calories', 'EndTime']
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
    table: 'activityLogs',
    fields: [{ target: 'Steps' }, { target: 'Calories' }]
  }

  const data = await getData(query, {})
  expect(data?.length).toBeGreaterThan(1)

  for (const row of data) {
    expect(new Set(Object.keys(row))).toEqual(new Set(['Steps', 'Calories']))
  }
})

// ---------------------- INCLUDE -----------------------

describe('Include tests', () => {
  test.each(DATABASE_IDS)('Basic include >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs',
      include: [{
        table: 'activityTypes'
      }]
    }

    const data = await getData(query, {})
    expect(data?.length).toBeGreaterThan(1)

    for (const row of data) {
      expect(new Set(Object.keys(row))).toEqual(new Set([...ACTIVITIES_MODEL_ATTRIBUTES, 'activityTypes']))
      expect(new Set(Object.keys(row.activityTypes))).toEqual(new Set([...ACTIVITY_TYPES_ATTRIBUTES]))
    }
  })

  test.each(DATABASE_IDS)('Include with filters >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs',
      fields: ['Steps', 'Calories'],
      include: [{
        table: 'activityTypes',
        fields: ['Description', 'DifficultyDetailsId']
      }]
    }

    const data = await getData(query, {})
    expect(data?.length).toBeGreaterThan(1)

    for (const row of data) {
      expect(new Set(Object.keys(row)))
        .toEqual(new Set([
          ...['Steps', 'Calories', 'activityTypes']
        ]))

      expect(new Set(Object.keys(row.activityTypes)))
        .toEqual(new Set([
          ...['Description', 'DifficultyDetailsId']
        ]))
    }
  })

  test.each(DATABASE_IDS)('Include 2 levels >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs',
      include: [{
        table: 'activityTypes',
        include: [{
          table: 'difficultyDetails'
        }]
      }]
    }

    const data = await getData(query, {})
    expect(data?.length).toBeGreaterThan(1)

    for (const row of data) {
      expect(new Set(Object.keys(row))).toEqual(new Set([...ACTIVITIES_MODEL_ATTRIBUTES, 'activityTypes']))
      expect(new Set(Object.keys(row.activityTypes))).toEqual(new Set([...ACTIVITY_TYPES_ATTRIBUTES, 'difficultyDetails']))
      expect(new Set(Object.keys(row.activityTypes.difficultyDetails))).toEqual(new Set([...DIFFICULTY_DETAILS_ATTRIBUTES]))
    }
  })
})

// ---------------------- GROUP BY -----------------------

test.each(DATABASE_IDS)('Group by >> %s', async databaseID => {
  const data = await getData({
    database: databaseID,
    table: 'activityLogs',
    fields: [{
      target: 'Steps',
      operator: ['avg', 'min', 'max', 'sum']
    },
    { target: 'Steps', operator: 'count' }],
    groupby: 'UserId'
  }, {})

  expect(data).toBeTruthy()
  expect(data.length).toBeGreaterThan(1)

  expect(data.every(d => Object.keys(d).length === 2)).toBe(true)
  for (const row of data) {
    for (const key in row) {
      expect(row[key]).toBeTruthy()
      expect(row[key] !== 'NA').toBeTruthy()
    }
    expect(Math.round(row.Steps.avg * row.Steps.count)).toBeCloseTo(row.Steps.sum)
    expect(row.Steps.max).toBeGreaterThan(row.Steps.min)
    expect(row.Steps.max).toBeGreaterThanOrEqual(row.Steps.avg)
    expect(row.Steps.min).toBeLessThanOrEqual(row.Steps.avg)
  }
})

// ---------------------- OPERATORS -----------------------

describe('Operator tests', () => {
  test.each(DATABASE_IDS)('Average operator >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs',
      fields: ['Steps']
    }
    const data = await getData(query, {})
    const aggregatedData = await getData({ ...query, fields: [{ target: 'Steps', operator: 'avg' }] }, {})

    expect(data?.length).toBeGreaterThan(1)
    expect(aggregatedData?.length).toEqual(1)
    expect(aggregatedData[0].Steps.avg)
      .toBeCloseTo(data
        .map(d => d.Steps)
        .reduce(
          (avg, val, _, { length }) => avg + parseFloat(val) / length,
          0.0))
  })

  test.each(DATABASE_IDS)('Max operator >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs',
      fields: ['Steps']
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'Steps', operator: 'max' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0].Steps.max)
      .toEqual(Math.max(...allData.map(d => d.Steps)))
  })

  test.each(DATABASE_IDS)('Min operator >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs',
      fields: ['Steps']
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'Steps', operator: 'min' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0].Steps.min)
      .toEqual(Math.min(...allData.map(d => d.Steps)))
  })

  test.each(DATABASE_IDS)('Sum operator >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs',
      fields: ['Steps']
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'Steps', operator: 'sum' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0].Steps.sum)
      .toEqual(allData
        .map(d => d.Steps)
        .reduce(
          (sum, val) => sum + parseFloat(val),
          0.0))
  })

  test.each(DATABASE_IDS)('Count operator >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs',
      fields: ['Steps']
    }
    const allData = await getData(query, {})
    const result = await getData({ ...query, fields: [{ target: 'Steps', operator: 'count' }] }, {})

    expect(allData?.length).toBeGreaterThan(1)
    expect(result?.length).toEqual(1)
    expect(result[0].Steps.count)
      .toEqual(allData.length)
  })
})

const getMaxSteps = async (databaseID: string) => (await getData({
  database: databaseID,
  table: 'activityLogs',
  fields: [{ target: 'Steps', operator: 'max' }]
}, {}))[0].Steps.max

const getMinSteps = async (databaseID: string) => (await getData({
  database: databaseID,
  table: 'activityLogs',
  fields: [{ target: 'Steps', operator: 'min' }]
}, {}))[0].Steps.min

const getRowCount = async (databaseID: string) => (await getData({
  database: databaseID,
  table: 'activityLogs',
  fields: [{ target: 'Steps', operator: 'count' }]
}, {}))[0].Steps.count

// ---------------------- FILTERS -----------------------

describe('Filter tests', () => {
  test.each(DATABASE_IDS)('== filter >> %s', async databaseID => {
    const maxStepsValue = await getMaxSteps(databaseID)
    const data = await getData({
      database: databaseID,
      table: 'activityLogs',
      filters: [{
        operator: '==',
        target: 'Steps',
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
      table: 'activityLogs',
      filters: [{
        operator: '!=',
        target: 'Steps',
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
      table: 'activityLogs',
      filters: [{
        operator: '>',
        target: 'Steps',
        value: minValue
      }]
    }, {})).length).toEqual(totalCount - 1)
    expect((await getData({
      database: databaseID,
      table: 'activityLogs',
      filters: [{
        operator: '>',
        target: 'Steps',
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
      table: 'activityLogs',
      filters: [{
        operator: '<',
        target: 'Steps',
        value: maxValue
      }]
    }, {})).length).toEqual(totalCount - 1)
    expect((await getData({
      database: databaseID,
      table: 'activityLogs',
      filters: [{
        operator: '<',
        target: 'Steps',
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
      table: 'activityLogs',
      filters: [{
        operator: '>=',
        target: 'Steps',
        value: minValue
      }]
    }, {})).length).toEqual(totalCount)
    expect((await getData({
      database: databaseID,
      table: 'activityLogs',
      filters: [{
        operator: '>=',
        target: 'Steps',
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
      table: 'activityLogs',
      filters: [{
        operator: '<=',
        target: 'Steps',
        value: maxValue
      }]
    }, {})).length).toEqual(totalCount)
    expect((await getData({
      database: databaseID,
      table: 'activityLogs',
      filters: [{
        operator: '<=',
        target: 'Steps',
        value: minValue
      }]
    }, {})).length).toEqual(1)
  })

  test.each(DATABASE_IDS)('with date filters >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs'
    }
    const data = await getData(query, {})
    const filtersData = await getData({
      database: databaseID,
      table: 'activityLogs',
      filters: [{
        operator: '>=',
        target: 'Steps',
        value: 4000
      }]
    }, { startDate: '2022-01-01', endDate: '2022-02-01' })

    const filterByDate = (entry: any) => {
      return new Date(entry.Date).valueOf() >= new Date('2022-01-01').valueOf() &&
        new Date(entry.Date).valueOf() < new Date('2022-02-01').valueOf() &&
        entry.Steps >= 4000
    }

    expect(filtersData.length).toEqual(data.filter(filterByDate).length)
  })
})

// ---------------------- SEARCH PARAMS FILTERS -----------------------

describe('Search params tests', () => {
  const cohortsMap = {
    PT: [1, 2, '1', '2'],
    USA: [3, '3']
  }

  test.each(DATABASE_IDS)('Filter by user ID >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs'
    }
    const data = await getData(query, {})
    const singleUser = await getData(query, { user: '1' })

    expect(singleUser?.length).toBeGreaterThan(1)
    // NOTE: We are using loose equality since the testing databases use different data types
    expect(data.filter(entry => entry.UserId == 1).length).toEqual(singleUser.length)
  })

  test.each(DATABASE_IDS)('Filter by cohort >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs'
    }
    const data = await getData(query, {})
    const cohortsData = await getData(query, { cohort: 'PT' })

    expect(cohortsData?.length).toBeGreaterThan(1)
    expect(data.filter(entry => cohortsMap.PT.includes(entry.UserId)).length).toEqual(cohortsData.length)
  })

  test.each(DATABASE_IDS)('Filter by date >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs'
    }
    const data = await getData(query, {})
    const rangeData = await getData(query, { startDate: '2022-01-01', endDate: '2022-02-01' })

    const filterByDate = (entry: any) => {
      return new Date(entry.Date).valueOf() >= new Date('2022-01-01').valueOf() &&
      new Date(entry.Date).valueOf() < new Date('2022-02-01').valueOf()
    }

    expect(rangeData?.length).toBeGreaterThan(1)
    expect(data.filter(filterByDate).length).toEqual(rangeData.length)
  })

  test.each(DATABASE_IDS)('Filter by date & ID >> %s', async databaseID => {
    const query = {
      database: databaseID,
      table: 'activityLogs'
    }
    const data = await getData(query, {})
    const rangeData = await getData(query, { startDate: '2022-01-01', endDate: '2022-02-01', user: '1' })

    const filterByDate = (entry: any) => {
      return new Date(entry.Date).valueOf() >= new Date('2022-01-01').valueOf() &&
        new Date(entry.Date).valueOf() < new Date('2022-02-01').valueOf() &&
        entry.UserId == 1
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
    table: 'activityLogs',
    fields: ['Steps']
  }
  const data = await getData(query, {})
  const aggregatedData = await getData({ ...query, fields: [{ target: 'Steps', operator: ops, name: 'Custom name' }] }, {})

  expect(data?.length).toBeGreaterThan(1)
  expect(aggregatedData?.length).toEqual(1)

  expect(Object.keys(aggregatedData[0])[0]).toEqual('Custom name')
})

test.each(DATABASE_IDS)('Custom name (string) >> %s', async databaseID => {
  const query = {
    database: databaseID,
    table: 'activityLogs',
    fields: ['Steps']
  }
  const data = await getData(query, {})
  const aggregatedData = await getData({ ...query, fields: [{ target: 'Steps', operator: 'min', name: 'Custom name' }] }, {})

  expect(data?.length).toBeGreaterThan(1)
  expect(aggregatedData?.length).toEqual(1)
  expect(Object.keys(aggregatedData[0])[0]).toEqual('Custom name')
})

test.each(DATABASE_IDS)('Custom name w/o operator (string) >> %s', async databaseID => {
  const query = {
    database: databaseID,
    table: 'activityLogs',
    fields: ['Steps']
  }
  const data = await getData({ ...query, fields: [{ target: 'Steps', name: 'Custom name' }] }, {})

  expect(data?.length).toBeGreaterThan(1)
  expect(Object.keys(data[0])[0]).toEqual('Custom name')
})
