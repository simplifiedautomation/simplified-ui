import { BehaviorSubject, Observable } from 'rxjs';
import { IFilterModel } from './DataFilterModels';

/**
 * Interface used for the common table filter,
 * used inside CommonTableDataSource for persisting filter states
 */
export interface SaCommonTableFilter {
  /** The zero-based page index of the displayed list of items. Defaulted to 0. */
  pageNo?: number;
  /** Number of items to display on a page. By default set to 100. */
  pageSize?: number;
  /** The id of the most recently sorted table column. Defaulted to 0. */
  sortCol?: string | number;
  /** The sort direction of the currently sorted column. Defaults to ascending */
  sortDir?: SortDirection;
  /** Term that should be used to filter out objects from the data array */
  filterModel?: IFilterModel;
  /** Stream to represent when the keyword has been updated */
  filterModelChange?: Observable<IFilterModel>;
}

//move to separate enum file

/** Sort Direction enum */
export enum SortDirection {
  /** Ascending sort order */
  Asc,
  /** Descending sort order */
  Desc,
  /** Unsorted state, used by angular material sort header if 'matSortDisableClear' flag is not set*/
  None
}

/** Defaults for the CommonTableFilter */
export class DefaultCommonTableFilter implements SaCommonTableFilter {
  pageNo = 0;
  pageSize = 20;
  sortCol = 0;
  sortDir = SortDirection.Desc;
  /** Term that should be used to filter out objects from the data array
   * Note: setting keyword trigger's keywordChange event*/
  get filterModel(): IFilterModel {
    return this.filterModelChange.value;
  }
  set filterModel(model: IFilterModel) {
    this.filterModelChange.next(model);
  }
  filterModelChange = new BehaviorSubject<IFilterModel>({
    keyword: ''
  });

  /**
   * Provides a new instance of the CommonTableFilter with the configured default values.
   *
   * @param override optional function, to override any of the default values for this instance
   */
  constructor(override?: (instance: DefaultCommonTableFilter) => void) {
    if (override) {
      override(this);
    }
  }
}
