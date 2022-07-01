import React from 'react'

import type { Heading as IHeading } from '@types'
import { styled } from '@app/theme'

export default function Heading ({ title }: IHeading) {
  return (
    <StyledTitle>{title}</StyledTitle>
  )
}

const StyledTitle = styled('h2', {
  marginBottom: 0,
  marginTop: '$2'
})
