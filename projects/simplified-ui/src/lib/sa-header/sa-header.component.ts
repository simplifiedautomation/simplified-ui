import { Component, Input } from '@angular/core';
import { IHeaderViewModel } from '../models/HeaderViewModels'

@Component({
  selector: 'sa-header',
  templateUrl: './sa-header.component.html',
  styleUrls: ['./sa-header.component.scss']
})
export class SaHeaderComponent{

  @Input() header: IHeaderViewModel;
  constructor() { }

}
