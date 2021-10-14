import React, { Component } from 'react'
import Plot from 'react-plotly.js'
import PropTypes from 'prop-types'
import * as Constants from '../../utils/Constants'

const minOpacity = 0.2
const maxOpacity = 1

class Histogram extends Component {
  addDataItem (data, xdata, opacity, legend) {
    data.push({
      x: xdata,
      type: 'histogram',
      histnorm: 'count',
      xbins: this.props.interval,
      opacity: opacity,
      name: legend,
      marker: { color: 'rgb(49,130,189)', opacity: 0.8 }
    })
  }

  setUpData () {
    const data = []
    const opacity =
      (maxOpacity - minOpacity) / this.props.data.length + minOpacity

    if (this.props.plurality === Constants.PLURALITY_MULTIPLE) {
      this.props.data.forEach((element, index) => {
        const itemOpacity =
          this.props.barmode !== Constants.BARMODE_STACK
            ? opacity * (index + 1)
            : 1
        this.addDataItem(data, element, itemOpacity, this.props.legend[index])
      })
    } else this.addDataItem(data, this.props.data, 1, null)

    return data
  }

  render () {
    const data = this.setUpData()

    return (
      <Plot
        data={data}
        layout={{
          autosize: true,
          bargap: 0.03,
          bargroupgap: 0.05,
          barmode: this.props.barmode,
          title: this.props.title,
          xaxis: { title: this.props.xlabel },
          yaxis: { title: this.props.ylabel }
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    )
  }
}

Histogram.propTypes = {
  plurality: PropTypes.string,
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  xlabel: PropTypes.string,
  ylabel: PropTypes.string,
  legend: PropTypes.array,
  barmode: PropTypes.string,
  intervals: PropTypes.object,
  interval: PropTypes.any
}

export default Histogram
