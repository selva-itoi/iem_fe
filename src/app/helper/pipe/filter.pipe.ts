import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(data: Array<any>, key: string, value: any): any {
    return data.find(a => a[key] == value)
  }

}
