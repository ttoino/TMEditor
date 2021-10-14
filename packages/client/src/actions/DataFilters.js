export const resetSelectedCohorts = () => {
  return {
    type: 'RESET_SELECTED_COHORT'
  }
}

export const changeSelectedCohort = (payload) => {
  return {
    type: 'CHANGE_SELECTED_COHORT',
    payload: payload
  }
}

export const changeSelectedUser = (payload) => {
  return {
    type: 'CHANGE_SELECTED_USER',
    payload: payload
  }
}

export const resetSelectedUser = () => {
  return { type: 'RESET_SELECTED_USER' }
}

export const resetSelectedUserAndCohort = () => {
  return { type: 'RESET_SELECTED_USER_AND_COHORT' }
}

export const changeSelectedDate = (payload) => {
  return {
    type: 'CHANGE_SELECTED_DATE',
    payload: payload
  }
}
