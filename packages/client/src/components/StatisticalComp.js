import React, { Component } from 'react'
import { Statistic } from 'semantic-ui-react'
import PropTypes from 'prop-types'

class StatisticalComp extends Component {
  render () {
    return (
      <div className="statistical-component">
        <Statistic color="red">
          <Statistic.Label> {this.props.label} </Statistic.Label>
          <Statistic.Value>{this.props.value}</Statistic.Value>
          <Statistic.Label>{this.props.operator}</Statistic.Label>
        </Statistic>
      </div>
    )
  }
}

StatisticalComp.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  operator: PropTypes.string
}

export default StatisticalComp
