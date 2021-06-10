import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  TemplateRef,
  ContentChild,
  ViewContainerRef,
  InjectionToken,
  Injector,
  ChangeDetectorRef
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { DataTable, IRequestModel, IDataTableColumn } from '../models/DataTableModel';
import { SaTableDataSource } from '../services/sa-table-data-source.service';
import { BehaviorSubject, Subscription, Observable, of } from 'rxjs';
import { DefaultCommonTableFilter, SaCommonTableFilter } from '../models/SaTableDataSource';
import { switchMap, tap } from 'rxjs/operators';
import { IGenericPageListViewModel } from '../models/IPagerModel';
import { SaButton } from '../models/SaButton';
import { IDataFilterViewModel, IFilterModel } from '../models/DataFilterModels';
import { CdkPortalOutlet, ComponentPortal, Portal, PortalInjector, TemplatePortal } from '@angular/cdk/portal';
export const CONTAINER_DATA = new InjectionToken<{}>('CONTAINER_DATA');
@Component({
  selector: 'sa-data-table',
  templateUrl: './sa-data-table.component.html',
  styleUrls: ['./sa-data-table.component.scss']
})
export class SaDataTableComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  @Input() dataTable: DataTable<T>;
  //container element
  containerElement: BehaviorSubject<T> | null = new BehaviorSubject(null);
  opened = false;

  @ViewChild('templatePortalContent', { static: true }) templatePortalContent: TemplateRef<any>;

  @Output() rowClick = new EventEmitter<T>();
  @Output() rowSelect = new EventEmitter<RowSelectEventDataModel<T>>();

  columnToDisplay: string[] = [];
  columns: IDataTableColumn[] = [];
  actionsTemplate: TemplateRef<any>;

  @ViewChild('iconSelector') iconSelector;
  filterArray: IDataFilterViewModel[] = [];

  /** list of paginated  rendered within the table */
  public get sourceList(): T[] {
    return this._source.value;
  }
  public set sourceList(list) {
    this._source.next(list);
  }
  private _source = new BehaviorSubject<T[]>([]);
  public requestModel: IRequestModel = null;
  public baseUrl: string;
  public isRender: boolean = false;
  public showFilter: boolean = false;

  public tableDataSource: SaTableDataSource<T, DefaultCommonTableFilter>;
  subs: Subscription[] = [];
  //minimap initializations
  @ViewChild('table', { static: true }) table: ElementRef;
  @ViewChild('scroller_div', { static: true }) scroller_div: ElementRef;
  @ViewChild('scroll_container', { static: true }) scroll_container: ElementRef;
  @ViewChild('scroller', { static: true }) scroller: ElementRef;
  @ViewChild('container', { read: CdkPortalOutlet })
  virtualPotalOutlet: CdkPortalOutlet;
  scrollerContainerWidth = 150;
  scrollerWidth = 100;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ContentChild('listItemTemplate', { static: true }) listItemTemplateRef: TemplateRef<any>;
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
    this.isAllSelected()
      ? this.selection.clear()
      : this.tableDataSource.dataStream.subscribe((row) => row.forEach((r) => this.selection.select(r)));
  }

  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row -`;
  }

  constructor(private _renderer: Renderer2, private changeDetector: ChangeDetectorRef, private _injector: Injector) {
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
    this.actionsTemplate = this.dataTable.actionsTemplate;
    this.subs.push(
      this.dataTable.onColumnAdded().subscribe((column) => {
        if (column.filter) this.filterArray.push(column.filter);
      })
    );
    this.subs.push(
      this.dataTable.onColumnRemoved().subscribe((column) => {
        this.filterArray =
          column.filter != null ? this.filterArray.filter((x) => x.key != column.filter.key) : this.filterArray;
      })
    );
    this.subs.push(
      this.dataTable.onColumnUpdated().subscribe((columns) => {
        this.columns = columns;
        this.columnToDisplay = columns.map((z) => {
          return z.key;
        });

        if (this.dataTable.optionsColumnRef) {
          this.columnToDisplay.push('options');
        }

        if (this.dataTable.enableDataContainer) {
          this.columnToDisplay.push('container');
        }

        if (this.dataTable.showCheckboxColumn) {
          this.columnToDisplay.unshift('select');
        }
      })
    );

    this.subs.push(
      this.dataTable.onFilterAdded().subscribe((filter) => {
        this.filterArray.push(filter);
      })
    );

    this.dataTable.onRowDelete().subscribe((itemOrIndexOrPredicate) => {
      if (typeof itemOrIndexOrPredicate == 'function') {
        this.sourceList = (<Function>itemOrIndexOrPredicate)(this.sourceList);
      } else if (typeof itemOrIndexOrPredicate == 'number') {
        this.sourceList = this.sourceList.filter((_, i) => i != itemOrIndexOrPredicate);
      } else {
        this.sourceList = this.sourceList.filter((x) => x != itemOrIndexOrPredicate);
      }
    });

    this.dataTable.onRefresh().subscribe((_) => {
      this.tableDataSource.triggerFilterChange();
    });

    this.subs.push(
      this.dataTable.onFilterApplied().subscribe((filters) => {
        this.filterArray.forEach((x) => (x.defaults = null));
        var clone = Object.assign([], this.filterArray);
        for (const filter of filters) {
          const index = clone.findIndex((x) => x.key == filter.key);
          if (index != -1) {
            clone[index].defaults = filter.defaults;
          }
        }
        this.filterArray = [];
        this.filterArray = clone;
      })
    );

    // listen to dataSource filter change
    this.subs.push(
      this.tableDataSource.onFilterChange
        // here we return a new observable to get the new records on filter change using switchMap,
        // which also discards any pending subscription if a new filter change event is emitted
        // while the previous request hasn't been completed
        .pipe(switchMap((filter) => this._getRecords(filter)))
        .subscribe((res) => {
          this.totalCount = res.Pager.TotalRecords;
          this.sourceList = res.List;
          this.isRender = true;
          this.showFilter = true;

          if (this.dataTable.selectedRowPredicate) {
            res.List.forEach((row) => {
              if (!this.selection.isSelected(row) && this.dataTable.selectedRowPredicate(row)) {
                this.selection.select(row);
              }

              this.selection.selected.forEach((selected) => {
                if (!this.dataTable.selectedRowPredicate(selected)) {
                  this.selection.deselect(selected);
                }
              });
            });
          }
        })
    );

    this.subs.push(
      this.dataTable.onRowAdded().subscribe((x) => {
        this._source.next([...[x], ...this._source.value]);
      })
    );

    this.tableDataSource.filter.pageSize = this.dataTable.defaultPageSize || this.tableDataSource.filter.pageSize;
  }

  ngAfterViewInit(): void {
    //attaching sort and paginator directives to the data source, after they are bound to the view

    if (this.dataTable.disableSorting) {
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
    };

    return this.dataTable.getResults(requestModel);
  }

  filterChange(filter: IFilterModel) {
    this.tableDataSource.filter.pageNo = 0;
    this.tableDataSource.filter.filterModel = filter;
  }

  dataRowClick(row: T) {
    this.rowClick.emit(row);
  }

  openContainer(ele) {
    this.containerElement.next(ele);
    this.opened = true;
    this.virtualPotalOutlet.detach();
    if (!this.dataTable.componentOrTemplateRef) {
      let x = new TemplatePortal<T>(this.templatePortalContent, null, <any>{ $implicit: ele });
      this.virtualPotalOutlet.attach(x);
      return;
    }
    if (this.dataTable.componentOrTemplateRef instanceof TemplateRef) {
      let portal = new TemplatePortal<T>(this.dataTable.componentOrTemplateRef, null, <any>{ $implicit: ele });
      this.virtualPotalOutlet.attach(portal);
    } else {
      this.virtualPotalOutlet.detach();
      let portal = new ComponentPortal(this.dataTable.componentOrTemplateRef, null, this.createInjector(ele));
      this.virtualPotalOutlet.attach(portal);
    }
  }
  private createInjector(dataToPass) {
    return Injector.create({
      parent: this._injector,
      providers: [{ provide: CONTAINER_DATA, useValue: dataToPass }]
    });
  }
  closeContainer() {
    this.opened = false;
    if (this.virtualPotalOutlet) this.virtualPotalOutlet.detach();
    this.containerElement.next(null);
  }
  getContainerElement() {
    return this.containerElement.asObservable();
  }

  openSubMenuOptions() {
    this.iconSelector.open();
  }

  columnChangeClicked(event: MatCheckboxChange, column: IDataTableColumn) {
    if (event.checked) {
      this.columnToDisplay.splice(-1, 0, column.key);
    } else {
      this.columnToDisplay = this.columnToDisplay.filter((x) => x != column.key);
    }
  }

  isColumnVisible(column: IDataTableColumn): boolean {
    return this.columnToDisplay.some((x) => x == column.key);
  }

  onCheckBoxChange(event, row) {
    this.selection.toggle(row);
    const eventdata: RowSelectEventDataModel<T> = {
      checked: event.checked,
      rowData: row
    };
    this.rowSelect.emit(eventdata);
  }

  initializeMinimap() {
    var elementWidth = this.table.nativeElement.offsetWidth;

    var scrollableWidth = this.table.nativeElement.scrollWidth;

    var scrollerRatio = scrollableWidth / elementWidth;

    this.scrollerWidth = this.scrollerContainerWidth / scrollerRatio;

    if (scrollableWidth > elementWidth) {
      var difference = scrollableWidth - elementWidth;
      var maxMargin = this.scrollerContainerWidth - this.scrollerWidth;
      var ratio = difference / maxMargin;

      let xValue = 0;
      let marginLeft = 0;
      var isDown = false;

      var right = (document.body.clientWidth - this.table.nativeElement.clientWidth + 40).toString() + 'px';

      this.scroller_div.nativeElement.style.visibility = 'visible';

      document.getElementById('parent').style.right = right;

      document.getElementById('parent').style.bottom = '40px';

      if (
        this.table.nativeElement.getBoundingClientRect().top >
        (window.innerHeight || document.documentElement.clientHeight) - 200
      ) {
        document.getElementById('parent').style.cssText = 'display: none !important';
      }

      this._renderer.listen(document, 'scroll', (e) => {
        var bounds = this.table.nativeElement.getBoundingClientRect();
        if (
          bounds.bottom < (window.innerHeight || document.documentElement.clientHeight) ||
          bounds.top > (window.innerHeight || document.documentElement.clientHeight) - 200
        ) {
          document.getElementById('parent').style.cssText = 'display: none !important';
        } else {
          document.getElementById(
            'parent'
          ).style.cssText = `position: fixed; top: unset; bottom: 40px; right: ${right} !important`;
        }
      });

      this._renderer.listen(this.scroller.nativeElement, 'mousedown', (e) => {
        isDown = true;
        xValue = e.clientX;
      });

      this._renderer.listen(document, 'mouseup', () => {
        isDown = false;
      });

      this._renderer.listen(this.scroller.nativeElement, 'mousemove', (e) => {
        if (isDown) {
          this.table.nativeElement.scrollLeft += ((e.clientX - xValue) * ratio) / 50;
          marginLeft += (e.clientX - xValue) / 50;

          switch (true) {
            case marginLeft > maxMargin:
              marginLeft = maxMargin;
              this.scroller.nativeElement.style.marginLeft = maxMargin.toString() + 'px';
              break;

            case marginLeft <= 0:
              marginLeft = 0;
              this.scroller.nativeElement.style.marginLeft = '0px';
              break;

            default:
              this.scroller.nativeElement.style.marginLeft = marginLeft + 'px';
              break;
          }
        }
      });

      this._renderer.listen(this.scroll_container.nativeElement, 'click', (e) => {
        if (!isDown && (<HTMLElement>e.target).id == 'scroll-container') {
          var clickOffsetLeft = e.clientX;

          this.table.nativeElement.scrollLeft += (clickOffsetLeft - this.scrollerWidth) * ratio;
          marginLeft += clickOffsetLeft - this.scrollerWidth;

          switch (true) {
            case marginLeft > maxMargin:
              marginLeft = maxMargin;
              this.scroller.nativeElement.style.marginLeft = maxMargin.toString() + 'px';
              break;

            case marginLeft <= 0:
              marginLeft = 0;
              this.scroller.nativeElement.style.marginLeft = '0px';
              break;

            default:
              this.scroller.nativeElement.style.marginLeft = marginLeft + 'px';
              break;
          }
        }
      });

      this._renderer.listen(this.table.nativeElement, 'scroll', (e) => {
        var denominator = difference / (this.scrollerContainerWidth - this.scrollerWidth);
        this.scroller.nativeElement.style.marginLeft =
          (this.table.nativeElement.scrollLeft / denominator).toString() + 'px';
      });
    }
  }
}

export interface RowSelectEventDataModel<T> {
  checked: boolean;
  rowData: T;
}
