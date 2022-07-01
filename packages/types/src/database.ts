export interface FiltersQuery {
  target: string,
  operator: '==' | '!=' | '>' | '>=' | '<' | '<=',
  value: any
}

export interface HapiFhirFiltersQuery extends Omit<FiltersQuery, 'operator'> {
  operator: FiltersQuery['operator'] | '+-' | 'contains' | 'exact' | 'in'
}

export interface FirebaseFiltersQuery extends Omit<FiltersQuery, 'operator'> {
  operator: FiltersQuery['operator'] | 'in' | 'not-in' | 'array-contains' | 'array-contains-any'
}

export interface UserPassAuth {
  username: string,
  password: string
}

export interface EmailPassAuth {
  email: string,
  password: string
}

export interface BearerAuth {
  bearer: string
}

export interface UsersConfig {
  table: string,
  idField: string,
  labelField?: string, // Field to be used as label on the selection dropdown
  fields?: string[], // Get all if not set
  filters?: FiltersQuery[]
}

export interface DBGeneric {
  id: string,
  users: UsersConfig,
  filters?: FiltersQuery[]
}

export interface DBConfigSQL extends DBGeneric {
  type: 'sqlite' | 'mysql' | 'mariadb' | 'postgres' | 'mssql',
  config: {
    database: string,
    uri: string,
    host: string,
    dialect: 'mysql' | 'mariadb' | 'postgres' | 'mssql',
    storage: string,
  },
  authentication: UserPassAuth,
  structure?: ModelStructureSQL,
  timestampField?: string
}

export interface DBConfigFirebase extends Omit<DBGeneric, 'filters'> {
  type: 'firebase',
  config: any,
  authentication?: EmailPassAuth,
  timestampField?: TimestampNoSQL,
  structure: ModelStructureRelationNoSQL,
  filters?: FirebaseFiltersQuery
}

export interface DBConfigFhir extends Omit<DBGeneric, 'filters'> {
  type: 'fhir',
  subtype: 'hapi',
  config: {
    url: string
  },
  authentication?: UserPassAuth | BearerAuth,
  filters?: HapiFhirFiltersQuery[]
}

export interface DBHapiFhir {
  url: string,
  authentication?: UserPassAuth | BearerAuth,
}

export type TimestampNoSQL = string | {
  name: string,
  type: 'FirebaseTimestamp'
}

export type ModelStructureRelationNoSQL = {
  [key: string]: {
    timestampField?: TimestampNoSQL,
    relations: {
      [key: string]: string
    },
    FK: {
      field: string,
      target: string
    }
  }
}

export type ModelStructureRelationSQL = {
  type: 'belongsTo' | 'hasMany' | 'belongsToMany',
  target: string,
  through?: string,
  FK: string
}

export type ModelStructureSQL = {
  [key: string]: {
    timestampField?: string,
    relations: ModelStructureRelationSQL[]
  }
}

export type DBConfig = DBConfigSQL | DBConfigFirebase | DBConfigFhir

export interface MainConfig {
  title: string,
  usersDB?: string,
  cache?: {
    expireTime: number
  }
  databases: DBConfig[]
}

// API response

export interface ResponseUsers {
  __key: string,
  __label: string,
  __cohort: string,
  [key: string]: string
}

export interface ResponseData {
  [key: string]: any
}
