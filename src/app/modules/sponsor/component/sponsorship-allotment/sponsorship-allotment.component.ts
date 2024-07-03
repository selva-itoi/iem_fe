import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { MODIFICATION_PERMISSION, MODULE_NAME, RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, isArray, isEmptyObj, mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { ResponseData, formBuilderData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { page } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { ChildBasicInfoComponent } from 'src/app/modules/child/component/child-basic-info/child-basic-info.component';
import { CHILD_LIST_TBL } from 'src/app/modules/child/helper/child-form';
import { ChildApiService } from 'src/app/modules/child/service/child-api.service';
import { ChurchBasicComponent } from 'src/app/modules/church/component/church-basic/church-basic.component';
import { CHURCH_LIST_TBL } from 'src/app/modules/church/helper/church-form';
import { ChurchApiService } from 'src/app/modules/church/service/church-api.service';
import { SELECT_STAFF_LIST_TBL, STAFF_LIST_TBL } from 'src/app/modules/staff/helper/staff_form';
import { StaffApiService } from 'src/app/modules/staff/service/staff-api.service';
import { StaffBasicComponent } from 'src/app/shared/feature-modal/staff-basic/staff-basic.component';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { SponsorApiService } from '../../service/sponsor-api.service';

@Component({
  selector: 'app-sponsorship-allotment',
  templateUrl: './sponsorship-allotment.component.html',
  styleUrls: ['./sponsorship-allotment.component.scss']
})
export class SponsorshipAllotmentComponent implements OnInit {
  pageInfo: pageInfo = { title: 'Sponsorship Allotment Details' }
  urlService: page = UrlServices.PAGE_URL;
  dataLoading: boolean = false;
  loading: boolean = false;
  isModifyRequest: boolean = false;
  submitted: boolean = false;
  isModal: boolean = false;
  sponsorshipId: string | number = '';
  disabled_save: boolean = false;
  selectedData: Array<any> = [];
  maxSelection: number = 0;
  errorText: string = '';
  showMarkDedication: boolean = false;
  segement = {
    SPONSOR: 'Sponsor',
    // SPONSORSHIP: 'SponsorShip',
    ALLOTMENT: 'Allotment',
  }
  pSegment: string | undefined = '';
  nSegment: string | undefined = this.segement.SPONSOR;
  currentSegment: string = this.segement.SPONSOR;

  segementError: any = {
    SPONSOR: false,
    SPONSORSHIP: false,
    ALLOTMENT: false
  }
  _bsModalRef: BsModalRef = {} as BsModalRef;
  sponsorData: any = {};
  sponsorshipData: any = {};
  sponsorId: string | number = '';

  LIST_COL: tableColum[] = cloneData(STAFF_LIST_TBL).filter((a: any) => a.colName != 'allow_sponsor_allotment');
  CHILD_LIST_COL: tableColum[] = CHILD_LIST_TBL;
  CHURCH_LIST_COL = CHURCH_LIST_TBL;

  tableConfig: tableBuilder = {
    name: '',
    addBtn: false,
    column: this.LIST_COL,
    action: [],
    isLazy: true,
    showFilter: true
  }
  actionBtn: tableButton[] = [{ name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View Details', type: 'VIEW' }]
  statusData: Array<any> = [
    { label: 'Active', key: 2, color: 'info' },
    { label: 'Completed', key: 1, color: 'success' },
    { label: 'Pending', key: 3, color: 'warning' },
  ];
  sponsorshipList: Array<any> = [];
  sponsorshipListLoading: boolean = false;
  dataForm: UntypedFormGroup = {} as UntypedFormGroup;
  amountForm!: FormGroup ;
  show_amt: boolean = false;
  show_total_support: boolean = false;
  public onClose: Subject<boolean> = new Subject();
  initialChanges: any = {};
  minDate = new Date();
  maxDate = new Date();
  showTable: boolean = false;
  skipId: Array<any> = [];
  tableCCval: any
  @ViewChild('tableList') tableList: TableListComponent | undefined;
  @ViewChild('tableList1') tableList1: TableListComponent | undefined;
  formField: formBuilderData[] = [{
    type: 'chips',
    col_size: 12,
    colName: 'cc_email',
    title: 'CC',
    visible: false,
    filter: true,
    sort: true
  }]
  userData = this.auth.currentUserValue;
  showData: mapInfoView[] = [{ name: 'moduleName', title: 'Category' }, { name: 'child_type', title: 'Child Type', invisible: true }, { name: 'is_monthly', title: 'Is Allotment Required', type: 'BOOLEAN' },
  { name: 'freq_paymentName', title: 'Frequency' }, { name: 'sponsorship_programName', title: 'Program Name' },
  { name: 'preference', title: 'preference Req' }, { name: 'remarks', title: 'Remarks' }, { name: 'langName', title: 'Report Language' },
  { name: 'created_at', title: 'Create On', type: 'DATE' }, { name: 'updated_at', title: 'Last Updated On', type: 'DATE' }]
  showRemarks: boolean = false
  calculated: any;
  constructor(private activatedRoute: ActivatedRoute, private navigation: NavigationService,
    private alertService: AlertService, private staffApi: StaffApiService, private fb: FormBuilder,
    private auth: AuthService, private modifyrequest: ModifyService,
    private childApi: ChildApiService, private churchApi: ChurchApiService,
    private sponsorApi: SponsorApiService, private modalService: ModalService) { }

  ngOnInit(): void {
    const showAllot = this.auth.checkPermission('STAFF', 'VIEW_SPONSORSHIP');
    this.LIST_COL.map((a: any) => { if (a.colName == 'total_active_alloted') { a.visible = showAllot } return a })
    this.initForm();
    this.setMonthRange();
    this.sponsorshipId = this.activatedRoute.snapshot.queryParams.sponsorshipId || '';
    if (this.sponsorshipId) {
      this.currentSegment = this.segement.ALLOTMENT;
      this.nSegment = '';
      this.getSponsorShipData();

    }
    this.sponsorId = this.activatedRoute.snapshot.queryParams.sponsorId || '';
    this.pageInfo.buttonShowBtn = this.auth.checkPermission('SPONSORSHIP', 'VIEW_ALL');
    this.pageInfo.button = { title: 'Sponsorship List', url: this.urlService.SPONSOR.SPONSORSHIP.URL }
  }

  setMonthRange() {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    this.maxDate = d;
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 1);
  }

  tblAction = (id: string | number, type: tableAction, data: any = {}): Promise<any> => {
    switch (type) {
      case 'VIEW':
        this.viewHandler(data);
        break;
    }
    return Promise.resolve(true);
  }

  viewHandler(data: any) {
    switch (+this.sponsorshipData?.sponsorship_module) {
      case 1:
        this.modalService.openModal(StaffBasicComponent, { staff_emp_id: data.staff_emp_id, mode: 'FAMILY' }, 'modal-lg');
        break;
    }
  }

  returnZero() {
    return 0;
  }

  initForm(): void {
    this.dataForm = new UntypedFormGroup({
      sponsorship_id: new UntypedFormControl('', [Validators.required]),
      amount: new UntypedFormControl('', [Validators.required, Validators.pattern(VALIDATOR_PATTERNS.NUMBER)]),
      remarks: new UntypedFormControl(''),
      total_support: new UntypedFormControl('', [Validators.required, Validators.pattern(VALIDATOR_PATTERNS.NUMBER)]),
      changes_effect_from: new UntypedFormControl(new Date(), [Validators.required]),
      // alloted_amount:new FormArray([
      //     new FormControl(null,Validators.required)
      // ])
    });

    setTimeout(() => {
      this.amountForm = new FormGroup({
        alloted_amount: new FormControl (['', [Validators.pattern(VALIDATOR_PATTERNS.NUMBER)]])
      });

    }, 1000);
        // this.amountForm = this.fb.group({
        //   alloted_amount: this.fb.array([
        //     this.fb.control('', [Validators.pattern(VALIDATOR_PATTERNS.NUMBER)])
        //   ])
        // });
      

  }

  fullAmount:any = []
  totalAmount;

   calculateAmount(i: number){
    // for (let i = 0; i < length; i++) {
    //   this.totalAmount += this.dividedamount
    // }
    // this.totalAmount =  this.totalAmount-this.dividedamount
     if (this.amountForm && this.dataForm) {
       const ammFormAmount = this.amountForm.get('alloted_amount') as AbstractControl<any, any>;
       const amountFormAmount = ammFormAmount.value;
       if (typeof amountFormAmount === 'number' && !isNaN(amountFormAmount)) {
         const index = this.fullAmount.findIndex(item => item.key === i);
         if (index !== -1) {
           this.fullAmount[index].amount = amountFormAmount;
          } else { 
            this.fullAmount.push({ amount: amountFormAmount, key: i });
          }
          console.log("Updated fullAmount:", this.fullAmount);
        } else {
          console.error("Invalid input format. Please provide a valid number.");
        }
        this.totalAmount = 0
    this.fullAmount.forEach(item => {
        this.totalAmount += item.amount;
    });
    console.log('Total amount:', this.totalAmount);
    if(this.dataForm && this.amountForm){
      const dataFormAmount = this.dataForm.get('amount') as AbstractControl<any, any>;
      const dataFormNumericAmount = dataFormAmount.value;
      if (this.totalAmount !== dataFormNumericAmount) {
        // this.alertService.showToast('please enter the same equal amount to the capital amount', 'info');
      }
      if(this.totalAmount == dataFormNumericAmount){
        this.alertService.showToast('equal amount to capital amount', 'success');
      }
    }
         
    }
  }
   dividedamount:any;
   getSponsorShipData() {
    if (this.sponsorshipId) {
      this.dataLoading = true;
      this.showTable = false;
      this.skipId = [];
      this.sponsorApi.getSponsorshipDetails(this.sponsorshipId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.sponsorshipData = res.result;
          let numInt: number = parseInt('123', 10)
          this.dividedamount= parseInt(this.sponsorshipData.amount)/parseInt(this.sponsorshipData?.total_support)
          console.log( this.dividedamount,' this.dividedamount')
          this.sponsorshipData.langName = res.result?.sponsor?.langName || ''
          //this.sponsorshipData.child_type = this.sponsorshipData.child_type == 2 ? 'Home Child' : this.sponsorshipData.child_type == 1 ? 'MK Child' : '';
          this.sponsorData = res.result.sponsor || {};
          if (+this.sponsorshipData?.sponsorship_module == 1) {
            this.showData.splice(4, 0, { name: 'dedication_request', title: 'Dedication Req', type: 'BOOLEAN' })
          }
          this.sponsorshipData.allotment.forEach((a: any) => this.skipId.push(a.ref_id));
          this.dataForm.patchValue({
            sponsorship_id: this.sponsorshipData?.id,
            amount: this.sponsorshipData?.amount, total_support: this.sponsorshipData.total_support,
            remarks: this.sponsorshipData?.remarks || ''
          });
          this.changeTableSelection();
          this.calMaxSelection();
          this.initialChanges = this.apiPayload();
        }
      }).finally(() => { this.dataLoading = false })
    }
  }

  changeTableSelection() {
    this.showTable = false;
    switch (+this.sponsorshipData?.sponsorship_module) {
      case 1: // SRD Staff 
        this.tableConfig.column = this.LIST_COL;
        this.tableConfig.action = this.actionBtn;
        break;
      case 2:
        this.tableConfig.column = this.CHILD_LIST_COL;
        this.tableConfig.action = [];
        break;
      case 3:
        this.tableConfig.column = this.CHILD_LIST_COL;
        // this.tableConfig.column = this.CHURCH_LIST_COL;
        this.tableConfig.action = [];
        break;
    }
    this.showTable = true;
  }

 
  getListData = async (e: tblFilterQuery): Promise<any> => {
    let data: any = { statusCode: 200 };
    e.whereField = [];
    switch (+this.sponsorshipData?.sponsorship_module) {
      case 1: // SRD Staff 
        e.whereField = [{ colName: 'total_active_alloted', matchMode: '<', operation: 'AND', value: 3 }, { colName: 'allow_sponsor_allotment', operation: 'AND', value: '1' }]
        data = await this.staffApi.getList(e);
        break;
      case 2:
        e.whereField = this.auth.getPermittedId(['CHILD'], ['ALLOTMENT']);
        e.whereField?.push({ colName: 'total_active_alloted', matchMode: '<', operation: 'AND', value: 3 });
        // if (this.sponsorshipData.child_type) {
        //   e.whereField?.push({ colName: 'child_type', value: this.sponsorshipData.child_type })
        // }
        data = await this.childApi.getList(e);
        break;
      case 3:
        e.whereField = this.auth.getPermittedId(['CHILD'], ['ALLOTMENT']);
        e.whereField?.push({ colName: 'total_active_alloted', matchMode: '<', operation: 'AND', value: 3 });
        if (this.sponsorshipData.child_type) {
          e.whereField?.push({ colName: 'child_type', value: this.sponsorshipData.child_type })
        }
        data = await this.childApi.getList(e);
        // e.whereField = this.auth.getPermittedId(['CHURCH'], ['ALLOTMENT'], ['zone']);
        // e.whereField?.push({ colName: 'is_donation_allow', operation: 'AND', value: 1 });
        // data = await this.churchApi.getList(e).then((res: ResponseData | any) => {
        //   if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        //     res?.result?.data.map((a: any) => {
        //       a.is_donation_allow = a.is_donation_allow == 1 ? 'Yes' : 'No'
        //     })
        //   }
        //   return res
        // })
        break;
    }
    return data;
  }


  getSponsorshipList() {
    this.sponsorshipListLoading = true;
    this.sponsorApi.getAllPending(this.sponsorData?.id).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.sponsorshipList = res.result;
        if (!isArray(this.sponsorshipList)) {
          this.alertService.showToast('Oh! No Active sponsorship', 'info');
        }
      } else {
        this.alertService.showToast('Unable to get Sponsorship Data', 'info');
        this.sponsorshipList = [];
        this.sponsorshipId = '';
      }
    }).catch(err => {
      this.sponsorshipId = '';
      this.sponsorshipList = [];
      this.alertService.showToast('Unable to get Sponsorship Data', 'info');
    }).finally(() => {
      this.sponsorshipListLoading = false,
        this.dataForm.patchValue({ sponsorship_id: '' })
    })
  }

  getSponsorData() {
    if (this.sponsorId && isEmptyObj(this.sponsorData)) {
      this.sponsorApi.getById(this.sponsorId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.sponsorData = res.result;
          if (+this.sponsorData.status == 2) {
            this.alertService.showToast("sponsor on Pending Mode,unable to process", 'info');
          }
        } else {
          this.alertService.showToast("Unable to get sponsor Details", 'info');
          this.resetSponsor();
        }
      }).catch(err => {
        this.alertService.showToast("Unable to get sponsor Details", 'info');
        this.resetSponsor();
      })
    }
  }

  updatedTableData() {

  }
  deleteTableData(index: number) {
    this.modalService.openConfirmDialog({}).then(res => {
      if (res) {
        const data = this.sponsorshipData.allotment[index];
        if (data.id) {
          data.action = 3; // to delete
          this.sponsorshipData.allotment[index] = data;
          this.calMaxSelection();
        }
      }
    });
  }
  closeModal() {
    this.modalService.close();
  }

  editTableData(index: number, type: 'OLD' | 'NEW' = 'OLD') {
    const data = (type == 'OLD' ? this.sponsorshipData.allotment[index] : this.selectedData[index]) || [];
    if (data.cc_email) {
      data.cc_email = typeof data.cc_email == 'string' ? data.cc_email : data.cc_email.join(',')
    }
    this.modalService.openConfirmDialog({ title: 'Associate Email', message: '', formField: this.formField, isFormField: true, type: 'FORM', formValue: data }).then((dataConfirm: any) => {
      if (dataConfirm) {
        data.cc_email = dataConfirm.cc_email;
        if (type == 'OLD') {
          data.action = 2;
          this.sponsorshipData.allotment[index] = data;
        } else {
          this.selectedData[index] = data
        }
      }
    });
  }
  changeSegment(s: string) {
    //@ts-ignore
    const key: any = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.currentSegment = s;
    this.pSegment = Object.values(this.segement)[Object.keys(this.segement).indexOf(key) - 1];
    this.nSegment = Object.values(this.segement)[Object.keys(this.segement).indexOf(key) + 1];
  }


  isFormChange() {
    const src = JSON.stringify(this.initialChanges);
    const to = JSON.stringify(this.apiPayload());
    return src === to;
  }
  get isChangedAmount() {
    return +this.sponsorshipData?.amount != (+this.dataForm.value.amount);
  }

