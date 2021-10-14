const moment = require('moment')
const _ = require('underscore')
const meanBy = require('lodash.meanby')
const maxBy = require('lodash.maxby')
const minBy = require('lodash.minby')
const sumBy = require('lodash.sumby')

const { defaultOperator, defaultQueryFilters, defaultQueryProperties, defaultRelation, defaultDecimalPlaces, defaultGroupBy } = require('../../utils/default-values-generator')
const { setReducerConfig } = require('../../reducers/index')
const { roundDecimalPlaces, applyAggregation } = require('../../utils/formatter')
const databaseAPI = require('../../database/api')

const groupByDatetime = (groupby, xdata, ydata) => {
  const applyOperator = (operator, data) => {
    operator = defaultOperator(operator)
    return applyAggregation(operator, [
      meanBy(data),
      maxBy(data),
      minBy(data),
      sumBy(data),
      data.length
    ])
  }

  if (groupby !== 'none') {
    var groups = _.groupBy(xdata, function (date) {
      return moment(date).startOf(groupby.time).format()
    })
    var aux = 0
    var aggVals = []
    var aggDates = []

    for (var key in groups) {
      aggDates.push(key)
      var length = groups[key].length

      var slicedArray = ydata.slice(aux, (aux + length))
      var val = applyOperator(groupby.operator, slicedArray)

      aux += length
      aggVals.push(roundDecimalPlaces(val, defaultDecimalPlaces(groupby.round)))
    }
    return { x: aggDates, y: aggVals }
  } else {
    return { x: xdata, y: ydata }
  }
}

const getTemporalDataAndApplyOps = (element, params, dataAccessInfo) => {
  var { groupby, table, map } = dataAccessInfo
  var properties = defaultQueryProperties(element.specifications.properties)
  var filters = defaultQueryFilters(element.specifications.filters)
  groupby = defaultGroupBy(groupby)
  element.specifications = { ...element.specifications, table: table, map: map, properties: properties, filters: filters }
  return databaseAPI.getData(element, params).then((data) => {
    var xdata = []
    var ydata = []
    var groupedData = null
    if (element.plurality === 'multiple' && element.relation === 'aggregated') {
      for (var i = 0; i < data.y.length; i++) {
        groupedData = groupByDatetime(groupby, data.x, data.y[i])
        xdata.push(groupedData.x)
        ydata.push(groupedData.y)
      }
    } else {
      groupedData = groupByDatetime(groupby, data.x, data.y)
      xdata = groupedData.x
      ydata = groupedData.y
    }
    data.x = xdata
    data.y = ydata
    return data
  })
}

const getTemporalData = async (element, params) => {
  var { specifications, relation } = element
  element.relation = defaultRelation(relation)
  var data

  setReducerConfig('temporal', element)
  var map = specifications.map
  data = await getTemporalDataAndApplyOps(element, params, { groupby: specifications.groupby, table: specifications.table, map: map })
  element.specifications.data = data
  return element
}

exports.default = (element, params) => getTemporalData(element, params)
