import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateTime'
})

export class SaDateTimePipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {

    switch (args) {
      case DateFormats.shortDate: {
        return super.transform(value, DateFormats.shortDate);
      }
      case DateFormats.shortTime: {
        return super.transform(value, DateFormats.shortTime);
      }
      case DateFormats.shortDateTime: {
        return super.transform(value, DateFormats.shortDateTime);
      }
      default: {
        return super.transform(value, args);
      }
    }
  }

}
export class DateFormats  {
  static readonly shortDate = 'MMM d, yyy';
  static readonly shortTime = 'h:mm a';
  static readonly shortDateTime = `${DateFormats.shortDate} \'at\' ${DateFormats.shortTime}`;
}
