import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe, formatCurrency, getCurrencySymbol } from '@angular/common';
import { DataTableColumnTypeEnum } from '../models/DataTableModel';
import { DateFormats } from './sa-date-time.pipe';

@Pipe({
  name: 'valueFormatter'
})
export class SaValueFormatterPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(value: any, type: string): any {
    if (value === undefined) {
      return 'not available';
    }

    if (type === 'number') {
      return value;
    }

    if (type === 'date') {
      return new Date(value).toLocaleDateString();
    }

    if (type === DataTableColumnTypeEnum.dateTime) {
      return new DatePipe(this.locale).transform(value, DateFormats.shortDateTime);
    }

    if (type == 'currency') {
      let symbol = getCurrencySymbol('USD', symbolFormatEnum.narrow, this.locale);
      return formatCurrency(value, this.locale, symbol);
    }

    return value;
  }
}

export enum symbolFormatEnum {
  wide = 'wide',
  narrow = 'narrow'
}
