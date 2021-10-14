const merge = require('lodash.merge')
const logger = require('../config/logger')
const { ERROR_INEXISTENT_AGG_OP } = require('./constants/logger-messages')

exports.roundDecimalPlaces = (string, decimalPlaces) => {
  var number = parseFloat(string)
  var aux = Math.pow(10, decimalPlaces || 2)
  return Math.round(number * aux) / aux
}

exports.round = (val, roundTo) => {
  switch (roundTo) {
    case 'units':
    case 'u':
      return this.roundDecimalPlaces(val, 0)
    case 'decimals':
    case 'd':
      return this.roundDecimalPlaces(val, 1)
    case 'centesimals':
    case 'c':
      return this.roundDecimalPlaces(val, 2)
    default:
      return this.roundDecimalPlaces(val, parseInt(roundTo))
  }
}

exports.extractDateFromTimestamp = timestamp => {
  return /^\d+$/.test(timestamp) ? new Date(parseInt(timestamp)) : timestamp
}

exports.concatStringsByDot = (s1, s2) => {
  return s1 + '.' + s2
}

exports.toflattenObjectByXProp = (obj, num = 1) => {
  function flattenByOneProp (obj) {
    var result = {}
    for (var key in obj) {
      result = merge(result, obj[key])
    }
    return result
  }

  for (var i = 0; i < num; i++) {
    obj = flattenByOneProp(obj)
  }
  return obj
}

exports.createObjWithDefaultPropsValues = properties => {
  const defaultObj = {}
  if (properties) {
    properties.forEach(el => {
      defaultObj[el] = 'N/D'
    })
  }
  return defaultObj
}

exports.dupObj = obj => {
  return Object.assign({}, obj)
}

exports.replaceNullObjProps = (obj, value) => {
  Object.keys(obj).forEach(function (key) {
    if (!obj[key]) {
      obj[key] = value
    }
  })
  return obj
}

exports.replicateArray = (it, array) => {
  var length = array.length
  for (var i = 0; i < it - 1; i++) {
    for (var j = 0; j < length; j++) {
      array.push(array[j])
    }
  }
}

exports.applyAggregation = (operator, callbacksArr) => {
  switch (operator) {
    case 'avg':
      return callbacksArr[0]
    case 'max':
      return callbacksArr[1]
    case 'min':
      return callbacksArr[2]
    case 'sum':
      return callbacksArr[3]
    case 'count':
      return callbacksArr[4]
    default:
      logger.error(ERROR_INEXISTENT_AGG_OP)
  }
}

exports.changePropertyName = (object, propertyName, newName, defaultValue) => {
  if (Object.prototype.hasOwnProperty.call(object, propertyName)) {
    object[newName] = object[propertyName]
    delete object[propertyName]
  } else {
    object[newName] = defaultValue
  }
}

exports.renameKeys = (keysMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || keysMap[key.split('.').pop()] || key]: obj[key] }
    }),
    {}
  )

exports.jsonConcat = (o1, o2) => {
  for (var key in o2) {
    o1[key] = o2[key]
  }
  return o1
}
