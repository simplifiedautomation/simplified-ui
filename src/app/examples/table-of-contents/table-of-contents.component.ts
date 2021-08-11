import { Component, OnInit } from '@angular/core';
import { NavigationItem } from '../../../../projects/simplified-ui/src/lib/models/NavigationItem';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss']
})
export class TableOfContentsComponent implements OnInit {

  primaryMenu: NavigationItem[] = [
    new NavigationItem('Item 1','item1','', new Observable<string>()),
    new NavigationItem('Item 2','item2','', new Observable<string>()),
    new NavigationItem('Item 3','item3','', new Observable<string>()),
  ];

  secondaryMenu: NavigationItem[] = [
    new NavigationItem('Item 1','item1','', new Observable<string>()),
    new NavigationItem('Item 2','item2','', new Observable<string>()),
    new NavigationItem('Item 3','item3','', new Observable<string>()),
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
