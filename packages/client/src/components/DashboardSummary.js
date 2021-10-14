// @flow
import React from 'react'
import moment from 'moment'
import Plot from 'react-plotly.js'
import { Container } from 'semantic-ui-react'

type Props = {
  summary: Array<Object>,
  usersInfo: Array<Object>
};

const renderPercentage = (colValues: Array<number>, col: Object) => {
  const colMap = colValues.reduce((acc, curr) => {
    acc[curr] = acc[curr] ? acc[curr] : 0
    acc[curr] += 1
    return acc
  }, {})

  return (
    <SummaryBlock key={col.id + col.type} col={col}>
      <ul>
        {Object.keys(colMap).map(key => {
          return <li key={key}>{key}: {Math.round(colMap[key] / colValues.length * 100)}%</li>
        })}
      </ul>
    </SummaryBlock>
  )
}

const renderAverage = (colValues, col, subtype) => {
  const sum = colValues.reduce((acc, curr) => {
    return acc + (col.subtype === 'date' ? moment().diff(curr, 'year') : curr)
  }, 0)

  return (
    <SummaryBlock key={col.id + col.type} col={col}>
      <p>{Math.round(sum / colValues.length)}</p>
    </SummaryBlock>
  )
}

const renderHistogram = (colValues, col) => {
  const BIN_SIZE = col.binSize || 5
  let colMap, labels

  if (col.subtype === 'date') {
    const ageList = colValues.map(item => moment().diff(item, 'year'))

    colMap = ageList.reduce((acc, curr) => {
      const group = Math.floor(curr / BIN_SIZE) * BIN_SIZE
      acc[group] = acc[group] === undefined ? 1 : acc[group] + 1
      return acc
    }, {})

    labels = Object.keys(colMap).map(key => `${key} – ${parseInt(key) + BIN_SIZE - 1}`)
  } else {
    colMap = colValues.reduce((acc, curr) => {
      acc[curr] = acc[curr] ? acc[curr] : 0
      acc[curr] += 1
      return acc
    }, {})
    labels = Object.keys(colMap)
  }

  return (
    <SummaryBlock key={col.id + col.type} col={col}>
      <Plot
        data={[{
          x: labels,
          y: Object.values(colMap),
          type: 'bar'
        }]}
        layout={{
          yaxis: { fixedrange: true },
          xaxis: { fixedrange: true },
          height: 200,
          margin: {
            l: 20, r: 0, t: 20, b: 25
          }
        }}
        style= {{ width: '100%', height: '100%' }}
        config={{ displayModeBar: false }}
      />
    </SummaryBlock>

  )
}

export default function DashboardSummary ({ summary, usersInfo }: Props) {
  return (
    <>
      {summary && Array.isArray(usersInfo) && usersInfo.length > 1 &&
        <Container>
          <div className="summary-container">
            <h2 className="section-title">Summary</h2>
            <p>{usersInfo.length} participants</p>

            {summary.map(col => {
              const colValues = usersInfo.map(item => item[col.id])

              switch (col.type) {
                case 'average':
                  return renderAverage(colValues, col)
                case 'percentage':
                  return renderPercentage(colValues, col)
                case 'histogram':
                  return renderHistogram(colValues, col)
                default:
                  return null
              }
            })}
          </div>
        </Container>
      }
    </>
  )
}

const SummaryBlock = ({ col, children }: Object) => {
  const label = col.label || col.id

  return (
    <div key={col.id + col.type} className="summary-block">
      <h2 className="section-title">{label}</h2>
      {children}
    </div>
  )
}
