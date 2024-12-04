import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthApiService } from 'src/app/core/service/auth-api.service';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { arrayGroupBy, isEmailUniqueValidation, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilder, ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { USER_ROLE_FORM } from '../../helper/user_form';
import { groupModule } from '../../page/role-permission/role-permission.component';
import { UserApiService } from '../../services/user-api.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  roleFormData: formBuilder[] = USER_ROLE_FORM;
  urlService = UrlServices.PAGE_URL;
  roleRequired: boolean = false;
  module: groupModule = {};
  moduleArray: any = [];
  loading: boolean = false;
  userForm: UntypedFormGroup = {} as UntypedFormGroup;
  userData: any = {};
  emailCheckingloader: boolean = false;
  data: any = {};
  submitted: boolean = false;
  tblRole: Array<any> = [];
  public onClose: Subject<boolean> = new Subject();
  userService: any;
  userId: any;
  pageInfo: pageInfo = { title: '' }
  cols = [{ colName: 'roleName', title: 'Role' }, { colName: 'regionName', title: 'Region' }, { colName: 'zoneName', title: 'Zone/State' }, 
  // { colName: 'adName', title: 'MS Office' },
  { colName: 'dName', title: 'Department' }, { colName: 'promotionalName', title: 'Church Ministry Area' }];

  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  constructor(private userApi: UserApiService,
    private masterApi: MasterApiService,
    private authApi: AuthApiService,
    private auth: AuthService,
    private modalService: ModalService,
    private navigation: NavigationService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.queryParams.id || '';
    this.pageInfo = {
      title: `${this.userId ? 'Update ' : 'Add '} User Detail`,
      buttonShowBtn: this.auth.checkPermission('USER', 'VIEW_ALL'),
      button: { url: this.urlService.USER.LIST.URL, title: 'User List' }
    }
    this.initForm();
    if (this.userId) {
      this.getUserData();
    }
    this.getData();
  }

  getData(tbl: any = 'module') {
    this.masterApi.getFullData(tbl, []).then(async (res: ResponseData | any) => {
      if (res.statusCode == 200) {
        if (tbl == 'module') {
          this.convertModuleArray(res.result);
        }
      }
    });
  }

  onChange(e: any) { }
  setInput(data: any) {
    this.data = data;
    this.getUserData();
  }

  initForm() {
    this.userForm = new UntypedFormGroup({
      password: new UntypedFormControl('', [Validators.required]),
      fname: new UntypedFormControl('', [Validators.required]),
      lname: new UntypedFormControl('',),
      user_name: new UntypedFormControl('', [Validators.required], [isEmailUniqueValidation.bind(this)]),
    });
  }



  applyFormvalue() {
    if (!isEmptyObj(this.userData)) {
      const patch = this.userData;
      patch.role = "";
      this.userForm.patchValue(patch);
    }
  }

  getUserData() {
    if (this.userId) {
      this.userApi.getUserData(this.userId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.userData = res.result;
          if (this.userData.role) {
            this.tblRole = this.userData.role;
            if (res.result.role.length) {
              this.mapTableData()
              this.getRolePermission();
            }
          }
          const val = ['password', 'lname', 'fname'];
          this.userForm.controls["user_name"].clearAsyncValidators();
          this.userForm.controls["user_name"].setValidators(Validators.required);
          this.userForm.controls["user_name"].updateValueAndValidity();
          val.forEach(e => {
            if (this.userData.staff_id || e == 'password') {
              this.userForm.controls[e].clearValidators();
              this.userForm.controls[e].updateValueAndValidity();
            }
          });
          this.applyFormvalue()
        }
      })
    }
  }

  showView(i: any) {
    this.modalService.openInfoModal({ formData: this.roleFormData, title: 'Role Permission Info', sourceData: i, btn: 'Close' }, 'modal-lg');
  }

  convertModuleArray(data: any) {
    this.moduleArray = data.map((a: any) => a.controlName = a.moduleName + '-' + a.actionName);
    const formGroup = arrayGroupBy(data, (a: any) => a.moduleName);
    this.module = formGroup;
  }

  mapModuleWithRole(role: Array<any>) {
    if (!isEmptyObj(this.module)) {
      if (isEmptyObj(this.moduleArray)) {
        this.convertModuleArray(this.module);
      }
      const roleId = role.map((a: any) => a.role_id)
        .filter((v: any, i: any, self: any) => self.indexOf(v) === i);
      Object.keys(this.module).map((a: any) => {
        this.module[a].map((b: any) => {
          const s = role.filter((f: any) => f.action_id == b.action_id && f.module_id == b.module_id) || []
          if (s.length) {
            b.checked = true;
          } else {
            b.checked = false;
          }
        })
      })
    }
  }

  getRolePermission() {
    const idArry: Array<any> = [];
    this.tblRole.map((a: any) => {
      idArry.push(a.role_id)
    });
    if (!idArry.length) {
      this.mapModuleWithRole([]);
      return;
    }
    const id = idArry.join(',')
    this.authApi.getRolePermissionByRole(id, true).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.mapModuleWithRole(res.result);
      }
    })
  }

  mapTableData() {
    this.tblRole.map((r: any) => {
      this.roleFormData.forEach((a: formBuilder) => {
        this.cols.map((b: any) => {
          if (b.colName == a.selectKeyName) {
            r[b.colName] = r[a.colName] == '0' ? 'All' : r[a.colName] ? r[b.colName] : 'None';
          }
        })
      })
    })
  }

  async addRole() {
    const tblData = this.basicForm?.getFormValue();
    if (!this.basicForm?.isValid()) {
      return;
    }
    let lastIndex = this.tblRole.length - 1;
    let pushed = false;
    if (lastIndex == -1) {
      pushed = true;
      this.tblRole.push(tblData)
    } else {
      const s = await JSON.stringify(tblData);
      let isDup = false;
      await this.tblRole.forEach(async (a, i) => {
        const dest = await JSON.stringify(a);
        if (dest === s) {
          isDup = true;
        }
      });
      if (!isDup) {
        this.tblRole.push(tblData);
      }
    }
    this.mapTableData();
    this.resetUserForm();
    this.getRolePermission();
  }
  
  resetUserForm() {
    this.basicForm?.reset();
  }

  deleteRow(i: any, update = false) {
    this.tblRole.splice(i, 1);
    if (update) {
      this.getRolePermission();
    }
  }

  close() {
    this.navigation.back();
  }

  apiPayload() {
    const payload: any = {};
    payload['user_name'] = this.userForm.value.user_name;
    if (this.userForm.value.password) {
      payload['password'] = this.userForm.value.password;
    }
    payload['role'] = this.tblRole;
    if (this.userData.user_id) {
      payload['id'] = this.userData.id;
      payload['user_id'] = this.userData.user_id;
    }
    // no need to update staff name or sponsor name
    if (this.userData.staff_id || this.userData.sponsor_id) {
      return payload;
    }
    payload.fname = this.userForm.value.fname,
      payload.lname = this.userForm.value.lname
    return payload;
  }

  saveData() {
    this.submitted = true;
    if (this.userForm.valid) {
      this.loading = true;
      this.userApi.saveUser(this.apiPayload()).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.alertService.showToast('User details has been saved..', 'success');
          this.onClose.next(true);
          this.close();
        } else {
          this.alertService.showToast('', 'error');
        }
      }).finally(() => {
        this.loading = false;
      })
    } else {
      this.alertService.showToast('form not valid', 'warn');
    }
  }
}
export interface masterData {
  [key: string]: Array<any>
};