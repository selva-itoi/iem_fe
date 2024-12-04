import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
 transform(value: string, formats = 'd-M-y',type : 'single' | 'range' | 'multiple' ='single'): any {
   const datePipe = new DatePipe("en-US");
   if(!value) return ''; 
   const dt = value.split(','),
    newA:any = [];
    dt.forEach((e:any,i) => {
      e = e && (typeof e == 'string' && e.search(/-00/gi) != -1) || !e ? '' : datePipe.transform(e, formats);
      newA.push(e)
    })
    return newA.length > 1 ? newA.join(" to ") : newA.join(", "); 
  }
}