import React, { useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import { useSearchParams } from 'react-router-dom'
import { endOfToday, format, isSameDay, startOfToday, subDays, isSameMonth, isSameYear } from 'date-fns'
import { styled } from '@app/theme'

type TSelectionRange = {
  startDate: Date,
  endDate: Date,
  key: string
}

export default function DatePicker () {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [selection, setSelection] = useState(getDefaultRange(searchParams))

  const handleChange = (ranges: any) => {
    const newSearchParams = new URLSearchParams(searchParams)

    setSelection(ranges.selection)

    const startDate = format(ranges.selection.startDate, 'yyyy-MM-dd')
    const endDate = format(ranges.selection.endDate, 'yyyy-MM-dd')
    if (startDate !== endDate || isCompleted) {
      newSearchParams.set('startDate', startDate)
      newSearchParams.set('endDate', endDate)

      setSearchParams(newSearchParams)
    }

    setIsCompleted(!isCompleted)
  }

  return (
    <div>
      <StyledButton onClick={() => setShowCalendar(!showCalendar)}>{formatDisplayDate(selection)}</StyledButton>

      {showCalendar &&
        <PickerContainer>
          <DateRangePicker
            ranges={[selection]}
            showDateDisplay={true}
            onChange={handleChange}
          />
        </PickerContainer>}
    </div>
  )
}

const getDefaultRange = (searchParams: URLSearchParams): TSelectionRange => {
  const getDate = (key: string) => {
    if (searchParams.get(key)) {
      return new Date(searchParams.get(key) ?? '')
    }

    return undefined
  }

  return {
    startDate: getDate('startDate') ?? subDays(startOfToday(), 7),
    endDate: getDate('endDate') ?? endOfToday(),
    key: 'selection'
  }
}

const formatDisplayDate = ({ startDate, endDate }: TSelectionRange) => {
  const fStartDate = format(startDate, 'd')
  const fEndDate = format(endDate, 'd MMM, yyyy')

  if (isSameDay(startDate, endDate)) {
    return fEndDate
  }

  if (!isSameYear(startDate, endDate)) {
    return `${format(startDate, 'd MMM, yyyy')} - ${fEndDate}`
  }

  if (!isSameMonth(startDate, endDate)) {
    return `${format(startDate, 'd MMM')} - ${fEndDate}`
  }

  return `${fStartDate} - ${fEndDate}`
}

const StyledButton = styled('button', {
  padding: '8px 12px',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: 16
})

const PickerContainer = styled('div', {
  position: 'absolute',
  right: 16,
  top: 60,
  zIndex: 1001,
  border: '1px solid #eee'
})
