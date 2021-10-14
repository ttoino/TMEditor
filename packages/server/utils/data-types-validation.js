// Returns if a value is a string
exports.isString = (value) => {
  return typeof value === 'string' || value instanceof String
}

// Returns if a value is really a number
exports.isNumber = (value) => {
  return typeof value === 'number' && isFinite(value)
}

// Returns if a value is a function
exports.isFunction = (value) => {
  return typeof value === 'function'
}

// Returns if a value is an object
exports.isObject = (value) => {
  return value && typeof value === 'object' && value.constructor === Object
}

// Returns if a value is null
exports.isNull = (value) => {
  return value === null
}

// Returns if a value is undefined
exports.isUndefined = (value) => {
  return typeof value === 'undefined'
}

// Returns if a value is a boolean
exports.isBoolean = (value) => {
  return typeof value === 'boolean'
}

// Returns if value is a date object
exports.isDate = (value) => {
  return value instanceof Date
}
