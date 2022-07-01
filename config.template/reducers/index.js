const customReducer = (data, component) => {
  return data.map(row => {
    return {
      ...row,
      newColumn: parseInt(row.value) * 2.13
    }
  })
}

module.exports = {
  customReducer
}