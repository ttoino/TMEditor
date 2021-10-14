// @flow
import React, { Component } from 'react'
import Plot from 'react-plotly.js'
import type { ChartGeneric } from '../../types'

type Props = {
  ...ChartGeneric,
  groupnorm?: string
};

class AreaChart extends Component<Props> {
  setupData = () => {
    const { data } = this.props
    const result = []

    for (let i = 0; i < data.y.length; i++) {
      result.push({
        x: data.x[i],
        y: data.y[i],
        stackgroup: 'one',
        groupnorm: this.props.groupnorm,
        name: this.props.legend && this.props.legend[i]
      })
    }

    return result
  }

  render () {
    const formattedData = this.setupData()

    return (
      <Plot
        className={this.props.className}
        data={formattedData}
        layout={{
          title: this.props.title,
          autosize: true,
          xaxis: {
            title: this.props.xlabel,
            showgrid: false,
            zeroline: false
          },
          yaxis: {
            title: this.props.ylabel,
            showline: false
          }
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    )
  }
}
export default AreaChart
