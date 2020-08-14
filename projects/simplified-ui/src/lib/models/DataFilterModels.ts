export interface IDataFilterViewModel {
  key: string;
  filterType: FilterTypeEnum;
  config: any;
  title?: string;
  defaults?: FilterDefaults;
}

export type FilterDefaults = Date[][] | SelectDefault[];

export type SelectDefault = { value: any; displayValue: string };

export enum FilterTypeEnum {
  select,
  date,
  text,
  number,
  none
}

export interface IFilterModel {
  keyword: string;
}

export interface IFilterChip {
  key: string;
  title: string;
  value: any;
  displayValue: string;
}
