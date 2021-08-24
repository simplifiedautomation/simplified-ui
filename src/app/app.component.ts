import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import {
  SaButtonConfig,
  SaButtonType,
  IDataFilterViewModel,
  FilterTypeEnum,
  SaSelectConfig,
  DatePickerConfig,
  IHeaderViewModel,
  SaMoreMenuItem,
  NavigationItem,
  DataTable,
  IDataTableColumn,
  DataTableColumnTypeEnum,
  IRequestModel,
  IGenericPageListViewModel,
  DateFormats,
  DatePickerType,
  DatePickerMode,
  DatePickerSelectMode,
  SaTextEditorComponent
} from 'projects/simplified-ui/src/public-api';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import * as moment_ from 'moment-timezone';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuillEditorComponent, ContentChange, SelectionChange } from 'ngx-quill';
const moment = moment_;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  links = [
    'home',
    'currency-input',
    'buttons',
    'stepper',
    'more-menu',
    'date-picker',
    'select',
    'toc',
    'text-editor',
    'page-header',
    'data-table'
  ];

}
