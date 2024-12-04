import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ObjectString } from 'src/app/core/helper/core.data.interface';
import { COMMON_INFO_UPDATE_INFO } from 'src/app/core/helper/core_form_helper';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { ResponseData, formBuilderData, tableAction, tableBuilder, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { ACCOUNT_FORM, ACCOUNT_SETTLEMENT_LIST, SETTLEMENT_VIEW_TBL } from '../../helper/account-form';
import { AccountApiService } from '../../service/account-api.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  isModal: boolean = false;
  pageInfo: any;
  basicFormData: formBuilderData[] = [...JSON.parse(JSON.stringify(ACCOUNT_FORM)).map((a: any) => { a.hidden = false; return a }), ...[{ colName: 'current_balance', title: 'Current Balance', colType: 'CURRENCY' }]];
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('sTbl') sTbl: TableListComponent | undefined;
  accountData: any
  accountId: any;
  dataLoading: boolean = false
  loading: boolean = false
  updateInfo: any = COMMON_INFO_UPDATE_INFO
  segement: ObjectString = {
    BASIC: 'Basic',
    SETTLEMENT: 'Settlement',
    TRANSACTION: 'Transaction',
    // LOG: 'Log',
  }
  logData: any
  // LIST_COL: tableColum[] = [...[{ colName: 'narration', title: 'Description' }, { colName: 'transactionTypeName', title: 'Transaction Type' }], ...cloneData(SETTLEMENT_VIEW_TBL).filter((a: any) => !['name'].includes(a?.colName))]
 
  LIST_COL: tableColum[] = [...cloneData( ACCOUNT_SETTLEMENT_LIST)]
  tableConfig: tableBuilder = {
    name: 'Payroll List',
    column: this.LIST_COL,
    action: [],
    // showFilter: true,
    isLazy: true
  }
  info_message: string = ''
  currentSegment: string = this.segement.BASIC;
  type: 'MODIFICATION' | 'VIEW' = 'VIEW';
  modifyData: any
  officeLoading: any
  _bsModalRef: BsModalRef = {} as BsModalRef;
  public onClose: Subject<boolean> = new Subject();
  officeKeys = [{ colName: 'accountName', title: 'Name' }, { colName: 'regionName', title: 'Region' }, { colName: 'zoneName', title: 'Zone' }, { colName: 'email_id', title: 'Email Id' },
  { colName: 'mobile_no', title: 'Phone' }];
  hasPermissionApprove: boolean = false
  globalWhere: any = []
  settlementData: any;
  constructor(
    private navigation: NavigationService, private accountApi: AccountApiService,
    private alertService: AlertService, private modifyService: ModifyService,
    private activatedRoute: ActivatedRoute, private auth: AuthService,
    private modalService: ModalService, private injector: Injector,) { }

  ngOnInit(): void {
    this.accountId = this.activatedRoute.snapshot.queryParams.id || '';
    const showBtnList = this.auth.checkPermission('ACCOUNT', 'VIEW_ALL');
    this.pageInfo = {
      title: 'Account Info',
      buttonShowBtn: showBtnList,
      button: {
        title: 'View All Account', url: this.urlService.ACCOUNT.ACCOUNT_LIST.URL,
      }
    }
    if (!this.accountId) {
      this._bsModalRef = this.injector.get<BsModalRef>(BsModalRef);
    }
    this.getData();
    this.getSettlementData();
  }

  setInput(data: any) {
    this.isModal = true;
    this.type = 'MODIFICATION';
    console.log('DAAT', data);

    if (data?.type == 'INFO') {
      this.accountId = data?.id
    } else {
      this.accountId = data?.ref_id;
    }
    this.segement = { BASIC: 'Basic' }
    this.modifyData = data;
    this.pageInfo.title = data.description;
    this.hasPermissionApprove = this.auth.checkPermission('ACCOUNT', 'VERIFY');
    if (data?.ref_id) {
      this.pageInfo.title = 'Account Info'
    }
    this.getData()
  }

  getOfficeInfo() {
    if (!isEmptyObj(this.accountData)) {
      switch (+this.accountData?.type) {
        case 1:
          this.officeKeys = [];
          break;
        case 5:
          this.officeKeys = [{ colName: 'church_name', title: 'Church Name' }, { colName: 'zoneName', title: 'Zone' },
          { colName: 'regionName', title: 'Region' }, { colName: 'email_id', title: 'Email Id' }, { colName: 'mobile_no', title: 'Phone' }];
          break;
        case 6:
          this.officeKeys = [{ colName: 'staffName', title: 'Staff Name' }, { colName: 'regionName', title: 'Region' },
          { colName: 'zoneName', title: 'Zone' }, { colName: 'email_id', title: 'Email Id' }, { colName: 'mobile_no', title: 'Phone' }];
          break;
      }
    }
  }

  getData() {
    if (this.accountId) {
      this.dataLoading = true
      this.accountApi.getAccountDetails(this.accountId).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (res.result) {
            this.accountData = res.result;
            this.info_message = res?.result?.des_notification;
            this.setMapData();
            this.globalWhere.push({ colName: 'to_account_fk_id', value: this.accountData?.id })
          }
        }
      }).finally(() => { this.dataLoading = false });
    }
  }

  getSettlementData() {
    this.accountApi.getSettlementByAccount(this.accountId).then((res: ResponseData) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.settlementData = res?.result;
        res?.result.map((a: any) => {
          a.statusName = a.status == 1 ? 'Approve' : 'Pending';
          a.name = `<span><strong>${a.general_account_name || ''}</strong></span><br><span><strong class="text-info">${a.general_account_code}</strong></span>`;
        })
        this.sTbl?.reload();
      }
    })
  }

  setMapData() {
    if (!isEmptyObj(this.accountData)) {
      // this.getOfficeInfo();
    }
  }

  closeAccount() {
    const title = 'Close Account'
    this.modalService.openConfirmDialog({ title: title, formField: [{ colName: 'remarks', title: 'Remarks', validator: [{ name: 'required' }] }], isFormField: true }).then((a: any) => {
      if (a?.remarks) {
        this.loading = true
        this.accountApi.closeAccount(a, this.accountData?.id).then((res: ResponseData) => {
          if (res.statusCode == RESPONSE_CODE.SUCCESS) {
            this.alertService.showToast('Account Details Saved', 'success');
            this.close();
          } else {
            this.alertService.showToast(res.message, 'info');
          }
        }).catch((err) => { this.alertService.showToast('Unable to save', 'error'), this.loading = false })
          .finally(() => this.loading = false)
      }
    })
  }
  getListData = async (e: tblFilterQuery): Promise<any> => {
    // return this.settlementData || []
    e.whereField = [{colName:'source_account_fk_id',value:this.accountId}]
    return this.accountApi.getListSettlement(e).then((res: ResponseData) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        res?.result.data.map((a: any) => {
          a.from_account = `<span><strong>${a?.from_accountName || ''}</strong></span><br><span><strong class="text-info" >${a?.from_account_code || ''}</strong></span>`
          a.to_account = `<span><strong>${a?.to_accountName || ''}</strong></span><br><span><strong class="text-info" >${a?.to_account_code || ''}</strong></span>`
          // a.account = `<span><strong>${a.general_account_name ||''}</strong></span><br><span><strong class="text-info">${a.general_account_code ||''}</strong></span>`;
        })
      }
      return res
    })
  }

  changeSegement(val: string) {
    this.currentSegment = val;
    //@ts-ignore
    const key: 'BASIC' | 'DOCUMENT' = Object.keys(this.segement).find((k: any) => this.segement[k] === val);
  }

  returnZero() {
    return 0;
  }
  close(status = false) {
    if (!this.isModal) {
      this.navigation.back();
      return;
    }
    this._bsModalRef.hide();
    this.onClose.next(status);
  }
  tblAction = (id: string | number, type: tableAction, data: any): Promise<any> => {
    switch (type) {
      case 'VIEW':
        // this.router.navigate([this.urlService.ACCOUNT.ADD.URL], { queryParams: { id: id } })
        break;

    }
    return Promise.resolve(true);
  }
  

  approveRequest() {
    return new Promise<boolean>((resolve, reject) => {
      const payload = this.modifyData.request_data;
      this.accountApi.save(payload).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          resolve(true);
        } else {
          this.alertService.showToast(res?.message, 'info');
          reject('Server Cannot handle the request');
        }
      }).catch(err => {
        this.alertService.showToast(err, 'error');
        reject('Server Cannot handle the request');
      })
    })
  }

  approve() {
    this.loading = true;
    this.modifyService.approveModification(this.approveRequest.bind(this), this.modifyData).then(res => {
      if (res.status) {
        this.alertService.showToast(res.msg, 'success');
        this.close(true);
      } else {
        this.alertService.showToast(res.msg, 'info');
      }
    }).catch(err => {
      this.alertService.showToast(err, 'error');
    }).finally(() => {
      this.loading = false;
    });
  }

  reject() {
    this.loading = true
    this.modifyService.rejectModification(this.rejectRequest.bind(this), this.modifyData).then((res: any) => {
      if (res) {
        this.alertService.showToast(res?.msg, 'success');
        this.close(true);
      } else {
        this.alertService.showToast(res?.msg, 'info');
      }
    }).catch(err => {
      this.alertService.showToast(err, 'error');
    }).finally(() => {
      this.loading = false;
    });
  }

  rejectRequest() {
    return new Promise<boolean>((resolve, reject) => {
      resolve(true)
    })
  }
}
