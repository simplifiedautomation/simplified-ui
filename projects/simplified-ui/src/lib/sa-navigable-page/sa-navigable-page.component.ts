import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResizeObserver as Polyfill } from '@juggle/resize-observer';
import { NavigationItem } from '../models/NavigationItem';

const ResizeObserver = (window as any).ResizeObserver || Polyfill;

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

  resizeObserver: Polyfill;

  constructor(private mediaObserver$: MediaObserver, private route: ActivatedRoute, private host: ElementRef) {
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

  ngAfterViewInit() {
    let pageContent = this.host.nativeElement.querySelector('.page-body  .mat-drawer-content');
    let subHeader = this.host.nativeElement.querySelector('.sub-header');
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (subHeader) {
          subHeader['style'].width = pageContent.getBoundingClientRect().width + 'px';
          subHeader['style'].left = pageContent.getBoundingClientRect().x + 'px';
        }
      });
    });

    if (pageContent) this.resizeObserver.observe(pageContent);
  }

  ngOnDestroy() {
    this.resizeObserver.unobserve(this.host.nativeElement.querySelector('.page-body'));
  }
}
