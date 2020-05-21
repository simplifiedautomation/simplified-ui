import { Component, OnDestroy, ViewChild, ElementRef, Input, Optional, Self, OnInit, Inject, LOCALE_ID, DoCheck } from '@angular/core';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { debounceTime } from 'rxjs/operators';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ControlValueAccessor, FormControl, NgControl, Validators } from '@angular/forms';
import { symbolFormatEnum } from '../pipes/sa-value-formatter.pipe';


@Component({
  selector: 'sa-currency-input',
  templateUrl: './sa-currency-input.component.html',
  styleUrls: ['./sa-currency-input.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: SaCurrencyInputComponent }]
})
export class SaCurrencyInputComponent implements ControlValueAccessor, MatFormFieldControl<any>, OnInit, OnDestroy, DoCheck {

  @ViewChild("input", { static: false }) inputRef: ElementRef;

  static nextId = 0;
  private decimalSeparator: string;
  public currencyValue = new FormControl();
  stateChanges = new Subject<void>();
  private _value: any;
  private viewValue: string;
  focused = false;
  errorState = false;
  controlType = 'currency-input';
  id = `currency-input-${SaCurrencyInputComponent.nextId++}`;
  describedBy = '';
  onChange = (_: any) => { };
  onTouched = () => { };
  private _empty = true;
  private symbol: string;
  private _disabled = false;
  private _placeholder: string;


  constructor(private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl,
    @Inject(LOCALE_ID) private locale: string) {
    this.decimalSeparator = '.';
    this.symbol = getCurrencySymbol("USD", symbolFormatEnum.narrow, this.locale)
    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        if (this.viewValue) {
          if (this.parse(this.viewValue))
            this.currencyValue.patchValue(formatCurrency(parseFloat(this.parse(this.viewValue)), this.locale, this.symbol));
          else this.currencyValue.patchValue('');
        }
        this.onTouched();
      } else {
        if (this._value) {
          this.currencyValue.patchValue(this.parse(this._value));
        }
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    this.currencyValue.valueChanges.pipe(debounceTime(200)).subscribe(num => {
      this.viewValue = num;
      this.value = this.parse(num);
    });
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = this.ngControl.invalid && this.ngControl.touched;
      this.stateChanges.next();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  get empty() {
    return this._empty;
  }

  get shouldLabelFloat() { return this.focused || !this.empty; }

  @Input()
  get placeholder(): string { return this._placeholder; }
  set placeholder(d: string) {
    this._placeholder = d;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.currencyValue.disable() : this.currencyValue.enable();
    this.stateChanges.next();
  }


  @Input()
  get value(): string | null {
    return this._value;
  }

  set value(val: string | null) {
    this._value = val;
    if (this._value != null && this._value !== "" && this._value >= 0) {
      this._empty = false;
    }
    else {
      this._empty = true;
    }
    this.onChange(this._value);
    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) { }

  writeValue(val: string | null): void {
    if(val != null){
      this._empty = false;
      this.currencyValue.patchValue(formatCurrency(parseFloat(val), this.locale, this.symbol));
    }
    this.value = val;
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

  _handleInput(): void {
    this.onChange(this.currencyValue.value);
  }

  parse(value: string, allowNegative = false) {
    let [integer, fraction = ''] = (value.toString() || '').split(this.decimalSeparator);
    integer = integer.replace(new RegExp(/[^\d\.]/, 'g'), '');
    fraction = parseInt(fraction, 10) > 0 && 2 > 0 ? this.decimalSeparator + (fraction + '000000').substring(0, 2) : '';
    if (allowNegative && value.startsWith('(') && value.endsWith(')')) {
      return (-1 * parseFloat(integer + fraction)).toString();
    } else {
      return integer + fraction;
    }
  }

}
