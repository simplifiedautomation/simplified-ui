import { Component, OnInit, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ActionElementConfig } from '../models/ActionElementConfig';

@Component({
  selector: 'sa-more-menu',
  templateUrl: './sa-more-menu.component.html',
  styleUrls: ['./sa-more-menu.component.scss']
})
export class SaMoreMenuComponent implements OnInit {
  @Input() items: SaMoreMenuItem[] = [];

  constructor() {}

  ngOnInit() {}
}

export class SaMoreMenuItem extends ActionElementConfig {}
