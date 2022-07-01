import React from 'react'
import type * as Stitches from '@stitches/react'

import { styled } from '@app/theme'
interface Props {
  children: React.ReactNode,
  css?: Stitches.CSS
}

export default function Card ({ children, css }: Props) {
  return (
    <StyledContainer css={css}>
      {children}
    </StyledContainer>
  )
}

const StyledContainer = styled('div', {
  backgroundColor: '#fff',
  padding: '$2',
  borderRadius: '$card',
  boxShadow: '$card'
})
