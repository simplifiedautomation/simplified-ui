import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {

  transform(value: number | string, args?: any): any {
    let number = Number(value);
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
    return (isNegative ? '-' : '') + absValue.toFixed(2) + key;
  }

}
