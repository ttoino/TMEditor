const { isObject } = require('./data-types-validation')

const emptyArrayAsDefault = val => val || []

const noneAsDefault = val => val || 'none'

exports.defaultReducerAttributes = val => emptyArrayAsDefault(val)

exports.defaultReducerName = val => val.name || val

exports.defaultParadigm = val => val || 'denormalized'

exports.defaultFirebaseDBSubType = val => val || 'realtime'

exports.defaultPlurality = val => val || 'unique'

exports.defaultChildrenProperty = val => noneAsDefault(val)

exports.defaultDocumentName = val => val.document || val

exports.defaultQueryProperties = val => emptyArrayAsDefault(val)

exports.defaultQueryFilters = val => emptyArrayAsDefault(val)

exports.defaultDecimalPlaces = val => val || 0

exports.defaultRelation = val => noneAsDefault(val)

exports.defaultUIComponentPlurality = val => val || 'single'

exports.defaultUserMappingMethod = val => val || 'id'

exports.defaultUsersTableName = val =>
  !isObject(val) ? val || 'Users' : val.table

exports.defaultCohortFile = val =>
  val ? val.file || 'user-mapping/config-file.yaml' : ''

exports.defaultCohortVisibilityProp = val => val && val.display

exports.defaultSQLSpecificationsArr = val =>
  !val || !val.length ? null : !Array.isArray(val) ? [val] : val

exports.defaultDbType = val => val || 'firebase'

exports.defaultAsArray = val => (!Array.isArray(val) ? [val] : val)

exports.defaultDatabaseID = val => (!val ? 'default' : val)

exports.defaultUserReference = val => (!val ? 'user' : val)

exports.defaultRound = val => val || 'units'

exports.defaultOperator = val => (val ? val.toLowerCase() : 'avg')

exports.defaultGroupBy = val => (val || 'none')

exports.defaultBarChartDomain = val => (val || 'categorical')

exports.defaultCouchDBUsersTableName = val =>
  !isObject(val) ? val || '_users' : val.table

exports.defaultMinTimestamp = val => (val ? parseInt(val) - 1 : 0)

exports.defaultMaxTimestamp = val => (val ? parseInt(val) : 32536799999999)
