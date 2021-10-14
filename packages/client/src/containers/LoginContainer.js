// @flow
import React, { useState } from 'react'
import { authenticateWithFirebase } from '../actions/PlatformMainConfig'
import { useDispatch, useSelector } from 'react-redux'
import type { GlobalState } from '../types'
import { Redirect } from 'react-router-dom'
import { BASENAME } from '../config/AccessPoint'

const LoginContainer = () => {
  const dispatch = useDispatch()
  const isAuthenticating = useSelector((state: GlobalState) => state.platformMainConfig.isAuthenticating)
  const authenticated = useSelector((state: GlobalState) => state.platformMainConfig.authenticated)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const loginWithEmailAndPasswordHandler = (ev, email, password) => {
    ev.preventDefault()

    dispatch(authenticateWithFirebase(email, password))
      .then(response => {
        setError(response)
      })
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget

    if (name === 'userEmail') {
      setEmail(value)
    } else if (name === 'userPassword') {
      setPassword(value)
    }
  }

  if (authenticated) {
    return <Redirect to="/" />
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-logo">
          <img src={`${BASENAME}/logo_large.png`} width="200" />
        </div>
        {isAuthenticating
          ? <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
          : <form className="login-form">
            <div className="login-field">
              <input
                type="email"
                name="userEmail"
                value={email}
                id="userEmail"
                onChange={(event) => onChangeHandler(event)}
              />
              <label htmlFor="userEmail" className="label">
                <span className="content-name">E-mail</span>
              </label>
            </div>
            <div className="login-field">
              <input
                type="password"
                name="userPassword"
                value={password}
                id="userPassword"
                onChange={(event) => onChangeHandler(event)}
              />
              <label htmlFor="userPassword" className="label">
                <span className="content-name">Password</span>
              </label>
            </div>
            <button className="login-button" onClick={(event) => loginWithEmailAndPasswordHandler(event, email, password)}>Sign in</button>
            {error !== null && <div className="login-error">{error.message}</div>}
          </form>
        }
      </div>
    </div>
  )
}

export default LoginContainer
