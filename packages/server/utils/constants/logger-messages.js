// ERRORS
exports.ERROR_READ_PLATFORM_CONFIG =
  'Error found while retrieving platform configuration.'
exports.ERROR_READ_UI_PAGE = page =>
  `Error found while retrieving ${page} configuration.`
exports.ERROR_PARSING_BAR_CHART = element =>
  `Error encountered while parsing bar chart element: ${element}.`
exports.ERROR_UNKNOWN_CHART_TYPE = 'Received unknown chart type.'
exports.ERROR_RETRIEVING_USERS = 'Error found while retrieving users.'
exports.ERROR_LOADING_YAML = "Couldn't open yaml file."
exports.ERROR_REFERRING_TABLE =
  'Tables provided are not linked. Either there is no reference or the name is incorrect.'
exports.ERROR_RETRIEVING_FIREBASE_DOCUMENT = error =>
  `Error while retrieving document: ${error}`
exports.ERROR_NO_PROPERTY_ON_REDUCER =
  'There is no such property to be retrieved by the reducer.'
exports.ERROR_INEXISTENT_AGG_OP = 'There is no such aggregation operator.'
exports.ERROR_INEXISTENT_DATABASE = dbName =>
  `There is no database with name ${dbName}`
exports.ERROR_RETRIEVING_EXPORT_DATA =
  'Error while retrieving data to be exported'

// INFO's
exports.AUTHENTICATION_REQUIRED = (id = '') =>
  `Authentication to ${id} database required.`
exports.SIGN_IN_SUCCESSFUL = 'Sign In Successful.'
exports.SIGN_IN_FAILED = (code, message) =>
  `Sign In failed with code: ${code} with message: ${message}.`
exports.SUCCESSFULLY_CONNECTED_TO_DB = id =>
  `Connection to ${id} has been established successfully.`
exports.STARTED_LISTENING = port => `Server started listening on port ${port}!`

// WARNS
exports.WARN_NO_USERS_AFTER_REDUCING =
  'There are no users being sent after reducer being applied.'
exports.WARN_NO_DOCUMENT_IN_USER = docName =>
  `There is no document ${docName} in the selected database.`
exports.WARN_NO_ATTRIBUTE_IN_DOCUMENT =
  'There is no attribute with such name in the selected document.'
