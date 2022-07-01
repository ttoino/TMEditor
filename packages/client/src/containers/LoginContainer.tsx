import React, { ChangeEvent, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { styled } from '@app/theme'
import { useAuth } from '@app/auth'

const LoginContainer = () => {
  const { authenticated, authenticate, isAuthenticating } = useAuth()
  const location: any = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<null | any>(null)

  const from = location.state?.from?.pathname || '/'

  const loginWithEmailAndPasswordHandler = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()

    try {
      await authenticate({ email, password })
    } catch (error) {
      setError(error)
    }
  }

  const onChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.currentTarget

    if (name === 'userEmail') {
      setEmail(value)
    } else if (name === 'userPassword') {
      setPassword(value)
    }
  }

  if (authenticated) {
    return <Navigate to={from} replace={true} />
  }

  return (
    <Wrapper>
      <div className="login-content">
        <div className="login-logo">
          <img src="/logo_large.png" width="200" />
        </div>
        {authenticated && isAuthenticating
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
            <button className="login-button" onClick={(event) => loginWithEmailAndPasswordHandler(event)}>Sign in</button>
            {error !== null && <div className="login-error">{error.message}</div>}
          </form>
        }
      </div>
    </Wrapper>
  )
}

export default LoginContainer

const Wrapper = styled('div', {
  backgroundColor: '$neutral50',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  height: '100vh'
})
