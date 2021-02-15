import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { IGenericPageListViewModel } from './IPagerModel';
import { TemplateRef } from '@angular/core';

/**
 * Configuration class for searchable select
 *
 * @param T Data type for select options list item.
 * */
export class SaSelectConfig<T> {
  /**
   * Callback method executed everytime the end of page is reached or
   * search term is changed in the search box. It requires a callback
   * with param results as array of result objects.
   *
   * This property can be left null when server-side filter, custom
   * filter or pagination is not required. Leaving this blank would
   * make the searchable select work like a regular select with search
   * box. In that case, search would be done in all properties of
   * model.
   *
   * @param page         Page number that is requested.
   *
   * @param searchTerm   Search term entered by user in search box.
   *
   * @param callback     A callback to be called with list of results
   *                     that would be appended to the existing options
   *                     in the select drop-down. This must be called
   *                     to append results in dropdown.
   */
  getResults?: (page: number, searchTerm: string) => Observable<IGenericPageListViewModel<T>>;

  /**
   * Object Key for value attribute in mat-option.
   */
  key: string;

  /**
   * List of select Options to be populated by default.
   */
  options: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  /**
   * Text shown when no results are found for search term
   */
  emptyResultsText?: string = 'No records found';

  /**
   * Placeholder for search box
   */
  searchPlaceholder?: string = 'Search';

  /**
   * Template for mat-option UI
   */
  templateRef?: TemplateRef<any>;

  /**
   * Template for mat-select-trigger UI
   */
  triggerTemplateRef?: TemplateRef<any>;

  /**
   *  Option to enable multi select
   */
  isMultiple: boolean = false;

  /**
   *  Classes to be passed to the select panel. Supports the same syntax as ngClass.
   */
  panelClass: string = '';

  private cancelSubject: Subject<any> = new Subject();

  cancel() {
    this.cancelSubject.next();
  }

  onCancelled(): Observable<any> {
    return this.cancelSubject.asObservable();
  }

  private refreshSubject: Subject<any> = new Subject();

  refresh() {
    this.refreshSubject.next();
  }

  onRefresh(): Observable<any> {
    return this.refreshSubject.asObservable();
  }

  private valueSubject: Subject<any> = new Subject();

  setValue(x: any) {
    this.valueSubject.next(x);
  }

  onValueChange(): Observable<any> {
    return this.valueSubject.asObservable();
  }
}
