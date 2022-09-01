import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { keyframes } from '@stitches/react'

import { styled } from '@app/theme'
import type { DatabaseQuery, QueryMeta } from '@types'

interface Props {
  query: DatabaseQuery,
  meta: QueryMeta
}

export default function QueryTooltip ({ query, meta }: Props) {
  const hasError = !!meta?.timestamp

  return (
    <TooltipPrimitive.Root>
      <StyledTrigger error={hasError}>
        <svg width="18px" height="18px" viewBox="0 0 18 18" fill="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g id="Theme" stroke="none" strokeWidth="1" fillRule="evenodd">
            <g id="ic_info" transform="translate(-3.000000, -3.000000)" fillRule="nonzero">
              <path d="M12.0000383,3.75 C7.44370431,3.75 3.75006699,7.44365146 3.75006699,12 C3.75006699,16.5563485 7.44370431,20.25 12.0000383,20.25 C16.5563723,20.25 20.2500096,16.5563485 20.2500096,12 C20.2500096,7.44365146 16.5563723,3.75 12.0000383,3.75 Z M12.0000383,5.25 C15.7279438,5.25 18.7500096,8.2720773 18.7500096,12 C18.7500096,15.7279227 15.7279438,18.75 12.0000383,18.75 C8.27213272,18.75 5.25006699,15.7279227 5.25006699,12 C5.25006699,8.2720773 8.27213272,5.25 12.0000383,5.25 Z M12.0000398,10.625 C12.3797404,10.625 12.6935378,10.9071607 12.7431949,11.2732415 L12.7500398,11.3750134 L12.749,15.011 L12.824339,15.0267907 C13.1100308,15.1053757 13.3274798,15.3487131 13.3681127,15.6482294 L13.3749593,15.75 C13.3749593,16.1296958 13.0928054,16.443491 12.7267299,16.4931534 L12.6249641,16.5 L11.9999617,16.5 C11.6202612,16.5 11.3064637,16.2178393 11.2568067,15.8517585 L11.2499617,15.7499866 L11.25,12.113 L11.1755844,12.0982093 C10.8898927,12.0196243 10.6724436,11.7762869 10.6318107,11.4767706 L10.6249641,11.375 C10.6249641,10.9953042 10.907118,10.681509 11.2731936,10.6318466 L11.3749641,10.625 L12.0000398,10.625 Z M11.8437123,7.78125 C12.2751831,7.78125 12.6249593,8.13102754 12.6249593,8.5625 C12.6249593,8.99397246 12.2751831,9.34375 11.8437123,9.34375 C11.4122415,9.34375 11.0624653,8.99397246 11.0624653,8.5625 C11.0624653,8.13102754 11.4122415,7.78125 11.8437123,7.78125 Z" id="Combined-Shape"></path>
            </g>
          </g>
        </svg>
      </StyledTrigger>
      <StyledContent>
        <StyledInfoRow>
          <dt>Database: </dt>
          <StyledTimestampValue>{query.database}</StyledTimestampValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <dt>Doc: </dt>
          <StyledTimestampValue>{query.table}</StyledTimestampValue>
        </StyledInfoRow>
        <StyledInfoRow>

          <dt>Fields: </dt>
          <StyledTimestampValue>{query.fields?.map(f => {
            return typeof f === 'string' ? f : f.target
          }).join(', ') ?? '-'}</StyledTimestampValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <dt>Timestamp: </dt>
          <StyledTimestampValue error={hasError}>{meta?.timestamp || 'No timestamp'}</StyledTimestampValue>
        </StyledInfoRow>
        <StyledArrow />
      </StyledContent>
    </TooltipPrimitive.Root>
  )
}

const StyledTrigger = styled(TooltipPrimitive.Trigger, {
  backgroundColor: 'transparent',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '$0',
  transition: '$hover',

  svg: {
    fill: '$neutral40',

    '&:hover': {
      fill: '$neutral10',
      transition: '$hover'
    }
  },

  variants: {
    error: {
      false: {
        svg: {
          fill: '$error',

          '&:hover': {
            fill: '$error'
          }
        }
      }
    }
  }
})

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(5px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' }
})

const StyledContent = styled(TooltipPrimitive.Content, {
  borderRadius: '$card',
  padding: '$2',
  backgroundColor: '$surface',
  fontSize: '$small',
  boxShadow: '$tooltip',
  minWidth: 200,
  maxWidth: 300,
  color: '$neutral20',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  animationFillMode: 'forwards',
  willChange: 'transform, opacity',
  '&[data-state="delayed-open"]': {
    '&[data-side="bottom"]': { animationName: slideUpAndFade }
  }
})

const StyledArrow = styled(TooltipPrimitive.Arrow, {
  fill: 'white'
})

const StyledInfoRow = styled('div', {
  marginBottom: '$0',

  '&:last-of-type': {
    marginBottom: 0
  },

  dt: {
    display: 'inline'
  }
})

const StyledTimestampValue = styled('dd', {
  display: 'inline',
  fontWeight: 600,
  marginLeft: 0,
  color: '$neutral10',

  variants: {
    error: {
      false: {
        backgroundColor: '$errorA10',
        color: '$error',
        padding: '2px 6px',
        borderRadius: 2,
        fontSize: '$xsmall'
      }
    }
  }
})
