// @flow
import React, { useState } from 'react'
import { Header, Icon } from 'semantic-ui-react'

type Props = {
  header: string,
  children: any
};

const PageSection = ({ header, children }: Props) => {
  const [showSection, setShowSection] = useState(true)

  return (
    <div className="section-wrapper">
      <Header as="h2" className="section-title" onClick={() => setShowSection(!showSection) } >
        {header}
        <Icon name={showSection ? 'angle down' : 'angle up'} />
      </Header>
      <div className={'section-content ' + (showSection ? 'hidden' : '')}>
        {showSection && children}
      </div>
    </div>
  )
}

export default PageSection
