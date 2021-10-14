const {
  defaultUIComponentPlurality,
  defaultBarChartDomain
} = require('../../utils/default-values-generator')
const {
  ERROR_PARSING_BAR_CHART
} = require('../../utils/constants/logger-messages')
const { replicateArray } = require('../../utils/formatter')
const logger = require('../../config/logger')
const { setReducerConfig } = require('../../reducers/index')
const databaseAPI = require('../../database/api')

exports.default = (element, params) => {
  if (
    defaultBarChartDomain(element.domain) === 'categorical' ||
    defaultBarChartDomain(element.domain) === 'day'
  ) {
    setReducerConfig('categorical-barchart', element)
    return databaseAPI.getData(element, params).then(data => {
      const plurality = defaultUIComponentPlurality(element.plurality) // default value
      if ((plurality === 'single' && data != null) || plurality === 'multiple') {
        const xlength = data.x.length
        const ylength = data.y.length
        if (ylength % xlength === 0) {
          replicateArray(ylength / xlength, data.x)
        } else {
          logger.error(ERROR_PARSING_BAR_CHART(element))
        }
      } else {
        throw new Error(
          'Information required for barchart unavailable in database'
        )
      }
      element.specifications.data = data
      return element
    })
  }
  return null
}
