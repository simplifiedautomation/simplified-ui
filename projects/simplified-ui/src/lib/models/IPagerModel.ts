export interface IGenericPageListViewModel<T> {
  Capacity: number;
  Count: number;
  List: T[];
  Pager: IPagerSettings;
}

export interface IPagerSettings {
  CurrentPage: number;
  PagenumberToDisplay: number[];
  PageSize: number;
  Pages: number;
  TotalRecords: number;
  UrlFormat: string;
}
