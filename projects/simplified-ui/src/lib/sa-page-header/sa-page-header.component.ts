import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IHeaderViewModel } from '../models/HeaderViewModels';

@Component({
  selector: 'sa-page-header',
  templateUrl: './sa-page-header.component.html',
  styleUrls: ['./sa-page-header.component.scss']
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
