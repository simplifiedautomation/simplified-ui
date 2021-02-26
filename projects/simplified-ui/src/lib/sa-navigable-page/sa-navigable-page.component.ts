import { Component, OnInit, Input, NgZone } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  viewPortSize$: Observable<string>;

  constructor(private mediaObserver$: MediaObserver, private route: ActivatedRoute) {
    mediaObserver$.media$.subscribe();
    this.viewPortSize$ = mediaObserver$.media$.pipe(
      map((change: MediaChange) => {
        return change.mqAlias;
      })
    );
  }

  ngOnInit() {
    this.navigationList = this.primaryMenu.concat(this.secondaryMenu);
    this.route.fragment.subscribe((f) => {
      const element = document.querySelector("a[name='" + f + "']");
      if (element) {
        element.scrollIntoView();
      }
    });
  }
}
