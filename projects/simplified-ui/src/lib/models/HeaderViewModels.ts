import { SaButtonConfig } from '../sa-button/sa-button.component';
import { TemplateRef } from '@angular/core';

export interface IHeaderViewModel {
  title: string;
  primaryButton: SaButtonConfig;
  secondaryButton: SaButtonConfig;
  responsiveMenuTemplate?: TemplateRef<any>;
  menuTemplate?: TemplateRef<any>;
  tooltip? : string;
}
