exports.objToMap = obj => {
  const mp = new Map()
  Object.keys(obj).forEach(k => { mp.set(parseInt(k), obj[k]) })
  return mp
}

exports.mapToObj = aMap => {
  const obj = {}
  aMap.forEach((v, k) => { obj[k] = v })
  return obj
}
