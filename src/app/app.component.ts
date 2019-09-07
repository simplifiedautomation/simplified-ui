import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { SaButtonConfig, SaButtonType, IDataFilterViewModel, FilterTypeEnum, SaSelectConfig, DatePickerConfig, IHeaderViewModel, SaMoreMenuItem, NavigationItem, DataTable, IDataTableColumn, DataTableColumnTypeEnum, IRequestModel, IGenericPageListViewModel, DateFormats, DatePickerType } from 'projects/simplified-ui/src/public-api';
import { FormControl, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import * as moment from 'moment-timezone';

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

  kaizenType;

  dataTable: DataTable<any> = new DataTable();

  constructor(private form: FormBuilder) { }

  ngOnInit() {

    this.selectOptions.templateRef = this.selectOptionBody;
    this.selectOptions.options.next(["Option 1"]);

    this.primarButton.type = SaButtonType.Secondary;

    this.dataFilterConfig = {
      key: 'id',
      filterType: FilterTypeEnum.select,
      config: this.selectOptions,
      title: 'filter'
    };

    this.dataFilterConfigArray.push(this.dataFilterConfig);

    this.saveButtonConfig.isSpinning = false;
    this.saveButtonConfig.loadingText = 'Saving';
    this.saveButtonConfig.type = SaButtonType.Anchor;

    this.currencyForm.controls.currency.setValue('100');
    this.setupDataTable();

    this.dateConfig.dateFormat = DateFormats.shortDate;
    this.dateConfig.pickerType = DatePickerType.timer;
  }

  onClick() {
    // this.primaryMenu = this.standardPrimaryMenu;
    // this.kaizenType = 'standard';
console.log(this.data);
  }

  onPrimaryClick(event) {
    this.primarButton.isSpinning = true;
  }

  onSecondaryClick(event) {
    this.primarButton.isSpinning = false;
  }

  updateTable() {
    this.dataTable.addColumn({
      key: "column4",
      title: "COLUMN 4",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: "column4"
      }
    });

    this.dataTable.addColumn({
      key: "column5",
      title: "COLUMN 5",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: "column4"
      }
    });

    this.dataTable.addColumn({
      key: "column6",
      title: "COLUMN 6",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: "column4"
      }
    });

    this.dataTable.addColumn({
      key: "column7",
      title: "COLUMN 7",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: "column4"
      }
    });

    this.dataTable.addRow({
      column1: 'column 1',
      column2: 'column 2',
      column3: 'column 3',
      column4: 'column 4'
    });
  }

  private setupDataTable() {

    this.dataTable.optionsColumnRef = this.dataTableOptionsRef;
    // this.dataTable.routerLinkEnabled = true;


    this.dataTable.addColumn({
      key: "area",
      title: "Area",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: "column1"
      },
      template: this.colTemplate
    });

    this.dataTable.addColumn({
      key: "line",
      title: "Line",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: "column2"
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

      return of(
        {
          Capacity: 100,
          Count: 1,
          List: this.json,
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
      key: "4",
      area: "Area 4",
      line: "Line 4",
      machine: "Machine 4"
    }];
    this.dataTable.refresh();
  }


  json = [
    {
      key: "1",
      area: "Area 1",
      line: "Line 1",
      machine: "Machine 1"
    },
    {
      key: "2",
      area: "Area 2",
      line: "Line 2",
      machine: "Machine 2"
    },
    {
      key: "3",
      area: "Area 2",
      line: "Line 3",
      machine: "Machine 3"
    }
  ]


  getClass(row: any): string {
    row.areaClass = this.areas.some(x => x == row["area"]) ? "sa-valid" : "sa-invalid"
    return row.areaClass;
  }

  areas: string[] = ["Area 1"];
}
