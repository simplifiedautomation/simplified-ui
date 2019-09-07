import { NgModule } from '@angular/core';
import { SimplifiedUiComponent } from './simplified-ui.component';
import { MaterialModule } from './material-module/material.module';
import { SaPrimaryButtonComponent } from './sa-primary-button/sa-primary-button.component';
import { SaDataTableComponent } from './sa-data-table/sa-data-table.component';
import { CommonModule } from '@angular/common';
import { SaDataFilterComponent } from './sa-data-filter/sa-data-filter.component';
import { SaDatePickerComponent } from './sa-date-picker/sa-date-picker.component';
import { SaDateTimePipe } from './pipes/sa-date-time.pipe';
import { SaValueFormatterPipe } from './pipes/sa-value-formatter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaSelectComponent } from './sa-select/sa-select.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { SaSecondaryButtonComponent } from './sa-secondary-button/sa-secondary-button.component';
import { SaAnchorButtonComponent } from './sa-anchor-button/sa-anchor-button.component';
import { SaCurrencyInputComponent } from './sa-currency-input/sa-currency-input.component';
import { SaTableOfContentsComponent } from './sa-table-of-contents/sa-table-of-contents.component';
import { SaTextEditorComponent } from './sa-text-editor/sa-text-editor.component';
import { QuillModule } from 'ngx-quill';
import { SaBaseHeaderComponent } from './sa-base-header/sa-base-header.component';
import { SaHeaderComponent } from './sa-header/sa-header.component';
import { SaBasePageComponent } from './sa-base-page/sa-base-page.component';
import { SaNavigablePageComponent } from './sa-navigable-page/sa-navigable-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SaStepperComponent } from './sa-stepper/sa-stepper.component';
import { SaMoreMenuComponent } from './sa-more-menu/sa-more-menu.component';
import { SaButtonComponent } from './sa-button/sa-button.component';
import { SaSpinnerDirective } from './directives/sa-spinner.directive';
import { MatProgressSpinner } from '@angular/material';
import { RouterModule } from '@angular/router';

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};


@NgModule({
  declarations: [
    SimplifiedUiComponent,
    SaPrimaryButtonComponent,
    SaDataTableComponent,
    SaDataFilterComponent,
    SaDatePickerComponent,
    SaDateTimePipe,
    SaValueFormatterPipe,
    SaSelectComponent,
    SaSecondaryButtonComponent,
    SaAnchorButtonComponent,
    SaTableOfContentsComponent,
    SaTextEditorComponent,
    SaCurrencyInputComponent,
    SaTableOfContentsComponent,
    SaBaseHeaderComponent,
    SaHeaderComponent,
    SaBasePageComponent,
    SaNavigablePageComponent,
    SaStepperComponent,
    SaMoreMenuComponent,
    SaButtonComponent,
    SaSpinnerDirective
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatSelectInfiniteScrollModule,
    QuillModule,
    FlexLayoutModule,
    RouterModule
  ],
  exports: [
    SimplifiedUiComponent,
    MaterialModule,
    SaPrimaryButtonComponent,
    SaSecondaryButtonComponent,
    SaAnchorButtonComponent,
    SaDataTableComponent,
    SaDataFilterComponent,
    SaDatePickerComponent,
    SaDateTimePipe,
    SaValueFormatterPipe,
    SaSelectComponent,
    SaTableOfContentsComponent,
    SaTextEditorComponent,
    SaCurrencyInputComponent,
    SaTableOfContentsComponent,
    SaBaseHeaderComponent,
    SaHeaderComponent,
    SaBasePageComponent,
    SaNavigablePageComponent,
    SaStepperComponent,
    SaMoreMenuComponent,
    SaButtonComponent,
    SaSpinnerDirective
  ],
  entryComponents:[MatProgressSpinner],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
]
})
export class SimplifiedUiModule { }
