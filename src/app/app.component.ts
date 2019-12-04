import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { SaButtonConfig, SaButtonType, IDataFilterViewModel, FilterTypeEnum, SaSelectConfig, DatePickerConfig, IHeaderViewModel, SaMoreMenuItem, NavigationItem, DataTable, IDataTableColumn, DataTableColumnTypeEnum, IRequestModel, IGenericPageListViewModel, DateFormats, DatePickerType, DatePickerMode, DatePickerSelectMode } from 'projects/simplified-ui/src/public-api';
import { FormControl, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import * as moment_ from 'moment-timezone';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const moment = moment_;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  @ViewChild("selectOptionBody") selectOptionBody;
  @ViewChild("myTemplate") dataTableOptionsRef: TemplateRef<any>;
  @ViewChild("colTemplate") colTemplate: TemplateRef<any>;

  dateFormats = DateFormats;

  date = moment.tz(moment(), moment.tz.guess());                  //current timezone
  date1 = moment.tz(moment(), "America/Toronto");                 //string timezone
  date2 = moment.tz();                                            //UTC timezone


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
    title: "Header",
    primaryButton: this.primarButton,
    secondaryButton: this.secondaryButton,
    moreMenu: null,
    tooltip: "Hello THere!"
  }

  currencyForm = this.form.group({
    currency: new FormControl()
  }
  );


  menuItems: SaMoreMenuItem[] = [
    new SaMoreMenuItem("Item 1"),
    new SaMoreMenuItem("Item 2")
  ];

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

  secondaryNavMenu: NavigationItem[] = [
    new NavigationItem("Nav 1", null),
    new NavigationItem("Nav 2", null),
  ];

  editorForm = this.form.group({
    description: new FormControl(),
  });

  dataTable: DataTable<any> = new DataTable();

  select = new FormControl();

  constructor(private form: FormBuilder,
    private client: HttpClient) { }

  ngOnInit() {

    this.selectOptions.templateRef = this.selectOptionBody;
    this.selectOptions.getResults = (page, term) => {
      return this.client.get(`https://localhost:44386/api/v2/team/teams?term=${term}&pageNumber=${page}`).pipe(map(x => {
        let genericList = <IGenericPageListViewModel<any>>x;
        genericList.List = genericList.List.map(y => y.name);
        return genericList;
      }));
    };

    this.primarButton.type = SaButtonType.Secondary;


    this.dataFilterConfig = {
      filterType: FilterTypeEnum.date,
      config: new DatePickerConfig(),
      key: "createdDate",
      title: "Created Date"
    }

    this.dataFilterConfig.config.pickerType = DatePickerType.calendar;
    this.dataFilterConfig.config.selectMode = DatePickerSelectMode.range;

    this.dataFilterConfigArray.push(this.dataFilterConfig);

    this.saveButtonConfig.isSpinning = false;
    this.saveButtonConfig.loadingText = 'Saving';
    this.saveButtonConfig.type = SaButtonType.Anchor;

    this.currencyForm.controls.currency.setValue('100');
    this.setupDataTable();

    this.dateConfig.pickerType = DatePickerType.calendar;
    this.dateConfig.selectMode = DatePickerSelectMode.range;

    this.data.valueChanges.subscribe(x => console.log("value changes", x));
  }
  dateSelectionChange(a) {
    console.log("selection change", a);
  }
  onClick() {
  }

  onPrimaryClick(event) {
    this.primarButton.isSpinning = true;
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
    this.dataTable.routerLinkEnabled = false;
    this.dataTable.showCheckboxColumn = true;


    this.dataTable.addColumn({
      key: "area",
      title: "Area that is too big to fit in a row",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.text,
        key: "column1"
      },
      template: this.colTemplate,
      // sticky: true
    });

    // this.dataTable.addColumn({
    //   key: "area1",
    //   title: "Area that is too big to fit in a row",
    //   type: DataTableColumnTypeEnum.text,
    //   filter: {
    //     config: null,
    //     filterType: FilterTypeEnum.text,
    //     key: "column1"
    //   },
    //   template: this.colTemplate
    // });

    // this.dataTable.addColumn({
    //   key: "area2",
    //   title: "Area",
    //   type: DataTableColumnTypeEnum.text,
    //   filter: {
    //     config: null,
    //     filterType: FilterTypeEnum.text,
    //     key: "column1"
    //   },
    //   template: this.colTemplate
    // });

    // this.dataTable.addColumn({
    //   key: "area3",
    //   title: "Area that is too big to fit in a row",
    //   type: DataTableColumnTypeEnum.text,
    //   filter: {
    //     config: null,
    //     filterType: FilterTypeEnum.text,
    //     key: "column1"
    //   },
    //   template: this.colTemplate
    // });

    // this.dataTable.addColumn({
    //   key: "area4",
    //   title: "Area",
    //   type: DataTableColumnTypeEnum.text,
    //   filter: {
    //     config: null,
    //     filterType: FilterTypeEnum.text,
    //     key: "column1"
    //   },
    //   template: this.colTemplate
    // });


    // this.dataTable.addColumn({
    //   key: "area5",
    //   title: "Area",
    //   type: DataTableColumnTypeEnum.text,
    //   filter: {
    //     config: null,
    //     filterType: FilterTypeEnum.text,
    //     key: "column1"
    //   },
    //   template: this.colTemplate
    // });

    // this.dataTable.addColumn({
    //   key: "area6",
    //   title: "Area",
    //   type: DataTableColumnTypeEnum.text,
    //   filter: {
    //     config: null,
    //     filterType: FilterTypeEnum.text,
    //     key: "column1"
    //   },
    //   template: this.colTemplate
    // });

    // this.dataTable.addColumn({
    //   key: "area7",
    //   title: "Area",
    //   type: DataTableColumnTypeEnum.text,
    //   filter: {
    //     config: null,
    //     filterType: FilterTypeEnum.text,
    //     key: "column1"
    //   },
    //   template: this.colTemplate
    // });

    // this.dataTable.addColumn({
    //   key: "area8",
    //   title: "Area",
    //   type: DataTableColumnTypeEnum.text,
    //   filter: {
    //     config: null,
    //     filterType: FilterTypeEnum.text,
    //     key: "column1"
    //   },
    //   template: this.colTemplate
    // });

    // this.dataTable.addColumn({
    //   key: "area9",
    //   title: "Area",
    //   type: DataTableColumnTypeEnum.text,
    //   filter: {
    //     config: null,
    //     filterType: FilterTypeEnum.text,
    //     key: "column1"
    //   },
    //   template: this.colTemplate
    // });

    let datepickerConfig = new DatePickerConfig();

    this.dataTable.addColumn({
      key: "line",
      title: "Line",
      type: DataTableColumnTypeEnum.text,
      filter: {
        title: "Line",
        config: datepickerConfig,
        filterType: FilterTypeEnum.date,
        key: "column2",
        defaults: [
          // [new Date(), new Date().setMonth(10)],
          // [new Date(), new Date(new Date().setMonth(10))],
          // [new Date(), new Date().setMonth(10)],
        ]
      }
    });

    this.dataTable.addColumn({
      key: "machine",
      title: "Machine",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: "column3"
      }
    });

    this.dataTable.getResults = (requestModel) => {
      console.log("data table", requestModel)

      let res = this.json.filter(x => x.area.includes(requestModel.filter.keyword));

      return of(
        {
          Capacity: 100,
          Count: 1,
          List: res,
          Pager: {
            CurrentPage: 1,
            PagenumberToDisplay: [1],
            PageSize: 20,
            Pages: 1,
            TotalRecords: 1,
            UrlFormat: ''
          }
        }
      );
    };
    this.dataTable.isClientSide = true;
  }

  deleteByIndex() {
    this.dataTable.deleteRow(2);
  }

  deleteByPredicate(item) {
    this.dataTable.deleteRow((x: any[]) => {
      x = x.filter(c => c != item);
      return x;
    });
  }

  deleteByObject(item) {
    this.dataTable.deleteRow(item);
  }

  refreshTable() {
    this.json = [{
      key: 4,
      area: "Area 4",
      line: "Line 4",
      machine: "Machine 4"
    }];
    this.dataTable.refresh();
  }


  json = [
    {
      key: 1,
      area: "Area 1",
      line: "Line 1",
      machine: "Machine 1",
      route: "something"
    },
    {
      key: 2,
      area: "Area 2",
      line: "Line 2",
      machine: "Machine 2"
    },
    {
      key: 3,
      area: "Area 2",
      line: "Line 3",
      machine: "Machine 3"
    },
  ]


  getClass(row: any): string {
    row.areaClass = this.areas.some(x => x == row["area"]) ? "sa-valid" : "sa-invalid"
    return row.areaClass;
  }

  areas: string[] = ["Area 1"];
}
