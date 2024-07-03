import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { MODULE_NAME, PERMISSION, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilderData, formDynamicValidator, tableBuilder, tblFilterQuery, whereField } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { StaffApiService } from 'src/app/modules/staff/service/staff-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { ACCOUNT_DATA_FORM, ACCOUNT_EMI_FORM, ACCOUNT_FORM, BANK_FORM } from '../../helper/account-form';
import { AccountApiService } from '../../service/account-api.service';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss']
})
export class NewAccountComponent implements OnInit {
  urlService = UrlServices.PAGE_URL
  pageInfo: pageInfo = {} as pageInfo
  accountId: any
  staffData: any
  totaldata:any
  accountData: any = {}
  loading: boolean = false
  dataLoading: boolean = false
  selectstaff: boolean = false
  selectvolunteer: boolean = false
  showdata:boolean = false
  volunteerData:any
  stafftype:any;
  staffid:any;
  form2:boolean=false;
  tablestaff:boolean = false
  tablevolunteer:boolean = false

  // basicFormData: formBuilderData[] = [...cloneData(ACCOUNT_FORM), ...cloneData(STAFF_BANK_FORM)]
  basicFormData: formBuilderData[] = [...cloneData(ACCOUNT_DATA_FORM)]
  FormData: formBuilderData[] = [...cloneData(ACCOUNT_EMI_FORM)]
  BankData: formBuilderData[] = cloneData(BANK_FORM)

  dynamicFormData: formDynamicValidator[] = [
    {
      controlName: 'category',
      hideControl: ['category_promotionaloffice'],
      validatorControl: ['category_promotionaloffice'],
      value: 6, operation: '=='
    },
    {
      controlName: 'category',
      hideControl: ['category_staff'],
      validatorControl: ['category_staff'],
      value: 4, operation: '=='
    },

  ]

  segement = {
    LOAN: 'Loan Details',
    BANK: 'Bank Details',
    // LOG: 'Log',
    // ACTION: 'Action Needed'
  }
  currentSegment: string = '';
  segmentVisited: any = { ACTIVE: true }
  dynamicData: formDynamicValidator[] = [

    // { controlName: 'category', hideControl: ['emi_amount', 'scheme_amount', 'scheduled_to_date','no_of_month'], validatorControl: ['emi_amount', 'scheme_amount', 'scheduled_to_date','no_of_month'], value: 2, operation: '==', validator: [{ name: 'required' }] },
    // { controlName: 'category', hideControl: ['monthlyAmount'], validatorControl: ['monthlyAmount'], value: 3, operation: '==', validator: [{ name: 'required' }] },
    // { controlName: 'category', hideControl: ['no_of_month'], validatorControl: ['no_of_month'], value: 3, operation: '!=', validator: [{ name: 'required' }] },
    // { controlName: 'category', hideControl: ['scheduled_from_date'], validatorControl: ['scheduled_from_date'], value: 1, operation: '>', validator: [{ name: 'required' }] },  
    // { controlName: 'category_staff', hideControl: ['emi_amount', 'scheme_amount', 'scheduled_to_date','no_of_month','monthlyAmount','account_remarks','scheduled_from_date','account_scheme_fk_id'], validatorControl: ['emi_amount', 'scheme_amount', 'scheduled_to_date','no_of_month','monthlyAmount','account_remarks','scheduled_from_date','account_scheme_fk_id'], value: 6, operation: '==', },
    // { controlName: 'category_staff', hideControl: ['emi_amount', 'scheme_amount', 'scheduled_to_date','no_of_month','monthlyAmount','account_remarks','scheduled_from_date','account_scheme_fk_id'], validatorControl: ['emi_amount', 'scheme_amount', 'scheduled_to_date','no_of_month','monthlyAmount','account_remarks','scheduled_from_date','account_scheme_fk_id'], value: 7, operation: '==', },
    // { controlName: 'category', hideControl: ['emi_amount', 'scheme_amount', 'scheduled_to_date','no_of_month','monthlyAmount','account_remarks','scheduled_from_date','account_scheme_fk_id'], validatorControl: ['emi_amount', 'scheme_amount', 'scheduled_to_date','no_of_month','monthlyAmount','account_remarks','scheduled_from_date','account_scheme_fk_id'], value: 6, operation: '==', },
    // { controlName: 'category', hideControl: ['emi_amount', 'scheme_amount', 'scheduled_to_date','no_of_month','monthlyAmount','account_remarks','scheduled_from_date','account_scheme_fk_id'], validatorControl: ['emi_amount', 'scheme_amount', 'scheduled_to_date','no_of_month','monthlyAmount','account_remarks','scheduled_from_date','account_scheme_fk_id'], value: 4, operation: '==', },

   ]


