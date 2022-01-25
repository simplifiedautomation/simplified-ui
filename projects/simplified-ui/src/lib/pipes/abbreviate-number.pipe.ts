import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';
import { symbolFormatEnum } from './sa-value-formatter.pipe';

@Pipe({
  name: 'abbreviateNumber'
})
export class AbbreviateNumberPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(value: number | string, isCurrency: boolean = false): any {
    let number: number;

    let currencySymbol: string;

    if (isCurrency) {
      currencySymbol = getCurrencySymbol('USD', symbolFormatEnum.narrow, this.locale);
      number = Number(
        value
          ?.toString()
          .replace(currencySymbol, '')
          .match(/[+-]?\d+(?:\.\d+)?/g)
          .join('')
      );
    } else {
      number = Number(value);
    }

    if (isNaN(number)) return value;
    if (number === null) return null;
    if (number === 0) return value;
    let absValue = Math.abs(number);
    const isNegative = number < 0;
    let key = '';

    const powers = [
      { key: 'T', value: Math.pow(10, 12) },
      { key: 'B', value: Math.pow(10, 9) },
      { key: 'M', value: Math.pow(10, 6) },
      { key: 'K', value: 1000 }
    ];

    for (let i = 0; i < powers.length; i++) {
      let reduced = absValue / powers[i].value;
      if (reduced >= 1) {
        absValue = reduced;
        key = powers[i].key;
        break;
      }
    }
    return (isNegative ? '-' : '') + (isCurrency ? currencySymbol : '') + Math.round(absValue * 100) / 100 + ' ' + key;
  }
}
