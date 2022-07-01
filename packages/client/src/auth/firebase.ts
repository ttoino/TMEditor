import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'

import type { TAuthProvider } from '.'

type TFirebaseProvider = TAuthProvider & {
  auth?: any,
}

export default {
  auth: undefined,

  init: async function (config: any, okTokenChange) {
    this.auth = getAuth(initializeApp(config))
    const authToken = localStorage.getItem('authToken')
    if (authToken) { okTokenChange(authToken) }
    return authToken
  },

  authenticate: async function (credentials) {
    const { email, password } = credentials || {}
    await signInWithEmailAndPassword(this.auth, email!, password!)

    const token = await this.auth.currentUser?.getIdToken() as string
    localStorage.setItem('authToken', token)

    return token
  },

  hasOwnLoginPage: () => false,

  signOut: async function () {
    localStorage.removeItem('authToken')
    await signOut(this.auth)
  }
} as TFirebaseProvider
