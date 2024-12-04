import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { arrayofData } from 'src/app/core/helper/core.data.interface';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { AppConstant, RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, convertDate, isMobileUniqueValidation } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilderData, tableButton } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { UserApiService } from 'src/app/modules/user/services/user-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { NEW_MAGAZINE_FORM, SPONSOR_ADDRESS, SPONSOR_OFFICEDATA } from '../../helper/sponsor-form';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';

@Component({
  selector: 'app-new-sponsor',
  templateUrl: './new-sponsor.component.html',
  styleUrls: ['./new-sponsor.component.scss']
})
export class NewSponsorComponent implements OnInit {
  urlService: any = UrlServices.PAGE_URL;
  sponsor_Form: any;
  dataLoading: boolean = false;
  emailCheckingloading: boolean = false;
  mobileCheckingloading: boolean = false;
  gender = AppConstant.GENDER;
  sponsorData: any;
  loading: boolean = false;
  isModifyRequest: boolean = false;
  submitted: boolean = false;
  email_id: string = ''; // validation purpose
  mobile_no: any; // asyn validation
  dateRange = AppConstant.DEFAULT_DATE_RANGE;
  dateFormat = AppConstant.DATE_FORMAT;
  MASTER_DATA: arrayofData = {
    promotional_office: [],
    lang: [],
    title: [],
    country: []
  }
  _bsModalRef: BsModalRef = {} as BsModalRef;
  isModal: boolean = false;
  modifyData: any = {};
  modifyMode: boolean = false;
  sponsorId: string | number = '';
  public onClose: Subject<boolean> = new Subject();
  showBtnList: boolean = false;
  masterLoading: any = {};
  disabled_save: boolean = false;
  pageInfo !: pageInfo;
  segement = {
    BASIC: 'Basic',
    MAGAZINE: 'Magazine',
  }
  dynFormData: formBuilderData[] = cloneData(NEW_MAGAZINE_FORM)
  dynTblButton: tableButton[] = [{ icon: 'icon-eye text-primary', title: 'View Info', type: 'VIEW' },
  { icon: 'icon-trash text-danger', title: 'Delete', type: 'DELETE' }]
  segementError: any = {}
  currentSegment: string = this.segement.BASIC;
  pSegment: string | undefined = '';
  regiondata: any;
  zonedata: any;
  promotionaldata:any;
  segmentVisited: any = {}
  // nSegment: string | undefined = this.segement.MAGAZINE;
  nSegment: string | undefined = this.segement.BASIC;
  nSegmentDisabled: boolean = false;
  mode: 'EDIT' | 'VIEW' = 'EDIT'
  @ViewChild('address') address: FormGeneratorComponent | undefined;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('dynTbl') dynTbl: DynamicTableFormComponent | undefined;
  addressFormData: formBuilderData[] = SPONSOR_ADDRESS
  basicFormData: formBuilderData[] = SPONSOR_OFFICEDATA
  constructor(public userApi: UserApiService, private sponsorApi: SponsorApiService,
    private auth: AuthService, private alertService: AlertService,
    private activatedRoute: ActivatedRoute, private modalService: ModalService,
    private navigation: NavigationService, private masterApi: MasterApiService) { }

  ngOnInit(): void {
    this.showBtnList = this.auth.checkPermission('SPONSOR', 'VIEW_ALL');
    this.sponsorId = this.activatedRoute.snapshot.queryParams.id || '';
    this.getSponsorDetails();
    this.initForm();
    this.region();

    if( this.sponsorId){
      setTimeout(() => {
      this.promotional();
    }, 1000);}

    Object.keys(this.MASTER_DATA).map(a => {
      this.getFullData(a);
    });
    this.pageInfo = {
      title: (!this.sponsorId ? 'New' : 'Update') + ' Donor',
      buttonShowBtn: true,
      button: {
        title: 'Donor List',
        url: this.urlService.SPONSOR.LIST.URL,
        class: 'btn-success'
      },
      //@ts-ignore
      info_text: this.sponsorId || ''
    }
    if (this.sponsorId) {
      this.mode = 'VIEW'
    }
  }
  regionzone() {
    this.zone()
  }
  zonepromotional(){
    this.promotional()
  }


  region() {
    this.sponsorApi.RegionData('[]').then((a: any) => {
      this.zone()
      this.regiondata = a?.result
    })

  }
  zone() {
    let payload = this.sponsor_Form.value.region
    const data: string[] = []
    data.push(payload)
    const arrayAsString = JSON.stringify(data);
    this.sponsorApi.ZoneData(arrayAsString).then((a: any) => {
      this.zonedata = a?.result
      data.pop()
    })
    
  }
dontcall:boolean=false;
  promotional(){
if(!this.dontcall && this.sponsorId){
    let payload =this.sponsorId? this.sponsorData.zone : this.sponsor_Form.value.zone;
    this.sponsorApi.PromotionalData(payload).then((a:any)=>{
      this.promotionaldata = a?.result
    })
    this.dontcall=true
  }else{
    let payload =this.sponsor_Form.value.zone;
    this.sponsorApi.PromotionalData(payload).then((a:any)=>{
      this.promotionaldata = a?.result
    })

  }
  }



  setInput(data: any) {
    this.modifyData = data || {};
    this.modifyMode = true;
    this.isModal = true;
  }

