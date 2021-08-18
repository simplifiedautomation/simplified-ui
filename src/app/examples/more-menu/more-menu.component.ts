import { Component, OnInit } from '@angular/core';
import { SaMoreMenuItem } from '../../../../projects/simplified-ui/src/lib/sa-more-menu/sa-more-menu.component';

@Component({
  selector: 'app-more-menu',
  templateUrl: './more-menu.component.html',
  styleUrls: ['./more-menu.component.scss']
})
export class MoreMenuComponent implements OnInit {

  itemList: SaMoreMenuItem[] = [
    new SaMoreMenuItem('title 1'),
    new SaMoreMenuItem('title 2')
  ];

  constructor() { }

  ngOnInit(): void {

    this.itemList[0].data = "Item 1 Page Data";
    this.itemList[1].data = "Item 2 Page Data";

    this.itemList[0].onClick.subscribe((_) => {
      console.log('Item 1 Clicked with data : ',this.itemList[0].data);
    })

    this.itemList[1].onClick.subscribe((_) => {
      console.log('Item 2 Clicked with data : ',this.itemList[1].data);
    })

  }

}
