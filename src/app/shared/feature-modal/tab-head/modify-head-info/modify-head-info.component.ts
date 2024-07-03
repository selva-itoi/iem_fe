import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MODIFY_INFO_UPDATE_INFO } from 'src/app/core/helper/core_form_helper';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { ResponseData, modifyActionType } from 'src/app/helper/interface/response';
import { Concrete, actionInterface, modulInterface } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';

@Component({
  selector: 'modify-head-info',
  templateUrl: './modify-head-info.component.html'
})
export class ModifyHeadInfoComponent implements OnInit {
  @Input() info_message = '';
  @Input() data: any = {};
  @Input() modifyData: any = {} as modifyApi;
  @Input() type: modifyActionType = 'MODIFICATION_SUBMIT';
  @Input() text_type: 'info' | 'warning' | 'danger' | 'default' = 'info';
  @ViewChild("modifyFooter", { static: false }) modifyFooter: TemplateRef<any> | any
  @ViewChild("modifyAlert", { static: false }) modifyAlert: TemplateRef<any> | any
  @ViewChild("modifyInfo", { static: false }) modifyInfo: TemplateRef<any> | any
  hasPermissionApprove: boolean = false;
  @Input() module: Concrete<keyof modulInterface> = 'STAFF';
  @Input() permission: Concrete<keyof actionInterface> = 'VERIFY'
  @Input() loading: boolean = false;
  @Input() getApiApprove: ((args?: any) => any) | any;
  @Input() bsModalRef: BsModalRef = {} as BsModalRef;
  @Output() onSubmit: EventEmitter<{ action: 'APPROVE' | 'REJECT' | 'CANCEL' | 'REVIEW', status: boolean, result: any }> = new EventEmitter();
  modifyMapData:any = MODIFY_INFO_UPDATE_INFO
  constructor(private auth: AuthService, private nav: NavigationService,
    private alertService: AlertService,
    private modifyService: ModifyService) { }
  ngOnInit(): void {
    this.hasPermissionApprove = this.auth.checkPermission(this.module, this.permission);
  }

  getById(id: any) {
    this.modifyService.getById(id).then((res: ResponseData | any | any) => {
      this.modifyData = res.result;
    })
  }

  approve() {
    const approveRequest = this.getApiApprove.bind(this);
    this.loading = true;
    this.modifyService.approve(approveRequest, this.modifyData).then(res => {
      this.alertService.showToast('Successfully Request Approved', 'success');
      this.onSubmit.emit({ action: 'APPROVE', status: true, result: res });
      this.close(true);
    }).finally(() => this.loading = false).catch(err => {
      this.loading = false;
      this.alertService.showToast(err.msg, 'info');
    });
  }

  review() {

  }

  reject() {
    this.loading = true;
    this.modifyService.reject(this.modifyData?.id).then(res => {
      this.alertService.showToast('Successfully Request Rejected', 'success');
      this.onSubmit.emit({ action: 'REJECT', status: true, result: res });
      this.close(true);
    }).finally(() => this.loading = false)
      .catch((err: any) => {
        this.loading = false;
        this.alertService.showToast(err.msg, 'info');
      });
  }
  close(status: boolean = false) {
    console.log('closed modal called')
    if (!isEmptyObj(this.bsModalRef)) {
      this.bsModalRef.hide();
      this.bsModalRef.content.onClose.next(status);
    } else {
      this.nav.back();
    }
  }
}