import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sa-button',
  templateUrl: './sa-button.component.html',
  styleUrls: ['./sa-button.component.scss']
})
export class SaButtonComponent {

  @Input() config: SaButtonConfig;
  @Output() click: EventEmitter<Event> = new EventEmitter();

  buttonType = SaButtonType;

  constructor() { }

  @Input() set isDisabled(val: boolean) {
    this.config.isDisabled = val;
  }

  get isDisabled(): boolean {
    return this.config.isDisabled;
  }


  ngOnInit() {
  }

  onClick(evt: Event) {
    this.click.emit(evt);
  }

}

export class SaButtonConfig {
  isDisabled: boolean = false;
  isSpinning: boolean = false;
  type: SaButtonType = SaButtonType.Primary;
  loadingText: string;

  constructor(public title: string){}
}

export enum SaButtonType {
  Primary,
  Secondary,
  Anchor
}
