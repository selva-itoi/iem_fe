import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { arrayofData } from 'src/app/core/helper/core.data.interface';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { AppConstant, MODULE_NAME, PERMISSION, RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { conditionalValidator, isEmptyObj, sort } from 'src/app/helper/class/utilityHelper';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { ResponseData, formBuilder } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { UserApiService } from 'src/app/modules/user/services/user-api.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';

@Component({
  selector: 'app-new-sponsorship',
  templateUrl: './new-sponsorship.component.html',
  styleUrls: ['./new-sponsorship.component.scss']
})
export class NewSponsorshipComponent implements OnInit {
  urlService: any = UrlServices.PAGE_URL;
  sponsor_Form: any;
  dataLoading: boolean = false;
  sponsorshipData: any;
  loading: boolean = false;
  isModifyRequest: boolean = false;
  disabled_save: boolean = false;
  submitted: boolean = false;
  dateRange = AppConstant.DEFAULT_DATE_RANGE;
  dateFormat = AppConstant.DATE_FORMAT;
  MASTER_DATA: arrayofData = {
    sponsorship_module: [],
    sponsorship_program: []
  }
  activeCategory: any = {};
  _bsModalRef: BsModalRef = {} as BsModalRef;
  isModal: boolean = false;
  modifyData: any = {};
  modifyMode: boolean = false;
  sponsorData: any = {};
  public onClose: Subject<boolean> = new Subject();
  masterLoading: any = {};
  sponsorshipId: string | number = '';
  showViewAll: boolean = false;
  userData = this.auth.currentUserValue;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('freqForm') freqForm: FormGeneratorComponent | undefined;


  basicFormData:formBuilder[]=[

    {
      colName: 'sponsorship_module',
      selectKeyName: 'name',
      selectPrimaryKey: 'id',
      defaultValue: '',
      apiTblName: 'sponsorship_module',
      type: 'select',
      title: 'Sponsorship',
      apiFilter : { keyName: 'isRecuring', value: '1', operation: '==' },
      event: { isCallback: true, name: 'change' },
      validator:[{name:'required'}]
  },
    
  ]
  freqFormData:formBuilder[]=[

    {
      colName: 'freq_payment_id',
      selectKeyName: 'freq_paymentName',
      selectPrimaryKey: 'id',
      defaultValue: '',
      apiTblName: 'freq_payment',
      type: 'select',
      title: 'Frequency',
      col_size:12,
      event: { isCallback: true, name: 'change' },
  },
    
  ]
  constructor(public userApi: UserApiService, private sponsorApi: SponsorApiService,
    private modalService: ModalService, private alertService: AlertService,
    private auth: AuthService, private modifyrequest: ModifyService,
    private activatedRoute: ActivatedRoute,
    private navigation: NavigationService, private masterApi: MasterApiService) { }

  ngOnInit(): void {
    this.sponsorshipId = this.activatedRoute.snapshot.queryParams.id || '';
    console.log('this.sponsorshipId', this.sponsorshipId)
    this.showViewAll = this.auth.checkPermission('SPONSORSHIP', 'VIEW_ALL');
    this.initForm();
    this.getFullData('sponsorship_module');
    this.getFullData('sponsorship_program')
    if (this.sponsorshipId) {
      this.getsponsorshipData();
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
    this.sponsor_Form.get('child_type').updateValueAndValidity();
    // this.sponsor_Form.get('freq_payment_id').updateValueAndValidity();
    this.sponsor_Form.get('sponsorship_program_id').updateValueAndValidity();
  }

  onClickTab(e: any = '') {
    const data = this.basicForm?.apiPayload()
    console.log(data.sponsorship_module,'sssss')
    // this.sponsor_Form.value.sponsorship_module
    this.activeCategory = this.MASTER_DATA.sponsorship_module.find((a: any) => a.id == data.sponsorship_module)
    this.sponsor_Form.patchValue({
      is_monthly: false,
      total_support: 1,
      report_language: '',
      preference: '',
      dedication_request: false,
      arrival_date_time: '',
      place: '',
      dept_date_time: '',
      date_time: '',
      // church_donation_to: '',
      child_type: '',
      // freq_payment_id: this.activeCategory.id == 3 ? 1 : 2,
      sponsorship_program_id: ''
    });
    this.updateValitityForm();
    this.onChangeNumber();
  }

  onChangeNumber() {
    const total_support = this.sponsor_Form.value.total_support || 0;
    let tot_amt = 0;
    if (this.activeCategory.amount) {
      tot_amt = total_support * +this.activeCategory.amount;
      this.sponsor_Form.patchValue({ amount: tot_amt });
    } else {
      this.sponsor_Form.patchValue({ amount: tot_amt });
    }
  }

  onChangeSponsorship() {
    const data = this.MASTER_DATA['sponsorship_program'].find((a: any) => a.id == this.sponsor_Form.get('sponsorship_program_id').value),
      tot_amt = data?.amount.split('.')[0] || 0
    this.sponsor_Form.patchValue({ amount: +tot_amt });
  }
  initForm() {
    this.sponsor_Form = new UntypedFormGroup({
      remarks: new UntypedFormControl(''),
      is_monthly: new UntypedFormControl(false),
      // sponsorship_module: new UntypedFormControl(1),
      amount: new UntypedFormControl(0, [Validators.required, Validators.pattern(VALIDATOR_PATTERNS.NUMBER), Validators.min(1)]),
      sponsor_id: new UntypedFormControl(''),
      report_language: new UntypedFormControl(''),
      preference: new UntypedFormControl(''),
      promotional_office: new UntypedFormControl(''),
      // church_donation_to: new FormControl('', [conditionalValidator(() => this.sponsor_Form.value.sponsorship_module == 3, //set optional dedication request id
      //   Validators.required),
      // ]),
      // freq_payment_id: new UntypedFormControl(this.activeCategory.id == 3 ? 1 : 2, [conditionalValidator(() => +(this.activeCategory?.isRecuring) == 1, //set optional dedication request id
      //   Validators.required),
      // ]),
      child_type: new UntypedFormControl('', [conditionalValidator(() => this.sponsor_Form.value.sponsorship_module == 2, //set optional dedication request id
        Validators.required),
      ]),
      total_support: new UntypedFormControl(1, [conditionalValidator(() => this.sponsor_Form.value.is_monthly, //set optional dedication request id
        Validators.required),
      ]),
      payment_status: new UntypedFormControl(2),
      dedication_request: new UntypedFormControl(false),
      is_revert: new UntypedFormControl(false),
      is_alloted: new UntypedFormControl(false),
      arrival_date_time: new UntypedFormControl('', [conditionalValidator(() => this.sponsor_Form.value.dedication_request && !this.sponsorshipId, //set optional dedication request id
        Validators.required),
      ]),
      place: new UntypedFormControl('', [conditionalValidator(() => this.sponsor_Form.value.dedication_request && !this.sponsorshipId, //set optional dedication request id
        Validators.required),
      ]),
      dept_date_time: new UntypedFormControl('', [conditionalValidator(() => this.sponsor_Form.value.dedication_request && !this.sponsorshipId, //set optional dedication request id
        Validators.required),
      ]),
      date_time: new UntypedFormControl('', [conditionalValidator(() => this.sponsor_Form.value.dedication_request && !this.sponsorshipId, //set optional dedication request id
        Validators.required),
      ]),
      sponsorship_program_id: new UntypedFormControl('', [conditionalValidator(() => this.sponsor_Form.value.sponsorship_module == 7, //set optional dedication request id
        Validators.required),
      ])
    });

  }

  getsponsorshipData() {
    if (this.sponsorshipId) {
      this.dataLoading = true;
      this.sponsorApi.getSponsorshipDetails(this.sponsorshipId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.sponsorshipData = res.result;
          setTimeout(() => {
            this.basicForm?.setData(this.sponsorshipData)
            this.freqForm?.setData(this.sponsorshipData)
          }, 1000); 
          this.sponsorData = res.result.sponsor || {};

          this.mapformData();
        }
      }).finally(() => { this.dataLoading = false })
    }
  }

  mapformData() {
    const mapData: any = {};
    Object.keys(this.sponsor_Form.controls).forEach((e: any) => {
      mapData[e] = this.sponsorshipData[e] ? this.sponsorshipData[e] : this.sponsorshipData.sponsor[e] ? this.sponsorshipData.sponsor[e] : '';
    });
    this.sponsor_Form.patchValue(mapData);
  }

  resetSponsor() {
    this.sponsorData = {};
    this.sponsor_Form.patchValue({ sponsor_id: '' });
  }

  openSearchModal() {
    this.modalService.openSearchModal({ type: 'SPONSOR', skipKey: 'sponsor_id', skipData: [this.sponsorshipData?.sponsor_id], activeOnly: true }).then(async (res: any) => {
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
      this.masterApi.getFullData(tblName, cond, isFull).then((res: ResponseData | any) => {
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
    return this.sponsor_Form.valid;
  }

  apiPayload() {
    const payload = this.sponsor_Form.value;
    const data = this.freqForm?.apiPayload();
    const sponsordata = this.basicForm?.apiPayload();
    if(data?.freq_payment_id){

      payload.status = data?.freq_payment_id ? 3 : 1;
    }
    // payload.moduleName = this.MASTER_DATA.sponsorship_module.filter((a: any) => a.id == +(this.sponsor_Form.value.sponsorship_module))[0]?.name || '';
    payload.sponsor_fk_id = this.sponsorData?.id;
    payload.id = this.sponsorshipId
    // payload.freq_paymentName = +payload.freq_payment_id == 1 ? 'One Time' : +payload.freq_payment_id == 2 ? 'Monthly' : 'Installment'
    if(data?.freq_payment_id){

      payload.freq_payment_id = data.freq_payment_id
    }
    payload.sponsorship_module = sponsordata.sponsorship_module
    if (this.sponsorshipId) {
      payload.created_byName = this.userData.fname;
      payload.created_by = this.userData.user_id;
    }else{
      payload.last_modify_byName = this.userData.fname;
      payload.last_modify_by = this.userData.user_id;
    }
    return payload;
  }

  apiPayloadModify() {
    const payload: modifyApi = {} as modifyApi;
    payload.created_by = this.auth.currentUserValue.user_id,
      payload.action_id = PERMISSION.ADD;
    payload.description = this.sponsorData?.name || 'Sponsor ' + '  requested to Add new sponsorship';
    if (this.sponsorshipId) {
      payload.action_id = PERMISSION.UPDATE;
      payload.description = this.sponsorData?.name || 'Sponsor' + '  requested to update the sponsorship details';
    }
    payload.ref_id = this.sponsor_Form.value.sponsor_id || '';
    payload.promotional_office = this.sponsor_Form.value.promotional_office;
    // payload.sponsor_fk_id = this.sponsorshipId;
    
    const sponsordata = this.basicForm?.apiPayload();

    payload.sponsorship_module = sponsordata.sponsorship_module
    payload.module_id = MODULE_NAME.SPONSORSHIP
    return payload;
  }

  onSubmit() {
    this.submitted = true
    const allValid = this.checkAllvalid();
    if (!this.sponsorData.sponsor_id) {
      this.alertService.showToast('One sponsor must be select, Please select Donor', 'info');
      return;
    }
    if (+this.sponsorData.status == 2) {
      this.alertService.showToast("sponsor on Pending Mode,unable to process", 'info');
      return;
    }
    if (allValid) {
      this.loading = true;
      const modifyData: modifyApi = this.apiPayloadModify();
      this.modifyrequest.saveModification(modifyData, this.apiPayload()).then((res: any) => {
        this.disabled_save = true;
        this.close();
      }).finally(() => {
        this.loading = false;
      })
    }
  }

  saveSposor(data: any = {}) {
    this.sponsorApi.saveSponsorShip(this.apiPayload()).then(res => {

    }).finally(() => this.loading = false)
  }

  close(status = false) {
    if (!this.isModal) {
      this.navigation.back();
      return;
    }
    this._bsModalRef.hide();
    this.onClose.next(status);
  }

}
