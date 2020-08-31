import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationItem } from '../models/NavigationItem';

@Component({
  selector: 'sa-navigable-page',
  templateUrl: './sa-navigable-page.component.html',
  styleUrls: ['./sa-navigable-page.component.scss']
})
export class SaNavigablePageComponent implements OnInit {
  @Input() primaryMenu: NavigationItem[] = [];
  @Input() secondaryMenu: NavigationItem[] = [];

  navigationList: NavigationItem[];

  panelOpenState: boolean;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.navigationList = this.primaryMenu.concat(this.secondaryMenu);
    this.route.fragment.subscribe((f) => {
      const element = document.querySelector("a[name='" + f + "']");
      if (element) {
        element.scrollIntoView();
      }
    });
  }

  ngDoCheck() {
    console.log("from page", this.primaryMenu);

    // let tempMenu = [...this.primaryMenu];
    // this.primaryMenu=null;
    // this.primaryMenu=tempMenu;
  }
}
