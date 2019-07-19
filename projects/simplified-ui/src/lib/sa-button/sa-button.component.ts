import { Component, OnInit, Input } from '@angular/core';
import { ActionElementConfig } from '../models/ActionElementConfig';

@Component({
  selector: 'sa-button',
  templateUrl: './sa-button.component.html',
  styleUrls: ['./sa-button.component.scss']
})
export class SaButtonComponent implements OnInit {

  @Input() config: SaButtonConfig;

  buttonType = SaButtonType;

  constructor() { }

  ngOnInit() {
  }

  onClick(evt: Event) {
    this.config.clickSubject.next(evt);
  }

}

export class SaButtonConfig extends ActionElementConfig {
  isDisabled: boolean = false;
  isSpinning: boolean = false;
  type: SaButtonType = SaButtonType.Primary;
  loadingText: string;
}

export enum SaButtonType {
  Primary,
  Secondary,
  Anchor
}
