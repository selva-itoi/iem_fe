import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { MODULE_NAME, PERMISSION, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { isArray } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { formBuilderData, ResponseData } from 'src/app/helper/interface/response';
import { User } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { StaffEducationComponent } from 'src/app/modules/staff/component/staff-education/staff-education.component';
import { EDU_STATUS } from 'src/app/modules/staff/helper/staff_form';
import { ProfileWidgetComponent } from 'src/app/shared/feature-modal/profile-widget/profile-widget.component';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { CHILD_PHY_FORM } from '../../helper/child-form';
import { ChildApiService } from '../../service/child-api.service';

@Component({
  selector: 'app-child-edu-yearly-update',
  templateUrl: './child-edu-yearly-update.component.html',
  styleUrls: ['./child-edu-yearly-update.component.scss']
})
export class ChildEduYearlyUpdateComponent implements OnInit {
  type: 'VERIFICATION' | 'UPDATE' = 'UPDATE';
  basicFormData: formBuilderData[] = CHILD_PHY_FORM;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('childEdu') childEdu: StaffEducationComponent | undefined;
  @ViewChild('profile') profile: ProfileWidgetComponent | undefined;
  childId: string = '';
  data: any;
  disabled_save: boolean = false
  hasPermissionApprove: boolean = false
  public onClose: Subject<boolean> = new Subject();
  EDU_STATUS: Array<any> = EDU_STATUS;
  pageInfo: pageInfo = {} as pageInfo
  isModal: boolean = false;
  user: User = this.auth.currentUserValue;
  loading: boolean = false;
  childData: any = {};
  modifyData: any = {};
  config: any = { title: '', type: 'CHILD' };
  isModifyRequest: boolean = false
  // _bsModalRef: BsModalRef = {} as BsModalRef;
  constructor(private childApi: ChildApiService, private auth: AuthService, private modifyService: ModifyService,
    private navigation: NavigationService,
    private modifyrequest: ModifyService,
    private _bsModalRef: BsModalRef,
    private alertController: AlertService) { }
  ngOnInit(): void {
    this.pageInfo = { title: 'Education Update ' + this.childId, };
    this.hasPermissionApprove = this.auth.checkPermission('CHILD_EDUCATION', 'VERIFY');
    this.basicForm?.setSubmitted(false);
  }
  setInput(d: any) {
    this.isModal = true;
    this.type = d.type == 'UPDATE' ? 'UPDATE' : 'VERIFICATION';
    // this.config.isRequest = this.type=='UPDATE' ? false:true;
    this.childEdu?.mapConfig(this.config)
    if (d.child_id) {
      this.childId = d.child_id;
      this.basicForm?.setSubmitted(false);
      this.getChildBasic();
      this.getAllPendingEdu(d.category || 'NOW');
    } else {
      // modify
      this.modifyData = d;
      this.childData = d.request_data;
      console.log(this.childData, 'modify data')
      setTimeout(() => {
        this.childEdu?.setData(d.request_data?.education || []);

      }, 800);
      this.childId = d.request_data.child_id || ''
    }
  }

  getAllPendingEdu(cat: any) {
    if (this.childId) {
      this.childApi.pendingEduByChild(cat, this.childId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.childData = res.result;
          // this.isModifyRequest = +this.childData?.modify_request ? true : false;
          this.childEdu?.setData(res.result || []);
        }
      })
    }
  }
  getChildBasic(){
      if(this.childId){
        this.childApi.getBasic( this.childId).then((res: ResponseData | any) => {
          if (res.statusCode == RESPONSE_CODE.SUCCESS) {
            const data = res.result;
            this.isModifyRequest = +data?.modify_request ? true : false;
          }
        })
      }
  }
  onChange(ev: any) { }
  apiPayload() {
    const profile = this.profile?.basicInfo;
    const payload = this.basicForm?.apiPayload();
    payload.education = this.childEdu?.apiPayload();
    payload.child_id = this.childId;
    payload.created_by = this.user.user_id;
    payload.child_type = profile?.child_type || '';
    payload.name = profile?.name || '';
    return payload;
  }
  close(status = false) {
    if (!this.isModal) {
      this.navigation.back();
      return;
    }
    this._bsModalRef.hide();
    this.onClose.next(status);
  }

  approve() {
    this.loading = true;
    this.modifyService.approveModification(this.approveRequest.bind(this), this.modifyData).then(res => {
      if (res.status) {
        this.alertController.showToast(res.msg, 'success');
      } else {
        this.alertController.showToast(res.msg, 'info');
      }
      this.close(true);
    }).catch(err => {
      this.alertController.showToast(err, 'error');
    }).finally(() => {
      this.loading = false;
    });
  }

  approveRequest() {
    return new Promise<boolean>((resolve, reject) => {
      if (isArray(this.childData)) {
        reject('empty data');
      }
      let API: Promise<any> = this.childApi.saveEducation(this.modifyData.request_data);
      API.then(async (res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          resolve(true);
        } else {
          this.alertController.showToast(res?.message, 'info');
          reject('Server Cannot handle the request');
        }
      }).catch(err => {
        this.alertController.showToast(err, 'error');
        reject('Server Cannot handle the request');
      })
    });
  }

  reject() {
    const data: modifyApi = {} as modifyApi;
    data.action_by = this.auth.currentUserValue.user_id;
    this.modifyService.rejectModification(this.rejectRequest.bind(this), this.modifyData).then(res => {
      if (res.status) {
        this.alertController.showToast(res.msg, 'success');
      } else {
        this.alertController.showToast(res.msg, 'info');
      }
      this.close(true);
      console.log(res, 'result for confir, rejected')
    }).catch(err => {
      this.alertController.showToast(err, 'error');
      console.log(err, 'error for confir, approve')
    })
  }

  rejectRequest(): Promise<any> {
    return new Promise<boolean>((resolve, reject) => {
      this.loading = true;
      this.childApi.rejectEdu(this.childData).then((res: ResponseData | any) => {
        resolve(true);
      }).catch(err => {
        reject('Unable handle your Request');
      });
    });
  }

  apiPayloadModify() {
    const payload: any = {},
      eduApi = this.apiPayload();
    payload.created_by = this.user.user_id,
      payload.action_id = PERMISSION.UPDATE;
    payload.description = eduApi.name + 'Requested for Education Record Update';
    payload.ref_id = eduApi.child_id || '';
    payload.home = eduApi.home;
    payload.child_id = this.childId;
    payload.child_type = eduApi.child_type;
    payload.module_id = MODULE_NAME.CHILD_EDUCATION;
    return payload;
  }

  submit() {
    const payload = this.apiPayload();
    if (payload.height || payload.weight || payload.sickness || payload.health_cond) {
      this.basicForm?.setSubmitted(true);
      if (!this.basicForm?.isValid()) {
        return;
      }
    }
    this.sendModify();
  }

  sendModify() {
    const data = this.apiPayload();
    const modifyApi = this.apiPayloadModify();
    this.loading = true;
    this.modifyrequest.saveModification(modifyApi, data).then((res: any) => {
      if (res) {
        this.disabled_save = true;
        this.close(true);
      }
    }).catch((err: any) => {
      this.alertController.showToast('Unable to save the Record', 'error');
    }).finally(() => this.loading = false);
  }

  save(data: any) {
    this.childApi.saveEducation(data).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {

      }
    })
  }
}
