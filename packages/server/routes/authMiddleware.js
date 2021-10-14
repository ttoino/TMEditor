
const admin = require('firebase-admin')
const hasAuth = process.env.AUTH === 'FIREBASE'

if (hasAuth) {
  const serviceAccount = require('../../../config/firebaseServiceAccount.json')
  const firebaseConfig = require('../../../config/firebaseConfig.json')

  // Supports Firebase authentication with email and password
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseConfig.databaseURL
  })
}

module.exports = function (req, res, next) {
  if (hasAuth) {
    if (req.headers.authorization) {
      admin.auth().verifyIdToken(req.headers.authorization)
        .then((user) => {
          next()
        }).catch(() => {
          res.status(403).send('Unauthorized')
        })
    } else {
      res.status(403).send('Unauthorized')
    }
  } else {
    next()
  }
}
