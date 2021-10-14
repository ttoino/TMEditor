import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import DocumentTitle from 'react-document-title'
import PropTypes from 'prop-types'

class PageNotFound extends Component {
  render () {
    return (
      <DocumentTitle title="Error 404 - Page Not Found">
        <div className="page-404-container">
          <div className="page-404-description">
            <h1> 404 </h1>
            <h3> PAGE NOT FOUND </h3>
          </div>
          <Button inverted onClick={() => this.props.history.push('/')}>
            Go back to Home
          </Button>
        </div>
      </DocumentTitle>
    )
  }
}

PageNotFound.propTypes = {
  history: PropTypes.object
}

export default PageNotFound
