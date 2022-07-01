import React from 'react'
import { styled } from '@app/theme'
import type { DatabaseQuery, QueryMeta } from '@types'
import QueryTooltip from './QueryTooltip'

interface Props {
  title: string,
  query?: DatabaseQuery,
  meta: QueryMeta
}

export default function CardHeader ({ title, query, meta }: Props) {
  return (
    <StyledHeading>{title}
      {query && <QueryTooltip query={query} meta={meta} />}
    </StyledHeading>
  )
}

const StyledHeading = styled('h3', {
  display: 'flex',
  margin: 0,
  marginBottom: '$2',
  color: '$neutral20',
  fontWeight: 400
})
