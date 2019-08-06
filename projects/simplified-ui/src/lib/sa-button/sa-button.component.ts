import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'sa-button',
  templateUrl: './sa-button.component.html',
  styleUrls: ['./sa-button.component.scss'],
  animations: [
    trigger('Fading', [
      state('false', style({ opacity: 1 })),
      state('true', style({ opacity: 0 })),
      transition('false => true', animate('800ms ease-out')),
    ])]
})
export class SaButtonComponent {

  @Input() config: SaButtonConfig;
  @Output() onClick: EventEmitter<Event> = new EventEmitter();

  buttonType = SaButtonType;

  showCheckmark: boolean;

  showAnimation: boolean = false;

  constructor() { }

  @Input() set isDisabled(val: boolean) {
    this.config.isDisabled = val;
  }

  get isDisabled(): boolean {
    return this.config.isDisabled;
  }

  ngOnInit() {
    this.config.loadingStopped.subscribe(res => {
      if (res) {
        this.showCheckmark = true;
        setTimeout(() => {
          this.showAnimation = true;
          setTimeout(() => {
            this.showCheckmark = false;
            this.showAnimation = false;
          }, 800);
        }, 1600);
      }
    })
  }

  onButtonClick(evt: Event) {
    this.onClick.emit(evt);
  }

}

export class SaButtonConfig {
  isDisabled: boolean = false;
  type: SaButtonType = SaButtonType.Primary;
  loadingText: string;

  private _isSpinning: boolean = false;
  get isSpinning(): boolean {
    return this._isSpinning;
  }
  set isSpinning(val: boolean) {
    if (this._isSpinning == true && val == false) {
      this.loadingSubject.next(true);
    }
    this._isSpinning = val;
  }

  private loadingSubject: Subject<boolean> = new Subject();

  get loadingStopped(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  constructor(public title: string) { }
}

export enum SaButtonType {
  Primary,
  Secondary,
  Anchor
}