apiPayload() {
  const payload: any = this.dataForm.value;
  payload.id = this.sponsorshipData.id;
    payload.sponsorship_module = this.sponsorshipData.sponsorship_module;
    payload.last_modify_byName = this.userData.fname;
    payload.last_modify_by = this.userData.user_id;
    payload.request_data= { allotmentData: [] }
    payload.isChanged = this.isChangedAmount;
  if (this.isChangedAmount) {
    payload.amount = this.dataForm.value.amount;
    payload.total_support = this.dataForm.value.total_support;
  }
  const allotted: Array<any> = [...this.selectedData] || [];
  if (this.amountForm) {
    this.selectedData.forEach((data: any) => {
      const allottedData = { ...data };
      const allotedAmountControl = this.amountForm.get('alloted_amount');
      if (allotedAmountControl) {
        const allotedAmount = allotedAmountControl.value || 0;
        allottedData.alloted_amount = allotedAmount;
        payload.request_data.allotmentData.push(allottedData);
      }});
  }
  if (this.sponsorshipData.allotment) {
    this.sponsorshipData.allotment.filter((a: any) => +a.action === 3 || +a.action === 2)
      .forEach((e: any) => {
        const allottedData = { ...e };
        allottedData.alloted_amount = e.alloted_amount || 0;
        allotted.push(allottedData);
      });
  }
  payload['allotmentData'] = allotted;
  return payload;
} 

  apiPayloadModify() {
    const payload: modifyApi = {} as modifyApi;
    payload.created_by = this.userData.user_id;
    const apiPayload = this.apiPayload();
    if (!apiPayload.allotmentData.length) {
      payload.action_id = MODIFICATION_PERMISSION.UPDATE;
      payload.description = (this.sponsorData?.name || 'Sponsor ') + ' has sponsorship are requested to Update ' + (+this.sponsorshipData?.sponsorship_module == 2 ? 'Child' : +this.sponsorshipData?.sponsorship_module == 3 ? ' Church' : 'Missionary');
    } else {
      payload.action_id = MODIFICATION_PERMISSION.ALLOTMENT;
      payload.description = (this.sponsorData?.name || 'Sponsor ') + ' has sponsorship are requested to allot a ' + (+this.sponsorshipData?.sponsorship_module == 2 ? 'Child' : +this.sponsorshipData?.sponsorship_module == 3 ? ' Church' : 'Missionary');
    }
    payload.ref_id = this.sponsorshipData?.id || '';
    payload.promotional_office = this.sponsorData?.promotional_office;
    payload.sponsorship_module = this.sponsorshipData?.sponsorship_module;
    payload.module_id = MODULE_NAME.SPONSORSHIP
    return payload;
  }

  async onSubmit() {
    this.submitted = true;
    this.errorText = '';
    const dataFormAmount = this.dataForm.get('amount') as AbstractControl<any, any>; // Type assertion
    console.log(this.totalAmount,'aa',dataFormAmount.value)
    if(this.totalAmount == dataFormAmount.value){
      // this.alertService.showToast('equal amount', 'success');
    }
      else{
      this.alertService.showToast('Please enter the same amount as the capital amount', 'info');
        return;
    }
    
    if (this.isFormChange()) {
      this.alertService.showToast('No changes you made', 'info');
      return;
    }
    if (!this.dataForm.value.sponsorship_id) {
      this.alertService.showToast('Must be Select one sponsorship', 'info');
      return;
    }
    if (!this.sponsorData?.sponsor_id) {
      this.errorText = 'Sponsor not yet selected';
    } else if (!this.dataForm.valid) {
      this.errorText = 'Please ensure all the field are valid';
    } else if (!this.sponsorshipData?.id) {
      this.errorText = 'Select any one of Sponsorship';
    } else if (!this.getTotalAlloted()) {
      this.errorText = 'Select Any one for allotment';
    }
    //  else if ((+this.dataForm.value.total_support - this.getTotalAlloted()) != 0) {
    //   this.errorText = 'Allotment and sponsorship support should be equal';
    // }
    else if (+this.sponsorshipData?.sponsorship_module == 1 && +this.sponsorshipData?.dedication_request) {
      const da = this.selectedData.filter((a: any) => a.dedication_status == true);
      if (!da.length) {
        const resultChe = await this.modalService.openConfirmDialog({ message: 'Do you want to proceed without dedication request?', title: 'Dedication Request' });
        if (!resultChe) {
          return;
        }
      }
    }
    if (+this.sponsorData.status == 2) {
      this.errorText = "sponsor on Pending Mode,unable to process";
    }

    if (this.errorText) {
      this.alertService.showToast(this.errorText, 'info');
      return
    }
    const data = this.apiPayload();
    this.loading = true;
    const modifyData: modifyApi = this.apiPayloadModify();
    this.modifyrequest.saveModification(modifyData, data).then((res) => {
      if (res) {
        if (+this.sponsorshipData?.sponsorship_module == 1) { // staff  SRD
          const emp_id: Array<any> = [];
          this.selectedData.forEach((e: any) => {
            emp_id.push(e.staff_emp_id);
          });
          //  this.staffApi.updateRequest(emp_id, { modify_request: true });
        }
        //this.sponsorApi.updateSponsorshipRequest(data.id, { modify_request: true });
        this.disabled_save = true;
        this.close()
      }
    }).finally(() => {
      this.loading = false;
    }).catch(err => {
      this.disabled_save = true;
    })

  }



  saveAllotment() {
    this.sponsorApi.saveAllotment(this.apiPayload()).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {

      }
    })
  }

  resetSponsor() {
    this.sponsorData = {};
  }

  selectSponsorship() {
    const id = this.dataForm.value.sponsorship_id || '';
    this.sponsorshipData = {};
    this.sponsorshipId = '';
    this.showTable = false;
    if (id) {
      this.sponsorshipData = this.sponsorshipList.find((a: any) => +a.id == +id);
      this.dataForm.patchValue({
        sponsorship_id: this.sponsorshipData?.id,
        amount: this.sponsorshipData?.amount, total_support: this.sponsorshipData.total_support
      });
      this.changeTableSelection();
      this.showTable = true;
      this.calMaxSelection();
      this.initialChanges = this.apiPayload();
    }
  }

  getTotalAlloted(): number {
    let total_alloted = 0;
    if (Array.isArray(this.sponsorshipData.allotment)) {
      total_alloted = this.sponsorshipData.allotment.filter((a: any) => !a.deleted_at && a.action != 3)?.length;
    }
    return total_alloted + this.selectedData?.length;
  }

  calMaxSelection() {
    const total = this.dataForm.value.total_support;
    const max = (+total) - (this.getTotalAlloted() - this.selectedData?.length);
    this.maxSelection = max > -1 ? max : 0;
  }

  async close(status = false) {
    if (!this.isModal) {
      await this.navigation.back();
      return;
    }
    this._bsModalRef.hide();
    this.onClose.next(status);
  }

  openSponsorModal() {
    this.modalService.openSearchModal({ type: 'SPONSOR', skipKey: 'sponsor_id', skipData: [], activeOnly: true }).then(async (res: any) => {
      if (res.sponsor_id) {
        if (+res.status == 2) {
          this.alertService.showToast("sponsor on Pending Mode,unable to process", 'info');
          return;
        }

        this.sponsorData = {};
        if (res.deleted_at != null) {
          this.alertService.showToast("You can't select Inactive sponsor", 'info');
          return;
        }
        this.resetSponsor();
        this.sponsorData = res || {}
        this.getSponsorshipList();
      }
    });
  }

  onRemove(a: any) {
    if (this.tableList) {
      this.totalAmount = 0
      this.fullAmount = []
      this.tableList.AddRemoveSelection(a);
    }
  }

  markAsDedication(e: any) {
    if (this.selectedData.length) {
      this.selectedData.map((a: any) => {
        if (a === e) {
          a.dedication_status = true;
        } else {
          a.dedication_status = false;
        }
      });

      console.log(this.selectedData, 'seles')
    }
  }

  showProfile(a: any) {
    if (a.ref_id) {
      let comp: any;
      const api: any = {};
      switch (+this.sponsorshipData?.sponsorship_module) {
        case 1: // SRD Staff 
          comp = StaffBasicComponent;
          api.staff_emp_id = a.ref_id;
          break;
        case 2:
          comp = ChildBasicInfoComponent
          api.child_id = a.ref_id;
          break;
        case 3:
          comp = ChurchBasicComponent;
          api.church_id = a.ref_id;
          break;
      }
      this.modalService.openModal(comp, api, 'modal-lg');
    }
  }

  tabledata:any= []
  onSelectData(e: any) {
    this.amountForm.reset({
      alloted_amount: ' '
    });
    if (+e.modify_request) {
      this.alertService.showToast('Modification Request has been pending', 'info');
      this.onRemove(e);
      return;
    }
    console.log(e, 'on click')
    e.forEach((e: any) => {
      e.sponsorship_module = this.sponsorshipData?.sponsorship_module;
      e.sponsorship_id = this.sponsorshipData?.id;
      e.action = 1;
      e.created_at = mysqlDataTime();
      e.ref_id = e.id;
    });
    this.selectedData = e;
  
    console.log('selected data', this.selectedData);
    this.selectedGetListData(this.selectedData);
       
}

selectedGetListData = (e: tblFilterQuery[]) => {
    // Handle the selected data in the selectedGetListData function
    console.log('selected data in selectedGetListData', e);
    // Further processing...
    
    // 9; 
}
lastModifiedControl: string | null = null;
 
//  get allotedAmount(): FormArray {
//     return this.amountForm.get('alloted_amount') as FormArray;
//   }

// addHobby() {
//   // (<FormArray>this.dataForm.get('allowed_amount')).push(new FormControl('', Validators.required));
//  (<FormArray> this.amountForm.get('allowed_amount')).push(this.fb.control('', [Validators.pattern(VALIDATOR_PATTERNS.NUMBER)]));
// }
}