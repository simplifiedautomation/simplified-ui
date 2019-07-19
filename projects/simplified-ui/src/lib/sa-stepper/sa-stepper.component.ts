import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sa-stepper',
  templateUrl: './sa-stepper.component.html',
  styleUrls: ['./sa-stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SaStepperComponent implements OnInit {

  @Input() value: number;
  @Input() min: number;
  @Input() max: number;
  @Input() label: string;

  @Output() valueChanged: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  increment() {
    if (this.value < this.max) {
      this.value++;
      this.valueChanged.emit(this.value);
    }
  }

  decrement() {
    if (this.value > this.min) {
      this.value--;
      this.valueChanged.emit(this.value);
    }
  }

}
