import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { multiClientMiddleware } from 'redux-axios-middleware'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from '../reducers/Index'
import { dataFiltersTransforms } from '../reducers/DataFilters'
import clients from './clients'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['global', 'dataFilters'],
  transforms: [
    ...dataFiltersTransforms
  ]
}

const middlewares = [
  thunk,
  multiClientMiddleware(clients)
]

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middlewares)))
const persistor = persistStore(store)

export { store, persistor }
