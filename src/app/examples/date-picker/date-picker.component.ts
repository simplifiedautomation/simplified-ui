/*
Bugs :
- Label not floating when value if filled and is unfocused. Or gets unfocused during date selection and overlaps the pre-selected date.

 */


import { Component, OnInit } from '@angular/core';
import {
  DatePickerConfig,
  DatePickerMode,
  DatePickerType
} from '../../../../projects/simplified-ui/src/lib/models/DatePickerConfigModel';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  formControl: FormControl = new FormControl({value: '',disabled: true},[Validators.required]);

  dateConfig: DatePickerConfig;

  constructor() {
    this.dateConfig = new DatePickerConfig();
  }

  ngOnInit(): void {
    this.dateConfig.min = new Date(2021, 5,10);
    this.dateConfig.max = new Date(2021,12,24);
    this.dateConfig.pickerMode = DatePickerMode.dialog; // DatePickerMode.popup
    this.dateConfig.pickerType = DatePickerType.timer;  // DatePickerType.calender | DatePickerType.both
    this.formControl.valueChanges.subscribe((val) => {
      console.log("Form value changed : ",val);
    })
  }

  onDateSelection(event) {
    console.log("New selected date : ",event);
  }

  toggleState() {
    this.formControl.disabled ? this.formControl.enable() : this.formControl.disable();
  }

  resetValue() {
    this.formControl.setValue('');
  }

}
