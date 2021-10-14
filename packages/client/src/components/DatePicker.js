import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import { DateRangePicker } from 'react-date-range'
import PropTypes from 'prop-types'

import colors from '../resources/styles/_colors.scss'

class DatePicker extends Component {
  handleClickOutside = ({ path }) => {
    let pressedTimefilter = false
    let pressedDatePickerBtn = false

    if (path) {
      path.forEach(({ className }) => {
        if (className === 'time-filter') pressedTimefilter = true
        else if (className === 'ui labeled button') pressedDatePickerBtn = true
      })
    }

    if (!path || !(pressedTimefilter && pressedDatePickerBtn)) {
      this.props.handleOnDateFilterPressed()
    }
  }

  render () {
    const { selectionRange, handleSelect } = this.props
    return (
      <DateRangePicker
        calendars={1}
        ranges={[selectionRange]}
        rangeColors={[colors.colorPrimary]}
        onChange={handleSelect}
        showSelectionPreview={true}
        direction="horizontal"
        moveRangeOnFirstSelection={false}
      />
    )
  }
}

DatePicker.propTypes = {
  handleOnDateFilterPressed: PropTypes.func,
  selectionRange: PropTypes.object,
  handleSelect: PropTypes.func
}

export default onClickOutside(DatePicker)
