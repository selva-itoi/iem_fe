import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddressComponent } from 'src/app/core/component/address/address.component';
import { ImageUploadComponent } from 'src/app/core/component/image-upload/image-upload.component';
import { fileCompData, infoModalData } from 'src/app/core/helper/core.data.interface';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { AppConstant, MODULE_NAME, PERMISSION, RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, conditionalValidator, convertDate, isArray, isEmptyObj, isMobileUniqueValidation, mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { ResponseData, formBuilderData, formDynamicValidator } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { UserApiService } from 'src/app/modules/user/services/user-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { MARITAL_STATUS, staffOfficePartForm, STAFF_BASIC_FORM, STAFF_OFFICE_FORM } from '../../helper/staff_form';
import { StaffApiService } from '../../service/staff-api.service';
import { StaffEducationComponent } from '../staff-education/staff-education.component';
import { StaffExpGemsComponent } from '../staff-exp-gems/staff-exp-gems.component';
import { StaffExperienceComponent } from '../staff-experience/staff-experience.component';
import { StaffOtherDetailComponent } from '../staff-other-detail/staff-other-detail.component';
import { StaffTrainingComponent } from '../staff-training/staff-training.component';

@Component({
  selector: 'app-new-staff',
  templateUrl: './new-staff.component.html',
  styleUrls: ['./new-staff.component.scss']
})
export class NewStaffComponent implements OnInit {
  urlService: any = UrlServices.PAGE_URL;
  staff_Form: any
  profile:any;
  dataLoading: boolean = false;
  emailCheckingloading: boolean = false;
  mobileCheckingloading: boolean = false;
  showSpouseCheckbox: boolean = false;
  spouceDetails: any = {};
  disabled_save: boolean = false;
  loading: boolean = false;
  Marital_Status = MARITAL_STATUS;
  segement = {
    BASIC: 'Basic',
    ADDRESS: 'Address',
    TESTIMONY:'Testimony',
    EDUCATION: 'Education',
    TRAINING: 'IEM Training',
    EXPERIENCE: 'Prev. Exp',
    EXP_GEMS: 'Exp ' + AppConstant.ORG_NAME,
    OTHERS: 'Others',
  }
  segementError: any = {}
  dateRange = AppConstant.DEFAULT_DATE_RANGE;
  dateFormat = AppConstant.DATE_FORMAT;
  staff_educationData: Array<any> = [];
  staff_trainingData: Array<any> = [];
  staff_expData: Array<any> = [];
  staff_othersData: any = {};
  staff_exp_gemsData: Array<any> = [];
  staff_addressData: Array<any> = [];
  submitted: boolean = false;
  staffData: any = {};
  currentSegment: string = this.segement.BASIC;
  pSegment: string | undefined = '';
  nSegment: string | undefined = this.segement.ADDRESS;
  nSegmentDisabled: boolean = false;
  email_id: string = ''; // validation purpose
  mobile_no: any; // asyn validation
  isModifyRequest: boolean = false;
  profileImage: fileCompData = {
    filePath: '',
    label: 'Profile Image',
    fileType: 'IMAGE',
  };
  staffEmpId: string | number = '';
  familyImage: fileCompData = {
    filePath: '',
    label: 'family Image',
    fileType: 'IMAGE',
  };
  myProfileView: boolean = false;
  info_message: string = '';
  officeFormData: any = [...cloneData(STAFF_OFFICE_FORM), ...cloneData(staffOfficePartForm)];
  basicFormData: any = [...cloneData(STAFF_BASIC_FORM)];
  testimonydata:formBuilderData[]=[ {
    colName: 'testimony',
    title: 'Testimony ',
    col_size: 12,
    type: 'TEXTAREA',
}]
  stateData: any
  stateLoading: boolean = false
  isCrossCultural: boolean = false
  calDate: any = {}
  pageInfo: pageInfo = {} as pageInfo;
  request_id: string | number = '';
  requestData: any = {};
  spouseAddress: any
  basicDynValidator: formDynamicValidator[] = [
    { controlName: 'title', disableControl: ['gender'], hideControl: [], validatorControl: [], value: ['2','3','4','5','8']},
  ]
  @ViewChild('officeForm') officeForm: FormGeneratorComponent | undefined;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('testimonyform') testimonyform: FormGeneratorComponent | undefined;
  @ViewChild('presentAddress') presentAddress: AddressComponent | undefined;
  @ViewChild('permanentAddress') permanentAddress: AddressComponent | undefined;
  @ViewChild('staffOtherDetail') staffOtherDetail: StaffOtherDetailComponent | undefined;
  @ViewChild('staffExpGems') staffExpGems: StaffExpGemsComponent | undefined;
  @ViewChild('staffExpSecular') staffExpSecular: StaffExperienceComponent | undefined;
  @ViewChild('staffExpMinstrial') staffExpMinstrial: StaffExperienceComponent | undefined;
  @ViewChild('staffTraining') staffTraining: StaffTrainingComponent | undefined;
  @ViewChild('staffEduAcadmic') staffEduAcadmic: StaffEducationComponent | undefined;
  @ViewChild('staffEduTheology') staffEduTheology: StaffEducationComponent | undefined;
  @ViewChild('familyImageDiv') familyImageDiv: ImageUploadComponent | undefined;
  @ViewChild('profileImageDiv') profileImageDiv: ImageUploadComponent | undefined;
  basic: any;


  constructor(private modalService: ModalService, private masterApi: MasterApiService,
    private staffApi: StaffApiService,
    public userApi: UserApiService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private modifyrequest: ModifyService,
    private navigation: NavigationService) { }

  ngOnInit(): void {
    this.staffEmpId = this.activatedRoute.snapshot.queryParams.id || '';
    this.request_id = this.activatedRoute.snapshot.queryParams.request_id || '';
    if (this.staffEmpId == 'my_profile') {
      this.myProfileView = true;
      this.staffEmpId = this.auth.currentUserValue.staff_fk_id || '';
      if (!this.staffEmpId) {
        this.info_message = 'You are not a Staff';
      }
    }
    this.pageInfo = {
      title: (!this.staffEmpId ? 'New' : 'Update') + ' Staff Profile ',
      buttonShowBtn: this.auth.checkPermission('STAFF', 'VIEW_ALL'),
      button: {
        title: 'All Staff',
        url: this.urlService.STAFF.LIST.URL
      },
      info_text: this.staffData?.staff_emp_id || ''
    }
    this.getStaffDetails();
    this.initForm();
    this.getState();
    if(this.myProfileView){
      this.basicFormData.map((a:any)=>{   
        if(a.colName == 'mother_tongue' ){
        a.validator=[{ name: 'required', error: 'Name should not be blank' },
        { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Staff Name not Valid (Not allowed special character and space at end)' }]}})
        this.officeFormData.map((a:any)=>{
          if(a.colName == 'region' || a.colName == 'department' || a.colName == 'state_office' ||  a.colName == 'profile_img'){
            a.validator=[{name:'required'}]}
            if(a.colName =='profile_img'){
             a.fileConfig= { fileType: 'IMAGE', filePath: '' }
            }
          return a
          })
    }else{
            this.profile = 'profile'
            this.basicFormData.map((a:any)=>{   
              if(a.colName == 'mother_tongue' ){
              a.validator=[]}})
              this.officeFormData.map((a:any)=>{
                if(a.colName == 'region' || a.colName == 'department' || a.colName == 'state_office' || a.colName == 'profile_img' ){
                  a.validator=[]}})
                  this.basicFormData.map((a: formBuilderData) => { if (a.colName == 'name_cert') { a.readonly = false }; return a });      
    }
  }
  getRequest() {
    this.modifyrequest.getRequestData(this.request_id).then((res: any) => {
      if (res) {
        this.requestData = res;
        const staffData = res.source_data;
        this.staffData = { ...(res.request_data || {}), ...staffData };
        this.requestData.queryData = isArray(res.query) ? res.query.pop() : {};
        this.mapFormData(this.staffData);
      }
    })
  }

  fieldDisable() {
    const field = ['dob', 'do_appoint', 'do_join', 'do_confirm']
    this.basicFormData.map((a: formBuilderData) => { if (a.colName == 'name_cert') { a.readonly = true }; return a });
    field.forEach((b: any) => {
      this.staff_Form.controls?.[b].disable()
    })
  }


  genderdata:boolean= true
  genderdata1:any
  onChange(ev: any) {
    console.log(ev)
    
    // if(ev.controlName == 'name' ){
      //   this.basicForm?.toremoveWhiteSpace(ev)
      //   // const trimdata = ev.value.trim()
      //   // this.basicForm?.patchValue({name:trimdata})
      // }
      
      if (ev.controlName == 'title') {
        this.genderdata = false
        if (ev.value == 4) {
        this.basicForm?.patchValue({ gender: '1' });
        this.genderdata1 = '1'
        this.genderdata=true
      }
      else if (ev.value == 2 || ev.value == 3 || ev.value == 5 || ev.value == 8) {
        this.basicForm?.patchValue({ gender: '2' });
        this.genderdata1 = '2'
        this.genderdata=true



      }else {
        const defaultValue1: any = {};
        this.basicForm?.data?.forEach((a: any) => {
          if (a.defaultValue != undefined) {
            // defaultValue1[a.gender] = a.defaultValue1
           const Gender = defaultValue1[a.gender]
           this.basicForm?.patchValue({ gender: Gender });
          }
        })
  
      }
    }



  }

  initForm() {
    this.staff_Form = new FormGroup({
      isGemsStaff: new FormControl(false),
      staff_cross_id: new FormControl(null),
      lat: new FormControl(''),
      lng: new FormControl(''),
      maritial_status: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      do_bap: new FormControl(''),
      do_confirm: new FormControl(''),
      do_appoint: new FormControl(''),
      do_marraige: new FormControl('', [conditionalValidator(() => this.staff_Form.value.maritial_status != 1 && this.staff_Form.value.maritial_status != '', //set optional relationship id
        Validators.required),
      ]),
      origin_state_id: new FormControl(''),
      is_cross_culture: new FormControl(false),
      stay_on_sikaria_campus: new FormControl(false),
      distance_from_km: new FormControl(''),
      do_salvation: new FormControl('', []),
      do_join: new FormControl(''),
      title: new FormControl(''),
      allow_sponsor_allotment: new FormControl(false, []),
      email_id: new FormControl('', [Validators.required, Validators.pattern(VALIDATOR_PATTERNS.EMAIL)]),
      // mobile_no: new FormControl('', [Validators.required, Validators.pattern(VALIDATOR_PATTERNS.MOBILE)], [isMobileUniqueValidation.bind(this)]),
      mobile_no: new FormControl('',[Validators.required,Validators.pattern(VALIDATOR_PATTERNS.MOBILE)]),
      alt_mobile_no: new FormControl('', [Validators.pattern(VALIDATOR_PATTERNS.MOBILE)]),
      isSamePresent: new FormControl(false, []),
      req_staff_emp_ref: new FormControl('', [conditionalValidator(() => !this.staff_Form.get('staff_cross_id').value && this.staff_Form.get('isGemsStaff').value == true && isEmptyObj(this.spouceDetails), //set optional relationship id
        Validators.required),
      ]),
      isSpouseAddress: new FormControl(''),
    });
    if (this.myProfileView) {
      this.fieldDisable()
    }
  }
  getState() {
    this.stateLoading = true
    const cond = ['1']
    this.masterApi.getFullData('state', cond).then((res: ResponseData) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.stateData = res.result
      }
    }).finally(() => this.stateLoading = false)
  }
  crossCultural() {
    if (this.staff_Form.get('is_cross_culture')?.value) {
      this.isCrossCultural = true
      this.staff_Form.get('origin_state_id')?.setValidators(Validators.required)
      this.staff_Form.get('origin_state_id')?.updateValueAndValidity()
    } else {
      this.isCrossCultural = false
      this.staff_Form.get('origin_state_id')?.clearValidators()
      this.staff_Form.get('origin_state_id')?.updateValueAndValidity()
    }
  }
  calage(date: any, type: any) {
    const convertAge = new Date(date);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    const age_year = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    return this.calDate[type] = age_year
  }
  changeSpouceCheckbox() {
    this.staff_Form.get('req_staff_emp_ref').updateValueAndValidity();
  }

  changeAddressCheckbox() {
    if (this.staff_Form.value.isSamePresent) {
      const data = this.presentAddress?.apiPayload();
      this.permanentAddress?.disableAllField();
      this.permanentAddress?.applyFormValue(data);
      this.permanentAddress?.hideAll();
    } else {
      this.permanentAddress?.disableAllField(false);
      this.permanentAddress?.initForm();
      this.permanentAddress?.hideAll(false);
    }
  }

  changeMaritialStatus() {
    const v = this.staff_Form.value,
      s: any = {}
    if (v.maritial_status != 1 && v.maritial_status != '') {
      this.officeForm?.toggleControl('family_img', true);
      this.showSpouseCheckbox = true;
    } else {
      this.officeForm?.toggleControl('family_img', false);
      this.showSpouseCheckbox = false;
      s.isGemsStaff = false;
      s.req_staff_emp_ref = null;
      s.staff_cross_id = null;
      this.spouceDetails = {};
      this.staff_Form.patchValue(s);
    }
    this.staff_Form.get('do_marraige').updateValueAndValidity();
    this.staff_Form.get('req_staff_emp_ref').updateValueAndValidity();
  }


  changeSegment(s: string) {
    //@ts-ignore
    const key: any = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.currentSegment = s;
    this.pSegment = Object.values(this.segement)[Object.keys(this.segement).indexOf(key) - 1];
    this.nSegment = Object.values(this.segement)[Object.keys(this.segement).indexOf(key) + 1];
  }

  returnZero() {
    return 0;
  }

  apiPayload() {
    const user_id = this.auth.currentUserValue.user_id || '1',
      userName = this.auth.currentUserValue.fname || '';
    const payload = this.staff_Form.value;
    if (this.staffData.id) {
      payload.id = this.staffData.id;
      payload.last_modify_by = user_id;
      payload.last_modify_byName = userName
      payload.modify_at = mysqlDataTime()
    } else {
      payload.created_by = user_id
      payload.created_byName = userName
      payload.created_at = mysqlDataTime()
    }
    if (+payload.maritial_status == 1) {
      payload.isGemsStaff = false;
    }
    if (!payload.isGemsStaff) {
      payload.req_staff_emp_ref = null;
      payload.staff_cross_id = null;
    }

    const dateKey = ['do_marraige', 'dob', 'do_salvation', 'do_bap', 'do_confirm', 'do_appoint'];
    payload.staff_emp_id = this.staffData.staff_emp_id || '';
    dateKey.forEach(e => {
      payload[e] = payload[e] ? convertDate(payload[e]) : null;
    });
    const result = { ...payload, ...this.basicForm?.getFormValue(), ...this.officeForm?.getFormValue(true) };
    return result;
  }

  mapStaffPayload() {
    const payload: any = this.apiPayload();
    const addP: any = this.presentAddress?.apiPayload();
    addP.isPresent = true;
    addP.isPermanent = false;
    payload.address = [];
    if (!this.staff_Form.value.isSamePresent) {
      const addPr: any = this.permanentAddress?.apiPayload();
      addPr.isPermanent = true;
      addPr.isPresent = false;
      payload.address.push(addPr);
  } else {
      addP.isPermanent = true;
    }
    payload.address.push(addP);
    payload.experience = this.staffExpSecular?.apiPayload().concat(this.staffExpMinstrial?.apiPayload()) || [];
    payload.training = this.staffTraining?.apiPayload();
    payload.expGems = this.staffExpGems?.apiPayload() || [];
    payload.education = [...this.staffEduTheology?.apiPayload() || [], ...this.staffEduAcadmic?.apiPayload() || []];
    console.log('STAFF EDUCATION CHECK', payload.education)
    const extraField = {testimony:this.testimonyform?.getFormValue().testimony,alt_mobile_no:payload.alt_mobile_no, distance_from_km: payload.distance_from_km, origin_state_id: payload.origin_state_id, is_cross_culture: payload.is_cross_culture }
    const others = { ...this.staffOtherDetail?.apiPayload(), ...extraField }
    payload.others = [others]
    return payload;
  }


  get validSegemnet() {
    if (this.currentSegment) {
      switch (this.currentSegment) {
        case 'Basic':
          const d = !this.basicForm?.isValid();
          return !this.staff_Form?.valid && d;
          break;
        case 'Address':
          if (this.staff_Form.value.isSamePresent) {
            return !this.presentAddress?.isValidForm();
          } else {
            return false;
            //return (!this.presentAddress?.isValidForm() || !this.permanentAddress?.isValidForm()) ? true : false;
          }
          break;
      }
    }
    return false;
  }

  checkAllvalid() {
    this.segementError.BASIC = !this.staff_Form.valid;
    if (this.staff_Form.value.isSamePresent) {
      this.segementError.ADDRESS = !this.presentAddress?.isValidForm();
    } else {
      this.segementError.ADDRESS = (!this.presentAddress?.isValidForm() || !this.permanentAddress?.isValidForm()) ? true : false;
    }
    // this.segementError.OTHERS = !this.staffOtherDetail?.isValidForm();
    console.log(this.segementError)
    return Object.values(this.segementError).some((a: any) => a == true);
  }

  apiPayloadModify() {
    const payload: modifyApi = {} as modifyApi,
      dataStaffApi = this.apiPayload();
    payload.created_by = this.auth.currentUserValue.user_id,
      payload.action_id = PERMISSION.ADD;
    payload.description = dataStaffApi.name + ' staff requested to Add Record';
    if (this.staffData.id) {
      payload.action_id = PERMISSION.UPDATE;
      payload.description = dataStaffApi.name + ' staff requested to update the details';
    }
    payload.ref_id = dataStaffApi.staff_emp_id || this.staffData.staff_emp_id || '';
    payload.department = dataStaffApi.department;
    payload.zone = dataStaffApi.zone;
    payload.region = dataStaffApi.region;
    payload.state_office = dataStaffApi.state_office;
    payload.trust = dataStaffApi.trust;
    payload.module_id = MODULE_NAME.STAFF;
    return payload;
  }


  onSubmit() {
    this.submitted = true;
    if (+(this.basicForm?.getFormValue()?.gender) == +(this.spouceDetails.gender) ||  +(this.genderdata1) == +(this.spouceDetails.gender)) {
      this.alertService.showToast('You & Your Spouse are Same Gender not Allowed', 'info');
      return;
    }

    if (this.checkAllvalid()) {
      this.alertService.showToast('Some field not be valid ', 'error'); 
      return;
    }
    const data = this.mapStaffPayload();
    this.loading = true;
    // this.saveStaffData(data);
    // return;
    const modifyData: modifyApi = this.apiPayloadModify();
    this.modifyrequest.saveModification(modifyData, data).then((res) => {
      if (res) {
         this.staffApi.updateRequest(this.staffData.staff_emp_id, { modify_request: true });
        this.disabled_save = true;
        this.goBack();
      }
    }).finally(() => {
      this.loading = false;
    })
  }

  goBack() {
    this.navigation.back();
  }

  saveStaffData(data: any) {
    this.staffApi.saveStaffDetails(data).then((res: ResponseData) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        let msg;
        if (this.staffData.id) {
          msg = 'Staff Details has been updated';
        } else {
          const info: infoModalData = {
            content: `Staff Employee ID <b> ${res.result.staff_emp_code} </b>`
          };
          this.initForm();
          this.basicForm?.initForm();
          this.officeForm?.initForm();
          this.presentAddress?.initForm();
          this.permanentAddress?.initForm();
          this.modalService.openInfoModal(info)
          msg = "New Staff has been added";
        }
        this.alertService.showToast(msg, 'success');
        this.disabled_save = true;
        this.goBack();
      } else {
        this.alertService.showToast('Unable to save your changes ', 'error');
      }
    }).catch(err => {
      this.alertService.showToast(err || 'Unable to save your changes ', 'error');
    }).finally(() => {
      this.loading = false;
    })
  }
  openSearchModal() {
    const data = this.basicForm?.getFormValue();
    data.gender = this.basicForm?.getFormValue().gender
    console.log(data.gender,'form')
    if(this.staffEmpId && this.genderdata){
      data.gender=this.staffData.gender
      console.log('this.staffData')
    }
    if(this.genderdata1 &&  this.genderdata){
      data.gender=this.genderdata1
      console.log('this.genderdata1')
    }
    if (!data.gender ) {
      this.alertService.showToast('Please select Staff Gender before proceed', 'info');
      return;
    }
    if (+this.staff_Form.value.maritial_status == 1) {
      this.alertService.showToast('Staff Should not be a single', 'info');
      return;
    }

    this.modalService.openSearchModal({ type: 'STAFF', whereField: [{ colName: 'gender', value: +data.gender == 1 ? 2 : 1, operation: 'AND' }] }).then(async (res: any) => {
      if (res) {
        if (+(this.basicForm?.getFormValue()?.gender) == +(res.gender)) {
          this.alertService.showToast('You & Your Spouse are Same Gender not Allowed', 'info');
          return;
        }
        const d: any = {};
        this.spouceDetails = {};
        d.req_staff_emp_ref = res.staff_emp_id;

        if (res.staff_cross_id) {
          let allCrossStaff: Array<any> = [];
          await this.staffApi.getStaffByCross(res.staff_cross_id).then(async (result: ResponseData) => {
            if (result.statusCode == RESPONSE_CODE.SUCCESS) {
              allCrossStaff = result.result;
              if (allCrossStaff.length > 1) {
                let count = 0;
                allCrossStaff.forEach((e: any) => {
                  if (e.deleted_at == null) {
                    count = count + 1;
                  }
                });
                if (count > 1) {
                  const resConf = await this.modalService.openConfirmDialog({ title: 'Confirm Override spouse Details', message: 'Staff Mapped with another spouse Do you want to replace with this one?' });
                  if (!resConf) {
                    return;
                  }
                }
              }
              this.spouceDetails = res;
              this.staff_Form.patchValue(d);
              //requested_staff
            };
          })
        } else {
          // no crosRef
          this.spouceDetails = res;
          this.staff_Form.patchValue(d);
        }
      }
    });
  }

  applyFormValue(data: any) {
    if (data) {
      const mapData: any = {};
      Object.keys(this.staff_Form.controls).forEach((e: any) => {
        if (e == 'mobile_no') {
          const length = data[e].length;
          if (length > 10) {
            mapData[e] = data[e] ? data[e].substring(2) : '';
          } else {
            mapData[e] = data[e] ? data[e] : '';
          }
        } else {
          mapData[e] = data[e] ? data[e] : '';
        }
      });
      const dateKey = ['do_marraige', 'dob', 'do_salvation', 'do_bap', 'do_join', 'do_appoint', 'do_confirm'];
      dateKey.forEach(e => {
        mapData[e] = data[e] ? new Date(data[e]) : '';
      });
      mapData.isGemsStaff = data.staff_cross_id ? true : false;
      mapData.allow_sponsor_allotment = (+data.allow_sponsor_allotment) ? true : false;
      if (data.profile_img_path) {
        this.profileImage.filePath = data.profile_img_path;
        this.profileImageDiv?.setInput(this.profileImage);
      }
      if (data.family_img_path) {
        this.familyImage.filePath = data.family_img_path;
        this.familyImageDiv?.setInput(this.familyImage);
      }
      if (data.others) {
        const otherField: any = ['distance_from_km', 'origin_state_id', 'is_cross_culture'];
        otherField.forEach((a: any) => {
          mapData[a] = data['others'][a] || '';
        })
      }
      this.staff_Form.patchValue(mapData);
      this.changeMaritialStatus();
    }
  }

  getStaffDetails() {
    if (this.staffEmpId) {
      this.dataLoading = true;
      this.staffApi.getStaffDetails(this.staffEmpId).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          // this.basic = res.result.others[0].alt_mobile_no
          if (res.result) {
            this.pageInfo.info_text = res.result.staff_emp_id || '';
            this.staffData = res?.result;
            // this.staffData.alt_mobile_no = this.basic
            this.mapFormData(this.staffData);
          }
        }
      }).finally(() => {
        this.dataLoading = false;
      });
    }
  }

  mapFormData(result: any) {
    this.email_id = result.email_id;
    this.mobile_no = result.mobile_no;
    this.officeForm?.setData(result);
    this.basicForm?.setData(result);
    this.calage(result?.dob, 'DOB')
    this.calage(result?.do_join, 'DOJ')
    if (result.spouce) {
      this.spouceDetails = result.spouce;
    }
    this.isModifyRequest = +result?.modify_request ? true : false;
    if (result.others) {
      this.testimonyform?.setData(result.others[0]),
      this.staffOtherDetail?.applyFormValue(result.others[0])
    }
    result.stay_on_sikaria_campus = + result.others[0]?.stay_on_sikaria_campus ? true : false;
    this.applyFormValue(result);
    if (result.education && Array.isArray(result.education)) {
      const eduA = result.education.filter((a: any) => +a.type == 1)
      const eduT = result.education.filter((a: any) => +a.type == 2)
      this.staffEduAcadmic?.setData(eduA);
      this.staffEduTheology?.setData(eduT);
    }
    if (result.experience && Array.isArray(result.experience)) {
      const eduA = result.experience.filter((a: any) => +a.type == 1)
      const eduT = result.experience.filter((a: any) => +a.type == 2)
      this.staffExpMinstrial?.setData(eduT);
      this.staffExpSecular?.setData(eduA);
    }
    if (result.expGems && Array.isArray(result.expGems)) {
      this.staffExpGems?.setData(result.expGems);
    }
    if (result.training && Array.isArray(result.training)) {
      this.staffTraining?.setData(result.training);
    }
    if (result.address && Array.isArray(result.address)) {
      this.setAddress(result.address);
    }
  }

  setAddress(res: any) {
    if (res) {
      if (Array.isArray(res)) {
        if (res.length == 1) {
          const present = res[0].isPermanent ? true : false;
          this.staff_Form.patchValue({ isSamePresent: present });
          if (present) {
            this.permanentAddress?.disableAllField();
            this.permanentAddress?.hideAll();
          }
        }
        res.map(a => {
          if (a.isPresent == '1') {
            this.presentAddress?.applyFormValue(a)
          }
          if (a.isPermanent == '1') {
            this.permanentAddress?.applyFormValue(a)
          }
        })
      }
    }
  }

  changeSpouceAddress() {
    const id = 150;
    if (!this.staff_Form.get('isSpouseAddress')?.value) {
      this.staff_Form.patchValue({ isSamePresent: false });
      this.permanentAddress?.disableAllField(false)
      this.permanentAddress?.hideAll(false)
      this.presentAddress?.addressForm.reset()
      this.permanentAddress?.addressForm.reset()
      setTimeout(() => {
        this.presentAddress?.initForm()
      }, 200);
    } else { this.setAddress(this.spouseAddress?.address); }

    if (id && this.staff_Form.get('isSpouseAddress')?.value && !this.spouseAddress) {
      this.staffApi.getStaffDetails(id).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (res.result) {
            this.spouseAddress = res.result
            this.setAddress(this.spouseAddress?.address);
          }
        } else {
          this.alertService.showToast('Unable to Get Data', 'error')
        }
      }).catch(() => this.alertService.showToast('Unable to Get Data', 'error'))
    }

  }

  getStaffAddress() {
    if (this.staffEmpId) {
      this.staffApi.getStaffAddress(this.staffEmpId).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (res.result) {
            this.setAddress(res.result);
          }
        }
      });
    }
  }
}
