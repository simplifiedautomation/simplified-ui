import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IHeaderViewModel } from '../models/HeaderViewModels'

@Component({
  selector: 'sa-header',
  templateUrl: './sa-header.component.html',
  styleUrls: ['./sa-header.component.scss']
})
export class SaHeaderComponent{

  @Input() header: IHeaderViewModel;
  @Output() primaryClick: EventEmitter<Event> = new EventEmitter();
  @Output() secondaryClick: EventEmitter<Event> = new EventEmitter();
  
  constructor() { }

  onPrimaryClick(event: Event){
    this.primaryClick.emit(event)
  }

  onSecodaryClick(event: Event){
    this.secondaryClick.emit(event)
  }

}
