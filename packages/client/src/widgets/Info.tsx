import React from 'react'

import type { Info as IInfo } from '@types'
import Card from '@app/components/Card'
import CardHeader from '@app/components/CardHeader'

export default function Info ({ text, title }: IInfo) {
  return (
    <Card>
      <CardHeader title={title} />
      {text}
    </Card>
  )
}
