const INITIAL_STATE = {
  names: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_COHORTS':
      return { ...state, names: action.payload }
    default:
      return state
  }
}
