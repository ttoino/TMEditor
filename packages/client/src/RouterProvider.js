// @flow
import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { GlobalState } from './types'
import { BASENAME } from './config/AccessPoint'
import Home from './containers/pages/Home'
import PageNotFound from './containers/pages/PageNotFound'
import PageContainer from './containers/PageContainer'
import LoginContainer from './containers/LoginContainer'
import { auth } from './auth/firebase'
import { updateToken, setupPlatform } from './actions/PlatformMainConfig'

const RouterProvider = () => {
  const authenticated = useSelector((state: GlobalState) => state.platformMainConfig.authenticated)
  const dispatch = useDispatch()

  useEffect(() => {
    // get main config if authenticated
    if (!auth || authenticated) {
      dispatch(setupPlatform())
    }
  })

  if (auth) {
    auth.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await auth.currentUser.getIdToken()
        dispatch(updateToken(token))
      }
    })
  }

  return (
    <BrowserRouter basename={BASENAME}>
      <Route exact path="/login" component={LoginContainer} />
      {(!auth || authenticated)
        ? <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/pages/:page" component={(props) => <PageContainer {...props} />} />
          <Route exact path="/pages/:page/:id" component={props => <PageContainer {...props} />} />
          <Route exact path="/404" component={PageNotFound} />
        </Switch>
        : !authenticated ? <Redirect from="*" to="/login" /> : <Redirect to="/404" />
      }
    </BrowserRouter>
  )
}

export default RouterProvider
