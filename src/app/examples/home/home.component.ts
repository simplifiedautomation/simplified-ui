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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  @ViewChild('selectOptionBody', { static: true }) selectOptionBody;
  @ViewChild('myTemplate', { static: true }) dataTableOptionsRef: TemplateRef<any>;
  @ViewChild('colTemplate', { static: true }) colTemplate: TemplateRef<any>;

  dateFormats = DateFormats;

  date = moment.tz(moment(), moment.tz.guess()); //current timezone
  date1 = moment.tz(moment(), 'America/Toronto'); //string timezone
  date2 = moment.tz(); //UTC timezone

  content = 'abc';

  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);

  isLoading: boolean = true;

  isSpin: boolean = true;

  saveButtonConfig = new SaButtonConfig('Toggle Spinner');

  dataFilterConfig: IDataFilterViewModel;

  dataFilterConfigArray: IDataFilterViewModel[] = [];

  selectOptions = new SaSelectConfig<string>();

  dateConfig = new DatePickerConfig();

  data = new FormControl();

  primarButton = new SaButtonConfig('primary');
  secondaryButton = new SaButtonConfig('secondary');

  headerConfig: IHeaderViewModel = {
    title: 'Header',
    primaryButton: this.primarButton,
    secondaryButton: this.secondaryButton,
    moreMenu: null,
    tooltip: 'Hello THere!'
  };

  currencyForm = this.fb.group({
    currency: new FormControl()
  });

  menuItems: SaMoreMenuItem[] = [new SaMoreMenuItem('Item 1'), new SaMoreMenuItem('Item 2')];

  primaryMenu: NavigationItem[] = [
    new NavigationItem('Basic Information', 'basicInformation'),
    new NavigationItem('5G', '5g'),
    new NavigationItem('MOC', 'moc'),
    new NavigationItem('Tools', 'tools'),
    new NavigationItem('Team', 'team'),
    new NavigationItem('5W1H', '5w1h'),
    new NavigationItem('Results', 'results')
  ];

  quickPrimaryMenu: NavigationItem[] = [
    new NavigationItem('Basic Information', 'basicInformation'),
    new NavigationItem('5G', '5g'),
    new NavigationItem('MOC', 'moc'),
    new NavigationItem('Tools', 'tools'),
    new NavigationItem('Team', 'team'),
    new NavigationItem('5W1H', '5w1h'),
    new NavigationItem('Results', 'results')
  ];

  standardPrimaryMenu: NavigationItem[] = [
    new NavigationItem('Basic Information', 'basicInformation'),
    new NavigationItem('Kaizen Information', 'kaizenInformation'),
    new NavigationItem('5G', '5g'),
    new NavigationItem('MOC', 'moc'),
    new NavigationItem('Tools', 'tools'),
    new NavigationItem('Team', 'team'),
    new NavigationItem('Targets', 'targets'),
    new NavigationItem('5W1H', '5w1h'),
    new NavigationItem('4M1D', '4m1d'),
    new NavigationItem('5WHY', '5why'),
    new NavigationItem('Results', 'results')
  ];

  secondaryNavMenu: NavigationItem[] = [new NavigationItem('Nav 1', null), new NavigationItem('Nav 2', null)];

  //example new quil
  hide = false;
  quillform: FormGroup;
  backgroundColor = '';
  @ViewChild('editor', {
    static: true
  })
  editor: QuillEditorComponent;
  @ViewChild('matEditor', {
    static: true
  })
  matEditor: SaTextEditorComponent;
  isReadOnly = false;
  isRequired = false;

  setControl() {
    this.quillform.setControl('editor', new FormControl('test - new Control'));
    this.quillform.setControl('matEditor', new FormControl('test - new Control'));
  }

  patchValue() {
    this.quillform.get('editor').patchValue(`${this.quillform.get('editor').value} patched!`);
    this.quillform.get('matEditor').patchValue(`${this.quillform.get('matEditor').value} patched!`);
  }

  logChange($event: ContentChange) {
    // tslint:disable-next-line:no-console
  }

  logSelection($event: SelectionChange) {
    // tslint:disable-next-line:no-console
  }

  toggleReadOnly() {
    this.isReadOnly = !this.isReadOnly;
  }

  toggleRequired() {
    this.isRequired = !this.isRequired;
  }

  //end
  editorForm = this.fb.group({
    description: new FormControl(null, Validators.required)
  });
  description = new FormControl(null, Validators.required);

  dataTable: DataTable<any> = new DataTable();

  select = new FormControl();

  constructor(private fb: FormBuilder, private client: HttpClient) {
    this.quillform = fb.group({
      editor: ['<ol><li>test</li><li>123</li></ol>'],
      matEditor: ['<ol><li>test</li><li>123</li></ol>']
    });
  }

  ngOnInit() {
    this.quillform.controls.editor.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe((data) => {
      // tslint:disable-next-line:no-console
      console.log('native fromControl value changes with debounce', data);
    });

    this.editor.onContentChanged.pipe(debounceTime(400), distinctUntilChanged()).subscribe((data: ContentChange) => {
      // tslint:disable-next-line:no-console
      console.log('view child + directly subscription', data);
    });

    this.matEditor.onContentChanged.pipe(debounceTime(400), distinctUntilChanged()).subscribe((data: ContentChange) => {
      // tslint:disable-next-line:no-console
      console.log('view child + directly subscription', data);
    });

    this.selectOptions.templateRef = this.selectOptionBody;
    this.selectOptions.getResults = (page, term) => {
      return this.client.get(`https://localhost:44386/api/v2/team/teams?term=${term}&pageNumber=${page}`).pipe(
        map((x) => {
          let genericList = <IGenericPageListViewModel<any>>x;
          genericList.List = genericList.List.map((y) => y.name);
          return genericList;
        })
      );
    };

    this.primarButton.type = SaButtonType.Secondary;

    this.dataFilterConfig = {
      filterType: FilterTypeEnum.date,
      config: new DatePickerConfig(),
      key: 'createdDate',
      title: 'Created Date'
    };

    this.dataFilterConfigArray.push(this.dataFilterConfig);

    this.saveButtonConfig.isSpinning = false;
    this.saveButtonConfig.loadingText = 'Saving';
    this.saveButtonConfig.type = SaButtonType.Anchor;

    this.currencyForm.controls.currency.setValue('100');
    this.setupDataTable();

    this.dateConfig.pickerType = DatePickerType.calendar;
    this.dateConfig.selectMode = DatePickerSelectMode.range;

    // this.data.valueChanges.subscribe(x => console.log("value changes", x));
  }
  dateSelectionChange(a) {
    console.log('selection change', a);
  }
  onClick() {}

  onPrimaryClick(event) {
    this.primarButton.isSpinning = true;
    this.editorForm.disable();
  }

  onSecondaryClick(event) {
    this.primarButton.isSpinning = false;
  }

  updateTable() {
    this.dataTable.addRow({
      key: this.json.length + 1,
      area: 'column 1',
      line: 'column 2',
      machine: 'column 3'
    });
  }

  private setupDataTable() {
    this.dataTable.defaultPageSize = 1;
    this.dataTable.optionsColumnRef = this.dataTableOptionsRef;
    // this.dataTable.showFilters = false;
    this.dataTable.disableSorting = true;
    this.dataTable.showColumnToggle = true;
    this.dataTable.routerLinkEnabled = true;
    this.dataTable.showCheckboxColumn = true;
    this.dataTable.addFilter(this.dataFilterConfig);

    this.dataTable.addColumn({
      key: 'name',
      title: 'Tool Name',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      }
      // template: this.colTemplate,
      // sticky: true
    });

    this.dataTable.addColumn({
      key: 'area1',
      title: 'Area that is too big to fit in a row',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area188',
      title: 'Area that is too big to fit in a row',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area121112',
      title: 'Area that is too big to fit in a row',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area12111',
      title: 'Area that is too big to fit in a row',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area199',
      title: 'Area that is too big to fit in a row',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area2',
      title: 'Area',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area3',
      title: 'Area that is too big to fit in a row',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area4',
      title: 'Area',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area5',
      title: 'Area',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area6',
      title: 'Area',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area7',
      title: 'Area',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area8',
      title: 'Area',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: 'area9',
      title: 'Area',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: 'column1'
      },
      template: this.colTemplate
    });

    let datepickerConfig = new DatePickerConfig();

    this.dataTable.addColumn({
      key: 'line',
      title: 'Line',
      type: DataTableColumnTypeEnum.text,
      filter: {
        title: 'Line',
        config: datepickerConfig,
        filterType: FilterTypeEnum.date,
        key: 'column2',
        defaults: [
          // [new Date(), new Date().setMonth(10)],
          // [new Date(), new Date(new Date().setMonth(10))],
          // [new Date(), new Date().setMonth(10)],
        ]
      }
    });

    this.dataTable.addColumn({
      key: 'machine',
      title: 'Machine',
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: 'column3'
      }
    });

    this.dataTable.selectedRowPredicate = (row, selected) => {
      if (selected && selected.id == row.id) {
        console.log('row matched', row);
      }
      if (row.id == 1) {
        console.log('row matched static', row);
      }

      return (selected && selected.id == row.id) || row.id == 1;
    };
    this.dataTable.showPaginator = true;
    this.dataTable.getResults = (requestModel) => {
      let res = this.json.filter((x) => x.area.includes(requestModel.filter.keyword));

      return of({
        Capacity: 100,
        Count: 1,
        List: res,
        Pager: {
          CurrentPage: 1,
          PagenumberToDisplay: [1],
          PageSize: 5,
          Pages: 1,
          TotalRecords: 100,
          UrlFormat: ''
        }
      });
    };
    this.dataTable.isClientSide = true;
  }

  deleteByIndex() {
    this.dataTable.deleteRow(2);
  }

  deleteByPredicate(item) {
    this.dataTable.deleteRow((x: any[]) => {
      x = x.filter((c) => c != item);
      return x;
    });
  }

  deleteByObject(item) {
    this.dataTable.deleteRow(item);
  }

  refreshTable() {
    this.json = [
      {
        key: 4,
        area: 'Area 4',
        line: 'Line 4',
        machine: 'Machine 4'
      }
    ];
    this.dataTable.refresh();
  }

  json = [
    {
      key: 1,
      area: 'Area 1',
      line: 'Line 1',
      machine: 'Machine 1',
      route: 'something'
    },
    {
      key: 2,
      area: 'Area 2',
      line: 'Line 2',
      machine: 'Machine 2'
    },
    {
      key: 3,
      area: 'Area 2',
      line: 'Line 3',
      machine: 'Machine 3'
    },
    {
      key: 4,
      area: 'Area 4',
      line: 'Line 4',
      machine: 'Machine 4'
    },
    {
      key: 5,
      area: 'Area 5',
      line: 'Line 5',
      machine: 'Machine 5'
    },
    {
      key: 6,
      area: 'Area 6',
      line: 'Line 6',
      machine: 'Machine 6'
    },
    {
      key: 7,
      area: 'Area 7',
      line: 'Line 7',
      machine: 'Machine 7'
    },
    {
      key: 8,
      area: 'Area 8',
      line: 'Line 8',
      machine: 'Machine 8'
    },
    {
      key: 9,
      area: 'Area 9',
      line: 'Line 9',
      machine: 'Machine 9'
    },
    {
      key: 18,
      area: 'Area 18',
      line: 'Line 18',
      machine: 'Machine 18'
    },
    {
      key: 19,
      area: 'Area 19',
      line: 'Line 19',
      machine: 'Machine 19'
    },
    {
      key: 28,
      area: 'Area 28',
      line: 'Line 28',
      machine: 'Machine 28'
    },
    {
      key: 29,
      area: 'Area 29',
      line: 'Line 29',
      machine: 'Machine 29'
    },
    {
      key: 28,
      area: 'Area 28',
      line: 'Line 28',
      machine: 'Machine 28'
    },
    {
      key: 29,
      area: 'Area 29',
      line: 'Line 29',
      machine: 'Machine 29'
    }
  ];

  getClass(row: any): string {
    row.areaClass = this.areas.some((x) => x == row['area']) ? 'sa-valid' : 'sa-invalid';
    return row.areaClass;
  }

  areas: string[] = ['Area 1'];

  //ftag datatable
  ftagDataTable: DataTable<any> = new DataTable();
  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<any>;
  @ViewChild('issueTemplate', { static: true }) issueTemplate: TemplateRef<any>;
  @ViewChild('titleTemplate', { static: true }) titleTemplate: TemplateRef<any>;
}
