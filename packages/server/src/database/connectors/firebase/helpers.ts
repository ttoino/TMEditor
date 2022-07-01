import { DBConfigFirebase } from '@types'

/**
 * Gets the timestamp key from the config
 * @param table
 * @param dbConfig
 * @returns string
 */
export const getTimestampKey = (table: string, dbConfig: DBConfigFirebase) => {
  const timestampField = 'timestampField' in dbConfig.structure[table] ? dbConfig.structure[table].timestampField : dbConfig.timestampField

  if (!timestampField) {
    return undefined
  }

  return typeof timestampField === 'object' ? timestampField.name : timestampField
}
