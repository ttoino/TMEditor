const { isObject } = require('../utils/data-types-validation')
const { objToMap, mapToObj } = require('../utils/converter')
const { extractDateFromTimestamp, round } = require('../utils/formatter')
const orderBy = require('lodash.orderby')

const getPropertyName = (properties, el) => {
  return properties.map(name => {
    var propertyName = name
    if (!Object.prototype.hasOwnProperty.call(el, name)) {
      Object.keys(el).forEach(elKey => {
        if (elKey.endsWith(name) || name.endsWith(elKey)) {
          propertyName = elKey
        }
      })
    }
    return propertyName
  })
}

exports.sortTemporalData = data => {
  var mapAsc = new Map([...objToMap(data).entries()].sort())
  return mapToObj(mapAsc)
}

exports.getObjectValueDirOrUndir = (array, elem) => {
  if (!isObject(elem)) {
    array.push(elem)
  } else {
    var uniqueKey = Object.keys(elem)[0]
    array.push(elem[uniqueKey])
  }
}

exports.histogramInputFormatter = data => {
  var newData = []
  for (var key in data) {
    this.getObjectValueDirOrUndir(newData, data[key])
  }
  return newData
}

exports.flattenSingleTimeChart = (data, args) => {
  var x = args[0]
  var y = args[1]

  x = getPropertyName(x, data[0]).shift()
  y = getPropertyName(y, data[0]).shift()
  data = orderBy(data, [x], ['asc'])
  // x-> first key & y -> second key
  return {
    x: data.map(el => extractDateFromTimestamp(el[x])),
    y: data.map(el => parseFloat(el[y]))
  }
}

exports.flattenMultiLineTimeChart = (data, args) => {
  var reducedData = { x: [], y: [] }
  var x = args[0]
  var y = args[1]

  x = getPropertyName(x, data[0]).shift()
  y = getPropertyName(y, data[0])
  data = orderBy(data, [x], ['asc'])

  data.forEach(el => {
    reducedData.x.push(extractDateFromTimestamp(el[x]))
    for (var i = 0; i < y.length; i++) {
      if (!reducedData.y[i]) reducedData.y[i] = []
      reducedData.y[i].push(parseFloat(el[y[i]]))
    }
  })
  return reducedData
}

exports.flattenCategoricalBarChart = (data, args) => {
  var reducedData = { x: [], y: [] }
  var x = getPropertyName(args[0], data[0]).shift()
  var y = args[1]
  if (y === 'IS_COUNT') {
    reducedData.x = data.map(el => el[x])
    reducedData.y = Array(reducedData.x.length).fill(1)
  } else {
    y = args.length > 1 ? getPropertyName(args[1], data[0]).shift() : []

    if (x.length && y.length) {
      data.forEach(el => {
        reducedData.x.push(el[x])
        reducedData.y.push(parseFloat(el[y]))
      })
    } else {
      reducedData.x = Object.keys(data[0])
      reducedData.y = data
        .map(el => {
          return Object.values(el).map(x => parseFloat(x))
        })
        .toFlat(1)
    }
  }

  return reducedData
}

exports.cardReducer = (data, args = []) => {
  var obj = data
  if (Array.isArray(data) && data.length >= 1) {
    obj = data.shift()
  }

  return round(Object.values(obj).shift(), args[0])
}

exports.flattenPieChart = data => {
  var occurrencesMap = {}
  data.forEach(el => {
    var value = Object.values(el)[0]
    Object.prototype.hasOwnProperty.call(occurrencesMap, value)
      ? occurrencesMap[value]++
      : (occurrencesMap[value] = 1)
  })

  return { x: Object.keys(occurrencesMap), y: Object.values(occurrencesMap) }
}

exports.table = (data, args) => {
  /*
       # Add the possibility to rename properties
       var headers = args[0];
       if(headers) {
       }
    */
  return data.length === 0
    ? data
    : {
      headers: Object.keys(data[0]),
      values: data.map(el => Object.values(el))
    }
}
