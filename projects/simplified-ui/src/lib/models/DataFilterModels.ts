export interface IDataFilterViewModel {
  key: string,
  filterType: FilterTypeEnum,
  config: any,
  title?: string
}

export enum FilterTypeEnum {
  select,
  date,
  text,
  number,
  none
}

export interface IFilterModel {
  keyword: string
}

export interface IFilterChip {
  key: string,
  title: string,
  value: any,
  displayValue: string
}
