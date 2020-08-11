import { IRequestModel } from './DataTableModel';
import { IFilterModel } from './DataFilterModels';
import { SortDirection } from './SaTableDataSource';

export class RequestModel implements IRequestModel {
  filter: IFilterModel;
  pageNumber: number;
  pageSize: number;
  sortCol: string | number;
  sortDir: SortDirection;

  constructor(
    filter: IFilterModel = { keyword: '' },
    pageNumber: number = 0,
    pageSize: number = 20,
    sortCol: string | number = 0,
    sortDir: SortDirection = SortDirection.Asc
  ) {
    this.filter = filter;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.sortCol = sortCol;
    this.sortDir = sortDir;
  }
}
