import {
  Component,
  DoCheck,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { debounceTime } from 'rxjs/operators';
import {
  CurrencyPipe,
  getLocaleCurrencyCode, getLocaleCurrencySymbol,
  getLocaleNumberFormat,
  NumberFormatStyle,
  registerLocaleData
} from '@angular/common';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

@Component({
  selector: 'sa-currency-input',
  templateUrl: './sa-currency-input.component.html',
  styleUrls: ['./sa-currency-input.component.scss'],
  providers: [
    CurrencyPipe,
    { provide: MatFormFieldControl, useExisting: SaCurrencyInputComponent },
  ]
})
export class SaCurrencyInputComponent implements ControlValueAccessor, MatFormFieldControl<any>, OnInit, OnDestroy, DoCheck {
  @ViewChild('input') inputRef: ElementRef;

  static nextId = 0;

  private decimalSeparator;
  private groupSeparator;

  public currencyValue = new FormControl();
  stateChanges = new Subject<void>();
  private _value: any;
  focused = false;
  errorState = false;
  controlType = 'currency-input';
  id = `currency-input-${SaCurrencyInputComponent.nextId++}`;
  describedBy = '';
  private _empty = true;
  private _disabled = false;
  private _placeholder: string;

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(private _focusMonitor: FocusMonitor, private _elementRef: ElementRef<HTMLElement>, @Optional() @Self() public ngControl: NgControl, @Inject(LOCALE_ID) private locale: string,private currencyPipe: CurrencyPipe) {

    console.log('Locale : ', this.locale);
    console.log('Currency Code : ', getLocaleCurrencyCode(this.locale));
    console.log('Data : ', Intl.NumberFormat(this.locale).formatToParts(100000.123));

    this.groupSeparator = Intl.NumberFormat(this.locale).formatToParts(100000.123)[1].value;
    this.decimalSeparator = Intl.NumberFormat(this.locale).formatToParts(100000.123)[3].value;

    _focusMonitor.monitor(_elementRef, true).subscribe((origin) => {

      if(this.currencyValue.value != null) {
        if (origin) {
          this.currencyValue.setValue(this.parse(this.currencyValue.value.replace(getLocaleCurrencySymbol(this.locale), '')));
        }
        else {
          this.currencyValue.setValue(currencyPipe.transform(this.parse(this.currencyValue.value), getLocaleCurrencyCode(this.locale)));
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
    this.currencyValue.valueChanges.pipe(debounceTime(200)).subscribe((num) => {});
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

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(d: string) {
    this._placeholder = d;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
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
    if (this._value != null && this._value !== '' && this._value >= 0) {
      this._empty = false;
    } else {
      this._empty = true;
    }
    this.onChange(this._value);
    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {}

  writeValue(val: string | null): void {
    if (val != null) {
      this._empty = false;
      this.currencyValue.setValue(this.currencyPipe.transform(this.parse(val),getLocaleCurrencyCode(this.locale)))
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
    console.log("Value : ", value);
    console.log("Value Contains : ", value.includes(','));
    let [integer, fraction = ''] = (value.toString() || '').split(this.decimalSeparator);
    integer = integer.replace(new RegExp(/[^\d\.]/, 'g'), '');
    integer = integer.replaceAll(this.groupSeparator,'');
    console.log('Fraction : ', fraction);
    fraction = parseInt(fraction, 10) > 0 && 2 > 0 ? this.decimalSeparator + (fraction + '000000').substring(0, 2) : '';
    if (allowNegative && value.startsWith('(') && value.endsWith(')')) {
      return (-1 * parseFloat(integer + fraction)).toString();
    } else {
      return integer + fraction;
    }
  }
}
