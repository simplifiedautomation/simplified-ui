import { Component, OnInit, OnDestroy, Input, ElementRef, Optional, Self, HostBinding, ViewChild, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { DatePickerConfig, DatePickerType } from '../models/DatePickerConfigModel';

import * as moment_ from 'moment-timezone';
const moment = moment_;
import { DateFormats } from '../pipes/sa-date-time.pipe';
import { MOMENT_FORMATS } from '../simplified-ui.module';

@Component({
  selector: 'sa-date-picker',
  templateUrl: './sa-date-picker.component.html',
  styleUrls: ['./sa-date-picker.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: SaDatePickerComponent }]
})
export class SaDatePickerComponent implements ControlValueAccessor, MatFormFieldControl<Date>, OnDestroy, OnInit {

  @ViewChild("input") inputRef: ElementRef;

  @Input() dateConfig: DatePickerConfig;

  dateTime = new FormControl();

  @Output() onSelection: EventEmitter<any> = new EventEmitter();

  id: string;
  onChange = (_: any) => { };
  onTouched = () => { };

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
  controlType = "app-date-picker";
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
    this.focused = true;
  }

  datePickerContent: any;
  @Input()
  get value(): Date | null {
    this.datePickerContent = this.dateTime;
    if (this.datePickerContent)
      return this.datePickerContent;
    return null;
  }
  set value(date: Date | null) {
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
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled)
      this.elRef.nativeElement.setAttribute("style", "pointer-events: none");
    this.stateChanges.next();
  }
  private _disabled = false;

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }


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
  }

  ngOnInit() {

    if (!this.dateConfig.dateFormat){
      if(this.dateConfig.pickerType == DatePickerType.calendar){
        this.dateConfig.dateFormat = MOMENT_FORMATS.datePickerInput;
      } else if(this.dateConfig.pickerType == DatePickerType.timer){
        this.dateConfig.dateFormat = MOMENT_FORMATS.timePickerInput;
      } else if(this.dateConfig.pickerType == DatePickerType.both){
        this.dateConfig.dateFormat = MOMENT_FORMATS.fullPickerInput;
      } 
    }

    this.dateTime.valueChanges.subscribe(x=>{
      this.value = moment(x).format(this.dateConfig.dateFormat);
    })
  }

}
