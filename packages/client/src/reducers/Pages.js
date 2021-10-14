const defaultState = {
  data: [],
  isLoading: true
}

export default (state = defaultState, action) => {
  const { type } = action
  switch (type) {
    case 'GET_PAGE_DATA':
      return { ...state, isLoading: true }
    case 'GET_PAGE_DATA_SUCCESS':
      return { ...state, data: action.payload.data, isLoading: false }
    default:
      return state
  }
}
