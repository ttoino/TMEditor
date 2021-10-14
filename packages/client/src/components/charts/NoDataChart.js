import React, { Component } from 'react'
import { Message, Icon } from 'semantic-ui-react'

class NoDataChart extends Component {
  render () {
    return (
      <div className="no-data-chart">
        <Message className="no-data-message" negative>
          <Icon name="chart line" size="large"/>
          <div>No data available.</div>
        </Message>
      </div>
    )
  }
}

export default NoDataChart
