const databaseAPI = require('../../database/api')
const { setReducerConfig } = require('../../reducers/index')
const parseTimeSeries = require('./time-series').default
const parseBarChart = require('./bar-chart').default

const { changePropertyName } = require('../../utils/formatter')

const parseComponentWOProcessingData = (element, params) => {
  return databaseAPI.getData(element, params).then(data => {
    element.specifications.data = data
    return element
  })
}

const parsePieChart = (element, params) => {
  setReducerConfig('pie-chart', element)
  return parseComponentWOProcessingData(element, params)
}

const parseHistogram = (element, params) => {
  setReducerConfig('histogram', element)
  return parseComponentWOProcessingData(element, params)
}

const parseCard = (element, params) => {
  setReducerConfig('card', element)
  return parseComponentWOProcessingData(element, params)
}

const parseTable = (element, params) => {
  changePropertyName(element.specifications, 'attributes', 'x', [])
  changePropertyName(element, 'headers', 'mappedAttributes', {})
  setReducerConfig('table', element)
  return parseComponentWOProcessingData(element, params)
}

const parseMap = (element, params) => {
  // no reducer
  return parseComponentWOProcessingData(element, params)
}

const parseComponent = (uiComponent, params) => {
  switch (uiComponent.type) {
    case 'timeseries':
      return parseTimeSeries(uiComponent, params)
    case 'areachart':
      return parseBarChart(uiComponent, params)
    case 'barchart':
      return parseBarChart(uiComponent, params)
    case 'piechart':
      return parsePieChart(uiComponent, params)
    case 'histogram':
      return parseHistogram(uiComponent, params)
    case 'card':
      return parseCard(uiComponent, params)
    case 'table':
      return parseTable(uiComponent, params)
    case 'map':
      return parseMap(uiComponent, params)
    default:
      return Promise.resolve()
  }
}

exports.readUIComponents = (uiComponents, params) => {
  const promises = []
  uiComponents.forEach(uiComponent =>
    promises.push(parseComponent(uiComponent, params))
  )
  return Promise.all(promises)
}
