const INITIAL_STATE = {
  identifiers: [],
  isLoadingUsers: true,
  error: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_USERS':
      return { ...state, identifiers: action.payload || [] }
    case 'GET_USERS':
      return { ...state, error: false, isLoadingUsers: true }
    case 'GET_USERS_SUCCESS':
      return { ...state, identifiers: action.payload.data, isLoadingUsers: false }
    case 'GET_USERS_FAIL':
      return { ...state, identifiers: [], error: action.error.response.data }
    default:
      return state
  }
}
