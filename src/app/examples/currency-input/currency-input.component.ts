import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SaCurrencyInputComponent } from '../../../../projects/simplified-ui/src/lib/sa-currency-input/sa-currency-input.component';

@Component({
  selector: 'app-currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss']
})
export class CurrencyInputComponent implements OnInit, AfterViewInit {

  formControl: FormControl = new FormControl({value: '234',disabled: true},[Validators.required]);

  @ViewChild(SaCurrencyInputComponent) saCurrencyInputComponent: SaCurrencyInputComponent;

  constructor() { }

  ngAfterViewInit(): void {
      console.log("Currency Value : ",this.saCurrencyInputComponent.currencyValue);
      console.log("Control Type : ",this.saCurrencyInputComponent.controlType);
  }

  ngOnInit(): void {  }

  toggleState() {
    this.formControl.disabled ? this.formControl.enable() : this.formControl.disable();
  }

  resetValue() {
    this.formControl.setValue('');
  }

}



/*

Bugs :

- Setting initial value through html 'value' is not optimized to parse it to currency.
- Reseting value to empty dynamically is not handled well (Try the reset button)


Note :
- required, disabled, value can also be set through html attributes too just like normal textfield.
*/
