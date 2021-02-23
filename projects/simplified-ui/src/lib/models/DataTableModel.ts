import { IGenericPageListViewModel } from './IPagerModel';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { IDataFilterViewModel, IFilterModel, FilterDefaults } from '../models/DataFilterModels';
import { SortDirection } from './SaTableDataSource';
import { SaButtonConfig } from '../sa-button/sa-button.component';
import { TemplateRef, ElementRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

//data for each column in a table
export enum DataTableColumnTypeEnum {
  text = 'text',
  number = 'number',
  date = 'date',
  dateTime = 'dateTime'
}

//data for each column in a table
export interface IDataTableColumn {
  key: string;
  title: string;
  type: DataTableColumnTypeEnum;
  filter: IDataFilterViewModel;
  sticky?: boolean;
  stickyEnd?: boolean;
  template?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  data?: any;
}

export interface IRequestModel {
  pageNumber: number;
  pageSize: number;
  sortCol: string | number;
  sortDir: SortDirection;
  filter: IFilterModel;
}

//abstract class which each data table/track pages will implement
export class DataTable<T> {
  private columns: IDataTableColumn[] = [];
  private columnsUpdatedSubject: ReplaySubject<IDataTableColumn[]> = new ReplaySubject();
  private columnAddedSubject: ReplaySubject<IDataTableColumn> = new ReplaySubject();
  private columnRemovedSubject: ReplaySubject<IDataTableColumn> = new ReplaySubject();
  private addFilterSubject: ReplaySubject<IDataFilterViewModel> = new ReplaySubject();
  private applyFilterSubject: ReplaySubject<{ key: string; defaults: FilterDefaults }[]> = new ReplaySubject();

  private rowAddedSubject: ReplaySubject<T> = new ReplaySubject();

  private deleteRowSubect: ReplaySubject<T | number | ((sourceList: T[]) => T[])> = new ReplaySubject();

  private refreshTableSubject: Subject<any> = new Subject();
  mainActionMenu: SaButtonConfig[] = [];

  routerLinkEnabled: boolean = false;

  isClientSide: boolean = false;

  showCheckboxColumn: boolean = false;

  showPaginator?: boolean = true;

  showFilters?: boolean = true;

  disableSorting?: boolean = false;

  showColumnToggle?: boolean = true;

  showTableMinimap?: boolean = false;

  optionsColumnRef: TemplateRef<ElementRef>;

  defaultPageSize?: number;

  actionsTemplate?: TemplateRef<any>;

  /**
   * Enable data container on the right of data table for selected row visualization.
   *
   */
  enableDataContainer?: boolean = false;
  /**
   * Component or template ref of data table, this works similarly to the Mat Dialog
   * where you can get access to the selected row in the injection of the constructor
   */
  componentOrTemplateRef: ComponentType<T> | TemplateRef<T>;

  getResults?: (requestModel: IRequestModel) => Observable<IGenericPageListViewModel<T>>;

  /**
   * This method implementation is required when selection and server-side data
   * rendering is enabled together. Because the instance of same data is dynamic,
   * the state for selection does not match between the selection array and incoming
   * data with same values.
   *
   * By implementing this method, you will allow the data table to understand
   * if the row should be selected or not when data is refreshed or page changes.
   *
   * @param insertedRow The instance of row that is inserted in data table
   * @param selected The instance of selected row from selection array. This is
   * optional to allow pre-selected rows.
   *
   * @returns Boolean value indicating if the row should be selected or not. If this
   * is true, the row will be in selected state. Otherwise, it will not be selected.
   *
   */
  selectedRowPredicate?: (insertedRow: T, selected?: T) => boolean;

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
   * Adds the column at given index. If Index is null,
   * pushes the column at end of table.
   *
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
    if (typeof keyOrIndex === 'string') {
      removedColumn = this.columns.find((x) => x.key != keyOrIndex);
      this.columns = this.columns.filter((x) => x.key != keyOrIndex);
    }
    if (typeof keyOrIndex === 'number') {
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

  onRowDelete(): Observable<T | number | ((sourceList: T[]) => T[])> {
    return this.deleteRowSubect.asObservable();
  }

  onRefresh(): Observable<any> {
    return this.refreshTableSubject.asObservable();
  }

  /**
   * Deletes the row by matching object reference
   * @param item Item to be deleted
   */
  deleteRow(item: T);
  /**
   * Deletes the row by index
   * @param index Zero based index where the row should be deleted
   */
  deleteRow(index: number);
  /**
   * Recieves the source list from which the item can be deleted using custom logic.
   * @param predicate Method receiving the source list. Must return the updated source List
   */
  deleteRow(predicate: (sourceList: T[]) => T[]);
  deleteRow(itemOrIndexOrPredicate: T | number | ((sourceList: T[]) => T[])) {
    this.deleteRowSubect.next(itemOrIndexOrPredicate);
  }

  refresh() {
    this.refreshTableSubject.next();
  }

  /**
   * Adds a new filter
   * @param filter Filter to be added
   */
  addFilter(filter: IDataFilterViewModel) {
    this.addFilterSubject.next(filter);
  }

  onFilterAdded(): Observable<IDataFilterViewModel> {
    return this.addFilterSubject.asObservable();
  }

  applyFilter(filters: { key: string; defaults: FilterDefaults }[]) {
    this.applyFilterSubject.next(filters);
  }

  onFilterApplied(): Observable<{ key: string; defaults: FilterDefaults }[]> {
    return this.applyFilterSubject.asObservable();
  }
}
