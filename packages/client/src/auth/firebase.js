import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const authEnabled = process.env.AUTH === 'FIREBASE'
const firebaseConfig = process.env.FIREBASE_CONFIG

// Initialize Firebase
if (authEnabled) {
  initializeApp(firebaseConfig)
}

export const auth = authEnabled ? getAuth() : false
