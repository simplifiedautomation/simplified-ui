import { IGenericPageListViewModel } from "./IPagerModel";
import { Observable, Subject } from "rxjs";
import { IDataFilterViewModel, IFilterModel } from "../models/DataFilterModels";
import { SortDirection } from "./SaTableDataSource";
import { SaButton } from "./SaButton";

//data for each column in a table
export enum DataTableColumnTypeEnum {
  text = "text",
  number = "number",
  date = "date",
  dateTime = "dateTime"
}

//data for each column in a table
export interface IDataTableColumn {
  key: string;
  title: string;
  type: DataTableColumnTypeEnum,
  filter: IDataFilterViewModel
}

export interface IRequestModel {
  pageNumber: number,
  pageSize: number,
  sortCol: string | number,
  sortDir: SortDirection,
  filter: IFilterModel
}

//abstract class which each data table/track pages will implement
export interface IDataTable<T> 
{
  dataSource: Subject<T>;

  columns: IDataTableColumn[];

  mainActionMenu: SaButton[];

  optionsMenu: SaButton[];

  isClientSide: boolean;

  showCheckboxColumn: boolean;

  rowClick?: (event: T) => void;

  rowSelect?: (event: T[]) => void;

  getResults?: (requestModel: IRequestModel) => Observable<IGenericPageListViewModel<T>>;
}

