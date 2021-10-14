const realtimeQueryModule = require('./realtime')
const cloudfirestoreQueryModule = require('./cloudfirestore')

exports.selectQueryModule = (subtype) => {
  return (subtype === 'realtime') ? realtimeQueryModule : cloudfirestoreQueryModule
}
