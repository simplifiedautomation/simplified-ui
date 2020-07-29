import { Component, OnInit, Input, Output, EventEmitter, HostBinding, Optional, Self, ElementRef, ViewChild, DoCheck, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatSelectChange } from '@angular/material/select';
import { NgControl, ControlValueAccessor, FormControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SaSelectConfig } from '../models/SaSelectModels';

@Component({
  selector: 'sa-select',
  templateUrl: './sa-select.component.html',
  styleUrls: ['./sa-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: SaSelectComponent }]
})
/**
* A searchable and paginated select component that can be
* used when local or server-side searching and pagination
* is needed in select elements.
*
* For client side data, search feature automatically works
* on the options data model that is passed. Search term is
* matched with any value in all keys in model.
*
* @type SearchableSelectOptionComponent
*/
export class SaSelectComponent<T> implements OnInit, DoCheck, MatFormFieldControl<T>, ControlValueAccessor {

  matSelect = new FormControl();

  /**
   * Configuration object for select element
   *
   * @param T Data type of select options list item.
   */
  @Input() config: SaSelectConfig<T>;

  @Output() selectionChange: EventEmitter<MatSelectChange> = new EventEmitter();
  /**
   * Behaviour subject for changes in options based on search term
   * and pagination.
   *
   * This is also the output property that will be used to build
   * mat-option view elements whenever options are changed due to
   * search or pagination.
   */
  private _selectOptions = new BehaviorSubject<T[]>([]);
  public selectOptions = new BehaviorSubject<T[]>([]);

  private didFilter = false;
  searchTerm: string = "";
  private searchTermSubject = new Subject<string>();
  private _isWaitingResultsCallback = false;
  public showSpinner = false;

  private originalData: T[] = []
  private resultCallbackSubscription: Subscription = new Subscription();
  private totalRecords: number;
  page = 0;

  private _placeholder: string;
  private _panelClass: string;
  static nextId = 0;
  stateChanges = new Subject<void>();
  focused: boolean = false;
  errorState = false;
  controlType = "app-searchable-select";
  autofilled?: boolean;
  private _empty = true;
  private _disabled = false;
  id: string;
  private _required = false;

  @ViewChild("matSelectRef", { static: true }) matSelectRef;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(@Optional() @Self() public ngControl: NgControl, private fm: FocusMonitor, private elRef: ElementRef<HTMLElement>) {
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    this._selectOptions.subscribe(x => {
      if (this.didFilter) {
        this.didFilter = false;
        this.originalData = x;
        this.selectOptions.next(this.originalData);
        return;
      }
      this.originalData = [...this.originalData, ...x];
      this.selectOptions.next(this.originalData);
      return;
    });

    this.config = new SaSelectConfig<any>();
  }

  public get isComplete(): boolean {
    return this.originalData.length >= this.totalRecords;
  }

  ngOnInit() {
    let time = this.isGetResultsCallbackNull() ? 0 : 500;
    this.searchTermSubject.asObservable()
      .pipe(debounceTime(time))
      .subscribe(_ => {
        this._isWaitingResultsCallback = false;
        this.resultCallbackSubscription.unsubscribe();
        this.getNextBatch();
      });

    this.config.options.subscribe(x => {
      this.didFilter = true;
      this.totalRecords = x.length;
      this._selectOptions.next(x);
      this.page = 0;
      if (!this.isGetResultsCallbackNull()) {
        this.getNextBatch();
      }
    });

    if (!this.isGetResultsCallbackNull()) {
      this.getNextBatch();
    }

    this.config.onCancelled().subscribe(x => {
      this._isWaitingResultsCallback = false;
      this.resultCallbackSubscription.unsubscribe();
    });

    this.config.onRefresh().subscribe(_ => {
      this.searchTerm = "";
      this.filterRecords();
    })
  }

  clicked(event: MouseEvent): void {
    event.stopPropagation();
  }


  searchTermChanged(event: KeyboardEvent): void {
    event.stopPropagation();
    this.filterRecords();
  }

  private filterRecords(): void {
    // Do not show spinner when data is client side.
    this.showSpinner = !this.isGetResultsCallbackNull();

    this.page = 0;
    this.searchTerm = this.searchTerm.toLowerCase();
    this.didFilter = true;

    // Do not empty the options when data is client side.
    // Previous options are removed automatically when next
    // time `selectOptions` subject is observed with `didFilter`
    // flag set to true.
    if (this.value instanceof Array) {
      this._selectOptions.next(<Array<T>>this.value);
    } else {
      if (!this.isGetResultsCallbackNull()) {
        let val = this.value ? [this.value] : [];
        this._selectOptions.next(val);
      }
    }

    this.searchTermSubject.next();
  }

  getNextBatch() {
    if (this._isWaitingResultsCallback)
      return;

    // Do not show spinner when data is client side.
    this.showSpinner = !this.isGetResultsCallbackNull();

    if (this.isGetResultsCallbackNull()) {
      var filteredData = this.config.options.value.filter(x => {
        for (let key in x) {
          if (x[key] && x[key].toString().toLowerCase().indexOf(this.searchTerm) > -1) {

            // Check required when client side multiple select is enable to remove duplicates.
            if (this.value instanceof Array) {
              return !(this.value.indexOf(x) > -1);
            }

            return true;
          }
        }
        return false;
      });

      this._selectOptions.next(filteredData);
      this.totalRecords = filteredData.length;
      return;
    }

    this._isWaitingResultsCallback = true;
    this.resultCallbackSubscription = this.config.getResults(this.page, this.searchTerm)
      .subscribe(result => {
        this.showSpinner = false;
        this._isWaitingResultsCallback = false;
        this._selectOptions.next(result.List);
        this.totalRecords = result.Pager.TotalRecords;
        this.page++;
      });
  }

  private isGetResultsCallbackNull(): boolean {
    return this.config.getResults == null;
  }

  onSelect(event: MatSelectChange) {
    this.value = event.value;
    this.selectionChange.emit(event);
  }

  selectOpenChanged(opened: boolean) {
    if (!opened && this.searchTerm.trim() != "") {
      this.config.refresh();
    }

    if (opened && !this.value) {
      this.searchInput.nativeElement.focus();
    }
  }

  writeValue(value: any): void {
    if (value != null)
      this._empty = false;
    this.value = value;
  }

  private _value: T;
  get value(): T {
    return this._value;
  }

  set value(val: T) {
    this._value = val;
    if (this._value != null || (this._value != null && (<any>this._value).length > 0))
      this._empty = false;
    else
      this._empty = true;


    this.matSelectRef.value = val;
    this.matSelect.setValue(val);

    this.onChange(val);
    this.stateChanges.next();
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = this.ngControl.invalid && this.ngControl.touched;
      this.stateChanges.next();
    }
  }
  markAsTouched() {
    if (this.ngControl != undefined && this.ngControl != null)
      this.ngControl.control.markAsTouched();
  }
  @Output() onSelection: EventEmitter<any> = new EventEmitter();

  onChange = (_: any) => { };
  onTouched = () => { };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled) {
      this.elRef.nativeElement.setAttribute("style", "pointer-events: none");
    } else {
      this.elRef.nativeElement.setAttribute("style", "pointer-events: auto");
    }

    this.stateChanges.next();
  }

  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this._empty;
  }

  get empty() {
    return this._empty;
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  @Input()
  get panelClass() {
    return this._panelClass;
  }

  set panelClass(panelClass) {
    this._panelClass = panelClass;
    this.stateChanges.next();
  }

  onContainerClick(event: MouseEvent): void {
    this.focused = true;
  }

}
