import React, { Component } from 'react'
import { Map as PigeonMap, Marker } from 'pigeon-maps'
import PropTypes from 'prop-types'
import NoDataChart from './charts/NoDataChart'

class Map extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedMarker: ''
    }
  }

  handleMarkerClick = ({ event, payload, anchor }) => {
    let markerInfo = null
    for (let i = this.props.data.length - 1; i >= 0; i--) {
      if (
        this.props.data[i].latitude === anchor[0] &&
        this.props.data[i].longitude === anchor[1]
      ) {
        const time = this.props.data[i].time
          ? new Date(this.props.data[i].time)
          : null

        markerInfo =
          'Latitude: ' +
          this.props.data[i].latitude +
          ' | Longitude: ' +
          this.props.data[i].longitude +
          (time ? ' | Time: ' + time.toUTCString() : '') +
          (this.props.data[i].accuracy
            ? ' | Accuracy: ' + this.props.data[i].accuracy + ' meters'
            : '')
        break
      }
    }
    this.setState({ selectedMarker: markerInfo })
  }

  // Pigeon Map API - https://github.com/mariusandra/pigeon-maps#api
  render () {
    let markers = null
    let centerLatitude = 0
    let centerLongitude = 0
    let centerZoom = 3

    if (this.props.data === null) {
      return <NoDataChart />
    }

    if (this.props.data.length !== 0) {
      markers = this.props.data.map((marker, key) => (
        <Marker
          key={key}
          anchor={[marker.latitude, marker.longitude]}
          onClick={this.handleMarkerClick}
        />
      ))

      centerLatitude = this.props.data[this.props.data.length - 1].latitude
      centerLongitude = this.props.data[this.props.data.length - 1].longitude
      centerZoom = 14
    }

    return (
      <div>
        <PigeonMap
          center={[centerLatitude, centerLongitude]}
          zoom={centerZoom}
          height={400}
        >
          {markers}
        </PigeonMap>
        <p>{this.state.selectedMarker}</p>
      </div>
    )
  }
}

Map.propTypes = {
  data: PropTypes.array
}

export default Map
