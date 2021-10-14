// @flow
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import type { GlobalState } from '../types'
import UserDashboard from './pages/UserDashboard'
import { useSelector } from 'react-redux'
import PageNotFound from './pages/PageNotFound'

type Props = {
 ...RouteComponentProps
};

const PageContainer = (props: Props) => {
  const currentPage = props.match.params.page
  const pages = useSelector((state: GlobalState) => state.platformMainConfig.pages)
  const isPageValid = pages.some(p => p.fileName === currentPage)

  if (!isPageValid) {
    return <PageNotFound {...props} />
  }

  return <UserDashboard {...props} />
}

export default PageContainer
