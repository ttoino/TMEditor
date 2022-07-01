import React from 'react'
import { _ } from 'gridjs-react'

import { styled } from '@app/theme'
import type { TableWithData, Warning } from '@types'
import TableGeneric from '@app/components/TableGeneric'
import Card from '@app/components/Card'
import Flex from '@app/components/Flex'
import CardHeader from '@app/components/CardHeader'
import WarningIndicator from '@app/components/WarningIndicator'
import useWarning from '@app/hooks/useWarning'

export default function Table ({ data, title, warnings, export: allowExport, ...props }: TableWithData) {
  const columns = data.length > 0 ? Object.keys(data[0]) : []
  const rows = data.map(el => Object.values(el))

  const columnsFormatted = columns.map((column) => {
    const columnWarning = warnings?.[column.split('.').pop() ?? column]

    return {
      name: column,
      attributes: (cell: any) => {
        if (cell !== null) {
          return {
            class: 'gridjs-td-custom'
          }
        }
      },
      formatter: (cell: any) => _(<TableCell value={cell} warning={columnWarning} />)
    }
  })

  const exportData = (ev: any) => {
    const allRows = [columns, ...rows]

    const csvContent = 'data:text/csv;charset=utf-8,' + allRows.map((row) => {
      const escapedValues = row.map((el: any) => typeof el === 'string' ? `"${el}"` : el)
      return escapedValues.join(',')
    }).join('\n')

    ev.target.setAttribute('href', encodeURI(csvContent))
  }

  return (
    <Card>
      <CardHeader title={title} {...props} />
      <TableGeneric columns={columnsFormatted} data={rows} {...props} />

      {allowExport &&
        <Flex css={{ marginTop: 10, justifyContent: 'flex-end' }}>
          <Button download="data.csv" href="" onClick={exportData}>Export data (CSV)</Button>
        </Flex>}
    </Card>

  )
}

type TCell = {
  warning?: Warning
  value: number
}

const TableCell = ({ value, warning }: TCell) => {
  const [showWarning] = useWarning(value, warning)

  return (
    <CellStyled hasWarning={showWarning}>
      <span>{value}</span>
      <WarningIndicator warning={warning} value={value} />
    </CellStyled>
  )
}

const Button = styled('a', {
  display: 'inline-block',
  padding: '$2',
  backgroundColor: '$primaryTint',
  borderRadius: '$button',
  textDecoration: 'none',
  color: '$text',
  transition: 'all 300ms',

  '&:hover': {
    backgroundColor: '$primaryTintDark'
  }
})

const CellStyled = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$1 $2',

  variants: {
    hasWarning: {
      true: {
        backgroundColor: '$errorA05',
        color: '$error'
      }
    }
  }
})
