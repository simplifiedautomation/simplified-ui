import {
  Component,
  OnInit,
  Input,
  QueryList,
  ViewChildren,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import {
  IDataFilterViewModel,
  IFilterModel,
  FilterTypeEnum,
  IFilterChip,
  SelectDefault
} from '../models/DataFilterModels';
import { SaDatePickerComponent } from '../sa-date-picker/sa-date-picker.component';
import { SaSelectComponent } from '../sa-select/sa-select.component';

@Component({
  selector: 'sa-data-filter',
  templateUrl: './sa-data-filter.component.html',
  styleUrls: ['./sa-data-filter.component.scss']
})
export class SaDataFilterComponent implements OnInit, OnChanges {
  @ViewChildren('datePicker') datePickers: QueryList<SaDatePickerComponent>;

  @Input() filters: IDataFilterViewModel[];

  /**
   * Event emmited when filter model is updated.
   * This will always have the latest filter values.
   */
  @Output() filterChange: EventEmitter<IFilterModel> = new EventEmitter();

  keyword = new FormControl('');

  get filterType() {
    return FilterTypeEnum;
  }

  chips: IFilterChip[] = [];

  private filterModel: IFilterModel = {
    keyword: ''
  };

  nonTextFilters: IDataFilterViewModel[];

  textFilters: IDataFilterViewModel[];

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters) {
      this.initFilters();
      this.updateDefaults();
    }
  }

  ngOnInit() {
    this.initFilters();
    this.keyword.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      this.filterModel.keyword = value;
      this.filterChange.emit(this.filterModel);
    });
  }

  private initFilters() {
    this.nonTextFilters = this.filters.filter(
      (x) => !(x.filterType == FilterTypeEnum.text || x.filterType == FilterTypeEnum.none)
    );
    this.textFilters = this.filters.filter((x) => x.filterType == FilterTypeEnum.text);

    this.filters.forEach((x) => {
      this.filterModel[x.key] = [];
    });
  }

  ngAfterViewInit() {
    this.updateDefaults();
  }

  private updateDefaults() {
    this.filters.forEach((filter) => {
      if (filter.filterType == this.filterType.date && filter.defaults) {
        (filter.defaults as Date[][]).forEach((y) => {
          this.pushDatesToFilterModel(y, filter);
        });
      }

      if (filter.filterType == this.filterType.select && filter.defaults) {
        (filter.defaults as SelectDefault[]).forEach((y) => {
          this.addSelectItemToFilter(y.value, y.displayValue, filter);
        });
      }
    });
  }

  onSelect(event: MatSelectChange, filter: IDataFilterViewModel) {
    let val = event.value[filter.config.key];

    if (val == null) return;

    this.addSelectItemToFilter(val, (<MatOption>event.source.selected).viewValue.trim(), filter);

    event.source.value = null;
  }

  private addSelectItemToFilter(val: any, displayValue: string, filter: IDataFilterViewModel) {
    let filterProperty = this.filterModel[filter.key];
    let isExist: boolean = filterProperty.filter((x) => x == val).length > 0;

    if (!isExist) {
      filterProperty.push(val);
      this.chips.push({
        displayValue: displayValue,
        key: filter.key,
        title: filter.title,
        value: val
      });
      this.filterChange.emit(this.filterModel);
    }
  }

  removeChip(chip: IFilterChip) {
    if (chip.value instanceof Array) {
      this.filterModel[chip.key] = this.filterModel[chip.key].filter(
        (x) => x.from != chip.value[0] || x.to != chip.value[1]
      );
    } else {
      this.filterModel[chip.key] = this.filterModel[chip.key].filter((x) => x != chip.value);
    }
    this.chips = this.chips.filter((x) => !(x.key == chip.key && x.value == chip.value));
    this.filterChange.emit(this.filterModel);
  }

  dateButtonClicked(ref: SaDatePickerComponent) {
    (<HTMLElement>ref.inputRef.nativeElement).click();
  }

  selectButtonClicked(ref: SaSelectComponent<any>) {
    ref.matSelectRef.open();
  }

  datePickerChange(dates: Date[], filter: IDataFilterViewModel, ref: SaDatePickerComponent) {
    if (dates == null) return;
    this.pushDatesToFilterModel(dates, filter);

    ref.value = null;
  }

  private pushDatesToFilterModel(dates: Date[], filter: IDataFilterViewModel) {
    let filterProperty = this.filterModel[filter.key];

    filterProperty.push({
      from: dates[0],
      to: dates[1]
    });

    this.chips.push({
      displayValue: dates[0] + ' - ' + dates[1],
      key: filter.key,
      title: filter.title,
      value: dates
    });
    this.filterChange.emit(this.filterModel);
  }
}
