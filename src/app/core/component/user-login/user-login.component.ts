import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstant, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { ResponseData } from 'src/app/helper/interface/response';
import { User } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { AuthApiService } from '../../service/auth-api.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  login_type = AppConstant.DEFAULT_LOGIN;
  loginForm: UntypedFormGroup = {} as UntypedFormGroup;
  @ViewChild('otp1') input: any;
  UrlService = UrlServices;
  returnUrl: string = '';
  isLoading: boolean = false;
  errorMessage: any;
  statusMes: any;
  constructor(private authApi: AuthApiService, private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }
  sendingOtp: boolean = false;
  submitted: boolean = false;
  userData: User = {} as User;
  status = false;
  statusMessage: string | null = '';
  otpString: string[] = ['', '', '', ''];
  mobile_no = new UntypedFormControl('', [Validators.required, Validators.pattern("^((\\+91-?) |0)?[0-9]{10}$")]);
  isOtp: boolean = false
  radioForm: UntypedFormGroup = {} as UntypedFormGroup
  otpResentInterval: any
  otpInterval: any
  ngOnInit(): void {
    this.initVariable();
    this.formInit();
    this.radio();
    const url = this.router.url;
    if (url.search('/pw') > -1) {
      this.login_type = 'PASSWORD';
    }
    if (this.login_type != 'BOTH') {
      this.toggleOption(this.login_type);
    }
  }

  startTimer(interval: number) {
    this.otpInterval = interval
    this.otpResentInterval = setInterval(() => {
      if (this.otpInterval > 0) {
        this.otpInterval--;
      }
      if (this.otpInterval == 0) {
        clearInterval(this.otpResentInterval)
      }
    }, 1000)
  }

  initVariable() {
    this.submitted = false;
    this.sendingOtp = false;
    this.status = false;
  }
  radio() {
    this.radioForm = new UntypedFormGroup({
      loginOption: new UntypedFormControl('PASSWORD')
    })
  }
  get loginOption() { return this.radioForm.controls.loginOption.value }
  formInit() {
    this.loginForm = new UntypedFormGroup({
      'username': new UntypedFormControl(null, [Validators.required]),
      'password': new UntypedFormControl(null, [Validators.required])
    });
  }

  sendOtp(isResend: boolean = false) {
    this.startTimer(120)
    if (this.mobile_no.invalid) {
      return
    }
    this.sendingOtp = true;
    const mobile = this.mobile_no.value;
    const api = isResend ? this.authApi.resendOtp(mobile, this.login_type) : this.authApi.otpSend(mobile, this.login_type);
    api.then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.isOtp = true;
        this.alertService.showToast('OTP Sent', 'info');
      } else
        this.statusMessage = 'unable to sent OTP';
    }).finally(() => {
      this.isLoading = false
      this.sendingOtp = false
    }).catch(err => this.alertService.showToast(err, 'info'))
  }

  onlyNumber(a: any) {
    let keycode = a.which ? a.which : a.keyCode
    const pattern = /[0-9]{10}/
    if (pattern && a.which == '13') {
      this.sendOtp()
    }
    if (keycode > 31 && (keycode < 48 || keycode > 57)) {
      return false;
    } else {
      return true
    }
  }
  getApiPayload() {
    let loginAPIPayload: any = {};
    loginAPIPayload.username = this.loginForm.value.username,
      loginAPIPayload.password = this.loginForm.value.password;
    return loginAPIPayload;
  }
  toggleOption(val: any) {
    this.radioForm.patchValue({ loginOption: val })
  }

  otp(event: any, prev: any, next: any, index: any): any {
    const pattern = /[0-9]/;
    const value = event.target.value;
    const inputChar: any = +event.key || -1;
    //let inputChar = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (event.key == 'Backspace') {
      if (prev) {
        prev.focus();
      }
      this.otpString[index] = '';
      return;
    }

    if (!pattern.test(inputChar)) {
      event.preventDefault();
      this.otpString[index] = '';
      return;
    }
    // console.log(value.length, ' value length', 'codiiton ', value.length > 1)
    if (value.length) {
      this.otpString[index] = value;
    }
    console.log(this.otpString, ' value otp')
    if (value.length < 1 && prev) {
      prev.focus();
    } else if (next && value.length > 0) {
      next.focus();
    } else {
      if (next == '') {
        this.formSubmit();
      } else return 0;
    }
  }

  async formSubmit() {
    this.errorMessage = ''
    this.statusMessage = null;
    this.submitted = true;
    const otp = this.joinOtpArray(this.otpString);
    this.userData = {} as User;
    const payload = { otp: otp, mobile_no: this.mobile_no.value };
    this.isLoading = true;
    await this.alertService.showToast('Verifying...', 'info');
    let API: any;
    if (!this.loginForm.valid && this.login_type == 'PASSWORD')
      return;
    switch (this.loginOption) {
      case 'OTP':
        this.statusMes = 'Verifying otp...';
        API = this.authApi.loginOTP(payload);
        break;

      case 'PASSWORD':
        API = this.authApi.login(this.getApiPayload());
        break;
    }
    API.then(async (res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        await this.loggedIn(res);
      } else {
        this.statusMessage = String(res.message || '');
        if (this.login_type == 'PASSWORD') {
          this.statusMessage = 'Your username or password is incorrect';
        }
      }
    }).catch((err: any) => {
      this.errorMessage = err;
      this.otpString = ['', '', '', ''];
      this.statusMessage = err;
    }).finally(() => {
      this.isLoading = false;
      this.alertService.clearToast();
    })
  }
  async loggedIn(res: any) {
    this.userData = res.result;
    if (res.result.role.length) {
      this.userData.permission = await this.authService.mapRolePermission(res.result.role);
    }
    if (this.userData.token) {
      this.authService.setApplicationUser(this.userData);
      this.goToPage();
    } else {
      this.statusMessage = String(res.message);
    }
  }

  joinOtpArray(otp: any) {
    if (!otp || otp == '') return 0;
    const otpNew = otp.join('');
    return otpNew;
  }

  clearAll() {
    this.authService.clearLocalStorage();
    this.authService.clearSubscribe();
    this.status = false;
  }

  get Url() {
    return decodeURIComponent(this.route.snapshot.queryParams['returnUrl'])
  }
  goToPage() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      const url: URL = new URL('http://local' + decodeURIComponent(returnUrl));
      const query: any = {};
      if (url.hash) {
        query.fragment = url.hash.replace("#", "")
      }
      if (url.search) {
        query.queryParams = url.searchParams;
      }
      this.router.navigate([url.pathname], query);
    }
    else {
      this.router.navigateByUrl('/' + UrlServices.DASHBOARD_ROUTE);
    }
  }

  ngOnDestroy() {
    this.formInit();
    this.initVariable();
    clearInterval(this.otpResentInterval);
  }

}