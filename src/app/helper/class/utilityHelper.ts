import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ResponseData } from '../interface/response';
import { AppConstant, VALIDATOR_PATTERNS } from './app-constant';
import { formatDate } from '@angular/common';

export function convertDate(data: any): Date | any {
  const dat = new Date(data);
  return `${dat.getFullYear()}-${dat.getMonth() + 1}-${dat.getDate()}`;
  return dat;
}

export function createSearchTableQuery(event: any) {
  if (!event)
    return null;

  const search: any = {};
  let sortText;
  if (event.first)
    search.page = (event.first / AppConstant.TABLE_PAGE_ROWS) || 1;
  else
    search.page = 0;
  search.rows = event.rows;
  if (event.filters) {
    search.queryParams = [];
    Object.keys(event.filters).forEach(key => {
      const d = event.filters[key].value || '';
      if (d instanceof Date) {
        event.filters[key].value = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        event.filters[key].type = 'DATE'
      } else if (typeof d == 'object') {
        event.filters[key].value = null
      }
      event.filters[key]['colName'] = key;
      if (event.filters[key].value) {
        search.queryParams.push(event.filters[key]);
      }
    });
  }
  if (event.sortField) {
    search.sort = [];
    if (event.sortOrder == 1) {
      sortText = 'asc';
    }
    else if (event.sortOrder == -1) {
      sortText = 'desc';
    }
    if (event.sortField) {
      search.sort.push({ colName: event.sortField, sortOrder: sortText });
    }
  }
  return search;
}

export function extractNumber(txt: string | number) {
  return +(String(txt).replace(/\D/g, ''));
}

export function toMonthName(monthNumber: any = new Date().getMonth(), type: 'short' | 'long' = 'short') {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('en-US', {
    month: type,
  });
}



export function isArray(data: any) {
  if (Array.isArray(data)) {
    return data.length;
  }
  return false;
}

export function cleanForm(formGroup: UntypedFormGroup): any {
  Object.keys(formGroup.controls).forEach((key) => {
    if (formGroup.get(key)?.value && typeof formGroup.get(key)?.value == 'string')
      formGroup.get(key)?.setValue(formGroup.get(key)?.value?.trim());
  });
}

export function formToWhere(formValue, keys: Array<string> = [], skipNull = false): Array<any> {
  const keyC = isArray(keys) ? keys : Object.keys(formValue),
    w: any = [];
  keyC.forEach(a => {
    if (skipNull && formValue[a]) {
      w.push({ colName: a, value: formValue[a] })
    } else if (!skipNull) {
      w.push({ colName: a, value: formValue[a] })
    }
  });
  return w;
}

export function filterData(filters: any, data: any): any {
  if (!filters)
    return [];
  let keys: any = Object.keys(filters);
  return data.filter((item: any) => {
    return keys.every((key: any) => {
      if (typeof filters[key] !== 'function') return true;
      return filters[key](item[key]);
    });
  });
}


export function isEmailUniqueValidation(control: AbstractControl): Promise<any> | Observable<any> {
  //@ts-ignore
  const self = this;
  let regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const promise = new Promise<any>((resolve, reject) => {
    if (self.email_id && self.email_id == control.value) {
      resolve(null);
    }
    self.emailCheckingloading = false;
    if (control.value && control.value.match(regx) !== null) {
      self.userApi.isUnique('user_name', control.value).then((data: ResponseData) => {
        if (!data.result.length) {
          resolve(null);
        } else {
          resolve({ 'isNotUnique': true });
        }
      }).catch((error: any) => {
        resolve({ 'isNotUnique': true });
      }).finally(() => {
        self.emailCheckingloading = false;
      });
    } else {
      resolve(null);
    }
  });
  return promise;
}