  initForm() {
    this.sponsor_Form = new FormGroup({
      is_whats_app: new FormControl(false),
      is_new_sponsor: new FormControl(false),
      name: new FormControl('', [Validators.required, Validators.pattern(VALIDATOR_PATTERNS.TEXT)]),
      promotional_office: new FormControl('', [Validators.required]),
      lang_id: new FormControl('', [Validators.required]),
      email_id: new FormControl('', [ Validators.pattern(VALIDATOR_PATTERNS.EMAIL)]),
      // mobile_no: new FormControl('', [Validators.required, Validators.pattern(VALIDATOR_PATTERNS.MOBILE)], [isMobileUniqueValidation.bind(this)]),
      mobile_no: new FormControl('', [Validators.required, Validators.pattern(VALIDATOR_PATTERNS.MOBILE)]),
      alt_mobile_no: new FormControl('', [Validators.pattern(VALIDATOR_PATTERNS.MOBILE)]),
      dob: new FormControl(''),
      title: new FormControl(''),
      region: new FormControl('',[Validators.required]),
      zone: new FormControl('',[Validators.required]),
      do_marraige: new FormControl(''),
      newsletter: new FormControl(''),
      place: new FormControl(''),
      comment: new FormControl(''),
      country_code: new FormControl(91, [Validators.required]),
      pan_card: new FormControl(),
      tally_code: new FormControl(),
    });

  }

  getFullData(tblName: any, cond = []) {
    if (tblName) {
      this.masterLoading[tblName] = true;
      //this.sponsor_Form.controls[tblName].disable();
      const isFull = tblName == 'field' ? true : false;
      this.masterApi.getFullData(tblName, cond, isFull).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.MASTER_DATA[tblName] = res.result;
        } else {
          this.MASTER_DATA[tblName] = [];
        }
        //this.address?.removeValidators();
      }).finally(() => {
        //this.sponsor_Form.controls[tblName].enable();
        this.masterLoading[tblName] = false;
      })
    }
  }

  checkAllValid(): boolean {
    const a = this.address?.isValid();
    return this.sponsor_Form.valid && a ? true : false;
  }

  applyFormValue(data: any) {
    if (data) {
      const mapData: any = {};
      Object.keys(this.sponsor_Form.controls).forEach((e: any) => {
        mapData[e] = data[e] ? data[e] : '';
      });
      mapData.dob = data.dob ? new Date(data.dob) : '';
      mapData.do_marraige = data.do_marraige ? new Date(data.do_marraige) : '';
      mapData.is_whats_app = data.is_whats_app ? true : false;
      mapData.is_new_sponsor = data.is_new_sponsor ? true : false;
      console.log(this.sponsor_Form,'this.sponsor_Form');
      console.log(mapData,'this.sponsor_FormmapData');
      this.sponsor_Form.patchValue(mapData);
      //this.sponsor_Form.get('req_staff_emp_ref').updateValueAndValidity();
    }
  }

  changeSegment(s: string) {
    //@ts-ignore
    const key: any = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.currentSegment = s;
    this.pSegment = Object.values(this.segement)[Object.keys(this.segement).indexOf(key) - 1];
    this.nSegment = Object.values(this.segement)[Object.keys(this.segement).indexOf(key) + 1];
  }

  getSponsorDetails() {
    if (this.sponsorId) {
      this.dataLoading = true;
      this.sponsorApi.getById(this.sponsorId).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (res.result) {
            this.sponsorData = res.result;
            this.basicForm?.setData(this.sponsorData)
            this.address?.setData(this.sponsorData);
            this.email_id = this.sponsorData.email_id;
            this.mobile_no = this.sponsorData.mobile_no;
            //this.isModifyRequest = +this.staffData?.modify_request ? true : false;
            this.applyFormValue(res.result);
            this.applyTblValue(res?.result);
          }
        }
      }).finally(() => {
        this.dataLoading = false;
      });
    }
  }

  applyTblValue(data: any) {
    if (data?.magazine) {
      this.dynTbl?.setInputData(data?.magazine)
    }
  }

  apiPayload() {
    const payload = this.sponsor_Form.value;
    const data = this.address?.apiPayload();
    Object.keys(data).forEach(a => {
      payload[a] = data[a]
    })
    const officedata = this.basicForm?.apiPayload();
    
    Object.keys(officedata).forEach(a => {
      payload[a] = officedata[a]
    })
    
    payload.dob = payload.dob ? convertDate(payload.dob) : null;
    payload.do_marraige = payload.do_marraige ? convertDate(payload.do_marraige) : null;
    payload.last_modify_by = this.auth.currentUserValue.user_id;
    if (this.sponsorId) {
      payload.sponsor_id = this.sponsorId;
      payload.id = this.sponsorData?.id;
    }
    payload.magazine = this.dynTbl?.apiPayload();
    return payload;
  }


  onSubmit() {
    // if (this.checkAllValid()) {
      this.saveSponsor();
    // }
  }

  saveSponsor() {
    this.loading = true;
    const payload = this.apiPayload();
    if (payload.magazine) {
      payload.magazine.map((a: any) => a.sponsor_fk_id = this.sponsorData?.id || '')
    };
    this.sponsorApi.saveSponsorDetails(payload).then((res: ResponseData) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('SuccessFully Saved', 'success');
        this.disabled_save = true;
        this.onClose.next(res.result)
        this.close();
      }
    }).catch(err => {
      this.alertService.showToast(err || 'Failed to save', 'error');
    }).finally(() => {
      this.loading = false;
    })
  }

  close(status = false) {
    if (!this.isModal) {
      this.navigation.back();
      return;
    }
    this.modalService.close()
    // this._bsModalRef.hide();
    // this.onClose.next(status);
  }

  returnZero() {
    return 0;
  }
}
