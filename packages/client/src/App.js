// @flow
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Loader } from 'semantic-ui-react'
import { store, persistor } from './config/ConfigureStore'
import RouterProvider from './RouterProvider'
import 'semantic-ui-css/semantic.min.css'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import './resources/styles/styles.scss'

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <PersistGate
          loading={
            <Loader active size="massive">
              Loading
            </Loader>}
          persistor={persistor}>
          <RouterProvider />
        </PersistGate>
      </Provider>
    )
  }
}

export default App
