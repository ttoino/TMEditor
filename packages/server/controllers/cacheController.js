const { flushCache } = require('../cache')

exports.resetCache = function (req, res) {
  flushCache()
    .then(() => {
      res.status(200).send({ success: 'Cache reseted!' })
    })
    .catch(e => {
      res.status(500)
    })
}
