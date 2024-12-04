import { Pipe, PipeTransform } from '@angular/core';
import { sort } from 'src/app/helper/class/utilityHelper';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(data: any, keys: string, desc: boolean = false, groupByKey = '', taskId = ''): Array<any> {
    let result:any;
    if (Array.isArray(data)) {
      result = sort(data, keys, desc);
    } else {
      result = sort(Object.values(data), keys, desc);
    }
    if (groupByKey) {
      result = groupBy(result, keys);
      const res:any = [],
        Objkeys = Object.keys(result);

      Objkeys.map(a => {
        res.push({ date: a, chat: result[a] })
      });
      result = res;
    }
    return result;
  }
}

function groupBy(objectArray:any, property:any) {
  return objectArray.reduce((acc:any, obj:any) => {
    4
    const key = obj[property].split('T')[0];
    if (!acc[key]) {
      acc[key] = [];
    }
    // Add object to list for given key's value
    acc[key].push(obj);
    return acc;
  }, {});
}