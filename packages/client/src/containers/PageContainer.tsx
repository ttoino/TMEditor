import React from 'react'
import { useQuery } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'

import { styled } from '@app/theme'
import { getPage } from '@app/api'
import ComponentWrapper from '@app/components/ComponentWrapper'
import FilterBar from '@app/components/FilterBar'
import LoadingIndicator from '@app/components/LoadingIndicator'
import { useUIConfig } from '@app/config-provider'

const PageContainer = () => {
  const { page } = useParams()
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams)
  const uiConfig = useUIConfig()
  const { data, isLoading } = useQuery(['page', page, params], () => getPage(page, searchParams, uiConfig?.api_url))

  if (isLoading || !data) {
    return (
      <LoadingContainer>
        <LoadingIndicator />
      </LoadingContainer>
    )
  }

  const { title, components } = data

  return (
    <Wrapper>
      <FilterBar />

      <StyledTitle>{title}</StyledTitle>

      <StyledCompList>
        {components.map((component, index) => {
          return (
            <ComponentWrapper key={index} component={component} />
          )
        })}
      </StyledCompList>
    </Wrapper>
  )
}

export default PageContainer

const Wrapper = styled('div', {
  padding: '$2'
})

const StyledCompList = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2'
})

const StyledTitle = styled('h1', {
  marginTop: '$4',
  marginBottom: '$2',
  fontSize: '1.8rem'
})

const LoadingContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%'
})
