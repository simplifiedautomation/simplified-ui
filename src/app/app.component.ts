import { Component, OnInit, ViewChild } from '@angular/core';
import { SaButtonConfig, SaButtonType, IDataFilterViewModel, FilterTypeEnum, SaSelectConfig, DatePickerConfig, IHeaderViewModel, SaButton, SaMoreMenuItem, NavigationItem } from 'projects/simplified-ui/src/public-api';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild("selectOptionBody") selectOptionBody;

  isLoading: boolean = true;

  saveButtonConfig = new SaButtonConfig('Save');

  dataFilterConfig: IDataFilterViewModel;

  dataFilterConfigArray: IDataFilterViewModel[] = [];

  selectOptions= new SaSelectConfig<string>();

  dateConfig = new DatePickerConfig();

  headerConfig: IHeaderViewModel = {
    title: "Header",
    primaryButton: new SaButton("Primary"),
    secondaryButton: new SaButton("Secondary"),
    moreMenu: null,
  }

  menuItems: SaMoreMenuItem[] = [
    new SaMoreMenuItem("Item 1"),
    new SaMoreMenuItem("Item 2")
  ];

  primaryNavMenu: NavigationItem[] = [
    new NavigationItem("Nav 1", null),
    new NavigationItem("Nav 2", null),
  ];

  secondaryNavMenu: NavigationItem[] = [
    new NavigationItem("Nav 1", null),
    new NavigationItem("Nav 2", null),
  ];

  editorForm = this.form.group({
    description: new FormControl(),
  });

  constructor(private form: FormBuilder){}

  ngOnInit(){

    this.selectOptions.templateRef = this.selectOptionBody;
    this.selectOptions.options.next(["Option 1"]);


    this.dataFilterConfig =  {
  key: 'id',
  filterType: FilterTypeEnum.select,
  config: this.selectOptions,
  title: 'filter'
};

this.dataFilterConfigArray.push(this.dataFilterConfig);

    this.saveButtonConfig.isSpinning = false;
    this.saveButtonConfig.loadingText = 'Saving';
    this.saveButtonConfig.type = SaButtonType.Anchor;

  }

  

}

