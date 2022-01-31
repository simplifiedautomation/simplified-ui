import { Component, OnInit } from '@angular/core';
import { IHeaderViewModel } from '../../../../projects/simplified-ui/src/lib/models/HeaderViewModels';
import { SaButtonConfig, SaButtonType } from '../../../../projects/simplified-ui/src/lib/sa-button/sa-button.component';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  headerViewModel: IHeaderViewModel = {
    title: 'Page Header',
    primaryButton: new SaButtonConfig('primary'),
    secondaryButton: new SaButtonConfig('secondary'),
    tooltip: 'tooltip',
    moreMenu: {
      primaryMenu: [{title: 'primary-menu 1',action: () => {console.log("Primary Menu")}},{title: 'primary-menu 2',action: () => {console.log("Primary Menu")}}],
      secondaryMenu: [{title: 'secondary-menu',action: () => {console.log("Secondary Menu")}},{title: 'secondary-menu 2',action: () => {console.log("Primary Menu")}}],
      }
    };

  constructor() { }

  ngOnInit(): void {
    this.headerViewModel.primaryButton.type = SaButtonType.Primary;
    this.headerViewModel.secondaryButton.type = SaButtonType.Secondary;
  }

  onPrimaryClick(){
    console.log("Primary Click");
  }

  onSecondaryClick() {
    console.log("Secondary Click");
  }

}
