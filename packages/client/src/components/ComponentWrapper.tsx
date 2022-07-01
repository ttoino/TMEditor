
import React from 'react'

import Chart from '../widgets/Chart'
import Columns from '../widgets/Columns'
import ErrorCard from './ErrorCard'
import Heading from '../widgets/Heading'
import Info from '../widgets/Info'
import Table from '../widgets/Table'
import Tabs from '../widgets/Tabs'
import SummaryStats from '../widgets/SummaryStats'
import ValuesCard from '../widgets/ValuesCard'

interface Props {
  component: any
}

export default function ComponentWrapper ({ component }: Props) {
  if (component.error) {
    return <ErrorCard error={component.error} />
  }

  switch (component.type) {
  case 'columns':
    return <Columns {...component} />
  case 'chart':
    return <Chart {...component} />
  case 'heading':
    return <Heading {...component} />
  case 'info':
    return <Info {...component} />
  case 'table':
    return <Table {...component} />
  case 'tabs':
    return <Tabs {...component} />
  case 'summary':
    return <SummaryStats {...component} />
  case 'value':
    return <ValuesCard {...component} />
  default:
    return <ErrorCard error={{
      code: 'ERROR',
      name: `Component type '${component.type}' not available`
    }} />
  }
}
