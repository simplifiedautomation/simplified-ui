import { Component, ElementRef, OnInit } from '@angular/core';
import { ResizeObserver as Polyfill } from '@juggle/resize-observer';

const ResizeObserver = (window as any).ResizeObserver || Polyfill;

@Component({
  selector: 'sa-base-page',
  templateUrl: './sa-base-page.component.html',
  styleUrls: ['./sa-base-page.component.scss']
})
export class SaBasePageComponent implements OnInit {
  resizeObserver: Polyfill;

  constructor(private host: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    let pageBody = this.host.nativeElement.querySelector('.page-body');
    let subHeader = this.host.nativeElement.querySelector('.sub-header');
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (subHeader) {
          subHeader['style'].width = pageBody.getBoundingClientRect().width + 'px';
          subHeader['style'].left = pageBody.getBoundingClientRect().x + 'px';
        }
      });
    });

    if (pageBody) this.resizeObserver.observe(pageBody);
  }

  ngOnDestroy() {
    this.resizeObserver.unobserve(this.host.nativeElement.querySelector('.page-body'));
  }
}
