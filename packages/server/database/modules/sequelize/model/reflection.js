exports.getModelPrimaryKeys = (model) => {
  return model.describe().then(function (schema) {
    return Object.keys(schema).filter(function (field) {
      return schema[field].primaryKey
    })[0]
  })
}

exports.containsAttribute = (model, attr) => {
  return model.describe().then(function (schema) {
    return Object.keys(schema).includes(attr)
  })
}
