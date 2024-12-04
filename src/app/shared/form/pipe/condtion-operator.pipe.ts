import { Pipe, PipeTransform } from '@angular/core';
import { isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';

@Pipe({
  name: 'conditionOperator'
})
export class ConditionOperatorPipe implements PipeTransform {

  transform(obj: any, condition: Array<any>): boolean {
    if (isEmptyObj(condition)) {
      return true;
    }
    const dt = [];
    let pre_res: boolean;
    let rev_join = '';
    let result: boolean = false;
    condition.forEach((e: any) => {
      result = this.conditionValCheck(e, obj[e.key]);
      if (rev_join) {
        result = this.conditionValCheck({ operation: rev_join, value: pre_res }, result);
      }

      if (e.join) {
        rev_join = e.join;
        pre_res = result;
      } else {
        pre_res = false;
        rev_join = '';
      }
    });
    return result;
  }


  conditionValCheck(condition: any, val: any) {
    if (condition.operation == '!=') {
      return val != condition.value;
    }
    if (condition.operation == '==' || condition.operation == '&&') {
      if(isArray(condition.value)){
        return condition.value.includes(val)
      }
      return val == condition.value;
    }
    if (condition.operation == '||') {
      return val || condition.value;
    }
    if (condition.operation == '>=') {
      return val >= condition.value;
    }
    return false;
  }
}
