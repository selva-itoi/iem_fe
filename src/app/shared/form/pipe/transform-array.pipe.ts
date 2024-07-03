import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'src/app/helper/class/utilityHelper';

@Pipe({
  name: 'transformArray'
})
export class TransformArrayPipe implements PipeTransform {

  transform(data: any, split = ',', join = ''): Array<any> {
    if (!data) {
      return [];
    }
    if (isArray(data) == false) {
      data = data.split(split);
    }
    return this.joinArray(data, join);
  }

  joinArray(data: any, join: string) {
    const dat: Array<any> = [];
    let i = 0;
    data.forEach((a: any) => {
      if (data[i]) {
        dat.push(a)
      }
      if (data[i + 1]) {
        dat.push(join);
      }
      i++;
    });
    data = dat;
    return data;
  }

}
