import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { infoModalData } from 'src/app/core/helper/core.data.interface';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { MODULE_NAME, PERMISSION, RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { cloneData, isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { formBuilder, formBuilderData, formDynamicValidator, ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { User } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { CHURCH_LIST_TBL } from 'src/app/modules/church/helper/church-form';
import { ChurchApiService } from 'src/app/modules/church/service/church-api.service';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';
import { UrlServices } from 'src/app/helper/class/url-services';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-assign-info',
  templateUrl: './assign-info.component.html',
  styleUrls: ['./assign-info.component.scss']
})
export class AssignInfoComponent implements OnInit, OnDestroy {
  donationInfoData: any;
  basicFormData: formBuilder[] = [];
  id: any;
  skipId: any
  LIST_COL = [...cloneData(CHURCH_LIST_TBL).filter((a: any) => !['church_typeName', 'staff_emp_id', 'status', 'updated_at','is_donation_allow'].includes(a.colName)), ...[{ colName: 'raised_amount', title: 'Raised Amt' }, { colName: 'goal_amount', title: 'Goal Amt' }]]
  churchList: any;
  dataLoading: boolean = false
  userData: User = this.auth.currentUserValue;
  tableConfig!: tableBuilder
  maxSelection: number = -1
  selectedData: Array<any> = [];
  loading: boolean = false;
  type: 'MODIFICATION' | 'VIEW' | 'EDIT' = 'EDIT';
  modifyData: any = {}
  isModal: boolean = false;
  pageInfo: pageInfo = { title: 'Donation Allotment', buttonShowBtn: true, button: { title: 'All Allotment', url: UrlServices.PAGE_URL.CHURCH.CHURCH_COLLECTION.URL } };
  @ViewChild('tableList') tableList: TableListComponent | undefined
  hasPermissionApprove: boolean = false
  showChurchTbl: boolean = true;
  isModifyRequest: boolean = false
  // dynam
  selectableTblForm: formBuilderData[] = []
  showAllChurch: UntypedFormControl = new UntypedFormControl(false);
  @ViewChild('dyTbl') dyTbl: DynamicTableFormComponent | undefined;

  constructor(private sponsorApi: SponsorApiService, private activateRoute: ActivatedRoute, private churchApi: ChurchApiService,
    private modifyRequest: ModifyService, private navigation: NavigationService,
    private auth: AuthService, private modalService: ModalService, private alertService: AlertService) { }


  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.queryParams['id'];
    this.pageInfo.buttonShowBtn = this.auth.checkPermission('DONATION_ALLOTMENT', 'VIEW_ALL')
    if (this.id) {
      this.getDonationData()
    }
    this.initVariable();
  }

  onChangeShowBtn($ev: any) {
    //clear all selected item
    this.allotmentData = this.allotmentData.filter((a: any) => a.action != 1);
    this.mapSelectTblData();
    this.tableList?.reload();
  }
  setInput(data: any) {
    this.type = 'MODIFICATION';
    this.showChurchTbl = false;
    this.modifyData = data || {};
    this.id = data.ref_id || '';
    this.isModal = true;
    if (data.request_data) {
      this.pageInfo.title = data.description;
      this.getDonationData();
      this.hasPermissionApprove = this.auth.checkPermission('DONATION_ALLOTMENT', 'VERIFY');
    }
  }

  initVariable() {
    this.basicFormData = [{ title: 'Sponsor Name', colName: 'sponsorName' }, { title: 'Donor ID', colName: 'sponsor_id' }, { title: 'Church Ministry Area', colName: 'promotionalName' },
    { title: 'Amount', colName: 'amount' }, { title: 'Status', colName: 'statusName' }, { title: 'Receipt', colName: 'receipt_id' }, { title: 'Donation Date', colName: 'donation_date' },
    { title: 'Donation Id', colName: 'donation_id' }, { title: 'Remarks', colName: 'remarks' }, { title: 'Payment Mode', colName: 'payment_modeName' }, { title: 'Program', colName: 'donation_sub_programName' }]
    this.tableConfig = {
      name: 'Church list',
      addBtn: false,
      column: this.LIST_COL,
      action: [],
      isLazy: true,
      showFilter: true
    }
    const SELECT_LIST_COL: any = [{ colName: 'moduleName', title: 'Module Name' }, { colName: 'church_name', title: 'Assignee Name' },
    { colName: 'amount', title: 'Amount' }, { colName: 'allotment_remarks', title: 'Remarks' }];
    setTimeout(() => {
      if (this.type == 'MODIFICATION') {
        this.selectableTblForm = [...SELECT_LIST_COL, ...[{ colName: 'actionName', title: 'Action' }]]
      } else {
        this.selectableTblForm = SELECT_LIST_COL
      }
    }, 800);
  }

  mapSelectTblData() {
    if (this.dyTbl?.setInputData) {
      this.dyTbl?.setInputData(this.allotmentData);
    } else {
      setTimeout(() => {
        this.mapSelectTblData();
      }, 800);
    }
  }

  getDonationData() {
    this.dataLoading = true;
    this.sponsorApi.getDonationById(this.id).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.donationInfoData = res.result;
        this.isModifyRequest = +this.donationInfoData?.modify_request ? true : false;
        if (!isEmptyObj(this.modifyData)) {
          const modiData = this.modifyData?.request_data.allotment.map((a: any) => { a.actionName = +a.action == 1 ? 'To Add' : +a.action == 2 ? 'To Update' : 'To Delete'; return a })
          this.allotmentData = [...modiData, ...this.donationInfoData.allotment];
        } else {
          this.allotmentData = this.donationInfoData.allotment
        }
        this.mapSelectTblData();
      }
    }).finally(() => this.dataLoading = false)
  }
  tblAction = (id: string | number, type: tableAction, data: any = {}): Promise<any> => {
    switch (type) {
      case 'VIEW':

        break;
    }
    return Promise.resolve(true);
  }

  selectTblAction(ev: any) {
    const type = ev.action, data = ev.data;
    const i = this.allotmentData.findIndex(a => a.ref_id == data.ref_id);
    switch (type) {
      case 'DELETE':
        const index = this.allotmentData.findIndex(a => a.id == data.id);
        this.removeData(index)
        break;
      case 'EDIT':
        this.updateForm(i)
        break;
    }
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    const showBtn = this.showAllChurch.value;
    if (showBtn) {
      e.whereField = this.auth.getPermittedId(['CHURCH'], ['VIEW_ALL'], ['zone']) || [];
      e.whereField?.push({ colName: 'is_donation_allow', value: 1 });
    } else {
      e.whereField = [{ colName: 'sponsorship_module', value: 3 }]
      if (this.donationInfoData?.sponsor_id) {
        e.whereField.push({ colName: 'sponsor_id', value: this.donationInfoData?.sponsor_id })
      }
    }
    const api: any = showBtn ? this.churchApi.getListWithProgress(e) : this.sponsorApi.getListAllotment(e)
    return this.churchList = await api.then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result.data.map((a: any) => {
          a.church_name = a.name || a.church_name
          a.church_id = a.ref_code || a.church_id
        })
      }
      return res;
    });
  }

  allotmentData: Array<any> = [];
  selectTablegetList = async (e: tblFilterQuery): Promise<any> => {
    return this.allotmentData;
  }

  getTotalAmt(): number {
    let totalAmount = 0;
    this.allotmentData.forEach((a: any) => {
      if (+a.action != 3) {
        totalAmount += (+a.amount || 0);
      }
    });
    return +totalAmount;
  }
  getDonationAmt(): number {
    return +this.donationInfoData.amount || 0;
  }
  checkAmountCal() {
    const maxAmount = +this.donationInfoData.amount || 0;
    return this.getTotalAmt() <= maxAmount;
  }
  updateForm(i: number) {
    let data = this.allotmentData[i] || {}
    let amt = this.getDonationAmt() - this.getTotalAmt();
    if (this.allotmentData[i]?.amount) {
      amt += (+this.allotmentData[i].amount)
    }
    if (!data.amount) {
      data.amount = amt
    }
    const valid: any = [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT, error: `Amount should be valid` }, { name: 'required' }]
    // data.amount = amt;
    const formField: formBuilderData[] = [{ colName: 'amount', title: 'Amount', defaultValue: 0, event: { isCallback: true, name: 'change' }, validator: valid }, { colName: 'allotment_remarks', title: 'Remarks' }]
    const dynamicValidator: formDynamicValidator[] = [{ controlName: 'amount', operation: '>', validatorControl: ['amount'], value: amt, validator: [{ name: 'max', funValue: amt, error: `Amount should not be greater than ${amt}` }] }]
    this.modalService.openConfirmDialog({ title: 'Confirm ', message: '', formField: formField, isFormField: true, type: 'FORM', formValue: data, dynamicValidator: dynamicValidator }).then((dataConfirm: any) => {
      if (dataConfirm) {
        data.amount = dataConfirm.amount;
        data.allotment_remarks = dataConfirm.allotment_remarks;
        if (data.action != 1 && data.id) {
          data.last_modify_by = this.userData.user_id || ''
          data.action = 2;
        }
        this.allotmentData[i] = data;
        if (!data.amount) {
          this.removeData(i)
        }
      } else {
        if (!data.amount || +data?.action == 1) {
          this.removeData(i)
        }
      }
    });
  }


  removeData(i: number) {
    const d = this.allotmentData[i] || '';
    if (d.action == 1) {
      this.tableList?.AddRemoveSelection(d)
    } else {
      d.action = 3;
      this.allotmentData[i] = d;
      this.mapSelectTblData()
    }
  }

  onSelectData(e: any) {
    if (Array.isArray(e)) {
      e = e.map((a: any) => ({ ...a }));
    }
    const addedData = this.allotmentData.filter((a: any) => a.action != 1);
    if (!e.length) {
      this.allotmentData = addedData;
    }
    const ids: Array<any> = []; // for new selection
    e.forEach((a: any, i: any) => {
      a.moduleName = 'Church Building'
      a.selectable = false;
      if (this.showAllChurch.value) {
        a.ref_id = a.id;
      }
      a.church_fk_id = a.ref_id;
      // a.module_id = 3; // church
      a.created_by = this.userData.user_id || ''
      a.action = 1; // for ADD
      // check already exists
      const s = this.allotmentData.findIndex(s => a.ref_id == s.ref_id);
      if (s == -1) {
        ids.push(a.ref_id);
        this.allotmentData.push(a)
        delete a.id;
      } else if (s > -1) {
        const d = this.allotmentData[s]
        if (d.action != 1) {
          this.tableList?.AddRemoveSelection(a);
        } else {
          ids.push(a.ref_id);
        }
      }
    });
    console.log('check already exists', this.allotmentData, ids)
    // remove non selected data
    this.allotmentData = this.allotmentData.filter(a => ((+a.action == 1 && ids.includes(a.ref_id)) || a.action != 1));
    if (e.length > this.selectedData.length) {
      this.updateForm(this.allotmentData.length - 1);
    }
    this.selectedData = e;
    this.mapSelectTblData();
  }

  apiPayload() {
    const payload: any = {};
    payload.donation_fk_id = this.donationInfoData?.id || '';
    payload.sponsor_fk_id = this.donationInfoData?.sponsor_fk_id;
    payload.donation_id = this.donationInfoData.donation_id;
    payload.amount = this.donationInfoData?.amount;
    payload.allotment = this.allotmentData.filter((a: any) => a.action);
    return payload;
  }

  apiPayloadModify() {
    const payload: modifyApi = {} as modifyApi,
      dataStaffApi = this.apiPayload();
    payload.created_by = this.auth.currentUserValue.user_id,
      payload.action_id = PERMISSION.ADD;
    payload.description = this.donationInfoData.receipt_id + ' New Donation Allotment for ' + this.donationInfoData?.sponsorName;
    if (isArray(this.donationInfoData.allotment)) {
      payload.action_id = PERMISSION.UPDATE;
      payload.description = this.donationInfoData.receipt_id + ' Update Donation Allotment for ' + this.donationInfoData?.sponsorName;
    }
    payload.ref_id = dataStaffApi.donation_id || '';
    payload.module_id = MODULE_NAME.DONATION_ALLOTMENT;
    return payload;
  }
  disabled_submit = false;
  onSubmit() {
    if (this.getTotalAmt() < this.getDonationAmt()) {
      this.alertService.showToast('Total Allotment Amount and Donation amount should be equal', 'info');
      return
    }
    const data = this.apiPayload();
    if(!data.allotment){
      this.alertService.showToast('No changes on allotment', 'info');
      return
    }
    if (Array.isArray(data.allotment) && !isArray(data.allotment)) {
      const msg = isArray(this.donationInfoData.allotment) ? 'No Changes Made' : 'Allotment Details Should not be empty';
      this.alertService.showToast(msg, 'info');
      return;
    }
    this.loading = true;
    const modifyData: modifyApi = this.apiPayloadModify();
    this.modifyRequest.saveModification(modifyData, data).then((res) => {
      if (res) {
        this.disabled_submit = true;
        this.goBack();
      }
    }).finally(() => {
      this.loading = false;
    })

  }

  approve() {
    this.loading = true;
    this.modifyRequest.approveModification(this.approveRequest.bind(this), this.modifyData).then(res => {
      if (res.status) {
        this.alertService.showToast(res.msg, 'success');
      } else {
        this.alertService.showToast(res.msg, 'info');
      }
      this.goBack();
    }).catch(err => {
      this.alertService.showToast(err, 'error');
    }).finally(() => {
      this.loading = false;
    });
  }

  reject() {
    const data: modifyApi = {} as modifyApi;
    data.action_by = this.auth.currentUserValue.user_id;
    this.modifyRequest.rejectModification(this.rejectRequest.bind(this), this.modifyData).then(res => {
      if (res.status) {
        this.alertService.showToast(res.msg, 'success');
      } else {
        this.alertService.showToast(res.msg, 'info');
      }
      this.goBack();
    }).catch(err => {
      this.alertService.showToast(err, 'error');
    })
  }

  rejectRequest(): Promise<any> {
    return new Promise<boolean>((resolve, reject) => {
      this.loading = true;
      this.sponsorApi.updateDonationRequest(this.donationInfoData.donation_id, { modify_request: false }).then((res: ResponseData | any) => {
        resolve(true);
      }).catch((err: any) => {
        reject('Unable handle your Request');
      });
    });
  }

  approveRequest() {
    return new Promise<boolean>((resolve, reject) => {
      if (isEmptyObj(this.donationInfoData)) {
        reject('empty data');
      }
      let API: Promise<any>;
      const payload = this.modifyData.request_data;
      API = this.sponsorApi.saveDonationAllotment(this.modifyData.request_data);
      API.then(async (res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          resolve(true);
        } else {
          this.alertService.showToast(res?.message, 'info');
          reject('Server Cannot handle the request');
        }
      }).catch(err => {
        this.alertService.showToast(err, 'error');
        console.log(err);
        reject('Server Cannot handle the request');
      })
    });
  }

  goBack() {
    if (this.isModal) {
      this.modalService.close();
    } else {
      this.navigation.back();
    }
  }
  ngOnDestroy(): void {
    this.initVariable()
  }
}