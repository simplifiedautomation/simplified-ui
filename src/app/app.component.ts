import { Component, OnInit, ViewChild } from '@angular/core';
import { SaButtonConfig, SaButtonType, IDataFilterViewModel, FilterTypeEnum, SaSelectConfig, DatePickerConfig, IHeaderViewModel, SaMoreMenuItem, NavigationItem, IDataTable, IDataTableColumn, DataTableColumnTypeEnum, IRequestModel, IGenericPageListViewModel } from 'projects/simplified-ui/src/public-api';
import { FormControl, FormBuilder } from '@angular/forms';
import { Subject, Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild("selectOptionBody") selectOptionBody;
  
  items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
  
  isLoading: boolean = true;

  saveButtonConfig = new SaButtonConfig('Save');

  dataFilterConfig: IDataFilterViewModel;

  dataFilterConfigArray: IDataFilterViewModel[] = [];

  selectOptions = new SaSelectConfig<string>();

  dateConfig = new DatePickerConfig();

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

  demoDataTable: DemoDataTable;

  constructor(private form: FormBuilder) { }

  ngOnInit() {

    this.selectOptions.templateRef = this.selectOptionBody;
    this.selectOptions.options.next(["Option 1"]);


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

    this.demoDataTable = new DemoDataTable();

  }

  onClick(){
    this.primaryMenu = this.standardPrimaryMenu;
    this.kaizenType = 'standard';
  }

  onPrimaryClick(event) {
    
  }

  onSecondaryClick(event) {
    
  }

}


export class DemoDataTable implements IDataTable<any>
{
  dataSource: Subject<any> = new Subject();

  columns: IDataTableColumn[] = [];

  mainActionMenu: SaButtonConfig[] = [new SaButtonConfig('option 1')];

  optionsMenu: SaButtonConfig[] = [];

  isClientSide: boolean = true;

  showCheckboxColumn: boolean = false;

  showFilters: boolean = false;

  constructor() {
    this.setColumns();
  }

  private setColumns() {
    this.columns.push({
      key: "column1",
      title: "COLUMN 1",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: "column1"
      },
      stickyEnd: true
    });

    this.columns.push({
      key: "column2",
      title: "COLUMN 2",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: "column2"
      },
      stickyEnd: true
    });

    this.columns.push({
      key: "column3",
      title: "COLUMN 3",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: "column3"
      },
      stickyEnd: true
    });

    this.columns.push({
      key: "column4",
      title: "COLUMN 4",
      type: DataTableColumnTypeEnum.text,
      filter: {
        config: null,
        filterType: FilterTypeEnum.none,
        key: "column4"
      },
      stickyEnd: true
    });

  }

  getResults(requestModel: IRequestModel): Observable<IGenericPageListViewModel<any>> {
    return of(
      {
        Capacity: 100,
        Count: 1,
        List: [
          {
            column1: 'column 1',
            column2: 'column 2',
            column3: 'column 3',
            column4: 'column 4'
          }
        ],
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
  }


}