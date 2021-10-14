import { createWhitelistFilter } from 'redux-persist-transform-filter'

const urlParams = new URLSearchParams(window.location.search)
let startDate = null
if (urlParams.has('from')) {
  startDate = new Date(urlParams.get('from'))
} else {
  startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)
}
startDate.setHours(0, 0, 0, 0)

let endDate = null
if (urlParams.has('to')) {
  endDate = new Date(urlParams.get('to'))
} else {
  endDate = new Date()
}
endDate.setHours(23, 59, 59, 999)

const INITIAL_STATE = {
  selected_cohort: 'none',
  selected_user: 'none',
  date: {
    startDate: startDate,
    endDate: endDate
  }
}

export const dataFiltersTransforms = [
  createWhitelistFilter('dataFilters', ['date'])
]

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_SELECTED_COHORT':
      return { ...state, selected_cohort: action.payload }
    case 'RESET_SELECTED_COHORT':
      return { ...state, selected_cohort: INITIAL_STATE.selected_cohort }
    case 'CHANGE_SELECTED_USER':
      return { ...state, selected_user: action.payload }
    case 'CHANGE_SELECTED_DATE':
      return { ...state, date: action.payload }
    case 'RESET_SELECTED_USER':
      return { ...state, selected_user: INITIAL_STATE.selected_user }
    case 'RESET_SELECTED_USER_AND_COHORT':
      return {
        ...state,
        selected_user: INITIAL_STATE.selected_user,
        selected_cohort: INITIAL_STATE.selected_cohort
      }
    default:
      return state
  }
}
