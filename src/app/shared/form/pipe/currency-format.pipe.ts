import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value === undefined || value === null) {
      return '₹ 0';
    }
    return `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(+value)}`;
  }

}
