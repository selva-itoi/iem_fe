import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { arrayofData } from 'src/app/core/helper/core.data.interface';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { AppConstant, RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { sort } from 'src/app/helper/class/utilityHelper';
import { ResponseData, formBuilderData, formDynamicValidator, tableAction, tableBuilder, tableButton, tblFilterQuery } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { DonationApiService } from 'src/app/modules/donation/service/donation-api.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { UserApiService } from 'src/app/modules/user/services/user-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { BANK_TABLE, SELECTED_FORM, SELECTED_FORM_DATA, SPONSORMODULE_FORM, SPONSORSHIP_ID, SPONSORSHIP_TABLE } from '../../helper/sponsor-form';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { min } from 'rxjs/operators';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';

@Component({
  selector: 'app-new-donation',
  templateUrl: './new-donation.component.html',
  styleUrls: ['./new-donation.component.scss']
})
export class NewDonationComponent implements OnInit {
  urlService: any = UrlServices.PAGE_URL;
  sponsor_Form: any;
  SPONSORMODULE_FORM = SPONSORMODULE_FORM
  SELECTED_FORM = SELECTED_FORM
  SELECTED_TABLE = SELECTED_FORM_DATA
  dataLoading: boolean = false;
  donationData: any;
  loading: boolean = false;
  isModifyRequest: boolean = false;
  disabled_save: boolean = false;
  submitted: boolean = false;
  dateRange = AppConstant.DEFAULT_DATE_RANGE;
  dateFormat = AppConstant.DATE_FORMAT;
  MASTER_DATA: arrayofData = {
    sponsorship_module: [],
  }
  segement = {
    BASIC: 'Basic',
    ACTIVE: 'Active Sponsorship',
    SPONSORSHIP: 'Sponsorship',
    DONATION: 'Donation'
  }
  activeCategory: any = {};
  selecteddata:any=[]

  currentSegment: string = this.segement.BASIC;
  _bsModalRef: BsModalRef = {} as BsModalRef;
  isModal: boolean = false;
  bankdetails: any;
  donationamount: boolean = false
  sponserid: any;
  purpose = new FormControl()
  modifyData: any = {};
  modifyMode: boolean = false;
  sponsorData: any = {};
  public onClose: Subject<boolean> = new Subject();
  masterLoading: any = {};
  donationId: string | number = '';
  showViewAll: boolean = false;
  selectedDate: any;
  requiredfields:boolean= false
  // LIST_COL = SPONSORSHIP_TABLE.slice(3, -1);
  LIST_COL = SPONSORSHIP_ID
  BANK_COL = BANK_TABLE

  basicDynamicValidator: formDynamicValidator[] = [
    {
      controlName: 'is_recurring',
      hideControl: ['total_support'],
      validatorControl: ['total_support'],
      value: 1,
      validator: [{ name: 'required' }]
    },
    {
      controlName: 'is_recurring',
      hideControl: ['freq_payment_id'],
      validatorControl: ['freq_payment_id'],
      value: 1,
      // operation: '!=',
      validator: [{ name: 'required' }]
    },
    // {
    //   controlName: 'sponsorship_module_fk_id',
    //   hideControl: ['is_recurring'],
    //   validatorControl: ['is_recurring'],
    //   value: 1,
    //   validator: [{ name: 'required' }]
    // }
  ]
  actionBtn: tableButton[] = [
    { name: '', class: 'info', icon: 'pi pi-pencil', type: 'EDIT' },
    { name: '', class: 'danger', icon: 'pi pi-trash', type: 'INACTIVE' }
  ]

  tableConfig: tableBuilder = {
    name: '',
    addBtn: false,
    column: this.LIST_COL,
    action: [],
    isLazy: false,
  }
  selecttableConfig: tableBuilder = {
    name: 'donation data',
    column: this.SELECTED_TABLE,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }

  // tableConfig: tableBuilder = {
  //   name: 'Staff list',
  //   column: this.LIST_COL,
  //   action: this.actionBtn,
  //   isLazy: true,
  //   showFilter: true
  // }
  banktableConfig: tableBuilder = {
    name: '',
    addBtn: false,
    column: this.BANK_COL,
    action: [],
    isLazy: true,
  }
  maxSelection: number = 0;
  maxBankSelection: number = 1;


  // name: 'email' | 'required' | "pattern" | 'minLength' | 'maxLength' | 'min' | 'max' | 'asyncInvalid',
  // funName?: string | number;
  // asynFun?: boolean;
  // funValue?: RegExp | any;
  // error?: string | null,
  // conditional?: tbl_condition[],
  // is_async?: boolean



  // Validators.pattern(VALIDATOR_PATTERNS.NUMBER), Validators.min(1)
  // {name:'pattern',funValue:VALIDATOR_PATTERNS.NUMBER_FLOAT}
  // amount: new FormControl(0, [Validators.required, Validators.pattern(VALIDATOR_PATTERNS.NUMBER), Validators.min(1)]),
  // keyName: 'id', operation: '==', value: value
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined
  @ViewChild('dyTbl') dyTbl: DynamicTableFormComponent | undefined;
  @ViewChild('tableList') tableList: TableListComponent | undefined
  @ViewChild('selectedtableList') selectedtableList: TableListComponent | undefined
  @ViewChild('basicdonation') basicdonation: FormGeneratorComponent | undefined
  basicFormData: formBuilderData[] = [{ colName: 'amount', title: 'Amount', validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }, { name: 'min', funValue: '10', error: 'Minimun Amount is 10' }], event: { name: 'change' } }, { colName: 'remarks', title: 'Remarks' },
   { colName: 'payment_mode_fk_id', type: 'select', title: 'Payment Mode', selectKeyName: 'payment_modeName', selectPrimaryKey: 'id', apiTblName: 'payment_mode', apiFilter: { keyName: 'id', operation: '!=', value: 1 }, validator: [{ name: 'required' }] },
  { colName: 'transaction_ref', title: 'Cheque No/ DD / transaction Ref', validator: [{ name: 'required' }] }, { colName: 'transaction_date', title: 'Cheque No/ DD / transaction Date', type: 'DATE', defaultValue: new Date() }, { colName: 'document', title: 'Document', type: 'FILE' }]
  promotionalid: any;
  
  constructor(public userApi: UserApiService, private sponsorApi: SponsorApiService,
    private modalService: ModalService, private alertService: AlertService,
    private auth: AuthService, private modifyrequest: ModifyService,
    private activatedRoute: ActivatedRoute, private donationApi: DonationApiService,
    private navigation: NavigationService, private masterApi: MasterApiService) {
  }

  ngOnInit(): void {

    this.donationId = this.activatedRoute.snapshot.queryParams.id || '';
    this.showViewAll = this.auth.checkPermission('SPONSORSHIP', 'VIEW_ALL');
    this.initForm();
    this.getFullData('sponsorship_module');
    if (this.donationId) {
      this.getDonationData();
    }
  }

  setInput(data: any) {
    this.modifyData = data || {};
    this.modifyMode = true;
    this.isModal = true;
  }



  updateValitityForm() {
    this.sponsor_Form.get('place').updateValueAndValidity();
    this.sponsor_Form.get('date_time').updateValueAndValidity();
    this.sponsor_Form.get('dept_date_time').updateValueAndValidity();
    this.sponsor_Form.get('arrival_date_time').updateValueAndValidity();
    this.sponsor_Form.get('total_support').updateValueAndValidity();
    this.sponsor_Form.get('church_donation_to').updateValueAndValidity();
  }

  onClickTab(e: any = '') {
    this.activeCategory = this.MASTER_DATA.sponsorship_module.find((a: any) => a.id == this.sponsor_Form.value.sponsorship_module)
    // this.sponsor_Form.patchValue({
    //   is_monthly: false,
    //   total_support: 1,
    //   report_language: '',
    //   preference: '',
    //   dedication_request: false,
    //   arrival_date_time: '',
    //   place: '',
    //   dept_date_time: '',
    //   date_time: '',
    //   church_donation_to: '',

    // });
    // this.updateValitityForm();


    this.onChangeNumber();
  }
  editData:any
  // @ViewChild('targetElement') targetElement!: ElementRef;
  tblAction = (id: string | number, type: tableAction, data: any = {}): Promise<any> => {
    switch (type) {
      case 'EDIT':       
        this.updatetable = true
        this.editData = this.selecteddata.find(item => item === data);
        if (this.editData) {
          this.basicdonation?.setData(this.editData);
            this.hideform = false
            // this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        let totalamount: number = 0

        for (let i = 0; i < this.selecteddata.length; i++) {
          totalamount += parseFloat(this.selecteddata[i]?.amount)
        }
      
        if (this.selecteddata.length === 0) {
          const defaultValue1: any = {};
          this.basicForm?.data?.forEach((a: any) => {
            if (a.colName == 'amount') {
              a.readonly = false
          }
            if (a.defaultValue != undefined) {
              defaultValue1[a.amount] = a.defaultValue1
              totalamount = defaultValue1[a.amount]
            }
          })
    
        }else{
          this.basicForm?.data?.forEach((a: any) => {
            if (a.colName == 'amount') {
                a.readonly = true
            }
          })
        }
    
        this.basicForm?.patchValue({ amount: totalamount ,readonly:true});
        this.selectedtableList?.reload()
        break;
      
      case 'INACTIVE':
        const i = this.selecteddata.findIndex(a => {
            return a == data;
        });
        this.hideform = true
        this.updatetable = false
        this.basicdonation?.reset()

        this.deletedata(i)
       
        break;
      case 'ACTIVE':
        // this.delete(id, true);
        break;
    }
    return Promise.resolve(true);
  }

  deletedata(i){
    let totalamount:number=0
    this.selecteddata.splice(i,1);
    // let totalamount: number = 0
    totalamount = 0
    for (let i = 0; i < this.selecteddata.length; i++) {
      totalamount += parseFloat(this.selecteddata[i]?.amount)
    }
  
    if (this.selecteddata.length === 0) {
      const defaultValue1: any = {};
      this.basicForm?.data?.forEach((a: any) => {
        if (a.colName == 'amount') {
          a.readonly = false
      }
        if (a.defaultValue != undefined) {
          defaultValue1[a.amount] = a.defaultValue1
          totalamount = defaultValue1[a.amount]
        }
      })

    }else{
      this.basicForm?.data?.forEach((a: any) => {
        if (a.colName == 'amount') {
            a.readonly = true
        }
      })
    }

    this.basicForm?.patchValue({ amount: totalamount ,readonly:true});
    this.selectedtableList?.reload()
    this.selectedtableList?.reload()

  }

  onChangeNumber() {
    let tot_amt = 0;
    if (this.activeCategory.amount) {
      tot_amt = +this.activeCategory.amount;
      this.basicForm?.patchValue({ amount: tot_amt })
    } else {
      this.basicForm?.patchValue({ amount: '' });

    }
  }

  initForm() {
    this.sponsor_Form = new FormGroup({
      sponsorship_module: new FormControl(''),
      is_pay_sponsorship: new FormControl(false),
    });

  }

  getDonationData() {
    if (this.donationId) {
      this.dataLoading = true;
      this.donationApi.getDonationDetails(this.donationId).then((res: any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.donationData = res.result;
          this.sponsorData = res.result.sponsor || {};
          this.mapformData();
        }
      }).finally(() => { this.dataLoading = false })
    }
  }

  mapformData() {
    this.sponsor_Form.patchValue({ sponsorship_module: this.donationData?.sponsorship_module });
    const mapData: any = {};
    this.basicFormData.forEach((e: any) => {
      mapData[e.colName] = this.donationData[e.colName] ? this.donationData[e.colName] : this.donationData.sponsor[e.colName] ? this.donationData.sponsor[e.colName] : '';
    });
    setTimeout(() => {
      this.basicForm?.patchValue(mapData);
    }, 800);
  }

  resetSponsor() {
    this.sponsorData = {};
    this.sponsor_Form.patchValue({ sponsor_id: '' });
  }

  openSearchModal() {
    this.modalService.openSearchModal({ type: 'SPONSOR', skipKey: 'sponsor_id', skipData: [this.donationData?.sponsor_id], activeOnly: true }).then(async (res: any) => {
      if (res) {
        this.sponserid = res?.id
        this.promotionalid = res?.promo_id
      }
      if (res.sponsor_id) {
        this.sponsorData = {};
        if (res.deleted_at != null) {
          this.alertService.showToast("You can't Add sponsorship for Inactive Sponsor", 'info');
          return;
        }
        if (+res.status == 2) {
          this.alertService.showToast("sponsor on Pending Mode,unable to process", 'info');
          return;
        }
        if (+res.modify_request) {
          this.alertService.showToast("Staff Profile is under Admin approval", 'info');
          return;
        }
        this.resetSponsor();
        this.sponsorData = res || {}
        const pacthValue: any = {};
        pacthValue['sponsor_id'] = res.sponsor_id;
        Object.keys(this.sponsorData).forEach(key => {
          pacthValue['from_' + key] = this.sponsorData[key];
        })
        this.sponsor_Form.patchValue(pacthValue);
      }
    });
  }


  getFullData(tblName: any, cond = []) {
    if (tblName) {
      this.masterLoading[tblName] = true;
      //this.sponsor_Form.controls[tblName].disable();
      const isFull = tblName == 'field' ? true : false;
      this.masterApi.getFullData(tblName, cond, isFull).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.MASTER_DATA[tblName] = sort(res.result, 'order');
        } else {
          this.MASTER_DATA[tblName] = [];
        }
        this.onClickTab();
      }).finally(() => {
        //this.sponsor_Form.controls[tblName].enable();
        this.masterLoading[tblName] = false;
      })
    }
  }

  checkAllvalid(): boolean {
    return this.basicForm?.isValid()
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = [{ colName: 'sponsor_id', value: this.donationId || this.sponsorData.sponsor_id, operation: 'AND' }];
    // e.whereField.push({ colName: 'status', value: 2 })
    // this.sponserid
    // e.whereField = [{ colName: 'status', value: ['2', '3'] }]
    return await  this.sponsorApi.sponsorshipGetListbyid(this.sponserid).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.maxSelection = res?.result?.length
        // res.result.data.map((a: any) => {
        //   a.total_alloted = a.is_monthly ? +a.total_alloted ? a.total_alloted : 'Not Yet' : 'No alloted';
        // })
      }
      return res.result;
    });
  }


  getBankData = async (e: tblFilterQuery): Promise<any> => {
    return await this.donationApi.getMainBankAccount().then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        // this.bankdetails = res?.result
        // console.log( this.bankdetails,' this.bankdetails')
        // res.result.map((a: any) => {
        //   return a
        // })
      }
      return res.result;
    });
  }



  onSelectbankdata(e: any) {

    if (e.length == 0) {
      this.bankdetails = ''
    }
    else {
      e.map((a: any) => {
        // this.basicForm?.patchValue({ amount:a.amount});
        this.bankdetails = a.account_fk_id
      })
    }
  }

  apiPayload(type: any) {
    // const payload = this.sponsor_Form.value;
    console.log(type, 'type');
    const payload = this.basicForm?.apiPayload()
    payload.donation_date = payload?.transaction_date
    payload.account_fk_id = '1'
    payload.bank_fk_id= this.bankdetails  
    const dytabletaken = this.dyTbl?.apiPayload() || []
    const sponsorship_fk_id = ''; 
    const updatedDytabletaken = dytabletaken.map((item: any) => {
    return { ...item, sponsorship_fk_id: sponsorship_fk_id,is_recurring:false,total_support:1,freq_payment_id:1 };
    });
    const selectedtabledata = this.selecteddata.map((item: any) => {
      return { ...item, sponsorship_fk_id: sponsorship_fk_id,is_recurring:false,total_support:1,freq_payment_id:1 };
      });
    selectedtabledata.map((a:any)=>{
      if(a.id){
      a.sponsorship_fk_id = a.id 
      }
    })
    payload.data = [...selectedtabledata];
    payload.sponsorship_module = this.activeCategory?.id
    payload.promotional_fk_id = this.promotionalid
    if (type == 'pay') {
      payload.purpose = this.purpose.value
      payload.payment_status = 2
    } else if (type = 'approve') {
      payload.payment_status = 1
    } else if (type = 'failed') {
      payload.payment_status = 3
    }
    payload.moduleName = this.MASTER_DATA.sponsorship_module.filter((a: any) => a.id == +(this.sponsor_Form.value.sponsorship_module))[0]?.name || '';
    payload.sponsor_fk_id = this.sponsorData?.id;
    return payload;
  }

  basicOnChange(ev){
    // if (ev.controlName == 'sponsorship_module_fk_id') {
      
    // }
  }

  onSubmit(type: 'pay' | 'failed' | 'approve' = 'pay') {
    const allValid = this.checkAllvalid();
    if (!this.bankdetails) {
      this.requiredfields= true
      this.alertService.showToast('Select bank', 'info');
      return;
    }
    if (!this.sponsorData.sponsor_id) {
      this.alertService.showToast('One sponsor must be select, Please select Donor', 'info');
      return;
    }
    if (+this.sponsorData.status == 2) {
      this.alertService.showToast("sponsor on Pending Mode,unable to process", 'info');
      return;
    }
    if(!allValid){
      this.requiredfields= true
      return
    }
    if (allValid) {
      this.requiredfields= false
      this.loading = true;
      const data = this.apiPayload(type)
      const api = type == 'pay' ? this.donationApi.addDonation(data) : this.donationApi.updatePaymentStatus(this.donationId, data)
      api.then((res: any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.alertService.showToast('Sucessfully Saved', 'success')
          this.close()
        } else {
          this.alertService.showToast('Unable to save', 'error')
        }
      }).catch(() => this.alertService.showToast('Unable to save', 'error')
      ).finally(() => this.loading = false)
    }
  }

  // saveSposor(data: any = {}) {
  //   this.sponsorApi.saveSponsorShip(this.apiPayload('')).then(res => {

  //   }).finally(() => this.loading = false)
  // }

  close(status = false) {
    if (!this.isModal) {
      this.navigation.back();
      return;
    }
    this._bsModalRef.hide();
    this.onClose.next(status);
  }
  
  selectedamount:any =[]
  totaldata:any=[]
  receive($event){
    let totalamount: number = 0
    this.selectedamount = $event.data
    const i = this.selecteddata.findIndex(a => {
    
      this.selecteddata.splice(i, 1);
      this.dyTbl?.reset()
    })

    if(this.selecteddata){
      for (let i = 0; i < this.selecteddata.length; i++) {
        totalamount += parseFloat(this.selecteddata[i]?.amount)
      }
    }else{

    for (let i = 0; i < this.selecteddata.length; i++) {
      totalamount += parseFloat(this.selecteddata[i]?.amount)
    }
  }
    if (this.selecteddata.length === 0) {
      const defaultValue1: any = {};
      this.basicForm?.data?.forEach((a: any) => {
        if (a.colName == 'amount') {
          a.readonly = false
      }
        if (a.defaultValue != undefined) {
          defaultValue1[a.amount] = a.defaultValue1
          totalamount = defaultValue1[a.amount]
        }
      })

    }else{
      this.basicForm?.data?.forEach((a: any) => {
        if (a.colName == 'amount') {
            a.readonly = true
        }
      })
    }

    this.basicForm?.patchValue({ amount: totalamount ,readonly:true});
    this.selectedtableList?.reload()
    // this.selectedamount.map((a: any) => {
    //   // this.basicForm?.patchValue({ amount:a.amount});

    //   this.sponsor_Form.patchValue({ sponsorship_module: a.sponsorship_module });
    //   return a
    // })


    
    }
  

  onSelectData(e: any) {
    this.selecteddata = e
    // this.dyTbl?.setInputData(this.selecteddata);
    let totalamount: number = 0
     console.log(this.selectedamount,'this.selectedamount')

    // if(this.selectedamount){
    //   for (let i = 0; i < this.selectedamount.length; i++) {
    //     totalamount += parseFloat(this.selectedamount[i]?.amount)
    //   }
    // }
    // else{

    for (let i = 0; i < e.length; i++) {
      totalamount += parseFloat(e[i]?.amount)
    }
  // }
    if (e.length === 0) {
      const defaultValue1: any = {};
      this.basicForm?.data?.forEach((a: any) => {
        if (a.colName == 'amount') {
          a.readonly = false
      }
        if (a.defaultValue != undefined) {
          defaultValue1[a.amount] = a.defaultValue1
          totalamount = defaultValue1[a.amount]
        }
      })

    }else{
      this.basicForm?.data?.forEach((a: any) => {
        if (a.colName == 'amount') {
            a.readonly = true
        }
      })
    }

    this.basicForm?.patchValue({ amount: totalamount ,readonly:true});
    this.selectedtableList?.reload()
    e.map((a: any) => {
      // this.basicForm?.patchValue({ amount:a.amount});

      this.sponsor_Form.patchValue({ sponsorship_module: a.sponsorship_module });
      return a
    })

  }
  updatetable:boolean = false
  addData(){
    if(!this.basicdonation?.isValid()){
      return
    }
    // const tabledata = this.basicdonation?.apiPayload()
    // this.selecteddata.push(tabledata)
    // this.onSelectData(this.selecteddata)
    // this.hideform = true
    //  this.selectedtableList?.reload()
    //  this.basicdonation?.reset()

     
     if(this.updatetable){
      this.modalService.openConfirmDialog({ type: 'CONFIRM', title: 'Delete Confirm', message: 'Are you sure to update this one ?' }).then(res => {
        if (res) {
      const updatedData = this.basicdonation?.apiPayload();
      if (updatedData) {
        const index = this.selecteddata.findIndex(item => item === this.editData);
          this.selecteddata[index] = updatedData;
          this.selectedtableList?.reload()
               this.basicdonation?.reset()
               this.addamountdata()
           this.hideform= true
           this.updatetable=false
      }
    }
  })
  
     }
     if(!this.updatetable){
      let data= this.basicdonation?.apiPayload()
      
      this.selecteddata.push(data)
      console.log(this.selecteddata,'this.selecteddata');
      
      this.selectedtableList?.reload()
      this.basicdonation?.reset()

       this.addamountdata()

    }
  }
  addamountdata(){
    let totalamount:number=0
    // let totalamount: number = 0
    for (let i = 0; i < this.selecteddata.length; i++) {
      totalamount += parseFloat(this.selecteddata[i]?.amount)
    }
  
    if (this.selecteddata.length === 0) {
      const defaultValue1: any = {};
      this.basicForm?.data?.forEach((a: any) => {
        if (a.colName == 'amount') {
          a.readonly = false
      }
        if (a.defaultValue != undefined) {
          defaultValue1[a.amount] = a.defaultValue1
          totalamount = defaultValue1[a.amount]
        }
      })

    }else{
      this.basicForm?.data?.forEach((a: any) => {
        if (a.colName == 'amount') {
            a.readonly = true
        }
      })
    }

    this.basicForm?.patchValue({ amount: totalamount ,readonly:true});
    this.selectedtableList?.reload()
    this.basicdonation?.reset()

  }
  hideform:boolean =true
  addNew(){
     this.hideform = false
  }
  hide(){
    this.hideform = true
    this.updatetable = false
    this.basicdonation?.reset()
  }

  selectListData = async (e: tblFilterQuery): Promise<any> => {
    return this.selecteddata.map((a:any)=>{
      const dates = new Date();
      const date = a.date? new Date( a.date): new Date()
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      a.date = `${year}-${month}-${day}`;
      return a
    })
  }
  reset(){
     this.basicdonation?.reset()
  }


  submit(){
    if(!this.basicdonation?.isValid()){
      return
    }
    //  if(this.updatedata){
      this.modalService.openConfirmDialog({ type: 'CONFIRM', title: 'Delete Confirm', message: 'Are you sure to update this one ?' }).then(res => {
        if (res) {
      const updatedData = this.basicdonation?.apiPayload();
      if (updatedData) {
        const index = this.selecteddata.findIndex(item => item === this.editData);
          this.selecteddata[index] = updatedData;
          this.selectedtableList?.reload()
          //  this.updatedata= false
      }
    }
  })
  
    //  }
    //  if(!this.updatedata){
  //     let data= this.basicFormdata?.getFormValue()
  // this.tabledata.push(data)
  // this.tableInActiveList?.reload()
    }
  // }



}
