import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { NavigationItem } from '../models/NavigationItem';


@Component({
  selector: 'sa-table-of-contents',
  templateUrl: './sa-table-of-contents.component.html',
  styleUrls: ['./sa-table-of-contents.component.scss']
})
export class SaTableOfContentsComponent implements OnInit, AfterViewInit {

  href: string = ""

  @Input() primaryMenu: NavigationItem[]
  @Input() secondaryMenu: NavigationItem[]

  navigationItemOnClick(item) {
    document.getElementsByClassName("selected")[0].classList.remove("selected");
    item.closest("mat-list-item").className += " selected";
  }



  constructor(private scrollDispatcher: ScrollDispatcher) {

  }

  ngOnInit() {
    this.href = window.location.pathname;
  }

  ngAfterViewInit() {
    this.primaryMenu.forEach(function (menuItem) {
      menuItem.obs$.subscribe(
        function (result) {
          document.getElementsByClassName("selected")[0].classList.remove("selected");
          const menuItemElement = document.querySelector('a[href="' + window.location.pathname + '#' + result + '"]');
          menuItemElement.closest("mat-list-item").className += " selected";
        }
      );
    });
    this.secondaryMenu.forEach(function (menuItem) {
      menuItem.obs$.subscribe(
        function (result) {
          document.getElementsByClassName("selected")[0].classList.remove("selected");
          const menuItemElement = document.querySelector('a[href="' + window.location.pathname + '#' + result + '"]');
          menuItemElement.closest("mat-list-item").className += " selected";
        }
      );
    });

    this.scrollDispatcher.scrolled().subscribe(
      (x) => {
        let itemOffsets = this.getItemOffsets();
        let scroll_start = x['elementRef'].nativeElement.scrollTop;
        for (let i = 0; i < itemOffsets.length; i++) {
          if ((i === itemOffsets.length - 1) && scroll_start >= (itemOffsets[i].top - 66)) {
            this.triggerEvent(itemOffsets[i].route);
          } else if (scroll_start >= (itemOffsets[i].top - 66) && scroll_start < itemOffsets[i + 1].top - 66) {
            this.triggerEvent(itemOffsets[i].route);
          }
        }
      });

  }

  getItemOffsets() {
    const that = this;
    let itemOffsets = [];
    this.primaryMenu.forEach(function (item) {
      var top = that.getDistanceFromTop(document.querySelector('a[name="' + item.route + '"]'));
      let itemOffset = {
        top: top,
        route: item.route
      };
      itemOffsets.push(itemOffset);
    });
    this.secondaryMenu.forEach(function (item) {
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
      top += (element.offsetTop);
      element = element.offsetParent;
    }

    return top;
  }

  triggerEvent(route: string) {
    const menuItem = this.primaryMenu.find(x => x.route === route) || this.secondaryMenu.find(x => x.route === route);
    menuItem.triggerNext();
  }

}
