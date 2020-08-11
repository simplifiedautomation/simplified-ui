import { Component, HostListener, Input } from '@angular/core';
import { SaButton } from '../models/SaButton';

@Component({
  selector: 'sa-anchor-button',
  templateUrl: './sa-anchor-button.component.html',
  styleUrls: ['./sa-anchor-button.component.scss']
})
export class SaAnchorButtonComponent {
  @Input() button: SaButton;
  @Input() isDisabled: boolean = false;
  @Input() isLoading: boolean = false;

  constructor() {}

  @HostListener('click', ['$event'])
  clickHandler(evt) {
    this.button.triggerNext(evt);
  }
}
