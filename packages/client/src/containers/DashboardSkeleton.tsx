import React from 'react'
import { useQuery } from 'react-query'
import { Outlet } from 'react-router-dom'

import { styled } from '@app/theme'
import { getConfig } from '@app/api'
import Sidebar from '@app/components/Sidebar'
import LoadingIndicator from '@app/components/LoadingIndicator'
import { useUIConfig } from '@app/config-provider'

export default function DashboardSkeleton () {
  const uiConfig = useUIConfig()
  const { isLoading } = useQuery('config', () => getConfig(uiConfig?.api_url))

  if (isLoading) {
    return (
      <WrapperSpinner>
        <LoadingIndicator />
      </WrapperSpinner>
    )
  }

  return (
    <Wrapper>
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  minHeight: '100vh',
  backgroundColor: '$neutral50'
})

const Main = styled('div', {
  overflow: 'hidden'
})

const WrapperSpinner = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '$neutral50'
})
