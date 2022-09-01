import React from 'react'

import { styled } from '@app/theme'
import type { TableWithData } from '@types'
import Card from '@app/components/Card'
import CardHeader from '@app/components/CardHeader'

type TFieldValue = {
  field: string,
  value: any
}

type TStatsLineProps = {
  row: TFieldValue
}

export default function SummaryStats ({ title, data, ...props }: TableWithData) {
  return (
    <Card>
      <CardHeader title={title} {...props}/>

      {data.map((row, index) => {
        return <StatsLine key={index} row={row} />
      })}
    </Card>
  )
}

const StatsLine = ({ row }: TStatsLineProps) => {
  const { field, value } = row
  return (
    <StyledRow>
      <span>{field}</span> <StyledValue>{value ?? 'No data'}</StyledValue>
    </StyledRow>
  )
}

const StyledRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: '$0',
  paddingBottom: '$0',
  borderBottom: '1px solid $neutral40',
  fontSize: '$small',

  '&:last-child': {
    borderBottom: 0
  }
})

const StyledValue = styled('span', {
  fontWeight: 500
})
