import { NODATA_LABEL } from '@app/constants'
import { calculateAggregation } from '@app/utils/formatter'
import { checkIfStringsArray, checkPropertyInEveryObjectsArray } from '@app/utils/helpers'
import { Patient, BundleEntry, HapiFhirFiltersQuery, FieldAggregationOperator, FieldAggregation } from '@types'

type TKeyValue = { [key: string]: any }

export const formatUsersData = (data: BundleEntry[], fields: string[], idField: string) => {
  const formattedData: object[] = []

  for (const i in data) {
    const user: { [key: string]: string } = {}
    const resource: Patient | undefined = data[i].resource as Patient

    for (const j in fields) {
      const field = fields[j]

      if (resource && Object.prototype.hasOwnProperty.call(resource, field)) {
        if (field === 'name' && resource.name) {
          let name = ''
          const given = resource.name[0].given || []
          for (let k = 0; k < given.length; k++) {
            name += given[k]
            if (k < given.length - 1) name += ' '
          }

          const familyName = resource.name[0].family || ''
          if (name !== '' && familyName) name += ` ${familyName}`
          else name += familyName

          user[field] = name
        } else {
          user[field] = String(resource[field as keyof Patient])
        }
      } else if (field.includes('.')) {
        user[field] = searchInObject(resource, field) || NODATA_LABEL
      } else {
        user[field] = NODATA_LABEL
      }
    }

    user.__key = String(resource[idField as keyof Patient] || NODATA_LABEL)

    formattedData.push(user)
  }

  return formattedData
}

export const formatData = (data: BundleEntry[], fields: (string | FieldAggregation | FieldAggregationOperator)[], groupby?: string) => {
  let newData: any[] = []

  // If no fields are specified get all data
  if (fields.length === 0) newData = data.map(entry => entry.resource)
  else if (checkIfStringsArray(fields) || !checkPropertyInEveryObjectsArray(fields, 'operator')) {
    // If fields do not require any kind of aggregation
    for (const entry of data) {
      const { resource } = entry
      if (!resource) continue

      const newObj: TKeyValue = {}
      for (const field of fields) {
        if (typeof field === 'string') newObj[`${resource.resourceType}.${field}`] = searchInObject(resource, field) || NODATA_LABEL
        else {
          let keyName = `${resource.resourceType}.${field.target}`
          if (field.name) keyName = `${resource.resourceType}.${field.name}`
          newObj[keyName] = searchInObject(resource, field.target) || NODATA_LABEL
        }
      }

      newData.push(newObj)
    }
  } else {
    // Fields that require aggregation calculations
    const resourceType = data[0]?.resource?.resourceType

    if (groupby) {
      const groupedData: { [key: string]: object[] } = {
        null: []
      }
      for (const entry of data) {
        const { resource } = entry
        if (!resource) continue

        const groupKey = searchInObject(resource, groupby)
        if (groupKey) {
          groupedData[groupKey] = Object.prototype.hasOwnProperty.call(groupedData, groupKey) ? groupedData[groupKey].concat(resource) : [resource]
        } else {
          groupedData.null = groupedData.null.concat(resource)
        }
      }

      for (const groupKey in groupedData) {
        newData.push({
          ...calculateAggregationObject(groupedData[groupKey], fields, resourceType),
          [groupby]: groupKey
        })
      }
    } else {
      newData.push(calculateAggregationObject(data.map(e => e.resource), fields, resourceType))
    }
  }

  return newData
}

/**
 * Generates a string with filters to query Hapi FHIR API.
 * More documentation for the available filters in https://www.hl7.org/fhir/search.html
 *
 * @param filters   An array of filters to be used.
 * @returns     A filters query ready to be used as url parameters
 */
