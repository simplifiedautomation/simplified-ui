import { Component, OnInit } from '@angular/core';
import { DataTable, DataTableColumnTypeEnum } from '../../../../projects/simplified-ui/src/lib/models/DataTableModel';
import { FilterTypeEnum } from '../../../../projects/simplified-ui/src/lib/models/DataFilterModels';
import { DatePickerConfig } from '../../../../projects/simplified-ui/src/lib/models/DatePickerConfigModel';
import { SaSelectConfig } from '../../../../projects/simplified-ui/src/lib/models/SaSelectModels';
import { SaButtonConfig } from '../../../../projects/simplified-ui/src/lib/sa-button/sa-button.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  dataTable: DataTable<any> = new DataTable();

  filters = [
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
      title: 'Text filter'
    }

  ];


  columns = [
    {key: '0',title: 'Column 1',type: DataTableColumnTypeEnum.text,filter: {
        filterType: FilterTypeEnum.number,
        config: new DatePickerConfig(),
        key: 'filter 1',
        title: 'Column 1 filter'
    }},
    {key: '1',title: 'Column 2',type: DataTableColumnTypeEnum.text,filter: {
        filterType: FilterTypeEnum.text,
        config: new DatePickerConfig(),
        key: 'filter 2',
        title: 'Column 2 filter'
    }},
    {key: '2',title: 'Column 3',type: DataTableColumnTypeEnum.text,filter: {
        filterType: FilterTypeEnum.date,
        config: new DatePickerConfig(),
        key: 'filter 3',
        title: 'Column 3 filter'
    }},
    {key: '3',title: 'Column 4',type: DataTableColumnTypeEnum.text,filter: {
        filterType: FilterTypeEnum.select,
        config: new DatePickerConfig(),
        key: 'filter 4',
        title: 'Column 4 filter'
    }}
  ];

  rows = [
    {0: 1,1: 'text - 1',2: new Date(2001,2,12),3: 'select - 1'},
    {0: 2,1: 'text - 2',2: new Date(2001,2,12),3: 'select - 2'},
    {0: 3,1: 'text - 3',2: new Date(2001,2,12),3: 'select - 3'},
  ];

  constructor() {
    this.dataTable.showFilters = true;
    this.dataTable.isClientSide = true;
    //this.dataTable.showPaginator = false;

    this.dataTable.mainActionMenu = [new SaButtonConfig('menu-1'),new SaButtonConfig('menu-2')];

    for(let i =0;i< this.filters.length;i++) {
      this.dataTable.addFilter(this.filters[i]);
    }

    for(let i=0;i<this.columns.length;i++) {
      this.dataTable.addColumn(this.columns[i],i+1);
    }

    for(let i=0;i<this.rows.length;i++) {
      this.dataTable.addRow(this.rows[i]);
    }

    this.dataTable.onFilterAdded().subscribe((val)=>{
      console.log("Filter added : ",val);
    })

    this.dataTable.onFilterApplied().subscribe((val) => {
      console.log("Filter applied : ",val);
    })
  }

  ngOnInit(): void {
  }

}
