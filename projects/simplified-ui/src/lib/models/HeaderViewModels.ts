import { SaButton } from './Sabutton';

export interface IHeaderViewModel {
  title: string;
  primaryButton: SaButton;
  secondaryButton: SaButton;
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
