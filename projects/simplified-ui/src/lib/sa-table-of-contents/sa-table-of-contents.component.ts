import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { NavigationItem } from '../models/NavigationItem';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sa-table-of-contents',
  templateUrl: './sa-table-of-contents.component.html',
  styleUrls: ['./sa-table-of-contents.component.scss']
})
export class SaTableOfContentsComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() primaryMenu: NavigationItem[] = [];
  @Input() secondaryMenu: NavigationItem[] = [];

  private primaryMenuSubscription: Subscription[] = [];
  private secondaryMenuSubscription: Subscription[] = [];

  scrollListener: Subscription;

  href: string = '';
  currentRoute: string;

  constructor(private scrollDispatcher: ScrollDispatcher, private zone: NgZone, private route: ActivatedRoute) {}

  ngOnInit() {
    this.href = window.location.pathname;
  }

  ngAfterViewInit() {
    if (this.primaryMenu.length) {
      this.currentRoute = this.primaryMenu[0].route;
    } else if (this.secondaryMenu.length) {
      this.currentRoute = this.secondaryMenu[0].route;
    }

    this.primaryMenu.forEach((menuItem) => {
      this.primaryMenuSubscription.push(this.subscribeNavigableMenu(menuItem));
    });
    this.secondaryMenu.forEach((menuItem) => {
      this.secondaryMenuSubscription.push(this.subscribeNavigableMenu(menuItem));
    });

    if (this.scrollListener) this.scrollListener.unsubscribe();

    this.scrollListener = this.scrollDispatcher.scrolled(25).subscribe((x) => {
      if (x) {
        let scroll_start = x['elementRef'].nativeElement.scrollTop;
        let scrollHeight = scroll_start + 120;

        this.zone.run((_) => {
          let itemOffsets = this.getItemOffsets();
          for (let i = 0; i < itemOffsets.length; i++) {
            if (scroll_start <= itemOffsets[0].top - 66) {
              this.triggerEvent(itemOffsets[0].route);
            } else if (scrollHeight >= itemOffsets[itemOffsets.length - 1].top) {
              this.triggerEvent(itemOffsets[itemOffsets.length - 1].route);
            } else if (scrollHeight >= itemOffsets[i].top && scrollHeight < itemOffsets[i + 1]?.top) {
              this.triggerEvent(itemOffsets[i].route);
            }
          }
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.primaryMenu != undefined && changes.primaryMenu != null) {
      if (changes.primaryMenu.previousValue != undefined) {
        changes.primaryMenu.previousValue.forEach((x: NavigationItem) => {
          this.primaryMenuSubscription.forEach((y: Subscription) => {
            y.unsubscribe();
          });
        });

        this.primaryMenuSubscription = [];
      }

      changes.primaryMenu.currentValue.forEach((x: NavigationItem) => {
        this.primaryMenuSubscription.push(this.subscribeNavigableMenu(x));
      });
    }

    if (changes.secondaryMenu != undefined && changes.secondaryMenu != null) {
      if (changes.secondaryMenu.previousValue != undefined) {
        changes.secondaryMenu.previousValue.forEach((x: NavigationItem) => {
          this.secondaryMenuSubscription.forEach((y: Subscription) => {
            y.unsubscribe();
          });
        });

        this.secondaryMenuSubscription = [];
      }
      changes.secondaryMenu.currentValue.forEach((x: NavigationItem) => {
        this.secondaryMenuSubscription.push(this.subscribeNavigableMenu(x));
      });
    }

    if (changes.primaryMenu || changes.secondaryMenu) {
      let route = this.route.snapshot.fragment;
      const element = document.querySelector("a[name='" + route + "']");

      if (element) {
        this.currentRoute = route;
        element.scrollIntoView();
        this.triggerEvent(route);
      }
    }
  }

  ngOnDestroy() {
    if (this.scrollListener) this.scrollListener.unsubscribe();
  }

  private subscribeNavigableMenu(menuItem: NavigationItem): Subscription {
    return menuItem.obs$.subscribe((result) => {
      this.currentRoute = result;
    });
  }

  getItemOffsets() {
    const that = this;
    let itemOffsets = [];
    this.primaryMenu.forEach((item) => {
      var top = that.getDistanceFromTop(document.querySelector('a[name="' + item.route + '"]'));
      let itemOffset = {
        top: top,
        route: item.route
      };
      itemOffsets.push(itemOffset);
    });
    this.secondaryMenu.forEach((item) => {
      var top = that.getDistanceFromTop(document.querySelector('a[name="' + item.route + '"]'));
      let itemOffset = {
        top: top,
        route: item.route
      };
      itemOffsets.push(itemOffset);
    });

    return itemOffsets;
  }

  getDistanceFromTop(element) {
    var top = 0;

    while (element) {
      top += element.offsetTop;
      element = element.offsetParent;
    }

    return top;
  }

  triggerEvent(route: string) {
    const menuItem =
      this.primaryMenu.find((x) => x.route === route) || this.secondaryMenu.find((x) => x.route === route);
    menuItem?.triggerNext();
  }
}
