import React, { Component } from 'react'
import Plot from 'react-plotly.js'
import * as Constants from '../../utils/Constants'
import PropTypes from 'prop-types'

class BarChart extends Component {
  getUpdateMenus () {
    return this.props.domain === Constants.DOMAIN_CATEGORICAL &&
      this.props.plurality !== Constants.PLURALITY_MULTIPLE &&
      !this.props.isCount
      ? [
        {
          x: 1.15,
          y: 1.15,
          xref: 'paper',
          yref: 'paper',
          yanchor: 'top',
          active: 0,
          showactive: false,
          buttons: [
            {
              method: 'restyle',
              args: ['transforms[0].aggregations[0].func', 'avg'],
              label: 'Avg'
            },
            {
              method: 'restyle',
              args: ['transforms[0].aggregations[0].func', 'sum'],
              label: 'Sum'
            },
            {
              method: 'restyle',
              args: ['transforms[0].aggregations[0].func', 'min'],
              label: 'Min'
            },
            {
              method: 'restyle',
              args: ['transforms[0].aggregations[0].func', 'max'],
              label: 'Max'
            },
            {
              method: 'restyle',
              args: ['transforms[0].aggregations[0].func', 'mode'],
              label: 'Mode'
            },
            {
              method: 'restyle',
              args: ['transforms[0].aggregations[0].func', 'median'],
              label: 'Median'
            },
            {
              method: 'restyle',
              args: ['transforms[0].aggregations[0].func', 'count'],
              label: 'Count'
            },
            {
              method: 'restyle',
              args: ['transforms[0].aggregations[0].func', 'stddev'],
              label: 'Std.Dev'
            },
            {
              method: 'restyle',
              args: ['transforms[0].aggregations[0].func', 'first'],
              label: 'First'
            },
            {
              method: 'restyle',
              args: ['transforms[0].aggregations[0].func', 'last'],
              label: 'Last'
            }
          ]
        }
      ]
      : null
  }

  createRangeOptions () {
    return this.props.domain === Constants.DOMAIN_CATEGORICAL ||
      this.props.domain === Constants.DOMAIN_DAY
      ? { x: null, y: null }
      : { x: { rangeselector: {}, rangeslider: {} }, y: { fixedrange: true } }
  }

  createXLabel (data) {
    const categories = this.props.categories
    return categories.length > 0 ? categories : data
  }

  createColumn (dataField, xdata, ydata, index) {
    let transformProperty = null
    if (
      (this.props.domain === Constants.DOMAIN_CATEGORICAL ||
        this.props.domain === Constants.DOMAIN_DAY) &&
      !this.props.isCount
    ) {
      transformProperty = [
        {
          type: 'aggregate',
          groups: xdata,
          aggregations: [{ target: 'y', func: 'avg', enabled: true }]
        }
      ]
    } else {
      transformProperty = [
        {
          type: 'aggregate',
          groups: xdata,
          aggregations: [{ target: 'y', func: 'count', enabled: true }]
        }
      ]
    }

    this.renameCategories(xdata)

    const marker =
      this.props.plurality !== Constants.PLURALITY_MULTIPLE
        ? { color: 'rgb(49,130,189)', opacity: 0.8 }
        : {}
    const name =
      this.props.plurality === Constants.PLURALITY_MULTIPLE &&
      this.props.legend !== Constants.NONE
        ? this.props.legend[index]
        : null

    if (this.props.labels === 'direct') {
      dataField.push({
        x: xdata,
        y: ydata,
        type: 'bar',
        marker: marker,
        name: name,
        text: ydata.map(String),
        textposition: 'auto',
        hoverinfo: 'x',
        transforms: transformProperty
      })
    } else {
      dataField.push({
        x: xdata,
        y: ydata,
        type: 'bar',
        marker: marker,
        name: name,
        transforms: transformProperty
      })
    }
  }

  renameCategories (xdata) {
    const categories = this.props.categories
    if (
      this.props.domain === Constants.DOMAIN_CATEGORICAL &&
      categories.length > 0
    ) {
      for (let j = 0; j < xdata.length; j++) {
        xdata[j] = this.props.categories[j % categories.length]
      }
    }
  }

  setUpData () {
    const data = []
    if (this.props.plurality === Constants.PLURALITY_MULTIPLE) {
      const serverData = this.props.data
      for (let i = 0; i < serverData.y.length; i++) {
        const serverXDataFM =
          serverData.x.length === serverData.y.length
            ? serverData.x[i]
            : serverData.x
        const xlabelData = this.createXLabel(serverXDataFM)
        this.createColumn(data, xlabelData, this.props.data.y[i], i)
      }
    } else this.createColumn(data, this.props.data.x, this.props.data.y, null)

    return data
  }

  render () {
    const data = this.setUpData()
    const rangeOptions = this.createRangeOptions()
    const className = this.props.className

    return (
      <Plot
        className={className}
        data={data}
        layout={{
          title: this.props.title,
          autosize: true,
          xaxis: {
            title: this.props.xlabel,
            showgrid: false,
            zeroline: false,
            ...rangeOptions.x
          },
          yaxis: {
            title: this.props.ylabel,
            showline: false,
            ...rangeOptions.y
          },
          barmode: this.props.mode || Constants.MODE_GROUP,
          updatemenus: this.getUpdateMenus()
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    )
  }
}

BarChart.propTypes = {
  plurality: PropTypes.string,
  data: PropTypes.object.isRequired,
  categories: PropTypes.array,
  domain: PropTypes.string,
  legend: PropTypes.array,
  mode: PropTypes.string,
  title: PropTypes.string,
  xlabel: PropTypes.string,
  ylabel: PropTypes.string,
  className: PropTypes.string,
  isCount: PropTypes.bool,
  labels: PropTypes.string
}

export default BarChart
