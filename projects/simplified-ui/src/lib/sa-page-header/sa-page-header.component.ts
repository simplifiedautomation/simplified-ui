import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { IHeaderViewModel } from '../models/HeaderViewModels';

@Component({
  selector: 'sa-page-header',
  templateUrl: './sa-page-header.component.html',
  styleUrls: ['./sa-page-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaPageHeaderComponent implements OnInit {
  @Input() header: IHeaderViewModel;
  @Output() primaryClick: EventEmitter<Event> = new EventEmitter();
  @Output() secondaryClick: EventEmitter<Event> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onPrimaryClick(event: Event) {
    this.primaryClick.emit(event);
  }

  onSecodaryClick(event: Event) {
    this.secondaryClick.emit(event);
  }
}
