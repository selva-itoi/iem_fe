import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { Observable, lastValueFrom } from 'rxjs';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { ResponseData, formValidator } from 'src/app/helper/interface/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsyncApiService {

  constructor(private http: HttpClient) { }
  // isEmailUnique(username: any) {
  //   return lastValueFrom(this.http.get(`${environment.apiUrl}/users/isEmailUnique/${username}`));
  // }

  isMobileUnique(id: any, skipId: any = '') {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/users/isMobileUniqueStaff/${id}/${skipId}`))
  }

  isUniqueMobileValidation(validator: formValidator): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const key: any = validator.name,
        val = control.value,
        error = Object.keys(control?.errors || {}).some(a => a !== key),
        formValue = control.parent?.value,
        skipVal = formValue[validator.skipAsync?.key || ''] || validator.skipAsync?.value || '',
        promise = new Promise<any>((resolve, reject) => {
          if (!error) {
            this.isMobileUnique(val, skipVal).then((res: ResponseData) => {
              if (res.statusCode == RESPONSE_CODE.SUCCESS) {
                const r = res?.result;
                resolve(!r ? { [key]: !r } : null)
              } else {
                resolve({ [key]: true })
              }
            }).catch(() => resolve({ [key]: true }))
          }
        })
      return promise
    };
  }
}
