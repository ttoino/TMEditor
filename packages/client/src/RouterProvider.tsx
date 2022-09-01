// @flow
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from './auth'
import DashboardSkeleton from './containers/DashboardSkeleton'
import HomeContainer from './containers/HomeContainer'
import LoginContainer from './containers/LoginContainer'
import PageContainer from './containers/PageContainer'

const RouterProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoutes />}>
          <Route element={<DashboardSkeleton />}>
            <Route index element={<HomeContainer />} />
            <Route path="/pages/:page" element={<PageContainer />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginContainer />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default RouterProvider

function ProtectedRoutes () {
  const { authenticated, hasAuth, hasOwnLoginPage } = useAuth()
  const location = useLocation()

  if (hasAuth && !authenticated && !hasOwnLoginPage) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  return <Outlet />
}
