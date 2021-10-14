const commonReducer = require('../common')

exports.denormalizedSingleTimeChart = commonReducer.flattenSingleTimeChart

exports.denormalizedInputFormatter = commonReducer.histogramInputFormatter

exports.denormalizedMultiLineTimeChart = commonReducer.flattenMultiLineTimeChart

exports.denormalizedCategoricalBarChart = commonReducer.flattenCategoricalBarChart

exports.denormalizedPieChart = commonReducer.flattenPieChart

exports.denormalizedTable = commonReducer.table

exports.cardReducer = commonReducer.cardReducer
