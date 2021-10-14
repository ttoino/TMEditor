// @flow
import React, { Component } from 'react'
import Plot from 'react-plotly.js'
import * as Constants from '../../utils/Constants'
import * as moment from 'moment'

type Props = {
  data: {
    x: any[],
    y: any[],
    legend?: string[]
  },
  title: string,
  xlabel: string,
  ylabel: string,
  yrange: any,
  plurality: string,
  selectedDate: Object
};

class TimeSeries extends Component<Props> {
  setupData = (data: Object) => {
    const dataTemplate = (entry: Object, legend?: string) => {
      const { startDate, endDate } = this.props.selectedDate

      return {
        ...entry,
        type: 'scatter',
        name: legend,
        transforms: [
          {
            type: 'filter',
            target: 'x',
            operation: '>=',
            value: moment(startDate).toDate()
          },
          {
            type: 'filter',
            target: 'x',
            operation: '<=',
            value: moment(endDate).toDate()
          }
        ]
      }
    }

    return this.props.plurality === Constants.PLURALITY_MULTIPLE
      ? data.x.map((x, index) => {
        const legend = (this.props.data.legend && this.props.data.legend[index]) || index
        const entry = {
          x: this.props.data.x[index],
          y: this.props.data.y[index]
        }
        return dataTemplate(entry, legend)
      })
      : [dataTemplate(data)]
  }

  render () {
    const formattedData = this.setupData(this.props.data)

    return (
      <div style={{ width: '100%' }}>
        <Plot
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
              showline: false,
              range: this.props.yrange,
              fixedrange: true
            }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    )
  }
}

export default TimeSeries