  // { colName: 'selectvolenteer', title: 'Select Volenteer' },
  // { colName: 'promotionaloffice',
  staffShowData: mapInfoView[] = [
    { name: 'accountName', title: 'Name' }, { name: 'account_code', title: 'Account No' }, { name: 'ref_code', title: 'Ref' }, { name: 'typeName', title: 'Type' }, { name: 'current_balance', title: 'Current Balance' }, { name: 'statusName', title: 'Status' }];
  LIST_COL: formBuilderData[] = cloneData(ACCOUNT_FORM).map((a: any) => { a.filter = true, a.sort = true; return a })
  tableConfig: tableBuilder = {
    name: 'Account List',
    action: [],
    column: this.LIST_COL,
  }
  activeAccList: any
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('basicformData') basicformData: FormGeneratorComponent | undefined;
  @ViewChild('bankdetails') bankdetails: FormGeneratorComponent | undefined;
  @ViewChild('tblList') tblList: TableListComponent | undefined;
  constructor(private activatedRoute: ActivatedRoute, private modalService: ModalService,
    private auth: AuthService,
    private accountApi: AccountApiService,
    private alertService: AlertService,
    private navigation: NavigationService,
    private modifyrequest: ModifyService) { }

  ngOnInit(): void {
    this.accountId = this.activatedRoute.snapshot.queryParams['id'] || '';
    this.getData();
    this.pageInfo = {
      title: !this.accountId ? 'New Account' : 'Update Account',
      buttonShowBtn: true,
      button: {
        title: 'View Account List', url: this.urlService.ACCOUNT.ACCOUNT_LIST.URL,
      }
    }
  }

  openStaffModal() {
    // const wh: whereField[] = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['ADD'], ['region', 'zone']) || [];
    // this.modalService.openSearchModal({ type: 'STAFF', whereField: wh, activeOnly: true, filterShow: true }).then(async (res: any) => {
      this.modalService.openSearchModal({ type: 'STAFF', activeOnly: true, filterShow: true }).then(async (res: any) => {
      if (res) {
        this.staffData = res;
        this.tablevolunteer = false
        this.tablestaff = true
        this.tblList?.getData();
        this.basicForm?.reset();
      }
    });
  }

