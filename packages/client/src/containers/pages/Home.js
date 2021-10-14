import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import { Container, Form, Loader } from 'semantic-ui-react'
import _ from 'lodash'

import { resetSelectedUser } from '../../actions/DataFilters'
import { getUsers } from '../../actions/Users'
import DashboardSkeleton from '../DashboardSkeleton'
import Table from '../../components/Table'
import DashboardSummary from '../../components/DashboardSummary'

class Home extends Component {
  state = {
    currentDB: ''
  }

  componentDidMount () {
    this.props.resetSelectedUser()
  }

  componentDidUpdate (nextProps) {
    if (nextProps.usersLocation !== this.props.usersLocation) {
      this.setState({ currentDB: this.props.usersLocation[0] })
    }
  }

  formatUsersInfo = () => {
    const { usersInfo = [], showUsers } = this.props

    const result = { headers: [], values: [] }
    if (Array.isArray(usersInfo) && usersInfo.length > 0) {
      result.headers = showUsers?.length > 0 ? showUsers : Object.keys(usersInfo[0])
      result.values = usersInfo.map(el => Object.values(showUsers ? _.pick(el, showUsers) : el))
    }

    return result
  }

  render () {
    const { cohortFiltering, selectedDate, usersInfo, summary, showUsers, usersLocation, getUsers, loadingUsersError, isLoadingUsers } = this.props
    const { currentDB } = this.state
    const data = this.formatUsersInfo()

    return (
      <DocumentTitle title={this.props.platformName}>
        <DashboardSkeleton page="Home"
          cohortFiltering={cohortFiltering}
          selectedDate={selectedDate}
          loadingUsersError={loadingUsersError}>
          {isLoadingUsers
            ? <Loader active size="massive">
              Loading
            </Loader>
            : <>
              {usersLocation?.length > 1 &&
              <Container>
                <div className="dashboard-databases">
                  <Form.Select
                    value={currentDB}
                    options={usersLocation.map(loc => ({
                      key: loc,
                      text: loc,
                      value: loc
                    }))}
                    onChange={(ev, { value }) => {
                      this.setState({ currentDB: value })
                      getUsers(value)
                    }} />
                </div>
              </Container>}
              <DashboardSummary usersInfo={usersInfo} summary={summary} />
              {showUsers !== false &&
              <Container className="participants-table-container">
                <Table data={data} />
              </Container>}
            </>
          }
        </DashboardSkeleton>
      </DocumentTitle>
    )
  }
}

Home.propTypes = {
  changeSelectedUser: PropTypes.func,
  resetSelectedUser: PropTypes.func,
  cohortFiltering: PropTypes.bool,
  selectedDate: PropTypes.object,
  usersInfo: PropTypes.array,
  isLoadingUsers: PropTypes.bool,
  platformName: PropTypes.string,
  summary: PropTypes.array,
  showUsers: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  usersLocation: PropTypes.array,
  getUsers: PropTypes.func,
  loadingUsersError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
}

const mapStateToProps = (state) => ({
  cohortFiltering: (state.cohorts.names.length > 0),
  selectedDate: state.dataFilters.date,
  usersInfo: state.users.identifiers,
  loadingUsersError: state.users.error,
  isLoadingUsers: state.users.isLoadingUsers,
  platformName: state.platformMainConfig.title,
  summary: state.platformMainConfig.dashboard?.summary,
  showUsers: state.platformMainConfig.dashboard?.showUsers,
  usersLocation: state.platformMainConfig.usersLocation
})

export default connect(mapStateToProps, { resetSelectedUser, getUsers })(Home)
