import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthApiService } from 'src/app/core/service/auth-api.service';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { arrayGroupBy, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss']
})
export class RolePermissionComponent implements OnInit {
  module: groupModule = {};
  roleForm: UntypedFormGroup = {} as UntypedFormGroup;
  roleData: Array<any> = [];
  roleId: string = '';
  moduleArray: any = [];
  loading: boolean = false;
  roleInfo: any = {};
  urlService = UrlServices;
  constructor(private masterApi: MasterApiService, private router: ActivatedRoute,
    private alertService: AlertService,
    private navigation: NavigationService,
    private authApi: AuthApiService) { }

  ngOnInit(): void {
    this.roleId = this.router.snapshot.queryParams.id || '';
    this.initForm();
    this.getData('module');
    this.getRolePermission();
    this.getRoleName();
  }
  getRoleName() {
    this.masterApi.getById('role', this.roleId).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.roleInfo = res.result;
      }
    })
  }

  getRolePermission() {
    this.authApi.getRolePermissionByRole(this.roleId, true).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result.map((a: any) => a.controlName = a.moduleName + '-' + a.actionName);
        this.roleData = res.result;
        this.applyFormValue();
      }
    })
  }

  initForm(formArray: any =[]) {
    const group: any = {};
    formArray.map((a: any) => {
      group[a.controlName] = new UntypedFormControl('', []);
    });
    this.roleForm = new UntypedFormGroup(group);
    if (this.roleData.length) {
      this.applyFormValue();
    }
  }

  applyFormValue() {
    const fomrValue: any = {};
    const lastIndex = this.roleData.length - 1;
    if (this.roleData.length) {
      this.roleData.map((a: any, i) => {
        if (!isEmptyObj(a)) {
          console.log(a)
          fomrValue[a.controlName] = true;
          if (i == lastIndex) {
            console.log(fomrValue)
            if (this.roleForm) {
              this.roleForm.patchValue(fomrValue);
            }
          }
        }
      });
    }
  }

  getData(tbl: string) {
    this.masterApi.getFullData(tbl, [], true).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result.map((a: any) => a.controlName = a.moduleName + '-' + a.actionName);
        if (tbl == 'module') {
          this.moduleArray = res.result;
          const formGroup = arrayGroupBy(res.result, (a: any) => a.moduleName);
          this.initForm(res.result);
          this.module = formGroup;
        }
      }
    }).finally(() => {
      this.loading = false;
    })
  }

  async apiPayload() {
    const payLoad: any = {};
    payLoad['role'] = [];
    await Object.keys(this.roleForm.controls).map(async (a: any) => {
      const key = a.split('-')?.[0];
      if (!this.roleForm.value[a]) {
        return;
      }
      if (!isEmptyObj(this.module[key])) {
        await this.module[key].map(b => {
          if (a == b.controlName) {
            const f = { moduleActionId: b.moduleActionId, role_id: this.roleId };
            payLoad['role'].push(f);
          }
        })
      }
    });
    return payLoad;
  }
  async saveRole() {
    const data = await this.apiPayload();
    this.loading = true;
    this.authApi.saveRolePermission(data, this.roleId).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Permission has been updated', 'success');
        this.navigation.back();
      } else {
        this.alertService.showToast("We could'nt save your changes ", 'error');
      }
    }).finally(() => {
      this.loading = false;
    })
    //if(this)
  }
}

export interface groupModule {
  [key: string]: Array<any>
}