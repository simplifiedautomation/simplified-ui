import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuillModule } from 'ngx-quill';
import Counter from 'projects/simplified-ui/src/lib/sa-text-editor/counter';
import { SimplifiedUiModule } from '../../projects/simplified-ui/src/lib/simplified-ui.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './examples/home/home.component';
import { CurrencyInputComponent } from './examples/currency-input/currency-input.component';
import { ButtonsComponent } from './examples/buttons/buttons.component';
import { DataFilterComponent } from './examples/data-filter/data-filter.component';
import { SelectComponent } from './examples/select/select.component';
import { StepperComponent } from './examples/stepper/stepper.component';
import { DatePickerComponent } from './examples/date-picker/date-picker.component';
import { MoreMenuComponent } from './examples/more-menu/more-menu.component';
import { TableOfContentsComponent } from './examples/table-of-contents/table-of-contents.component';
import { DataTableComponent } from './examples/data-table/data-table.component';
import { PageHeaderComponent } from './examples/page-header/page-header.component';
import { TextEditorComponent } from './examples/text-editor/text-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ButtonsComponent,
    CurrencyInputComponent,
    StepperComponent,
    DataFilterComponent,
    MoreMenuComponent,
    DatePickerComponent,
    SelectComponent,
    TableOfContentsComponent,
    TextEditorComponent,
    PageHeaderComponent,
    DataTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatFormFieldModule,
    QuillModule,
    SimplifiedUiModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }],
  bootstrap: [AppComponent]
})
export class AppModule {}
