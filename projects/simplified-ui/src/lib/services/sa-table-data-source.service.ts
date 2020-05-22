import { DataSource } from '@angular/cdk/table';
import { Observable, BehaviorSubject, of, Subscription, merge, combineLatest, Subject } from 'rxjs';
import { SaCommonTableFilter, DefaultCommonTableFilter, SortDirection } from '../models/SaTableDataSource';
import { map, tap, debounceTime } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IFilterModel } from '../models/DataFilterModels';

/**
 * Data source that accepts a stream of data array and includes native support of filtering,
 * sorting (using MatSort), and pagination (using MatPaginator).
 *
 * It extends the default MatTableDataSource (which only works with client-side data array)
 * to include support for rendering paginated/sorted content coming from the server-side.
 */

export class SaTableDataSource<MODEL, FILTER extends SaCommonTableFilter> extends DataSource<MODEL> {

  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly _renderData = new BehaviorSubject<MODEL[]>([]);
  /**
 * Subscription to the changes that should trigger an update to the table's rendered rows, such
 * as filtering, sorting, pagination, or base data changes.
 */
  private _renderChangesSubscription = Subscription.EMPTY;
  /** mat table data source reference, used for calling helper functions defined in it */
  private _matTableDataSource = new MatTableDataSource<MODEL>();
  /**
   * Instance of the MatSort directive used by the table to control its sorting. Sort changes
   * emitted by the MatSort will trigger onFilterChanges() event, containing the updated filter value,
   * which can then be used to send updated data stream.
   */
  public get sort(): MatSort | null { return this._sort; }
  public set sort(sort: MatSort | null) {
    this._sort = sort;
    this._updateChangeSubscription();
  }
  private _sort: MatSort | null;
  /**
   * Instance of the MatPaginator component used by the table to control what page of the data is
   * displayed. Page changes emitted by the MatPaginator will trigger onFilterChanges() event,
   * containing the updated filter value, which can then be used to send updated data stream.
   *
   * Note that the data source uses the paginator's properties to calculate which page of data
   * should be displayed. If the paginator receives its properties as template inputs,
   * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the paginator's view has been
   * initialized before assigning it to this data source.
   */
  public get paginator(): MatPaginator | null { return this._paginator; }
  public set paginator(paginator: MatPaginator | null) {
    this._paginator = paginator;
    this._updateChangeSubscription();
  }
  private _paginator: MatPaginator | null;
  /**
   * Gets a sorted copy of the data array based on the state of the MatSort. Called
   * after changes are made to the filtered data or when sort changes are emitted from MatSort.
   * By default, the function retrieves the active sort and its direction and compares data
   * by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation
   * of data ordering.
   * @param data The array of data that should be sorted.
   * @param sort The connected MatSort that holds the current sort state.
   */
  public get sortData(): ((data: MODEL[], sort: MatSort) => MODEL[]) { return this._matTableDataSource.sortData; }
  public set sortData(sortingFunc) { this._matTableDataSource.sortData = sortingFunc };
  /**
   * Data accessor function that is used for accessing data properties for sorting through
   * the default sortData function.
   * This default function assumes that the sort header IDs (which defaults to the column name)
   * matches the data's properties (e.g. column Xyz represents data['Xyz']).
   * May be set to a custom function for different behavior.
   * @param data Data object that is being accessed.
   * @param sortHeaderId The name of the column that represents the data.
   */
  public get sortingDataAccessor(): ((data: MODEL, sortHeaderId: string) => string | number) { return this._matTableDataSource.sortingDataAccessor; }
  public set sortingDataAccessor(sortingAccessorFunc) { this._matTableDataSource.sortingDataAccessor = sortingAccessorFunc };
  /**
   * Event triggered when any of the sort/pagination/keyword filter changes, or
   * is triggered programmatically using triggerFilterChange() method.
   * Contains the updated filter state as the first parameter within the callback function.
   */
  public readonly onFilterChange = new Subject<FILTER>();
  /** Event emitter used for triggering manual filter change events */
  private _filterChangeTrigger = new Subject<string>();
  private readonly _MANUAL_CHANGE_TRIGGER: string = 'manual_change_trigger';
  /**
   * Initializes a new instance of CommonTableDataSource to render the stream of data within the mat table.
   * 
   * [Usage]
   * - Use the data stream passed in the constructor to update the rendered content within the table.
   * - Use the `isAllClientSideData` flag to control if the rendered content needs to be filtered on the client-side or not.
   * - If using the `MatSort` and/or `MatPaginator` directive, attach their reference to the source after they have been initialized in the view.
   *
   * The OnFilterChange() event is triggered once on initialization and every time a filter state is changed or triggerFilterChange() is called,
   * which can be used to pass new stream of data.
   * 
   * @param dataStream            The stream of data that needs to be render'd within the table, and can change overtime
   * @param filter                Optional generic filter model to persist the states of sort and paginator directives,
   *                              if not provided, uses the defaultCommonTableFilter
   * @param isAllClientSideData   True, if the stream of data contains all the unfiltered data, in which case it would
   *                              use the native sort and pagination helper methods from MatTableDataSource to filter out
   *                              the rendered records client-side. If false, no such filtering is done, as it is expected that the
   *                              filtered data would be updated through data stream.
   */
  constructor(
    public dataStream: Observable<MODEL[]>,
    public filter?: FILTER,
    public isAllClientSideData?: boolean
  ) {
    super();
    this.filter = this.filter || <FILTER>(new DefaultCommonTableFilter() as any);
    this._updateChangeSubscription();
  }
  /**
   * Subscribe to changes that should trigger an update to the table's rendered rows. When the
   * changes occur, process the current state of the filter and trigger filter change
   * which then facilitates new stream of data coming in.
   */
  private _updateChangeSubscription() {
    // Sorting and/or pagination should be watched if MatSort and/or MatPaginator are provided.
    // The events should emit whenever the component emits a change or initializes, or if no
    // component is provided, a stream with just a null event should be provided.
    // The `sortChange` and `pageChange` acts as a signal to the merge events below so that the
    // pipeline can progress to the next step. Note that the value from these streams are not used,
    // they purely act as a signal to progress in the pipeline.
    const sortChange: Observable<Sort | null | void> = this._sort ?
      merge(this._sort.sortChange, this._sort.initialized) as Observable<Sort | void> :
      of(null);
    const pageChange: Observable<PageEvent | null | void> = this._paginator ?
      merge(this._paginator.page, this._paginator.initialized) as Observable<PageEvent | void> :
      of(null);
    const keywordChange: Observable<IFilterModel | null> = this.filter.filterModelChange ?
      this.filter.filterModelChange :
      of(null);
    //merge all the filter change events
    const filterChange = merge(sortChange, pageChange, keywordChange, this._filterChangeTrigger).pipe(
      // populate the current state of filters on change
      tap((e: any) => this._updateFilters(e)),
      // provide the current state of filter
      map((e) => {
        return {
          filter: { filterModel: this.filter.filterModel, ...(this.filter as SaCommonTableFilter) } as FILTER,
          isManualTrigger: e === this._MANUAL_CHANGE_TRIGGER
        }
      }),
      // helps to suppress the multiple initial filter state events,
      // which can trigger if _updateChangeSubscription() is called in quick succession multiple times
      debounceTime(10),
      // trigger the filter change event with the current filter state
      tap(() => this.onFilterChange.next(this.filter))
    );
    // watch for base data stream or filter changes to provide a filtered set of data
    const filteredData = combineLatest(this.dataStream, filterChange)
      .pipe(map(([data]) => this._filterData(data as unknown as MODEL[])))
    // watched for filtered data changes and send the result to the table to render.
    this._renderChangesSubscription.unsubscribe();
    this._renderChangesSubscription = filteredData.subscribe(data =>{
      this._renderData.next(data);
    }) 
  }
  /**
   * Returns a filtered set of data array (for client-side data only), by applying the current state of filter
   * i.e applying sorting,paging and keyword filter states.
   * @param data  the whole set of data that needs to be filtered
   */
  private _filterData(data: MODEL[]): MODEL[] {
    if (!this.isAllClientSideData) //skip filtering if not all client-side data
      return data;
    //filter data using matTableDataSource native functions
    this._matTableDataSource.filter = this.filter.filterModel.keyword;
    let filteredData = this._matTableDataSource._filterData(data);
    this._updatePaginator(filteredData ? filteredData.length : 0);
    let sortedData = this._matTableDataSource._orderData.call(this, filteredData);
    let paginatedData = this._matTableDataSource._pageData.call(this, sortedData) as MODEL[];
    return paginatedData;
  }
  /**
   * Callback function for when any of the filter directive's state is changed,
   * updates the current state of filters
   * @param e event emitted representing the filter change
   */
  private _updateFilters(e: string | void | Sort | PageEvent | IFilterModel) {
    //sort event
    if (this.sort && e && typeof (<Sort>e).active !== 'undefined') {
      this.filter.sortCol = this.sort.active;
      this.filter.sortDir = this.sort.direction
        ? this.sort.direction == 'asc' ? SortDirection.Asc : SortDirection.Desc
        : SortDirection.None;
    }
    //page event
    if (this.paginator && e && typeof (<PageEvent>e).pageSize !== 'undefined') {
      this.filter.pageNo = this.paginator.pageIndex;
      this.filter.pageSize = this.paginator.pageSize;
    }
  }
  /**
   * Updates the paginator to reflect the length of the filtered data, and makes sure that the page
   * index does not exceed the paginator's last page.
   */
  private _updatePaginator(filteredDataLength: number) {
    const paginator = this.paginator;
    if (!paginator) { return; }
    paginator.length = filteredDataLength;
    // If the page index is set beyond the page, reduce it to the last page.
    if (paginator.pageIndex > 0) {
      const lastPageIndex = Math.ceil(paginator.length / paginator.pageSize) - 1 || 0;
      const newPageIndex = Math.min(paginator.pageIndex, lastPageIndex);
      if (newPageIndex !== paginator.pageIndex) {
        paginator.pageIndex = newPageIndex;
      }
    }
  }
  /**
   * Used by the MatTable. Called when it connects to the data source.
   */
  connect(): Observable<MODEL[]> {
     return this._renderData.asObservable();
  }
  /**
   * Used by the MatTable. Called when it is destroyed. Performs cleanup.
   */
  disconnect(): void {
    this._renderChangesSubscription.unsubscribe();
    this.onFilterChange.complete();
    this._renderData.complete();
  }
  /**
   * Method to manually trigger the OnFilterChange() event,
   * with the updated state of filter
   */
  triggerFilterChange() {
    this._filterChangeTrigger.next(this._MANUAL_CHANGE_TRIGGER);
  }
}
