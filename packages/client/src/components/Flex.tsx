import React from 'react'
import { styled } from '@app/theme'

type Props = {
  children?: React.ReactNode,
  css: CSS
}

export default function Flex (props: Props) {
  return (
    <StyledFlex {...props} />
  )
}

const StyledFlex = styled('div', {
  display: 'flex'
})
