import { Component, Input, HostListener } from '@angular/core';
import { SaButton } from '../models/SaButton';

@Component({
  selector: 'sa-secondary-button',
  templateUrl: './sa-secondary-button.component.html',
  styleUrls: ['./sa-secondary-button.component.scss']
})
export class SaSecondaryButtonComponent
{

  @Input() button: SaButton;
  @Input() isDisabled: boolean = false;
  @Input() isLoading: boolean = false;

  constructor() { }

  @HostListener('click', ['$event'])
  clickHandler(evt) {
    this.button.triggerNext(evt);
  }
}
