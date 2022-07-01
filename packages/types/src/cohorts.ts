export interface CohortsConfig {
  groupByField?: string,
  map?: CohortsMap
}

export interface CohortsMap {
  [key: string]: any[]
}