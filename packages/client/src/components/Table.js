// @flow
import React, { Component } from 'react'
import { Grid } from 'gridjs-react'
import { Button, Icon } from 'semantic-ui-react'

type Props = {
  data: {
    headers: any[],
    values: any[]
  },
  export: boolean,
  pagination?: boolean | number,
  search: boolean,
  sort: boolean,
  title?: string
};

class Table extends Component<Props> {
 static defaultProps = {
   data: {
     headers: [],
     values: []
   }
 }

 exportData = (ev: SyntheticInputEvent<HTMLInputElement>) => {
   const rows = [this.props.data.headers, ...this.props.data.values]
   const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(row => {
     const escapedValues = row.map(el => typeof el === 'string' ? `"${el}"` : el)
     return escapedValues.join(',')
   }).join('\n')

   ev.target.setAttribute('href', encodeURI(csvContent))
 }

 render () {
   const { data } = this.props

   return (
     <div className="table-container">
       {this.props.title && <h2>{this.props.title}</h2>}
       <Grid
         data={data.values}
         columns={data.headers}
         search={true}
         sort={true}
         pagination={{
           enabled: !!this.props.pagination,
           limit: typeof this.props.pagination === 'number' ? this.props.pagination : 20
         }} />

       {this.props.export &&
       <div className="table-download">
         <Button
           onClick={this.exportData}
           floated="right"
           download="data.csv"
           as="a"
           icon
           labelPosition="left"
           size="small">
           <Icon name="download" />Download data</Button>
       </div>}
     </div>
   )
 }
}

export default Table
