import React from 'react'
import { VegaLite } from 'react-vega'

import type { ChartWithData } from '@types'
import Card from '@app/components/Card'
import CardHeader from '@app/components/CardHeader'

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
    <Card>
      <CardHeader title={title} {...props} />
      <VegaLite spec={chartSpec} data={{ values: cleanedData }} style={{ width: '100%' }} />
    </Card>
  )
}
