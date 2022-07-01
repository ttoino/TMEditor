import React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { styled } from '@app/theme'
import type { Tabs as ITabs } from '@types'
import ComponentWrapper from '../components/ComponentWrapper'

export default function Tabs ({ panels }: ITabs) {
  return (
    <StyledTabs defaultValue="0">
      <StyledList>
        {panels.map((panel, index) =>
          <StyledTrigger key={index} value={index.toString()}>{panel.label}</StyledTrigger>
        )}
      </StyledList>
      {panels.map((panel, index) => {
        return (
          <StyledContent key={index} value={index.toString()}>
            {panel.components.map((component, idx) =>
              <ComponentWrapper key={idx} component={component} />
            )}
          </StyledContent>
        )
      })}
    </StyledTabs>
  )
}

const StyledTabs = styled(TabsPrimitive.Root, {
  display: 'flex',
  flexDirection: 'column'
})

const StyledList = styled(TabsPrimitive.List, {
  flexShrink: 0,
  display: 'flex',
  borderBottom: '1px solid $neutral40'
})

const StyledTrigger = styled(TabsPrimitive.Trigger, {
  all: 'unset',
  fontFamily: 'inherit',
  backgroundColor: 'transparent',
  padding: '0 $1',
  height: 45,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,

  '&:hover': {
    cursor: 'pointer'
  },

  '&[data-state="active"]': {
    color: '$primary',
    fontWeight: 700,
    boxShadow: 'inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor'
  }
})

const StyledContent = styled(TabsPrimitive.Content, {
  marginTop: 10,
  flexGrow: 1
})
