import React, { Component } from 'react'
import TimeSeries from './TimeSeries'
import AreaChart from './AreaChart'
import BarChart from './BarChart'
import PieChart from './PieChart'
import Histogram from './Histogram'
import * as Constants from '../../utils/Constants'
import PropTypes from 'prop-types'
import NoDataChart from './NoDataChart'

class TemplateChart extends Component {
  render () {
    let content
    switch (this.props.type) {
      case 'timeseries':
        content = <TimeSeries {...this.createTimeSeriesProps()} />
        break
      case 'barchart':
        content = <BarChart {...this.createBarChartProps()} />
        break
      case 'piechart':
        content = <PieChart {...this.createPieChartProps()} />
        break
      case 'histogram':
        content = <Histogram {...this.createHistogramProps()} />
        break
      case 'areachart':
        content = <AreaChart {...this.createBarChartProps()} />
        break
      default:
        content = <NoDataChart />
    }

    return <div className="template-chart">{content}</div>
  }

  createTimeSeriesProps () {
    const information = this.props.information
    return {
      selectedDate: this.props.selectedDate,
      plurality: this.pluralityValidFormat(information.plurality),
      data: information.specifications.data,
      legend: this.arrayValidFormat(information.legend),
      title: information.title,
      xlabel: information.xlabel,
      ylabel: information.ylabel,
      yrange: this.rangeValidFormat(information.yrange)
    }
  }

  createBarChartProps () {
    const information = this.props.information
    const { specifications, ...otherProps } = information

    return {
      ...otherProps,
      selectedDate: this.props.selectedDate,
      plurality: this.pluralityValidFormat(information.plurality),
      data: information.specifications.data,
      categories: this.arrayValidFormat(information.categories),
      domain: this.domainValidFormat(information.domain),
      legend: this.arrayValidFormat(information.legend),
      labels: this.labelsValidFormat(information.labels),
      mode: this.modeValidFormat(information.mode),
      isCount: this.isCount(information.specifications.y)
    }
  }

  createPieChartProps () {
    const information = this.props.information
    return {
      selectedDate: this.props.selectedDate,
      subtype: this.subtypeValidFormat(information.subtype),
      data: information.specifications.data,
      labels: this.objValidFormat(information.labels),
      title: information.title
    }
  }

  createHistogramProps () {
    const information = this.props.information
    return {
      selectedDate: this.props.selectedDate,
      plurality: this.pluralityValidFormat(information.plurality),
      data: information.specifications.data,
      title: information.title,
      xlabel: information.xlabel,
      ylabel: information.ylabel,
      interval: information.interval,
      barmode: information.barmode,
      legend: this.arrayValidFormat(information.legend)
    }
  }

  pluralityValidFormat (value) {
    return value || Constants.PLURALITY_SINGLE
  }

  modeValidFormat (value) {
    return value || Constants.MODE_GROUP
  }

  subtypeValidFormat (value) {
    return value || Constants.NONE
  }

  domainValidFormat (value) {
    return value || Constants.DOMAIN_TEMPORAL
  }

  labelsValidFormat (value) {
    return value || Constants.LABELS_HOVER
  }

  arrayValidFormat (value) {
    return value || []
  }

  objValidFormat (value) {
    return value || {}
  }

  barModeValidFormat (value) {
    return value || Constants.BARMODE_OVERLAY
  }

  rangeValidFormat (value) {
    if (value) return [value.beginning, value.end]

    return []
  }

  isCount (value) {
    return value === Constants.IS_COUNT
  }
}

TemplateChart.propTypes = {
  type: PropTypes.string.isRequired,
  information: PropTypes.object.isRequired,
  selectedDate: PropTypes.object
}

export default TemplateChart
