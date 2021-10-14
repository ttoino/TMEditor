import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Loader, Grid } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import uuidv1 from 'uuid/v1'
import DocumentTitle from 'react-document-title'

import StatisticalComp from '../../components/StatisticalComp'
import ErrorComponent from '../../components/ErrorComponent'
import PageSection from '../../components/PageSection'
import TemplateChart from '../../components/charts/TemplateChart'
import Map from '../../components/Map'
import Table from '../../components/Table'
import DashboardSkeleton from '../DashboardSkeleton'

import { updateUsers } from '../../actions/Users'
import * as PagesActions from '../../actions/Pages'
import {
  changeSelectedCohort,
  changeSelectedUser,
  resetSelectedUserAndCohort,
  changeSelectedDate
} from '../../actions/DataFilters'

class UserDashboard extends Component {
  componentDidMount () {
    const { id, cohort } = this.props.match.params

    this._updateSelectedUser(id) // first update
    this._updateCohorts(this.props.cohorts, cohort)

    this.loadPageData(this.props.selectedDate)
  }

  componentDidUpdate (prevProps) {
    const page = this.props.location?.pathname

    if (prevProps.location?.pathname !== page || prevProps.location.search !== this.props.location.search) {
      this.loadPageData()
    }
  }

  _updateCohorts = (cohorts, cohort) => {
    const shouldUpdate = cohort ? cohorts.includes(cohort) : false
    if (shouldUpdate) {
      this.props.changeSelectedCohort(cohort)
    }
  }

  _updateSelectedUser (paramid) {
    if (paramid) {
      const ids = this.props.usersIdentifiers
      ids.forEach(element => {
        if (element.key === paramid) {
          this.props.changeSelectedUser(paramid)
        }
      })
    }
  }

  loadPageData = options => {
    const query = new URLSearchParams(this.props.location.search)
    const { id, page } = this.props.match.params

    this.props.getPageData(page, id, { ...options, cohort: query.get('cohort') })
  }

  _buildComponent = (
    childrens,
    layout = true,
    object = { small: 1, medium: 1, large: 1 }
  ) => {
    const getDimensions = (stringID, object, numChilds = 1) => {
      return Object.prototype.hasOwnProperty.call(object, stringID)
        ? parseInt(16 / object[stringID])
        : parseInt(16 / numChilds)
    }

    const { numChilds } = object
    return childrens.map((element, index) => {
      let toRenderElem
      if (element.type === 'card' && element.specifications.data !== null) {
        const { data, operator } = element.specifications

        toRenderElem = (
          <StatisticalComp
            label={element.title}
            value={data}
            operator={operator}
          />
        )
      } else if (element.type === 'table') {
        toRenderElem = (
          <Table
            title={element.title}
            sort={element.sort ?? true}
            search={element.search ?? true}
            pagination={element.pagination ?? true}
            export={!!element.export}
            data={element.specifications.data}
          />
        )
      } else if (element.type === 'map') {
        toRenderElem = <Map data={element.specifications.data} />
      } else {
        toRenderElem = (
          <TemplateChart
            type={element.type}
            information={element}
            selectedDate={this.props.selectedDate}
          />
        )
      }

      const tmpcont = (
        <Grid.Column
          mobile={16}
          tablet={getDimensions('small', object)}
          computer={getDimensions('medium', object)}
          widescreen={getDimensions('large', object, numChilds)}
          key={index}
          textAlign="center"
        >
          {toRenderElem}
        </Grid.Column>
      )
      if (!layout) {
        return (
          <Grid centered={true} key={'row' + uuidv1()}>
            <Grid.Row>{tmpcont}</Grid.Row>
          </Grid>
        )
      } else {
        return tmpcont
      }
    })
  }

