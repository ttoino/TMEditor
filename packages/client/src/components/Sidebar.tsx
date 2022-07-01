import React from 'react'
import { useQuery } from 'react-query'
import { Link, NavLink } from 'react-router-dom'

import { styled } from '@app/theme'
import { useAuth } from '@app/auth'
import { getConfig } from '@app/api'
import type { ResponseSiteConfig } from '@types'
import { useUIConfig } from '@app/config-provider'

export default function Sidebar () {
  const { signOut, hasAuth } = useAuth()
  const uiConfig = useUIConfig()
  const { data } = useQuery('config', () => getConfig(uiConfig?.api_url))

  const { pages } = data as ResponseSiteConfig

  return (
    <Wrapper>
      <Logo to="/">
        <img width={200} src={uiConfig?.theme?.logo ?? '/logo.png'} alt="logo" />
      </Logo>

      <StyledList>
        {pages.map(({ fileName, name }) => {
          return (
            <li key={fileName}><StyledLink as={NavLink} to={`/pages/${fileName}`}>{name}</StyledLink></li>
          )
        })}
      </StyledList>

      <StyledFooter>
        <StyledAuthor>Built by <a href="https://www.fraunhofer.pt/">Fraunhofer AICOS</a></StyledAuthor>
        {hasAuth &&
          <button onClick={signOut}>Sign out</button>}
      </StyledFooter>
    </Wrapper>
  )
}

const Logo = styled(Link, {
  paddingTop: 12,
  marginLeft: '$1'
})

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$surface',
  padding: '$1'
})

const StyledFooter = styled('footer', {
  marginTop: 'auto'
})

const StyledList = styled('ul', {
  listStyle: 'none',
  marginTop: '$4',
  padding: 0
})

const StyledLink = styled('a', {
  display: 'block',
  marginBottom: '$0',
  padding: '$2',
  borderRadius: '$button',
  textDecoration: 'none',
  color: '$textMenu',
  transition: '$hover',

  '&.active': {
    backgroundColor: '$primaryTint',
    color: '$textMenuActive'
  },

  '&:hover': {
    backgroundColor: '$primaryTintHover',
    color: '$textMenuHover'
  }
})

const StyledAuthor = styled('div', {
  fontSize: '$xsmall'
})
