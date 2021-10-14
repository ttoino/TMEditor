const commonReducer = require('../common')

exports.sequelizeSingleTimeChart = commonReducer.flattenSingleTimeChart

exports.histogramInputFormatter = commonReducer.histogramInputFormatter

exports.sequelizeMultiLineTimeChart = commonReducer.flattenMultiLineTimeChart

exports.sequelizeCategoricalBarChart = commonReducer.flattenCategoricalBarChart

exports.sequelizePieChart = commonReducer.flattenPieChart

exports.sequelizeTable = commonReducer.table

exports.cardReducer = commonReducer.cardReducer