  _recursiveBuilder = (data, components) => {
    const handleChildren = (components, object) => {
      const { numChilds, children } = object
      let newChildrens
      if (numChilds) {
        newChildrens = this._buildComponent(
          components.splice(0, numChilds),
          true,
          object
        )
      } else {
        if (Array.isArray(children)) {
          newChildrens = children.map(childrenComp =>
            this._recursiveBuilder(childrenComp, components)
          )
        } else {
          newChildrens = this._recursiveBuilder(children, components)
        }
      }
      return newChildrens
    }

    const buildRow = (row, components) => {
      const childrens = handleChildren(components, row)

      const uiComponent = (
        <Grid centered={true} key={'row' + uuidv1()}>
          <Grid.Row>{childrens}</Grid.Row>
        </Grid>
      )
      return uiComponent
    }

    const buildSection = (section, components) => {
      const { numChilds, children, header } = section
      const childs = handleChildren(components, { numChilds, children })

      return (
        <PageSection key={header} header={header}>
          {childs}
        </PageSection>
      )
    }

    if (!data) {
      return
    }

    const componentType = Object.keys(data)[0]
    let content
    if (componentType === 'row') {
      content = buildRow(data.row, components)
    } else if (componentType === 'section') {
      content = buildSection(data.section, components)
    }
    return content
  }

  buildComponents () {
    const { layout, components } = this.props.data
    let content

    if (layout) {
      const componentsDup = components.slice(0)
      if (Array.isArray(layout)) {
        content = layout.map(layoutComp =>
          this._recursiveBuilder(layoutComp, componentsDup)
        )
      } else {
        content = this._recursiveBuilder(layout, componentsDup)
      }
      return content
    } else {
      return this._buildComponent(components, false)
    }
  }

  buildPageTitle () {
    const { usersIdentifiers, selectedUser, data } = this.props
    const selectedUserMappedId = usersIdentifiers.find(
      el => el.key === selectedUser
    )
    return data.title + (selectedUserMappedId && selectedUserMappedId !== -1
      ? ' - ' + selectedUserMappedId.id
      : '')
  }

  render () {
    const { page, cohort } = this.props.match.params
    const { cohortFiltering, selectedDate, isLoading, data, selectedUser, loadingUsersError } = this.props
    const pageTitle = this.buildPageTitle()

    return (
      <DocumentTitle title={pageTitle}>
        <DashboardSkeleton
          page={page}
          cohort={cohort}
          cohortFiltering={cohortFiltering}
          selectedDate={selectedDate}
          selectedUser={selectedUser}
          filterPageData={this.loadPageData}
          loadingUsersError={loadingUsersError}
        >
          <div className="dashboard-main-container">
            {isLoading ? (
              <Loader active size="massive">
                Loading
              </Loader>
            ) : data.length === 0 ? (
              <ErrorComponent message="Either verify your connection to the server or the page configuration"/>
            ) : (
              this.buildComponents()
            )}
          </div>
        </DashboardSkeleton>
      </DocumentTitle>
    )
  }
}

UserDashboard.propTypes = {
  usersIdentifiers: PropTypes.array,
  updateUsers: PropTypes.func,
  changeSelectedUser: PropTypes.func,
  pages: PropTypes.array,
  cohortFiltering: PropTypes.bool,
  cohorts: PropTypes.array,
  changeSelectedCohort: PropTypes.func,
  resetSelectedUserAndCohort: PropTypes.func,
  selectedDate: PropTypes.object,
  selectedUser: PropTypes.string,
  match: PropTypes.object,
  getPageData: PropTypes.func,
  data: PropTypes.object,
  loadingUsersError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
}

const mapStateToProps = state => ({
  usersIdentifiers: state.users.identifiers,
  loadingUsersError: state.users.error,
  pages: state.platformMainConfig.pages,
  cohortFiltering: state.cohorts.names.length > 0,
  cohorts: state.cohorts.names,
  selectedDate: state.dataFilters.date,
  selectedUser: state.dataFilters.selected_user,
  isLoading: state.pages.isLoading,
  data: state.pages.data
})

export default connect(mapStateToProps, {
  ...PagesActions,
  updateUsers,
  changeSelectedUser,
  changeSelectedCohort,
  changeSelectedDate,
  resetSelectedUserAndCohort
})(UserDashboard)
