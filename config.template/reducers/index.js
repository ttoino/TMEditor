exports.groupAndFilterData = (data, args) =>  {
  const filteredData = data.filter(el => el.id === args.id)

  const measuresGrouped = filteredData.reduce((acc, curr) => {
    acc[curr.id] = acc[curr.id] || []
    acc[curr.id].push(curr)
    return acc
  }, {})

  return {
    x: Object.keys(measuresGrouped),
    y: Object.values(measuresGrouped)
  }
}