export const generateFiltersQuery = (filters: HapiFhirFiltersQuery[]) => {
  let tempFilters = ''
  for (const filter of filters) {
    if (tempFilters !== '') tempFilters += '&'

    tempFilters += filter.target.toLowerCase()

    const dateRegExp = /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?/ // Regexp retrieved from FHIR documentation

    // Date available formats: YYYY, YYYY-MM, or YYYY-MM-DD
    // https://www.hl7.org/fhir/datatypes.html#date
    if (typeof filter.value === 'number' || dateRegExp.test(filter.value)) {
      switch (filter.operator) {
        case '==':
          tempFilters += '='
          break
        case '!=':
          tempFilters += '=ne'
          break
        case '>':
          tempFilters += '=gt'
          break
        case '>=':
          tempFilters += '=ge'
          break
        case '<':
          tempFilters += '=lt'
          break
        case '<=':
          tempFilters += '=le'
          break
        case '+-':
          tempFilters += '=ap'
          break
        default:
          tempFilters += '='
          break
      }
    } else if (typeof filter.value === 'string' && filter.value.includes(',')) {
      const firstElement: any = filter.value.split(',')[0]
      if (isNaN(firstElement)) {
        switch (filter.operator) {
          case '==':
            tempFilters += '='
            break
          case 'contains':
            tempFilters += ':contains='
            break
          case 'exact':
            tempFilters += ':exact='
            break
          case 'in':
            tempFilters += ':in='
            break
          default:
            tempFilters += '='
            break
        }
      } else {
        tempFilters += ':eq='
      }
    } else if (typeof filter.value === 'string') {
      switch (filter.operator) {
        case '==':
          tempFilters += '='
          break
        case '!=':
          tempFilters += ':not='
          break
        case 'contains':
          tempFilters += ':contains='
          break
        case 'exact':
          tempFilters += ':exact='
          break
        case 'in':
          tempFilters += ':in='
          break
        default:
          tempFilters += '='
          break
      }
    }

    tempFilters += filter.value
  }

  return tempFilters
}

/**
 * Retrieves the value from the object @obj with the key @key.
 * The value to retrieve can be nested inside objects or arrays so the @key needs to reflect the desired location separating with dots (.) the keys.
 * By default, whenever an array is found this function chooses the first element of the array
 *
 * @param obj   The object from where to get the value.
 * @param key   The key of the value we wish to retrieve separated with dots (.) (e.g., quantity.value).
 * @returns     The value or null if no value was found
 */
export const searchInObject: any = (obj: any, key: string) => {
  const keyArray = key.split('.')
  const tempKey = keyArray.shift()

  if (tempKey === null) return null

  if (tempKey && typeof obj === 'object' && tempKey in obj) {
    const value = obj[tempKey]
    if (Array.isArray(value)) {
      return searchInObject(value[0], keyArray.join('.'))
    } else if (typeof value === 'object') {
      return searchInObject(value, keyArray.join('.'))
    } else if (keyArray.length === 0) {
      return value
    }
  }

  return null
}

/**
 * Finds and aggregates values from @values array of objects using the operators from the @fields .
 *
 * @param array         An array of objects with values to be aggregated.
 * @param resourceType  FHIR resource type
 * @param fields        Array of fields which specifies the target, new name and the aggregation operators (avg, max, min, sum, count).
 * @returns             An object with the all the resulting aggregations
 */
export const calculateAggregationObject = (array: any[], fields: (string | FieldAggregation | FieldAggregationOperator)[], resourceType?: string) => {
  const newObj: TKeyValue = {}
  for (const field of fields) {
    if (typeof field !== 'object' || !Object.prototype.hasOwnProperty.call(field, 'operator')) continue

    const { name, target, operator } = field

    if (!operator) continue

    let keyName = ''
    if (resourceType) keyName += `${resourceType}.`

    if (name) keyName += `${name}`
    else keyName += `${target}`

    if (Array.isArray(operator)) {
      for (const op of operator) {
        if (!(keyName in newObj)) newObj[keyName] = {}
        newObj[keyName][op] = calculateAggregation(array.map(e => searchInObject(e, target)), op)
      }
    } else {
      if (!(keyName in newObj)) newObj[keyName] = {}
      newObj[keyName][operator] = calculateAggregation(array.map(e => searchInObject(e, target)), operator)
    }
  }

  return newObj
}
