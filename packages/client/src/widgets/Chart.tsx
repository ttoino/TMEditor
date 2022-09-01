import React from 'react'
import { VegaLite } from 'react-vega'

import type { ChartWithData } from '@types'
import Card from '@app/components/Card'
import CardHeader from '@app/components/CardHeader'
import { styled } from '@app/theme'

const defaultSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  width: 'container',
  height: 200,
  data: { name: 'values' }
}

export default function Chart ({ title, data, spec, ...props }: ChartWithData) {
  const chartSpec = {
    ...defaultSpec,
    ...spec
  }

  const cleanedData = data.map(entry => {
    return Object.entries(entry).reduce<{ [key: string]: any}>((acc, [k, v]) => {
      const [_, field] = k.split('.')

      acc[field ?? k] = v
      return acc
    }, {})
  })

  return (
    <Card css={{ position: 'relative' }}>
      <CardHeader title={title} {...props} />
      <VegaLite spec={chartSpec} data={{ values: cleanedData }} style={{ width: '100%' }} />

      {data.length === 0 &&
        <NoData>No data</NoData>
      }
    </Card>
  )
}

const NoData = styled('div', {
  color: '$neutral30',
  position: 'absolute',
  left: 36,
  right: 60,
  top: 60,
  bottom: 40,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})
