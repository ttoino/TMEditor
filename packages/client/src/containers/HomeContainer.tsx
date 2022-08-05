import React from 'react'
import { useQuery } from 'react-query'
import { _ } from 'gridjs-react'

import TableGeneric from '@app/components/TableGeneric'
import LoadingIndicator from '@app/components/LoadingIndicator'
import Card from '@app/components/Card'
import { getConfig } from '@app/api'
import { styled } from '@app/theme'
import IconChevronRight from '@app/assets/ic_chevron_right.svgr.svg'
import { useUIConfig } from '@app/config-provider'
import useParticipants from '@app/hooks/useParticipants'

const HomeContainer = () => {
  const uiConfig = useUIConfig()
  const { data, isLoading } = useParticipants()
  const { data: config } = useQuery('config', () => getConfig(uiConfig?.api_url))

  if (isLoading || !data) {
    return (
      <LoadingContainer>
        <LoadingIndicator />
      </LoadingContainer>
    )
  }

  const displayData = data.map(({ __key, __cohort, __label, ...entry }) => entry)

  const columns: any = displayData.length > 0 ? Object.keys(displayData[0]) : []
  const participants = displayData.map((el, index) => [...Object.values(el), index])

  // Add link to first page
  columns.push({ id: '__index', hidden: true })
  columns.push({
    id: '__link',
    name: '',
    sort: false,
    width: 24,
    attributes: {
      class: 'gridjs-td gridjs-next'
    },
    formatter: (cell: any, row: any) => {
      return _(
        <StyledIconLink href={`pages/${config?.pages[0].fileName}/?user=${data[row.cells[row.cells.length - 2].data].__key}`}>
          <IconChevronRight />
        </StyledIconLink>
      )
    }
  })

  return (
    <Wrapper>
      <Card>
        <TableGeneric data={participants} columns={columns} />
      </Card>
    </Wrapper>
  )
}

export default HomeContainer

const Wrapper = styled('div', {
  padding: '$2'
})

const LoadingContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%'
})

const StyledIconLink = styled('a', {
  'circle, polyline': {
    transition: 'all 300ms',
    stroke: '$neutral40'
  },

  '&:hover': {
    'circle, polyline': {
      stroke: '$primary'
    }
  }
})
