import { SaButtonConfig } from '../sa-button/sa-button.component';

export interface IHeaderViewModel {
  title: string;
  primaryButton: SaButtonConfig;
  secondaryButton: SaButtonConfig;
  moreMenu: IMoreMenuViewModel;
}

export interface IMoreMenuViewModel {
  primaryMenu: Array<IMenuItemViewModel>,
  secondaryMenu: Array<IMenuItemViewModel>
}

export interface IMenuItemViewModel {
  title: string;
  action: Function;
}
