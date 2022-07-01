import React from 'react'

import { styled } from '@app/theme'
import Card from '@app/components/Card'
import CardHeader from '@app/components/CardHeader'
import type { FieldAggregationOperator, TableWithData, Warning } from '@types'
import WarningIndicator from '@app/components/WarningIndicator'
import useWarning from '@app/hooks/useWarning'

type TFieldValue = {
  field: string,
  value: any
}

type TColumnProps = {
  entry: TFieldValue,
  config?: FieldAggregationOperator,
  warning?: Warning
}

export default function ValuesCard ({ title, data, query, warnings = {}, ...props }: TableWithData) {
  const flatWarnings = (query.fields ?? []).reduce<Array<Warning | null>>((acc, curr) => {
    // Generate an array of warnings based on the fields
    if (typeof curr === 'string') return acc

    const warning = warnings[curr.target]

    if (warning) {
      const thresholds = Array.isArray(warning.threshold) ? warning.threshold : [warning.threshold]

      const entries = thresholds.map((t, index) => ({
        threshold: t,
        operator: warning.operator[index]
      }))

      return [...acc, ...entries]
    }

    return [...acc, null]
  }, [])

  return (
    <Card>
      <CardHeader title={title} {...props} />
      <StyledColumnRow>
        {data.map((entry, index) => {
          return <ColumnValue key={index} entry={entry} warning={flatWarnings[index]} />
        })}
      </StyledColumnRow>
    </Card>
  )
}

const ColumnValue = ({ entry, warning }: TColumnProps) => {
  const { value, field } = entry
  const [showWarning] = useWarning(value, warning)

  return (
    <StyledColumn showWarning={showWarning}>
      <StyledValueRow>
        <StyledValue>{value.toLocaleString()}</StyledValue>

        <WarningIndicator size="large" warning={warning} value={value} />
      </StyledValueRow>
      <StyledFieldName>{field}</StyledFieldName>
    </StyledColumn>
  )
}

const StyledColumnRow = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$2'
})

const StyledColumn = styled('div', {
  flex: 1,

  variants: {
    showWarning: {
      true: {
        color: '$error'
      }
    }
  }
})

const StyledValueRow = styled('div', {
  display: 'flex',
  gap: '$1',
  alignItems: 'center'
})

const StyledValue = styled('div', {
  fontSize: 36,
  fontWeight: 700
})

const StyledFieldName = styled('div', {
  fontSize: 16,
  color: '$neutral30'
})
