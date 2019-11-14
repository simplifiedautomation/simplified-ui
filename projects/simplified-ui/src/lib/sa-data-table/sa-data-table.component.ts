import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatSort, MatPaginator, MatCheckboxChange } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DataTable, IRequestModel, IDataTableColumn } from '../models/DataTableModel';
import { SaTableDataSource } from '../services/sa-table-data-source.service';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { DefaultCommonTableFilter, SaCommonTableFilter } from '../models/SaTableDataSource';
import { switchMap } from 'rxjs/operators';
import { IGenericPageListViewModel } from '../models/IPagerModel';
import { SaButton } from '../models/SaButton';
import { IDataFilterViewModel, IFilterModel } from '../models/DataFilterModels';



@Component({
  selector: 'sa-data-table',
  templateUrl: './sa-data-table.component.html',
  styleUrls: ['./sa-data-table.component.scss']
})
export class SaDataTableComponent<T> implements OnInit, AfterViewInit {

  @Input() dataTable: DataTable<T>;

  @Output() rowClick = new EventEmitter<T>();
  @Output() rowSelect = new EventEmitter<RowSelectEventDataModel<T>>();

  columnToDisplay: string[] = [];
  columns: IDataTableColumn[] = [];

  @ViewChild('iconSelector') iconSelector;
  filterArray: IDataFilterViewModel[] = [];

  /** list of paginated  rendered within the table */
  public get sourceList(): T[] { return this._source.value };
  public set sourceList(list) { this._source.next(list); }
  private _source = new BehaviorSubject<T[]>([]);
  public requestModel: IRequestModel = null;
  public baseUrl: string;
  public isRender: boolean = false;
  public showFilter: boolean = false;

  public tableDataSource: SaTableDataSource<T, DefaultCommonTableFilter>;
  subs: Subscription[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  highlightedRows = [];
  totalCount: number;
  selection = new SelectionModel<T>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    if (this.tableDataSource.dataStream != null) {
      return numSelected === this.tableDataSource.filter.pageSize;
    }
    return false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableDataSource.dataStream.subscribe(row => row.forEach(r => this.selection.select(r)));
  }

  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row -`;
  }

  constructor() {
    this.tableDataSource = new SaTableDataSource(
      this._source.asObservable(),
      new DefaultCommonTableFilter(),
      this.dataTable == undefined ? false : true
    );
  }

  menuItemClicked(button: SaButton, evt) {
    button.triggerNext(evt);
  }

  ngOnInit() {

    this.dataTable.onColumnUpdated().subscribe(columns => {
      this.filterArray = [];
      columns.forEach(z => {
        if (z.filter != null)
          this.filterArray.push(z.filter);
      });

      this.columns = columns;

      this.columnToDisplay = columns.map(z => {
        return z.key;
      });
      if (this.dataTable.routerLinkEnabled) {
        this.columnToDisplay.push('route');
      }
      if (this.dataTable.optionsColumnRef) {
        this.columnToDisplay.push('options');
      }
    });

    this.dataTable.onRowDelete().subscribe(itemOrIndexOrPredicate => {
      if (typeof itemOrIndexOrPredicate == 'function') {
        this.sourceList = (<Function>itemOrIndexOrPredicate)(this.sourceList)
      }
      else if (typeof itemOrIndexOrPredicate == 'number') {
        this.sourceList = this.sourceList.filter((_, i) => i != itemOrIndexOrPredicate);
      } else {
        this.sourceList = this.sourceList.filter(x => x != itemOrIndexOrPredicate)
      }
    });

    this.dataTable.onRefresh().subscribe(_ => {
      this.tableDataSource.triggerFilterChange();
    })


    // listen to dataSource filter change
    this.subs.push(this.tableDataSource.onFilterChange
      // here we return a new observable to get the new records on filter change using switchMap,
      // which also discards any pending subscription if a new filter change event is emitted
      // while the previous request hasn't been completed
      .pipe(switchMap(filter => this._getRecords(filter)))
      .subscribe(
        res => {
          this.totalCount = res.Pager.TotalRecords;
          this.sourceList = res.List;
          this.isRender = true;
          this.showFilter = true;
        },
        e => console.log(e)
      )
    );

    if (this.dataTable.showCheckboxColumn) {
      this.columnToDisplay.unshift('select');
    }

    this.subs.push(this.dataTable.onRowAdded().subscribe(x => {
      this._source.next([...[x], ...this._source.value]);
    }));

    this.tableDataSource.filter.pageSize = this.dataTable.defaultPageSize || this.tableDataSource.filter.pageSize;
  }

  ngAfterViewInit(): void {
    //attaching sort and paginator directives to the data source, after they are bound to the view

    if (this.dataTable.disableSorting){
      this.sort.disabled = true;
    }

    this.tableDataSource.sort = this.sort;
    this.tableDataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    if (this.subs && this.subs.length > 0) {
      while (this.subs.length > 0) {
        let sub = this.subs.pop();
        sub.unsubscribe();
        sub = null;
      }
    }
    this._source.complete();
  }


  //* Callback for when table filter change is triggered.
  //  * Returns a new observable to fetch the new list of records using the updated filter model
  //*
  //  * @param filter updated table filter model
  //* /
  private _getRecords(filter: SaCommonTableFilter): Observable<IGenericPageListViewModel<T>> {
    this.isRender = false;
    let requestModel: IRequestModel = {
      pageNumber: filter.pageNo,
      pageSize: filter.pageSize,
      sortDir: filter.sortDir,
      filter: filter.filterModel,
      sortCol: filter.sortCol
    }

    return this.dataTable.getResults(requestModel);
  }

  filterChange(filter: IFilterModel) {
    this.tableDataSource.filter.pageNo = 0;
    this.tableDataSource.filter.filterModel = filter;
  }

  dataRowClick(row: T) {
    this.rowClick.emit(row);
  }

  openSubMenuOptions() {
    this.iconSelector.open();
  }

  columnChangeClicked(event: MatCheckboxChange, column: IDataTableColumn) {
    if (event.checked) {
      this.columnToDisplay.splice(-1, 0, column.key);
    } else {
      this.columnToDisplay = this.columnToDisplay.filter(x => x != column.key);
    }
  }

  isColumnVisible(column: IDataTableColumn): boolean {
    return this.columnToDisplay.some(x => x == column.key);
  }

  onCheckBoxChange(event, row) {
    this.selection.toggle(row);
    const eventdata: RowSelectEventDataModel<T> = {
      checked: event.checked,
      rowData: row
    }
    this.rowSelect.emit(eventdata);
  }
}


export interface RowSelectEventDataModel<T> {
  checked: boolean;
  rowData: T;
}
