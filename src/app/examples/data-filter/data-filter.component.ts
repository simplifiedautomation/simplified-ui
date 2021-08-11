/*
Add default parameter values for models and constructors
 */


import { Component } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  FilterTypeEnum,
  IDataFilterViewModel
} from '../../../../projects/simplified-ui/src/lib/models/DataFilterModels';
import { DatePickerConfig } from '../../../../projects/simplified-ui/src/lib/models/DatePickerConfigModel';
import { SaSelectConfig } from '../../../../projects/simplified-ui/src/lib/models/SaSelectModels';

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.scss'],
  providers: [{provide: MatFormFieldControl,useExisting: DataFilterComponent}],
})
export class DataFilterComponent {

  filterModel: IDataFilterViewModel[] = [
    {
      filterType: FilterTypeEnum.date,
      config: new DatePickerConfig(),
      key: 'date',
      title: 'Date filter'
    },
    {
      filterType: FilterTypeEnum.select,
      config: new SaSelectConfig(),
      key: 'select',
      title: 'Select filter'
    },
    {
      filterType: FilterTypeEnum.text,
      key: 'text',
      config: 'config',
      title: 'Title filter'
    },
    {                                            /// Not sure how to implement this one
      filterType: FilterTypeEnum.number,
      key: 'number',
      config: 'config 1',
      title: 'Number Filter'
    },
  ];

  constructor() {}

  onFilterChange(event) {
    console.log("Filter Change : ",event);
  }

}
