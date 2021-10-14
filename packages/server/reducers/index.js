const logger = require('../config/logger')
const fs = require('fs')
const path = require('path')
const { REDUCERS_PATH } = require('../utils/constants/config-file-paths')
const realtimeNoSQLReducer = require('./firebase/no-sql')
const sequelizeReducer = require('./sequelize')
const denormalizedReducer = require('./firebase/denormalized')
const yamlInterpreter = require('../parsers/yaml-parser')
const {
  defaultRound, defaultReducerAttributes, defaultReducerName, defaultParadigm, defaultDbType,
  defaultFirebaseDBSubType
} = require('../utils/default-values-generator')
const userReducer = require('./users-reducer.js').default

const createDefaultReducer = (name, attr = []) => {
  return { name: name, attr: attr, default: true }
}

const callbackBasedOnDB = (callbacks, parameterObj) => {
  const { dbType, paradigm } = parameterObj

  return (dbType === 'firebase' || dbType === 'couchdb')
    ? paradigm === 'NoSQL'
      ? callbacks['realtime-NoSQL']
      : callbacks.denormalized
    : callbacks.sequelize
}

const createCallBacksObj = callbackFunctions => {
  return {
    denormalized: callbackFunctions[0],
    'realtime-NoSQL': callbackFunctions[1],
    sequelize: callbackFunctions[2]
  }
}

const createReducerForSingleTimeChart = parameterObj => {
  var callbacks = createCallBacksObj([
    createDefaultReducer('denormalizedSingleTimeChart'),
    createDefaultReducer('realtimeNoSQLSingleTimeChart'),
    createDefaultReducer('sequelizeSingleTimeChart')
  ])

  return callbackBasedOnDB(callbacks, parameterObj)
}

const createReducerForMultiTimeChart = parameterObj => {
  var callbacks = createCallBacksObj([
    createDefaultReducer('denormalizedMultiLineTimeChart'),
    createDefaultReducer('realtimeNoSQLMultiTimeChart'),
    createDefaultReducer('sequelizeMultiLineTimeChart')
  ])

  return callbackBasedOnDB(callbacks, parameterObj)
}

const createReducerForCategoricalBarChart = parameterObj => {
  var callbacks = createCallBacksObj([
    createDefaultReducer('denormalizedCategoricalBarChart'),
    createDefaultReducer('realtimeNoSQLCategBarChart'),
    createDefaultReducer('sequelizeCategoricalBarChart')
  ])

  return callbackBasedOnDB(callbacks, parameterObj)
}

const createReducerForPieChart = parameterObj => {
  var callbacks = createCallBacksObj([
    createDefaultReducer('denormalizedPieChart'),
    null, // To be defined
    createDefaultReducer('sequelizePieChart')
  ])

  return callbackBasedOnDB(callbacks, parameterObj)
}

const createReducerForTable = parameterObj => {
  var callbacks = createCallBacksObj([
    createDefaultReducer('denormalizedTable'),
    null, // To be defined
    createDefaultReducer('sequelizeTable', parameterObj.headers)
  ])

  return callbackBasedOnDB(callbacks, parameterObj)
}

const createReducerForCard = round => {
  return createDefaultReducer('cardReducer', [round])
}

const getChartReducerConfig = (graphType, element) => {
  const { plurality, headers } = element
  const { reducer, x } = element.specifications
  const dbInfo = yamlInterpreter.readDBInfoByID(element.specifications.database)
  let map = {}

  if (dbInfo === undefined) {
    return null
  }

  var parameterObj = {
    dbType: defaultDbType(dbInfo.type),
    dbSubType: defaultFirebaseDBSubType(dbInfo.subtype),
    paradigm: defaultParadigm(dbInfo.paradigm)
  }

  if (!reducer) {
    switch (graphType) {
      case 'temporal':
        if (plurality === 'multiple') {
          map = createReducerForMultiTimeChart(parameterObj)
        } else {
          map = createReducerForSingleTimeChart(parameterObj)
        }
        break
      case 'histogram':
        map = createDefaultReducer('histogramInputFormatter')
        break
      case 'categorical-barchart':
        map = createReducerForCategoricalBarChart(parameterObj)
        break
      case 'pie-chart':
        map = createReducerForPieChart(parameterObj)
        break
      default:
        map = createReducerForTable({ ...parameterObj, headers })
        break
    }
  } else {
    // Create default map with custom reducer
    map = { name: reducer, attr: x, default: false }
  }
  return map
}

const getReducerModule = (map, dbType, paradigm, dbSubType) => {
  if (!map.default) {
    return loadCustomReducers()
  } else {
    const callbacks = createCallBacksObj([denormalizedReducer, realtimeNoSQLReducer, sequelizeReducer])
    return callbackBasedOnDB(callbacks, { dbType, paradigm, dbSubType })
  }
}

const loadCustomReducers = () => {
  let reducers = {}

  try {
    fs.readdirSync(REDUCERS_PATH).forEach(file => {
      const name = file.split('.')[0]
      const reducerFunctions = require(path.join('../', REDUCERS_PATH, `${name}.js`))

      reducers = { ...reducers, ...reducerFunctions }
    })
  } catch (e) {
    logger.error(e)
  }

  return reducers
}

exports.applyUserReducer = (data, userMappingMethod, cohortDefinition) => {
  return userReducer(data, userMappingMethod, cohortDefinition)
}

exports.setReducerConfig = (component, element) => {
  element.specifications.map =
    component === 'card'
      ? createReducerForCard(defaultRound(element.round))
      : getChartReducerConfig(component, element)
}

exports.specifyMapXnY = (map, x, y) => {
  if (map.default) {
    if (!x.length && y.length) {
      x = y
      y = null
    }

    if (x.length) {
      map.attr.splice(1, 0, x)
      if (y && y.length) {
        map.attr.splice(2, 0, y)
      }
    }
  }
}

exports.submitToReducer = (map, data, dbType, subtype, paradigm) => {
  const reducerName = (map.name && map.name.name) || map.name
  const reducerFunction = getReducerModule(map, dbType, paradigm, subtype)[reducerName]
  const args = map.name && map.name.args

  return reducerFunction(data, args)
}
