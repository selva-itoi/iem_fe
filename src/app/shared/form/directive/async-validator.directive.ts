import { HttpResponse } from '@angular/common/http';
import { AbstractControl, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncApiService } from '../service/async-api.service';
import {  Directive, forwardRef, Input  } from '@angular/core';

@Directive({
  selector: '[appAsyncValidator][formControlName], [asyncValidator][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => AsyncValidatorDirective),
      multi: true,
    },
  ],
})
export class AsyncValidatorDirective {
  @Input() asyncValidator: { coupledControl: AbstractControl; apiFun: string } = {} as any;

  validate(
    control: AbstractControl,
  ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> {
    return this.validateIsExistAsync(control);
  }

  constructor(private asyncApi: AsyncApiService) {}
  validateIsExistAsync(control: AbstractControl) {
    if (!control.pristine) {
      const coupledControl: AbstractControl = this.asyncValidator.coupledControl;
    //@ts-ignore
      return this.asyncApi[apiFun](coupledControl.value)
        .map((response: HttpResponse<boolean>) => {
          return !response.body ? null : { asyncInvalid: true };
        });
    }
    return Promise.resolve(null);
  }
}
