// @flow

const CHART_TYPES = [
  'table',
  'card',
  'barchart',
  'areachart'
]

export type ChartTypes = $Keys<typeof CHART_TYPES>;

export type ChartGeneric = {
  data: any,
  type: ChartTypes,
  className?: string,
  legend?: string[],
  title?: string,
  ylabel?: string,
  xlabel?: string
};
