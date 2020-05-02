import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationItem } from '../models/NavigationItem';

const SMALL_WIDTH_BREAKPOINT = 720;
@Component({
  selector: 'sa-navigable-page',
  templateUrl: './sa-navigable-page.component.html',
  styleUrls: ['./sa-navigable-page.component.scss']
})
export class SaNavigablePageComponent implements OnInit {

  @Input() primaryMenu: NavigationItem[] = [];
  @Input() secondaryMenu: NavigationItem[] = [];

  navigationList: NavigationItem[];

  private mediaMatcher: MediaQueryList =
    matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  constructor(zone: NgZone, private route: ActivatedRoute) {
    this.mediaMatcher.addListener(mql =>
      zone.run(() => this.mediaMatcher = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`)));
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  };

  ngOnInit() {
    this.navigationList = this.primaryMenu.concat(this.secondaryMenu);
    this.route.fragment.subscribe(f => {
      const element = document.querySelector("a[name='" + f + "']")
      if (element) {
        element.scrollIntoView();
      }
    })
  }

}
