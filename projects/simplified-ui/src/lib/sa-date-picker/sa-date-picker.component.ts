import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ElementRef,
  Optional,
  Self,
  HostBinding,
  ViewChild,
  Output,
  EventEmitter, LOCALE_ID, Inject
} from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { DatePickerConfig, DatePickerType } from '../models/DatePickerConfigModel';
import * as moment_ from 'moment-timezone';
const moment = moment_;
import { MOMENT_FORMATS } from '../pipes/sa-date-time.pipe';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';

@Component({
  selector: 'sa-date-picker',
  templateUrl: './sa-date-picker.component.html',
  styleUrls: ['./sa-date-picker.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: SaDatePickerComponent }]
})
export class SaDatePickerComponent
  implements ControlValueAccessor, MatFormFieldControl<Date | Date[]>, OnDestroy, OnInit {
  @ViewChild('input', { static: true }) inputRef: ElementRef;

  @Input() dateConfig: DatePickerConfig;

  dateTime = new FormControl();

  @Output() onSelection: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<MouseEvent> = new EventEmitter();

  id: string;
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(date: Date): void {
    this._empty = false;
    this.dateTime.patchValue(date);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this._empty;
  }

  onDateChange(event: any) {
    this.value = this.dateTime.value;
  }

  static nextId = 0;

  stateChanges = new Subject<void>();

  focused: boolean;
  errorState: false;
  controlType = 'app-date-picker';
  autofilled?: boolean;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  onContainerClick(event: MouseEvent): void {
    if (!this.disabled) this.click.emit(event);
    this.focused = true;
  }

  datePickerContent: any;
  @Input()
  get value(): Date | Date[] | null {
    this.datePickerContent = this.dateTime;
    if (this.datePickerContent) return this.datePickerContent;
    return null;
  }
  set value(date: Date | Date[] | null) {
    this.onSelection.emit(date);
    this.onChange(date);
    this.stateChanges.next();
  }

  private _empty = true;
  get empty() {
    return this._empty;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled) {
      this.elRef.nativeElement.setAttribute('style', 'pointer-events: none');
    } else {
      this.elRef.nativeElement.setAttribute('style', 'pointer-events: auto');
    }
    this.stateChanges.next();
  }
  private _disabled = false;

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    @Inject(LOCALE_ID) private locale: string,                /// Getting LOCALE_ID of our app. (manually set to 'en-IN' in app.module for testing)
    dateTimeAdapter: DateTimeAdapter<any>                     /// Injecting DateTimeAdapter to change date time picker's locale
  ) {
    dateTimeAdapter.setLocale(this.locale);                  // Setting our app's LOCALE_ID as date time picker's locale.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnInit() {
    this.dateTime.valueChanges.subscribe((x) => {
      if (x instanceof Array) {
        this.value = x.map((date) => this.formatDate(date));
      } else {
        this.value = this.formatDate(x);
      }
    });
  }

  private formatDate(date: Date): Date {
    let formattedDate: Date;

    switch (this.dateConfig.pickerType) {
      case DatePickerType.calendar:
        formattedDate = moment(date).format(MOMENT_FORMATS.dateA11yLabel);
        break;
      case DatePickerType.timer:
        formattedDate = moment(date).format(MOMENT_FORMATS.timePickerInput);
        break;
      case DatePickerType.both:
      default:
        formattedDate = moment(date).utc().format(MOMENT_FORMATS.full24HUTC);
        break;
    }

    return formattedDate;
  }
}
