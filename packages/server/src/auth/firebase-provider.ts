import admin from 'firebase-admin'
import { NextFunction, Request, Response } from 'express'
import { readAuthConfigFile, FirebaseAuthConfig } from '@app/parsers/config-parser'

export const firebaseProvider = async (req: Request, res: Response, next: NextFunction) => {
  // Supports Firebase authentication with email and password
  const authConfig = readAuthConfigFile() as FirebaseAuthConfig

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(authConfig.serviceAccount)
    })
  }

  if (req.headers.authorization) {
    try {
      await admin.auth().verifyIdToken(req.headers.authorization)

      next()
    } catch (error) {
      res.status(403).send('Unauthorized')
    }
  } else {
    res.status(403).send('Unauthorized')
  }
}
