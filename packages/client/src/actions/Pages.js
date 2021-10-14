import moment from 'moment'
import qs from 'query-string'
import { API_BASE_URL } from '../config/AccessPoint'

export const getPageData = (page, id, options) => (dispatch) => {
  const userFilteringLiteral = id ? '/' + id : ''

  const optionsQuery = qs.stringify({
    ...options,
    from: options && moment(options.startDate).format('YYYY-MM-DD'),
    to: options && moment(options.endDate).format('YYYY-MM-DD')
  })

  dispatch({
    type: 'GET_PAGE_DATA',
    payload: {
      request: {
        method: 'GET',
        url: `${API_BASE_URL}/api/config/pages/${page}/users${userFilteringLiteral}?${optionsQuery}`
      }
    }
  })
}
