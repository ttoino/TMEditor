const { submitToReducer } = require('../../../../reducers/index')
const {
  defaultPlurality,
  defaultDocumentName,
  defaultChildrenProperty
} = require('../../../../utils/default-values-generator')
const { filteredQuery } = require('../query/realtime')
const { toflattenObjectByXProp } = require('../../../../utils/formatter')

const paradigm = 'NoSQL'

const constructPath = (element, result) => {
  var plurality = defaultPlurality(element.plurality)
  var documentName = defaultDocumentName(element)
  return plurality === 'unique'
    ? documentName + '/' + result.path
    : documentName + '/' + '{required}/' + result.path
}

const searchTree = (element, targetDocument) => {
  const children = defaultChildrenProperty(element.children)
  const documentName = defaultDocumentName(element)
  if (documentName === targetDocument) {
    return {
      element: element,
      path: documentName,
      pluralityInfo: !element.plurality ? [] : [element.plurality]
    }
  } else if (children !== 'none') {
    var i
    var result = null
    for (i = 0; result == null && i < children.length; i++) {
      result = searchTree(children[i], targetDocument)
    }

    if (result !== null && documentName !== 'root') {
      var plurality = element.plurality || 'doc'
      if (plurality !== 'doc') {
        result.pluralityInfo.push('doc')
        result.pluralityInfo.push(element.plurality)
      }

      return {
        ...result,
        path: constructPath(element, result),
        pluralityInfo: result.pluralityInfo
      }
    } else return result
  }
  return null
}

const createRoute = (params, actualRoute) => {
  if (params.id) {
    actualRoute = actualRoute.replace('{required}', params.id)
  }

  return actualRoute
}

const getIndepthObjectProperties = (data, attr, length) => {
  if (!length || typeof data === 'undefined') {
    return data
  }
  var targetAttr = attr[0]
  return getIndepthObjectProperties(data[targetAttr], attr.slice(1), length - 1)
}

const cleanseData = (data, splittedRoute) => {
  if (!splittedRoute || !splittedRoute.length) {
    return data
  }

  // Handles data route as a queue -- FIFO
  var intermRoute = splittedRoute[0].split('/')

  for (var key in data) {
    var specificData = getIndepthObjectProperties(
      data[key],
      intermRoute,
      intermRoute.length
    )
    var newSplittedRoute =
      splittedRoute.length > 1 ? splittedRoute.slice(1) : []
    data[key] = specificData
      ? cleanseData(specificData, newSplittedRoute)
      : null
  }

  return data
}

exports.default = (db, specifications, params, dbInfo) => {
  var { map, table } = specifications

  // var { path, pluralityInfo } = searchTree(dbInfo.structure, table)
  // pluralityInfo = pluralityInfo.reverse() // reverse since it was built using backtracking

  var { path } = searchTree(dbInfo.structure, table)

  var splittedRoute = createRoute(params, path).split('/{required}/')

  return filteredQuery(db, splittedRoute[0], params).then(function (snapshot) {
    var cData = cleanseData(snapshot, splittedRoute.slice(1))
    if (!params.id) {
      cData = toflattenObjectByXProp(cData)
    }
    return submitToReducer(map, cData, 'firebase', 'realtime', paradigm)
  })
}
