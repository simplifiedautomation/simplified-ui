import { Component, Input, HostListener, ElementRef } from '@angular/core';
import { Subject } from "rxjs";
import { SaButton } from '../models/SaButton';

@Component({
  selector: 'sa-primary-button',
  templateUrl: './sa-primary-button.component.html',
  styleUrls: ['./sa-primary-button.component.scss']
})
export class SaPrimaryButtonComponent {

  @Input() button: SaButton;
  @Input() isDisabled: boolean = false;
  @Input() isLoading: boolean = false;

  constructor() { }

  @HostListener('click', ['$event'])
  clickHandler(evt) {
    this.button.triggerNext(evt);
  }
}
