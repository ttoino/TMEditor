import React, { Component } from 'react'
import { Sidebar } from 'semantic-ui-react'
import PropTypes from 'prop-types'

import VerticalSidebar from '../components/VerticalSideBar'
import Filterbar from '../components/Filterbar'
import ErrorComponent from '../components/ErrorComponent'

class DashboardSkeleton extends Component {
  render () {
    const { cohortFiltering, children, selectedDate, filterPageData, selectedUser, loadingUsersError } = this.props

    return (
      <>
        <Sidebar.Pushable>
          <VerticalSidebar
            page={this.props.page}
            animation="uncover"
            direction="left"
          />
          <Sidebar.Pusher className="dashboard-content">
            {loadingUsersError
              ? <ErrorComponent message={loadingUsersError.msg} />
              : <>
                {this.props.page !== 'Home' &&
                  <Filterbar
                    page={this.props.page}
                    cohortFiltering={cohortFiltering}
                    selectedDate={selectedDate}
                    filterPageData={filterPageData}
                    selectedUser={selectedUser}
                  />}
                {children}
              </>
            }
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </>
    )
  }
}

DashboardSkeleton.propTypes = {
  children: PropTypes.node,
  cohortFiltering: PropTypes.bool,
  page: PropTypes.string,
  selectedDate: PropTypes.object,
  filterPageData: PropTypes.func,
  selectedUser: PropTypes.string,
  loadingUsersError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
}

export default DashboardSkeleton
