import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import * as moment from 'moment'
import qs from 'query-string'
import { Menu, Sidebar, Loader, Dimmer } from 'semantic-ui-react'

import { BASENAME } from '../config/AccessPoint'

class VerticalSidebar extends Component {
  createPageLinks = () => {
    const {
      selectedUser,
      selectedCohort,
      usersIdentifiers,
      selectedDate
    } = this.props
    const { startDate, endDate } = selectedDate
    let participant
    if (selectedUser !== 'none') {
      participant = selectedUser
    } else if (
      usersIdentifiers.length !== 0 &&
      usersIdentifiers[0] !== undefined
    ) {
      if (selectedCohort === 'none' || !selectedCohort) {
        participant = usersIdentifiers[0].id
      } else {
        for (let i = 0; i < usersIdentifiers.length; i++) {
          if (usersIdentifiers[i].cohort === selectedCohort) {
            participant = usersIdentifiers[i].id
            break
          }
        }
      }
    }

    const optionsQuery = qs.stringify({
      from: startDate && moment(startDate).format('YYYY-MM-DD'),
      to: endDate && moment(endDate).format('YYYY-MM-DD')
    })

    const intermPath =
      selectedCohort !== 'none' && selectedCohort && selectedUser
        ? '/' + selectedCohort + '/' + participant
        : selectedUser !== 'none' && selectedUser
          ? '/' +
          participant + '?' + optionsQuery
          : ''

    const pages = this.props.pages.map((page, index) => (
      <Menu.Item
        active={this.props.page === page.fileName}
        key={index}
        as="li"
        link={true}
        onClick={() =>
          this.props.history.push('/pages/' + page.fileName + intermPath)
        }
      >
        {page.name}
      </Menu.Item>
    ))
    return pages
  }

  render () {
    const { platformName } = this.props
    return (
      <Sidebar
        as={Menu}
        animation={this.props.animation}
        direction={this.props.direction}
        icon="labeled"
        vertical
        visible={true}
        width="wide"
        className="sidebar"
      >
        {this.props.isLoadingConfig && (
          <Dimmer active className="platform-config-dimmer">
            <Loader
              className="platform-config-loader"
              active
              size="huge"
              content="Loading config..."
            />
          </Dimmer>
        )}

        <div className="sidebar-branding">
          <Link className="sidebar-link" to="/">
            <img className="sidebar-logo" src={`${BASENAME}/logo.png`} alt="logo" />
            <h1 className="sidebar-branding-name"> {platformName} </h1>
          </Link>
        </div>

        <ul className="sidebar-menu">{this.createPageLinks()}</ul>
      </Sidebar>
    )
  }
}

VerticalSidebar.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool,
  platformName: PropTypes.string,
  pages: PropTypes.array,
  page: PropTypes.string,
  usersIdentifiers: PropTypes.array, // To be removed later
  selectedUser: PropTypes.string, // To be removed later,
  selectedCohort: PropTypes.string, // To be removed later,
  selectedDate: PropTypes.object,
  history: PropTypes.object,
  isLoadingConfig: PropTypes.bool
}

const mapStateToProps = state => ({
  platformName: state.platformMainConfig.title,
  pages: state.platformMainConfig.pages,
  isLoadingPlatConfig: state.platformMainConfig.isLoadingConfig,
  usersIdentifiers: state.users.identifiers, // To be removed later
  selectedUser: state.dataFilters.selected_user, // To be removed later
  selectedCohort: state.dataFilters.selected_cohort, // To be removed later
  selectedDate: state.dataFilters.date
})

export default withRouter(connect(mapStateToProps)(VerticalSidebar))
