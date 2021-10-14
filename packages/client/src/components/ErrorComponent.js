// @flow
import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'

type Props = {
  message?: string
};

class ErrorComponent extends Component<Props> {
  render () {
    const { message } = this.props

    return (
      <div className="error-component-wrapper">
        <div>
          <Icon name="exclamation triangle" size="large" />
          <p> No data to be displayed</p>
          {message && <span>{message}</span>}
        </div>
      </div>
    )
  }
}

export default ErrorComponent
