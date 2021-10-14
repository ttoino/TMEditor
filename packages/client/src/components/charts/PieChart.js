import React, { Component } from 'react'
import Plot from 'react-plotly.js'
import * as Constants from '../../utils/Constants'
import PropTypes from 'prop-types'

class PieChart extends Component {
  mapLabels () {
    const xdata = this.props.data.x
    return (Object.keys(this.props.labels).length === xdata.length) ? xdata.map(x => this.props.labels[x]) : xdata
  }

  setUpData () {
    const holeDimension = (this.props.subtype === Constants.PIECHART_SUBTYPE) ? 0.4 : 0
    const data = [{
      labels: this.mapLabels(),
      values: this.props.data.y,
      type: 'pie',
      hole: holeDimension
    }]
    return data
  }

  render () {
    const data = this.setUpData()
    return (
      <Plot
        data = { data }
        layout = {{
          title: this.props.title,
          autosize: true
        }}
        useResizeHandler = {true}
        style= {{ width: '100%', height: '100%' }}
      />
    )
  }
}

PieChart.propTypes = {
  subtype: PropTypes.string,
  data: PropTypes.object.isRequired,
  labels: PropTypes.object,
  title: PropTypes.string
}

export default PieChart
