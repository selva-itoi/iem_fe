import { Component, OnInit, ViewChild } from '@angular/core';
import { cloneData, isArray } from 'src/app/helper/class/utilityHelper';
import { ResponseData, formBuilderData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { ACCOUNT_FORM, ACCOUNT_SETTLEMENT_INCOME_LIST, ACCOUNT_SETTLEMENT_LIST, BULK_SETTLEMENT_FORM } from '../../helper/account-form';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { UrlServices } from 'src/app/helper/class/url-services';
import { Router } from '@angular/router';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { FormControl } from '@angular/forms';
import { AccountApiService } from '../../service/account-api.service';
import { StaffApiService } from 'src/app/modules/staff/service/staff-api.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { ModalService } from 'src/app/shared/service/modal.service';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';

@Component({
  selector: 'app-account-settlement-list',
  templateUrl: './account-settlement-list.component.html',
  styleUrls: ['./account-settlement-list.component.scss']
})
export class AccountSettlementListComponent implements OnInit {
  accountlist: any
  accountall: any
  carddata: any
  account_value = new FormControl()
  urlService = UrlServices.PAGE_URL
  pageInfo: pageInfo = {} as pageInfo
  LIST_COL: tableColum[] = cloneData(ACCOUNT_SETTLEMENT_LIST)
  INCOMEAMOUNT_COL: tableColum[] = cloneData(ACCOUNT_SETTLEMENT_INCOME_LIST)

  // action: tableButton[] = [{ name: '', type: 'APPROVE', class: 'btn-info', icon: 'icon-paper-plane', condition: [{ key: 'status', value: 2, operation: '==' }] }]
  action: tableButton[] = [
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View', type: 'VIEW', permission: { moduleName: 'ACCOUNT', actionName: 'READ' } },
    { name: '', type: 'APPROVE', class: 'btn-info', icon: 'icon-paper-plane', condition: [{ key: 'status', operation: '==', value: 2 }] },
  ]
  tableConfig: tableBuilder = {
    name: 'Accont Settlement List',
    column: this.LIST_COL,
    action: this.action,
    showFilter: true,
    isLazy: true,
  }
  IncomeAmount: tableBuilder = {
    name: 'Amount Settlement List',
    column: this.INCOMEAMOUNT_COL,
    action: [],
    showFilter: true,
    isLazy: false,
  }
  segement: any = {
    ALL: 'All',
    PENDING: 'Pending',
    // INCOMEAMOUNT: 'Income Amount'
  }
  segmentVisited: any = {}
  currentSegment: string = this.segement.BASIC;
  accountNo: any;

  BULK_COL: tableColum[] = [{ colName: 'account', title: 'Account' }, { colName: 'current_balance', title: 'Balance' },
  { colName: 'account_categoryName', title: 'Account Type' }, { colName: 'account_schemeName', title: 'Account Scheme' },
  { colName: 'amount', title: 'Amount', isEditable: true }, { colName: 'description', title: 'Description' }]
  bulkActionBtn: tableButton[] = []//{ type: 'DELETE', icon: 'pi pi-times', name: '', title: 'Close' }]
  bulkTblConfig: tableBuilder = {
    name: '',
    action: this.bulkActionBtn,
    column: this.BULK_COL,
    isLazy: false,
  }
  // segement = {
  //   LIST: 'List',
  //   BULK: 'Settlement',
  // }

  settlementType: 'BULK' | 'SINGLE' = 'BULK'
  basicFormData: formBuilderData[] = []
  loading: boolean = false;
  radioControl = new FormControl(1);
  radioGroup: any = [{ id: 1, title: 'Credit' }]//, { id: 2, title: 'Withdraw' }]
  bulkFilterData: any = []
  selectedAccountData: any
  maindata: any
  showAccountInfo: any = JSON.parse(JSON.stringify((ACCOUNT_FORM))).filter((a: any) => ['accountName', 'account_code', 'ref_code', 'category', 'account_scheme_fk_id', 'scheme_amount', 'emi_amount'].includes(a.colName)).map((a: any) => { a.hidden = false; return a })
  btnText: string = 'Submit'

  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined
  @ViewChild('bulkTbl') bulkTbl: TableListComponent | undefined
  constructor(private router: Router, private accountApi: AccountApiService,
    private staffApi: StaffApiService, private modalService: ModalService, private authService: AuthService,
    private alertService: AlertService) { }

  ngOnInit(): void {


    console.log(this.authService.getUser(), '  this.authService.user');



    this.pageInfo = {
      title: 'Manage Account Settlement',
      // buttonShowBtn: true,
      // button: {
      //   title: ' Account Settlement',
      //   url: this.urlService.ACCOUNT.ADD.URL,
      //   icon: 'pi pi-plus'
      // }
    }
    this.gettabledata()

  }

  gettabledata() {
    // this.accountApi.getOfficeAccount(4).then((res: any) => {
    //   this.accountlist = res?.result
    // })
    // getAllAccountDetails
    if (!this.accountall) {
      // this.accountall= 3
    }
  }


  getListData = async (e: tblFilterQuery): Promise<any> => {

    if (this.authService.getUser().role?.length) {
      if (this.authService.getUser().role[0].roleName == "ADMIN") {
        e.whereField = [{ colName: 'to_account_fk_id', value: 1 }]
      }

    }

    return this.accountApi.getListSettlement(e).then((res: any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        res?.result.data.map((a: any) => {
          a.accountName = `<strong>${a?.accountName}</strong><br><strong class="text-info">${a?.ref_code}</strong>`
          // a.account = `<span><strong>${a.general_account_name ||''}</strong></span><br><span><strong class="text-info">${a.general_account_code ||''}</strong></span>`;
        })
      }
      return res
    })
  }
  getpendingData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = [{ colName: 'status', value: 2 }]
    return this.accountApi.getListSettlement(e).then((res: ResponseData) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        res?.result.data.map((a: any) => {
          a.account = `<span><strong>${a.general_account_name || ''}</strong></span><br><span><strong class="text-info">${a.general_account_code || ''}</strong></span>`;
        })
      }
      return res
    })
  }
  getListBulkData = async (e: tblFilterQuery): Promise<any> => {
    if (this.basicForm?.isValid()) {
      const d = this.basicForm?.apiPayload() || {}, amt = d?.amount || '', desc = d?.description || '';
      return this.bulkFilterData = await this.accountApi.getBulkListStaff(d).then((res: ResponseData) => {
        if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
          res?.result.map((a: any) => {
            a.account = `<span><strong>${a.accountName}</strong></span><br><span><strong class="text-info">${a.account_code}</strong></span>`
            a.amount = amt
            a.description = desc
          })
        }
        return res
      })
    }
  }
  changeSegment(ev: any) {
    this.segmentVisited = ev.visited;
    this.currentSegment = ev.key
    // if (this.currentSegment == this.segement['INCOMEAMOUNT']) {
    //   this.openConfirmModal()
    // }
  }
  openConfirmModal() {
    this.basicFormData = [];
    this.selectedAccountData = {}
    const msg = 'Which Account do you want to Show ?', title = 'Choose Account type'
    this.modalService.openConfirmDialog({ btnOK: 'Main Account', btnCancel: 'Office Account', message: msg, title: title, disableClose: true }).then((res: any) => {
      if (res) {
        this.accountApi.getMainAccount(1).then((res: any) => {
          this.accountlist = res?.result
        })

        // this.btnText = 'Submit'
        // this.settlementType = 'SINGLE';
        // const exForm: formBuilderData[] = [{ colName: 'account_fk_id', title: 'Account', col_size: 4, event: { name: 'click', isCallback: true }, readonly: true, info: 'Click to Select From Account', validator: [{ name: 'required' }] }]
        // this.basicFormData = [...exForm, ...cloneData(BULK_SETTLEMENT_FORM).filter((a: any) => ['amount', 'narration'].includes(a.colName))]
      } else {
        this.accountApi.getMainAccount(2).then((res: any) => {
          this.accountlist = res?.result
        })

        // this.btnText = 'Generate'
        // this.settlementType = 'BULK';
        // this.basicFormData = cloneData(BULK_SETTLEMENT_FORM);
      }
    })
  }
  onChange(ev: any) {
    this.accountall = this.account_value.value
    this.maindata = this.accountlist.find((a: any) => this.accountall == a.account_code);


    // this.getAccountData(this.accountall);
    //  this.accountNo = this.carddata.account_code

  }

  getAccountData = async (e: tblFilterQuery): Promise<any> => {
    if (this.accountall) {
      return this.accountApi.getAllAccountDetails(this.accountall).then(async (res: any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          console.log(res, 'data')
          await res.result?.map((a: any) => {
            a.account_name = `<span>${a.accountName || ''} - ${a.account_code || ''}</span>`
          })
        }

        return res.result
      })
    }
  }


  tblAction = (id: string | number, type: tableAction, data: any): Promise<any> => {
    switch (type) {
      case 'APPROVE':
        this.router.navigate([this.urlService.ACCOUNT.SETTLEMENT_VIEW.URL], { queryParams: { id: id, type: 'APPROVE' } })
        break;
      case 'VIEW':
        this.router.navigate([this.urlService.ACCOUNT.SETTLEMENT_VIEW.URL], { queryParams: { id: id, type: 'PREVIEW' } })
        break;
    }
    return Promise.resolve(true);
  }
  getaccountdetails() {
    this.bulkTbl?.reload()
  }

  async onSubmit() {
    if (!this.isValid) {
      return
    }
    if (this.settlementType == 'BULK') {
      return this.bulkTbl?.reload()
    }
    this.saveSettlement('SINGLE')
  }
  // onChange(ev: any) {
  //   if (ev.controlName == 'account_fk_id') {
  //     this.modalService.openSearchModal({ type: 'ACCOUNT' }).then((res: any) => {
  //       if (res) {
  //         this.selectedAccountData = res
  //         console
  //         this.basicForm?.patchValue({ [ev.controlName]: res.account_code })
  //       }
  //     })
  //   }
  // }
  saveSettlement(type: 'BULK' | 'SINGLE' = 'BULK') {
    const payload = this.basicForm?.apiPayload() || {}; let item = this.selectedAccountData;
    if (type == 'SINGLE') {
      item = isArray(item) ? item : [item]
      if (item?.length) {
        item = item.map(({ id }: any) => {
          return { amount: payload?.amount, narration: payload?.narration, id: id }
        })
      }
    }
    payload.item = type == 'SINGLE' ? item : this.bulkFilterData?.result
    this.loading = true
    this.accountApi.saveSettlement(payload).then((res: ResponseData) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Settlement save Sucessfully', 'success')
      }
    }).catch(() => this.alertService.showToast('Unable to save data', 'error'))
      .finally(() => this.loading = false)

  }
  get isValid() {
    return this.basicForm?.isValid()
  }
}
