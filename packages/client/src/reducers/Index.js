import { combineReducers } from 'redux'

import UsersReducer from './Users'
import PlatformMainConfigReducer from './PlatformMainConfig'
import CohortsReducer from './Cohorts'
import dataFilterReducer from './DataFilters'
import PagesReducer from './Pages'

const appReducer = combineReducers({
  users: UsersReducer,
  platformMainConfig: PlatformMainConfigReducer,
  cohorts: CohortsReducer,
  pages: PagesReducer,
  dataFilters: dataFilterReducer
})

export default appReducer
