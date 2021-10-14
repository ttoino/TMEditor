// Get all the unique keys from an array of objects
exports.getUniqueKeys = (data) => Object.keys(data.reduce((result, obj) => {
  return Object.assign(result, obj)
}, {}))
