import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { AuthApiService } from '../../service/auth-api.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  mode: 'FORGOT' | 'CHANGE' = 'CHANGE'
  showSection: 'OTP' | 'CHANGE' | 'USERNAME' = 'CHANGE';
  dataForm: UntypedFormGroup = {} as UntypedFormGroup;
  title: string = 'Change Password';
  sub_title: string = 'Type your password'; //'Type Email/Mobile to recover password.';
  error_info: string | any = '';
  loading: boolean = false;
  isModal: boolean = false;
  public onClose: Subject<boolean> = new Subject();
  constructor(private authApi: AuthApiService,
    private auth: AuthService,
    private modelService: ModalService,
    //private navi: AuthService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.changeSegment();
    this.initForm();
  }


  setInput(data: any) {
    this.mode = data.mode;
    this.isModal=true;
    this.changeSegment();
  }

  changeSegment(status: any = '') {
    if (status) {
      this.showSection = status;
    } else if (this.mode == 'FORGOT') {
      this.showSection = 'USERNAME';
    } else {
      this.showSection = 'CHANGE';
    }
    this.initForm();
  }

  initForm() {
    this.dataForm = new UntypedFormGroup({
      //username: new FormControl('', [Validators.required]),
      //email_id: new FormControl('', [Validators.required]),
      // mobile_no: new FormControl('', [Validators.required, Validators.pattern(VALIDATOR_PATTERNS.MOBILE)],
      //   [conditionalValidator(() => this.mode == 'FORGOT', //set optional relationship id
      //     Validators.required)
      //   ]),
      user_id: new UntypedFormControl(this.auth.currentUserValue.user_id || '', [Validators.required]),
      old_password: new UntypedFormControl('',[Validators.required]),
      password: new UntypedFormControl('',[Validators.required,matchValidator('confirm_password', true)]),
      confirm_password: new UntypedFormControl('', [matchValidator('password')])
    })
  }

  apiPayload() {
    const apiPayload = this.dataForm.value;
    return apiPayload;
  }


  changePassword() {
    this.error_info = '';
    console.log(this.dataForm)
    if (this.dataForm.valid) {
      this.loading = true;
      this.authApi.changePassword(this.apiPayload()).then((res: ResponseData | any | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.alertService.showToast('Password has been Changed Successfully', 'success');
          this.close();
        } else {
          this.error_info = res.message;
        }
      }).catch(err => {
        if(err){
          this.error_info = err;
        }
        this.alertService.showToast('Unable to save your request', 'error');
      }).finally(() => this.loading = false);
    }
  }

  close(status = true) {
    if (this.isModal) {
      this.modelService.close();
      this.onClose.next(status);
    }
  }

}

export function matchValidator(
  matchTo: string,
  reverse?: boolean
): ValidatorFn {
  return (control: AbstractControl):
    ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    return !!control.parent &&
      !!control.parent.value &&
      control.value ===
      (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
  };
}