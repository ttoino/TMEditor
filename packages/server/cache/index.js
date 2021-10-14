const NodeCache = require('node-cache')

// global cache object
var cache = null

exports.initializeCache = () => {
  cache = new NodeCache({ stdTTL: 60, checkperiod: 12, useClones: false })
  this.flushCache() // chache is reseted when initialized
}

exports.getCacheValueByKey = (key) => {
  const value = cache.get(key)
  return Promise.resolve(value)
}

exports.storeCacheKeyValue = (key, value, ttl) => cache.set(key, value, ttl)

exports.deleteCacheKeyValue = (key) => cache.del(key)

exports.flushCache = () => Promise.resolve(cache.flushAll())

exports.default = cache
