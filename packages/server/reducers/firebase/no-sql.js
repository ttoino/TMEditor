const commonReducer = require('../common')
const { extractDateFromTimestamp } = require('../../utils/formatter')

exports.realtimeNoSQLSingleTimeChart = data => {
  data = commonReducer.sortTemporalData(data)
  var newData = { x: [], y: [] }
  for (var key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      var date = extractDateFromTimestamp(key)
      newData.x.push(date)
      commonReducer.getObjectValueDirOrUndir(newData.y, data[key])
    }
  }
  return newData
}

exports.realtimeNoSQLMultiTimeChart = (data, attr) => {
  return formatPKMultiVal(data, attr, true)
}

function formatPKMultiVal (data, attr, isMulti) {
  data = commonReducer.sortTemporalData(data)
  var newData = { x: [], y: [] }

  var length = 0
  for (var keydup in data) {
    if (Object.prototype.hasOwnProperty.call(data, keydup)) {
      var date = extractDateFromTimestamp(keydup)
      newData.x.push(date)
      if (length === 0) {
        length = Object.keys(data[keydup]).length
      }
    }
  }
  for (var j = 0; j < length; j++) {
    var arrAux = []
    for (var key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        var name = Object.keys(data[key])[j]
        var element = data[key][name]
        if (!isMulti) {
          newData.y.push(element)
        } else {
          arrAux.push(element)
        }
      }
    }
    if (isMulti) {
      newData.y.push(arrAux)
    }
  }

  return newData
}

exports.histogramInputFormatter = data => {
  return commonReducer.histogramInputFormatter(data)
}

exports.realtimeNoSQLCategBarChart = data => {
  var newData = { x: [], y: [] }
  for (var keydup in data) {
    newData.x = Object.keys(data[keydup])
    break
  }

  for (var key in data) {
    for (var i = 0; i < newData.x.length; i++) {
      newData.y.push(data[key][newData.x[i]])
    }
  }
  return newData
}
