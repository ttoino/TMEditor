import React from 'react'

import { styled } from '@app/theme'
import type { Columns as IColumns } from '@types'
import ComponentWrapper from '../components/ComponentWrapper'

export default function Columns ({ components }: IColumns) {
  return (
    <StyledContainer>
      {components.map((component, index) =>
        <ComponentWrapper key={index} component={component} />
      )}
    </StyledContainer>
  )
}

const StyledContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '$2'
})
