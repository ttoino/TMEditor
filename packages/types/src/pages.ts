import type { FiltersQuery, HapiFhirFiltersQuery, IncludeQuery } from './database'

export interface Page {
  title: string,
  requiredPermissions?: string[],
  components: UIComponent[] // widgets?
}

export interface SearchParams {
  user?: string,
  cohort?: string,
  startDate?: string,
  endDate?: string,
}

export interface ErrorComponent {
  code: 'ERROR' | 'NO_PERMISSIONS',
  name: string,
  message?: string
}

export interface QueryMeta {
  timestamp: string | null
}

export interface Warning {
  threshold: number,
  operator: string
}

interface BaseComponent {
  title: string,
  requiredPermissions?: string[],
  error?: ErrorComponent
}

interface BaseDBComponent extends BaseComponent {
  query: DatabaseQuery,
  reducer?: string
}

export interface DatabaseQuery {
  database: string,
  // doc?: string,
  table: string,
  fields?: (string | FieldAggregation | FieldAggregationOperator)[], // Get all if not provided
  groupby?: string,
  filters?: FiltersQuery[],
  include?: IncludeQuery[]
}

export interface HapiFhirDatabaseQuery extends Omit<DatabaseQuery, 'filters'> {
  filters?: HapiFhirFiltersQuery | HapiFhirFiltersQuery[]
}

export type AggregationOperator = 'avg' | 'max' | 'min' | 'sum' | 'count'

export interface FieldAggregation {
  target: string,
  name?: string,
  operator?: never
}
export interface FieldAggregationOperator {
  target: string,
  name?: string,
  operator: AggregationOperator | AggregationOperator[]
}

export interface Chart extends BaseDBComponent {
  type: 'chart',
  // plot/presets ???
  spec?: any // Vega lite spec
}

export interface Table extends BaseDBComponent {
  type: 'table',
  export?: boolean,
  pagination?: boolean | number, // Number of rows per page
  search: boolean,
  sort: boolean,
  warnings?: {
    [key: string]: Warning
  }
}

export interface Value extends BaseDBComponent {
  type: 'value',
  precision?: number,
  warnings?: {
    [key: string]: {
      threshold: number | number[],
      operator: string | string[]
    }
  }
}

export interface Summary extends BaseDBComponent {
  type: 'summary',
  precision?: number
}

// Layout component
export interface Columns extends BaseComponent {
  type: 'columns',
  components: UIComponentResponse[]
}

export interface Heading extends BaseComponent {
  type: 'heading'
}

export interface Info extends BaseComponent {
  type: 'info',
  text: string
}

export interface Tabs extends BaseComponent {
  type: 'tabs',
  panels: TabsPanel[]
}

type TabsPanel = {
  label: string,
  components: UIComponentResponse[]
}

export type DataComponent = Chart | Table | Value | Summary
export type LayoutComponent = Columns | Info | Heading | Tabs

export type UIComponent = DataComponent | LayoutComponent

// API response
export type DataResponse = {
  data: any[],
  meta: QueryMeta,
}

export type PermissionErrorResponse = {
  error: { name: string, code: 'NO_PERMISSIONS' },
}

export type ErrorResponse = {
  error: ErrorComponent,
} | PermissionErrorResponse

export type ValueResponse = (Value | Summary) & (DataResponse | ErrorResponse)

export type ChartWithData = Chart & DataResponse
export type TableWithData = Table & DataResponse

export type ChartResponse = Chart & (DataResponse | ErrorResponse)
export type TableResponse = Table & (DataResponse | ErrorResponse)
export type UIComponentResponse = ChartResponse | TableResponse | LayoutComponent | ValueResponse

export interface PageResponse extends Page {
  components: UIComponentResponse[]
}
