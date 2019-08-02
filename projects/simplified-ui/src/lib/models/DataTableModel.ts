import { IGenericPageListViewModel } from "./IPagerModel";
import { Observable, Subject, ReplaySubject } from "rxjs";
import { IDataFilterViewModel, IFilterModel } from "../models/DataFilterModels";
import { SortDirection } from "./SaTableDataSource";
import { SaButtonConfig } from '../sa-button/sa-button.component';
import { TemplateRef, ElementRef } from '@angular/core';

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
  filter: IDataFilterViewModel,
  sticky?: boolean,
  stickyEnd?: boolean
}

export interface IRequestModel {
  pageNumber: number,
  pageSize: number,
  sortCol: string | number,
  sortDir: SortDirection,
  filter: IFilterModel
}

//abstract class which each data table/track pages will implement
export class DataTable<T>
{

  private columns: IDataTableColumn[] = [];
  private columnsUpdatedSubject: ReplaySubject<IDataTableColumn[]> = new ReplaySubject();
  private columnAddedSubject: ReplaySubject<IDataTableColumn> = new ReplaySubject();
  private columnRemovedSubject: ReplaySubject<IDataTableColumn> = new ReplaySubject();

  private rowAddedSubject: ReplaySubject<T> = new ReplaySubject();

  mainActionMenu: SaButtonConfig[] = [];

  optionsMenu: SaButtonConfig[] = [];

  isClientSide: boolean = false;

  showCheckboxColumn: boolean = false;

  showPaginator?: boolean = true;

  showFilters?: boolean = true;

  optionsColumnRef: TemplateRef<ElementRef>;

  getResults?: (requestModel: IRequestModel) => Observable<IGenericPageListViewModel<T>>;

  /**
   * Adds the row to the top of table.
   * @param row The row to be added.
   */
  addRow(row: T): void {
    this.rowAddedSubject.next(row);
  }

  onRowAdded(): Observable<T> {
    return this.rowAddedSubject.asObservable();
  }

  /**
   * Pushes the columns at the end of the table.
   * @param column Column to be added.
   */
  addColumn(column: IDataTableColumn): void;
  /**
   * Adds the column at given index.
   * @param column Column to be added.
   * @param index Index at which the column should be added.
   */
  addColumn(column: IDataTableColumn, index?: number): void {
    if (index) {
      this.columns.splice(index, 0, column);
    } else {
      this.columns.push(column);
    }
    this.columnAddedSubject.next(column);
    this.columnsUpdatedSubject.next(this.columns);
  }

  /**
   * Removes the last column from list.
   */
  removeColumn(): IDataTableColumn;
  /**
   * Removes the column from given index.
   * @param index Index from where the column should be removed.
   */
  removeColumn(index: number): IDataTableColumn;
  /**
   * Removes the column with given key.
   * @param key Key for which the column should be removed.
   */
  removeColumn(key: string): IDataTableColumn;
  removeColumn(keyOrIndex?: string | number): IDataTableColumn {
    let removedColumn: IDataTableColumn;

    if (!keyOrIndex) {
      removedColumn = this.columns.pop();
    }
    if (typeof keyOrIndex === "string") {
      removedColumn = this.columns.find(x => x.key != keyOrIndex);
      this.columns = this.columns.filter(x => x.key != keyOrIndex);
    }
    if (typeof keyOrIndex === "number") {
      removedColumn = this.columns.splice(<number>keyOrIndex, 1)[0];
    }

    this.columnRemovedSubject.next(removedColumn);
    this.columnsUpdatedSubject.next(this.columns);

    return removedColumn;
  }

  onColumnAdded(): Observable<IDataTableColumn> {
    return this.columnAddedSubject.asObservable();
  }

  onColumnRemoved(): Observable<IDataTableColumn> {
    return this.columnRemovedSubject.asObservable();
  }

  onColumnUpdated(): Observable<IDataTableColumn[]> {
    return this.columnsUpdatedSubject.asObservable();
  }
}