export function isMobileUniqueValidation(control: AbstractControl): Promise<any> | Observable<any> {
  //@ts-ignore
  const self = this;
  const code = control.parent?.value?.country_code || '91';
  const phone = code + control.value;
  let regx = VALIDATOR_PATTERNS.MOBILE;
  const promise = new Promise<any>((resolve, reject) => {
    if (self.mobile_no && self.mobile_no == control.value) {
      resolve(null);
    }
    self.mobileCheckingloading = false;
    if (control.value && control.value.match(regx) !== null) {
      self.userApi.isUnique('mobile_no', phone).then((data: ResponseData) => {
        if (!data.result.length) {
          resolve(null);
        } else {
          resolve({ 'isNotUnique': true });
        }
      }).catch((error: any) => {
        resolve({ 'isNotUnique': true });
      }).finally(() => {
        self.mobileCheckingloading = false;
      });
    } else {
      resolve(null);
    }
  });
  return promise;
}

export function conditionalValidator(predicate: any, validator: any) {
  return ((formControl: any) => {
    if (!formControl.parent) {
      return null;
    }
    if (predicate()) {
      return validator(formControl);
    }
    return null;
  })
}

export function removeTableClass(elRef: any) {
  let el = elRef.nativeElement.querySelectorAll(".table-responsive div");
  el.forEach((cl: any) => {
    cl.classList.remove('ui-table-wrapper');
    cl.classList.remove('ui-table');
    cl.classList.remove('ui-widget');
    cl.classList.remove('ui-table-responsive');
    cl.classList.remove('ui-table-auto-layout');
    cl.classList.remove('ui-table-resizable');
    cl.classList.remove('ui-widget-header');
    cl.classList.remove('ui-table-thead');
  });

}

export function decryptData(data: any) {
  return data;
}

export function encryptData(data: any) {
  if (data === "")
    return;
  data = data.toString();
  return data;
}

export function isEmptyObj(obj: any) {
  if (obj && typeof obj === 'object') {
    return Object.getOwnPropertyNames(obj).length == 0;
  } else {
    return true;
  }
}

export function cloneData(data: any) {
  return structuredClone(data);
}

export function jsonParse(str: any) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}
export function isExistsKey(obj: any, props: Array<string>): any {
  var prop = props.shift();
  return prop === undefined ? true : obj.hasOwnProperty(prop) ? isExistsKey(obj[prop], props) : false;
}
export function uniqueArray(a: any) {
  return a.filter(function (i: any, p: any) {
    return a.indexOf(i) == p;
  });
}

export function sort(arr: any, prop: string, desc?: boolean) {
  arr.sort(function (a: any, b: any) {
    if (!a[prop]) return -1;
    return a[prop].localeCompare(b[prop], "en", { ignorePunctuation: true });
  });
  if (desc) arr.reverse();
  return arr;
}

export function arrayGroupBy(xs: any, f: any) {
  return xs.reduce((r: any, v: any, i: any, a: any, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}
export function randomString(len: number, charSet = '') {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < len; i++) {
    let randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export function mysqlDataTime(fdate: any = new Date(), type: 'DATE' | 'DATETIME' = 'DATETIME') {
  if (!fdate) return '';
  const d = fdate instanceof Date ? fdate : new Date(fdate);
  const month = fdate instanceof Date ? d.getMonth() + 1 : d.getMonth();
  return type == 'DATE' ? `${d.getFullYear()}-${month}-${d.getDate()}` : `${d.getFullYear()}-${month}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
}
export function getMonthLastDate(date: any) {
  date = date instanceof Date ? date : new Date(date);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(lastDay)
  return date;
}


export function isValidUrl(url: any) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}
export function isPastDate(date: any): boolean {
  date = date instanceof Date ? +date : +new Date(date);
  const cDate = +new Date();
  return cDate > date
}

export function betweenTwoDays(fromDate: any, toDate: any) {
  fromDate = fromDate instanceof Date ? fromDate : new Date(fromDate);
  toDate = toDate instanceof Date ? toDate : new Date(toDate);
  const timeDiff = toDate.getTime() - fromDate.getTime();
  const res = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return Math.abs(res)
}