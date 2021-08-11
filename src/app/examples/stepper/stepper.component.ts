/*
- Can add a form control to our stepper component. Will provide us ability to enable/disable, mark are required etc.
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { SaStepperComponent } from '../../../../projects/simplified-ui/src/lib/sa-stepper/sa-stepper.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  onValueChange(event) {
    console.log("Value Changed to : ",event)
  }



}
