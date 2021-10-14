const pick = require('lodash.pick')

const { replaceNullObjProps } = require('../../../utils/formatter')

exports.formatQueryResultData = (result, properties) => {
  const guaranteePropOrder = prevFormatted => {
    if (!prevFormatted.length) {
      return
    }
    var keys = Object.keys(prevFormatted[0])
    var auxKeys = {}

    keys.forEach(el => {
      auxKeys[el] = properties.findIndex(prop => el.endsWith(prop))
    })

    keys = keys.sort(function (a, b) {
      return auxKeys[a] - auxKeys[b]
    })

    var finalData = prevFormatted.map(el => {
      var newObj = {}
      keys.forEach(key => {
        newObj[key] = el[key]
      })
      return newObj
    })

    return finalData
  }

  var auxProps = {}
  var formKeys = Object.keys(result[0]).filter(el => {
    var elSplitted = el
      .split('.')
      .pop()
      .split('|')
      .pop()
    return properties.findIndex(prop => prop.endsWith(elSplitted)) !== -1
  })

  formKeys.forEach(el => {
    auxProps[el] = properties.find(prop => prop.endsWith(el))
  })

  if (properties.length > 0) {
    result = result.map(el => {
      var formattedEl = {}
      formKeys.forEach(key => {
        var splittedKey = key.split('.')
        var formattedKey
        if (splittedKey.length === 1) {
          formattedKey = splittedKey.shift().replace('|', '.')
        } else {
          var lastEl = splittedKey.pop()
          formattedKey = lastEl.includes('|')
            ? lastEl.replace('|', '.')
            : lastEl
        }
        if (!Object.prototype.hasOwnProperty.call(formattedEl, formattedKey)) {
          formattedEl[formattedKey] = el[key]
        }
      })
      return formattedEl
    })
  }

  return guaranteePropOrder(result)
}

exports.formatUserQueryResultData = (
  result,
  PkKey,
  idAttribute,
  nmAttributes,
  map
) => {
  var formattedUsers = {}

  result.forEach(el => {
    var id = PkKey
    if (idAttribute) {
      id = idAttribute
      map[el[id]] = el[PkKey]
    }
    formattedUsers[el[id]] =
      nmAttributes && nmAttributes.length > 0
        ? pick(replaceNullObjProps(el, 'N/D'), nmAttributes)
        : null
  })
  return formattedUsers
}
