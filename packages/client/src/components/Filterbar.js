import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Icon, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import * as moment from 'moment'
import qs from 'query-string'

import { changeSelectedUser, changeSelectedCohort, changeSelectedDate, resetSelectedUserAndCohort, resetSelectedUser } from '../actions/DataFilters'
import DatePicker from './DatePicker'
import * as Constants from '../utils/Constants'

class Filterbar extends Component {
  constructor (props) {
    super(props)
    const startDate = moment(props.selectedDate.startDate)
    const endDate = moment(props.selectedDate.endDate)
    this.state = {
      calendarVisible: false,
      filteredUsers: [],
      formattedDate: this.formatDisplayedDate(startDate, endDate)
    }
  }

  goToNextRoute = (valueUser, valueDate, valueCohort, hasCohort = false) => {
    var { page, selectedUser, selectedDate } = this.props

    if (valueDate === null) valueDate = selectedDate
    if (valueUser === null) valueUser = selectedUser || 'none'

    var { startDate, endDate } = valueDate

    if (page !== 'Participants' && page !== 'Home') {
      const optionsQuery = qs.stringify({
        from: startDate && moment(startDate).format('YYYY-MM-DD'),
        to: endDate && moment(endDate).format('YYYY-MM-DD')
      })

      const intermPath = valueUser && valueUser !== 'none' ? `${valueUser}?${optionsQuery}` : ''

      const route = `/pages/${page}/${intermPath}`

      this.props.history.push(route)
    }
  }

  handleUserSelectionChange = (e, { value }) => {
    const selectedUser = value || 'none'
    const selectedCohort = this.props.selectedCohort || 'none'
    this.props.changeSelectedUser(selectedUser)
    if (value) {
      this.goToNextRoute(value, null, null)
    } else if ((this.props.cohortFiltering && (selectedCohort === 'none')) || !this.props.cohortFiltering) {
      this.props.history.push('/pages/' + this.props.page)
    }
  }

  handleCohortSelectionChange = (e, { value }) => {
    const { page, changeSelectedCohort } = this.props

    changeSelectedCohort(value)

    this.props.history.push(`/pages/${page}?cohort=${value}`)
  }

  handleSelect = (range) => {
    let { startDate, endDate } = range.selection

    endDate = new Date(endDate)
    endDate.setHours(23, 59, 59, 999)
    this.props.changeSelectedDate({ startDate: startDate, endDate: endDate })
    this.setState({ formattedDate: this.formatDisplayedDate(moment(startDate), moment(endDate)) })

    this.goToNextRoute(null, range.selection, null, false)

    this.props.filterPageData(range.selection)
  }

  handleOnDateFilterPressed = () => {
    this.setState({ calendarVisible: !this.state.calendarVisible })
  }

  createDropdownOptions = (data, isUser = false) => {
    return data.map((element, index) => {
      return { key: index, text: (isUser) ? element.id : element, value: (isUser) ? element.key : element }
    })
  }

  filterUsersByCohort = (users, cohort) => {
    let filteredUsers = users
    if (cohort) {
      filteredUsers = users.filter((element) => {
        return element.cohort === cohort
      })
    }
    return filteredUsers
  }

  aggreggatedPressed = () => {
    this.props.resetSelectedUserAndCohort()
  }

  getDayMonthYear = (date) => {
    return { day: date.format('D'), month: moment.monthsShort(date.format('M') - 1), year: date.format('YYYY') }
  }

  formatDisplayedDate = (startDate, endDate) => {
    const startDateFM = this.getDayMonthYear(startDate)
    const endDateFM = this.getDayMonthYear(endDate)

    var { day: startDateDay, month: startDateMonth, year: startDateYear } = startDateFM
    var { day: endDateDay, month: endDateMonth, year: endDateYear } = endDateFM

    const sameDay = startDateDay === endDateDay
    const sameMonth = startDateMonth === endDateMonth
    const sameYear = startDateYear === endDateYear

    if (!sameYear) {
      return startDateDay + ' ' + startDateMonth + ', ' + startDateYear + ' - ' + endDateDay + ' ' + endDateMonth + ', ' + endDateYear
    } else if (sameMonth && sameYear) {
      if (!sameDay) {
        return startDateDay + '-' + endDateDay + ' ' + startDateMonth + ', ' + startDateYear
      } else {
        return startDateDay + ' ' + startDateMonth
      }
    } else {
      return startDateDay + ' ' + startDateMonth + ' - ' + endDateDay + ' ' + endDateMonth + ', ' + endDateYear
    }
  }