  openvolunteerModal() {
    const wh: whereField[] = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['ADD'], ['region', 'zone']) || [];
    this.modalService.openSearchModal({ type: 'VOLUNTEER', whereField: wh, activeOnly: true, filterShow: true }).then(async (res: any) => {
      if (res) {
        this.volunteerData = res;
        this.tablestaff = false
        this.tablevolunteer = true
        this.tblList?.getData();
        this.basicForm?.reset();
      }
    });
  }

  getData() {
    if (this.accountId) {
      this.dataLoading = true;
      this.accountApi.getAccountDetails(this.accountId).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.accountData = res.result;
      
        setTimeout(() => {
          this.basicForm?.setData(this.accountData);
          this.basicformData?.setData(this.accountData); 
            }, 800);
        }
      }).finally(() => this.dataLoading = false)
    }
  }

  getPayload() {
    const data1: any = this.basicformData?.apiPayload()
    const data: any = this.basicForm?.apiPayload();
    const bank:any = this.bankdetails?.apiPayload()
    if( this.selectstaff || this.showdata){
      data1.type = 6
      // data1.staffid = this.staffData?.id
    }
    if( this.selectvolunteer ){
      data1.type = 7
    }
    if (this.accountId) {
      data1.id = this.accountId
      data1.account_code =  this.accountData.account_code
      data1.type = 6
       data1.ref_fk_id = this.staffData?.id
    }
    if (this.staffData) {
      data1.ref_fk_id = this.staffData?.id
    }
    if(this.tablestaff){
      data1.type = 6
      // data.ref_fk_id = this.staffData?.id
      data1.ref_fk_id = this.staffData?.id
    }
    if(this.tablevolunteer){
      data1.type = 7
      data1.ref_fk_id = this.volunteerData?.id
    }
    this.totaldata= {...data1,...data}
    
    return this.totaldata;
  }


  onSubmit() {
    // if (!this.basicForm?.isValid()) {
    //   return
    // }
      // this.tblList?.getData();

    this.loading = true;
    this.accountApi.save(this.getPayload()).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        if(res.message =="already this ref_fk_id have an account"){
          this.alertService.showToast('Account already exists', 'error');
        }else{
        this.alertService.showToast('Account Details Saved', 'success');
        this.navigation.back();
        }
      }else{
        this.alertService.showToast(res.message, 'info');
      }
    }).catch(err => this.alertService.showToast('Unable to save', 'error')).finally(() => { this.dataLoading = false; this.loading = false })
    this.loading = false;
  }

  goBack() {
    this.navigation.back();
  }

  onChange(ev: any) {
    const FORM_SUPPORT_DATA: any = this.basicForm?.FORM_SUPPORT_DATA;
    if (ev?.controlName == 'category') {
      this.basicForm?.patchValue({ category: ev.value})
      this.selectvolunteer = false
      this.selectstaff = false
      if(ev.value == 2|| ev.value== 3){
        this.showdata = true
      }else{
        this.showdata = false
      }
      if(ev.value ==4){
        this.form2 == true
     }else{
      this.form2 == false
    }
      
    }
    if(ev?.controlName == 'category_staff'){
      if (ev.value == 6) {
        this.selectstaff = true
      } else {
        this.selectstaff = false
      }
      if (ev.value == 7) {
        this.selectvolunteer = true
      } else {
        this.selectvolunteer = false
      }
    }

    if (ev?.controlName == 'account_scheme_fk_id') {
      let cVal = FORM_SUPPORT_DATA[ev.controlName]?.find((a: any) => a.id == ev.value);
      const sDate = new Date(new Date().setMonth(new Date().getMonth() + 1))
      const emiAmt = (cVal?.max_amount / cVal?.duration_in_month) || 0
      this.basicForm?.patchValue({ no_of_month: cVal?.duration_in_month, scheme_amount: cVal?.max_amount, scheduled_from_date: sDate, emi_amount: emiAmt })
      this.setEmiMonth()
    }
    if (ev.controlName == 'scheduled_from_date' || ev.controlName == 'no_of_month') {
      this.setEmiMonth()
    }
    const dataFormVal = this.basicForm?.dataForm?.value;
    if (ev.controlName == 'emi_amount' || ev.controlName == 'no_of_month') {
      const val = ev.value, scheme_amt = dataFormVal['scheme_amount'],
        cal = (scheme_amt / val) || 0, ctrl = ev.controlName == 'emi_amount' ? 'no_of_month' : 'emi_amount'
      this.basicForm?.patchValue({ [ctrl]: cal })
      this.setEmiMonth()
    };
  }


  setEmiMonth() {
    const sd = this.basicForm?.dataForm.value['scheduled_from_date'],
      no_month = this.basicForm?.dataForm.value['no_of_month'] || 10;
    const startDate = sd ? new Date(sd) : new Date();
    const endDate = new Date(startDate.setMonth(startDate.getMonth() + (+no_month)))
    this.basicForm?.patchValue({ scheduled_to_date: endDate })
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // this.tblList?.reload();

    // return this.accountApi.getAccountByStaff(this.staffData?.id).then((res: ResponseData) => {
    //   if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
    //     this.activeAccList = res.result
    //   }
    //   return res
    // })
  
    if(this.tablestaff){
      this.stafftype = 6
      this.staffid = this.staffData?.id
    }
    if(this.tablevolunteer){
      this.stafftype = 7
      this.staffid = this.volunteerData?.id
    }
     return this.accountApi.getstaffdetails(this.staffid,this.stafftype,4).then((res: any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.activeAccList = res.result
      }
      return res
    })
  }

  checkLoanExceed() {
    let loanCount = this.activeAccList?.filter((a: any) => a.category == 2).length;
    return loanCount
  }

  modifyPayload() {
    const payload: modifyApi = {} as modifyApi, modifyData: any = this.getPayload();
    payload.action_id = PERMISSION.ADD;
    payload.description = modifyData?.accountName + ' account requested to Add Record';
    if (this.accountData.id) {
      payload.action_id = PERMISSION.UPDATE;
      payload.description = modifyData?.accountName + ' account requested to update the details';
    }
    payload.module_id = MODULE_NAME.ACCOUNT;
    payload.ref_id = this.accountId
    return payload
  }

  saveRequest() {
    this.loading = true
    const modifyData: any = this.modifyPayload(), data: any = this.getPayload();
    console.log('Modify', data)
    this.modifyrequest.saveModification(modifyData, data).then((res) => {
      if (res) {
        this.goBack();
      }
    }).finally(() => {
      this.loading = false;
    })
  }
}
