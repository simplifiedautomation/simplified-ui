import { SaButtonConfig } from '../sa-button/sa-button.component';
import { TemplateRef } from '@angular/core';

export interface IHeaderViewModel {
  title: string;
  primaryButton: SaButtonConfig;
  secondaryButton: SaButtonConfig;
  moreMenu?: IMoreMenuViewModel;
  menuTemplate?: TemplateRef<any>
}

export interface IMoreMenuViewModel {
  primaryMenu: Array<IMenuItemViewModel>,
  secondaryMenu: Array<IMenuItemViewModel>
}

export interface IMenuItemViewModel {
  title: string;
  action: Function;
}