  render () {
    const { cohorts, usersIdentifiers, selectedUser, selectedCohort, selectedDate } = this.props
    const { pathname } = this.props.location
    const selectedUserTemp = (selectedUser !== 'none') ? selectedUser : null
    const selectedCohortTemp = (selectedCohort !== 'none') ? selectedCohort : null
    const filteredUsers = this.filterUsersByCohort(usersIdentifiers, selectedCohortTemp)

    const selectionRange = {
      startDate: selectedDate.startDate,
      endDate: selectedDate.endDate,
      key: 'selection'
    }

    const allparticipantsPg = (pathname === Constants.HOME_PAGE) ? Constants.HOME_PAGE : '/pages/' + this.props.page

    return (
      <div className="filter-bar">
        <div className="user-filter">
          <Link onClick={this.aggreggatedPressed} to={allparticipantsPg}>All participants</Link>
          {(this.props.cohortFiltering) ? (
            <>
              <Icon name="chevron right" />
              <Dropdown
                placeholder="Search Cohort..."
                search
                clearable
                selection
                selectOnBlur={false}
                options={this.createDropdownOptions(cohorts)}
                className="filter-dropdown"
                onChange={this.handleCohortSelectionChange}
                value={selectedCohortTemp}
                disabled={this.props.isFetching}
                loading={this.props.isFetching}
              />
            </>
          ) : null}
          <Icon name="chevron right" />
          <Dropdown
            placeholder="Search Participant..."
            search
            clearable
            selection
            selectOnBlur={false}
            options={this.createDropdownOptions(filteredUsers, true)}
            className="filter-dropdown"
            onChange={this.handleUserSelectionChange}
            value={selectedUserTemp}
            disabled={this.props.isFetching}
            loading={this.props.isFetching}
          />
        </div>
        <div className="time-filter">
          <div className="datePickerBtnWrapper">
            <Button basic inverted icon={<Icon name="calendar alternate outline" size="large" />} label={this.state.formattedDate}
              onClick={this.handleOnDateFilterPressed}>
            </Button>
          </div>
          {(this.state.calendarVisible)
            ? <div className="datePickerWrapper">
              <DatePicker handleOnDateFilterPressed = {this.handleOnDateFilterPressed} selectionRange={selectionRange}
                handleSelect={this.handleSelect} />
            </div> : null}

        </div>
      </div>
    )
  }
}

Filterbar.propTypes = {
  cohortFiltering: PropTypes.bool,
  usersIdentifiers: PropTypes.array,
  changeSelectedUser: PropTypes.func,
  changeSelectedCohort: PropTypes.func,
  changeSelectedDate: PropTypes.func,
  resetSelectedUserAndCohort: PropTypes.func,
  resetSelectedUser: PropTypes.func,
  selectedUser: PropTypes.string,
  selectedCohort: PropTypes.string,
  cohorts: PropTypes.array,
  selectedDate: PropTypes.object,
  isFetching: PropTypes.bool,
  page: PropTypes.string,
  history: PropTypes.object,
  filterPageData: PropTypes.func,
  location: PropTypes.object
}

const mapStateToProps = (state) => ({
  usersIdentifiers: state.users.identifiers,
  selectedUser: state.dataFilters.selected_user,
  selectedCohort: state.dataFilters.selected_cohort,
  selectedDate: state.dataFilters.date,
  cohorts: state.cohorts.names,
  isFetching: state.users.isLoadingUsers
})

export default withRouter(connect(mapStateToProps, { changeSelectedUser, changeSelectedCohort, changeSelectedDate, resetSelectedUserAndCohort, resetSelectedUser })(Filterbar))
