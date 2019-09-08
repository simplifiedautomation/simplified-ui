import { Component, OnInit, Input, QueryList, ViewChildren, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatSelectChange, MatOption } from '@angular/material';
import { IDataFilterViewModel, IFilterModel, FilterTypeEnum, IFilterChip } from '../models/DataFilterModels';
import { SaDatePickerComponent } from '../sa-date-picker/sa-date-picker.component';

@Component({
  selector: 'sa-data-filter',
  templateUrl: './sa-data-filter.component.html',
  styleUrls: ['./sa-data-filter.component.scss']
})
export class SaDataFilterComponent implements OnInit {

  @ViewChildren('datePicker') datePickers: QueryList<SaDatePickerComponent>;

  @Input() filters: IDataFilterViewModel[];

  /**
   * Event emmited when filter model is updated.
   * This will always have the latest filter values.
   */
  @Output() filterChange: EventEmitter<IFilterModel> = new EventEmitter();

  keyword = new FormControl('');

  get filterType() { return FilterTypeEnum; }

  chips: IFilterChip[] = [];

  private filterModel: IFilterModel = {
    keyword: ""
  };

  constructor() {

  }

  ngOnInit() {

    this.filters.forEach(x => {
      this.filterModel[x.key] = [];
    });

    this.keyword.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this.filterModel.keyword = value;
        this.filterChange.emit(this.filterModel);
      });
  }

  ngAfterViewInit() {
    this.datePickers.forEach(x => {
      (<HTMLElement>x.inputRef.nativeElement).style.width = "0px";
    });
  }

  onSelect(event: MatSelectChange, filter: IDataFilterViewModel) {
    let val = event.value[filter.config.key]

    if (val == null)
      return;

    let filterProperty = this.filterModel[filter.key];
    let isExist: boolean = filterProperty.filter(x => x == val).length > 0;

    if (!isExist) {
      filterProperty.push(val);
      this.chips.push({
        displayValue: (<MatOption>event.source.selected).viewValue.trim(),
        key: filter.key,
        title: filter.title,
        value: val
      });
      this.filterChange.emit(this.filterModel);
    }
    event.source.value = null;
  }

  removeChip(chip: IFilterChip) {
    if (chip.value instanceof Array) {
      this.filterModel[chip.key] = this.filterModel[chip.key].filter(x => x.from != chip.value[0] && x.to != chip.value[1]);
    }
    else {
      this.filterModel[chip.key] = this.filterModel[chip.key].filter(x => x != chip.value);
    }
    this.chips = this.chips.filter(x => !(x.key == chip.key && x.value == chip.value));
    this.filterChange.emit(this.filterModel);
  }

  dateButtonClicked(ref: SaDatePickerComponent) {
    (<HTMLElement>ref.inputRef.nativeElement).click()
  }

  datePickerChange(dates: Date[], filter: IDataFilterViewModel, ref: SaDatePickerComponent) {
    if (dates == null)
      return;
    let filterProperty = this.filterModel[filter.key];
    filterProperty.push({
      from: dates[0],
      to: dates[1]
    });
    this.chips.push({
      displayValue: dates[0] + " - " + dates[1],
      key: filter.key,
      title: filter.title,
      value: dates
    });
    this.filterChange.emit(this.filterModel);
    ref.value = null;
  }

}
