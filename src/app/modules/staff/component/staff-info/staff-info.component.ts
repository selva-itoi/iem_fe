import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ObjectString, infoModalData } from 'src/app/core/helper/core.data.interface';
import { ADDRESS_MAP_INFO, MODIFY_COL, RELIVE_COL } from 'src/app/core/helper/core_form_helper';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { AppConstant, MODIFICATION_PERMISSION, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, isArray, isEmptyObj, mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilder, formBuilderData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { CHILD_SIBLING_FORM } from 'src/app/modules/child/helper/child-form';
import { EmailApiService } from 'src/app/modules/email/service/email-api.service';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { MARITAL_STATUS, PAYROLL_EXPERIENCE_FORM, STAFF_BANK_FORM, STAFF_BASIC_FORM, STAFF_OFFICE_FORM, STAFF_OTHERS_FORM, STAFF_PAYROLL_FORM, staffOfficePartForm } from '../../helper/staff_form';
import { StaffApiService } from '../../service/staff-api.service';
import { StaffEducationComponent } from '../staff-education/staff-education.component';
import { StaffExpGemsComponent } from '../staff-exp-gems/staff-exp-gems.component';
import { StaffExperienceComponent } from '../staff-experience/staff-experience.component';
import { StaffTrainingComponent } from '../staff-training/staff-training.component';
import { ProfileWidgetComponent } from 'src/app/shared/feature-modal/profile-widget/profile-widget.component';

@Component({
  selector: 'app-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.scss'],
  // providers: [BsModalRef]
})
export class StaffInfoComponent implements OnInit {
  shortOrg = AppConstant.ORG_NAME
  type: 'MODIFICATION' | 'VIEW' | 'RELIVE' | 'REJOIN' = 'VIEW';
  urlService = UrlServices.PAGE_URL;
  modifyData: any = {};
  staff_id: number | string = '';
  staffData: any = {};
  dataLoading: boolean = false;
  myProfileView:any
  presentAddress: any = {};
  premanentAddress: any = {};
  segment: ObjectString = {
    BASIC: 'Basic',
    ADDRESS: 'Testimony',
    FAMILY_INFO: 'Family Info',
    EDUCATION: 'Education',
    TRAINING: 'Training',
    EXPERIENCE: 'Experience',
    EXP_GEMS: 'Exp ' + AppConstant.ORG_NAME,
    OTHERS: 'Others'
  }
  othersInfoFormData: formBuilderData[] = [...cloneData(STAFF_OTHERS_FORM).slice(0, 3), ...cloneData(STAFF_OTHERS_FORM).slice(4, 6)]
  // othersCommentsFormData: formBuilderData[] = [...cloneData(STAFF_OTHERS_FORM).slice(9, 12), ...[{ colName: 'testimony', title: 'Testimony',col_size:12 }]]
  othersCommentsFormData: formBuilderData[] = [{ colName: 'testimony', title: '',col_size:12 }]
  othersMedicalFormData: formBuilderData[] = cloneData(STAFF_OTHERS_FORM).slice(7, 9)
  othersBankFormData: formBuilderData[] = [...cloneData(STAFF_BANK_FORM), ...cloneData(STAFF_OTHERS_FORM).slice(12, 14)]
  othersSupportFormData: formBuilderData[] = cloneData(STAFF_OTHERS_FORM).slice(15)
  payrollFormData: formBuilder[] = [...cloneData(STAFF_PAYROLL_FORM), ...[{ title: 'Years Of Experience', colName: 'year_of_exp' }, { title: 'Additional Experience', colName: 'additional_exp' }]]
  payrollDynTableForm: formBuilder[] = cloneData(PAYROLL_EXPERIENCE_FORM)
  showPayRoll: boolean = false;
  _bsModalRef: BsModalRef = {} as BsModalRef;
  isModal: boolean = false;
  hasPermissionViewSponsorship: boolean = false;
  info_message: string = '';
  pageInfo: pageInfo = {} as pageInfo;
  officeFormData = [...STAFF_OFFICE_FORM, ...cloneData(staffOfficePartForm).slice(0, -2), ...RELIVE_COL, ...[{ colName: 'statusName', title: 'Current Status' }], ...MODIFY_COL, ...[ { colName: 'last_rejoin_date', title: 'Rejoin Date', type: 'DATE' }]];
  formDataBas: any[] = [{ title: 'Date of Birth', colName: 'dob', type: 'DATE' }, { title: 'Age', colName: 'age' }, { title: 'Marital Status', colName: 'maritial_status', type: 'select', data: MARITAL_STATUS, selectKeyName: 'maritalName' },
  { title: 'Date Of Marriage', colName: 'do_marraige', type: 'DATE' }, { title: 'Date of Baptism', colName: 'do_bap', type: 'DATE' }, { title: 'Date of Salvation', colName: 'do_salvation', type: 'DATE' }, { title: 'Date of Joining', colName: 'do_join', type: 'DATE' }, { title: 'Years Of Experience', colName: 'year_of_exp' },
  { title: 'Cross Ref No', colName: 'staff_cross_id', isClickable: true, viewType: 'CROSS_REF_ID' }, { title: 'Is Cross Culture', colName: 'is_cross_culture' }, { title: 'Origin State', colName: 'stateName' }, { title: 'Native Distance', colName: 'distance_from_km' }]
  basicFormData: formBuilder[] = [...cloneData(STAFF_BASIC_FORM).slice(2), ...this.formDataBas, ...[{ colName: 'alt_mobile_no', title: 'Alt Mobile' }]];
  addressFormData: formBuilderData[] = cloneData(ADDRESS_MAP_INFO)
//   profileData:formBuilderData[]=[  { colName: 'fullname', title: 'Name' },{ colName: 'role', title: 'role' },{ colName: 'email_id', title: 'Email Id' },{ colName: 'mobile_no', title: 'Mobile No' },{ colName: 'created_at', title: 'Created on' },
// ]
  modifyPresentAddress: any
  modifyPermanentAddress: any
  spouseDetail: any
  spouseInfoView: any = [{ name: 'fullName', title: 'Name' }, { name: 'staff_cross_id', title: 'Cross Ref' }, { title: 'Department', name: 'dName' },
  { title: 'Date of Birth', name: 'dob', type: 'DATE' }, { title: 'Gender', name: 'genderName' }, { title: 'Mobile No', name: 'mobile_no' }, { title: 'Branch', name: 'branchName' },
  { title: 'E-mail', name: 'email_id' },
  //  { title: 'MS Office', name: 'adName' }, 
   { title: 'Active From', name: 'do_join', type: 'DATE' }, { title: 'Remarks', name: 'reason_relive' },
  { title: 'Status', name: 'staff_statusName' }, { title: 'Last Update', name: 'updated_at', type: 'DATE' }
  ]
  childFormData = cloneData(CHILD_SIBLING_FORM)
  @ViewChild('staffExpGems') staffExpGems: StaffExpGemsComponent | undefined;
  @ViewChild('staffExpSecular') staffExpSecular: StaffExperienceComponent | undefined;
  @ViewChild('staffExpMinstrial') staffExpMinstrial: StaffExperienceComponent | undefined;
  @ViewChild('staffTraining') staffTraining: StaffTrainingComponent | undefined;
  @ViewChild('staffEduAcadmic') staffEduAcadmic: StaffEducationComponent | undefined;
  @ViewChild('staffEduTheology') staffEduTheology: StaffEducationComponent | undefined;
  @ViewChild('payrollDynForm') payrollDynForm: DynamicTableFormComponent | undefined;
  @ViewChild('childFamilyTbl') childFamilyTbl: DynamicTableFormComponent | undefined;
  @ViewChild('profileWidget') profileWidget: ProfileWidgetComponent | undefined;
  constructor(private staffApi: StaffApiService,
    private auth: AuthService,
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: ModalService, private alertController: AlertService) { }
    profiledata:any
    roleName1:any
  ngOnInit(): void {
    this.profiledata=this.auth.currentUserValue
    // this.roleName1 = this.auth.currentUserValue.role?.[0].roleName;
    // this.segment['PAYROLL'] = 'Payroll';
    const queryParam = this.activatedRoute.snapshot.queryParams.id || '';
    const showBtnList = this.auth.checkPermission('STAFF', 'VIEW_ALL'),
      profile_view = queryParam == 'my_profile' ? true : false;
      // if(profile_view){
      //   this.officeFormData = [...STAFF_OFFICE_FORM, ...cloneData(staffOfficePartForm).slice(0, -2), ...[{ colName: 'statusName', title: 'Current Status' }], ...MODIFY_COL, ...[ { colName: 'last_rejoin_date', title: 'Rejoin Date', type: 'DATE' }]];
      // }
      this.myProfileView=profile_view
    this.staff_id = profile_view ? this.auth.currentUserValue.staff_fk_id || '' : this.activatedRoute.snapshot.queryParams.id || '';
    if (!queryParam) {
      this.type = 'MODIFICATION';
      this.isModal = true;
      this._bsModalRef = this.injector.get<BsModalRef>(BsModalRef);
    }
    this.showPayRoll = this.auth.checkPermission('STAFF', 'MANAGE_PAYROLL') //|| this.auth.checkPermission('STAFF', 'VERIFY');
    if (this.showPayRoll) {
      this.segment['PAYROLL'] = 'Payroll';
    }
    this.info_message = profile_view && !this.staff_id ? 'You are not a Staff' : '';
    this.pageInfo = {
      title: this.isModal ? 'Staff Request' : profile_view ? 'My Profile' : 'Staff Info',
      buttonShowBtn: profile_view ? true : showBtnList,
      button: {
        title: profile_view ? 'Modify Profile' : 'View All Staff',
        url: profile_view ? this.urlService.STAFF.ADD.URL : this.urlService.STAFF.LIST.URL,
        queryParams: { id: profile_view ? 'my_profile' : '' }
      }
    }
    this.getStaffData();
    this.hasPermissionViewSponsorship = this.auth.checkPermission('STAFF', 'VIEW_SPONSORSHIP');
    if (this.hasPermissionViewSponsorship && this.type != 'MODIFICATION') {
      this.segment.SPONSORSHIP = 'Sponsor';
    }
  }

  setInput(data: any) {
    this.modifyData = data || {};
    this.staff_id = data.ref_id || '';
    this.type = 'MODIFICATION';
    if (data.action_id) {
      if (+data.action_id == MODIFICATION_PERMISSION.RELIVE || +data.action_id == MODIFICATION_PERMISSION.MAKE_ACTIVE) {
        this.type = +data.action_id == MODIFICATION_PERMISSION.RELIVE ? 'RELIVE' : 'REJOIN';
      }
    }
    if (data.request_data) {
      this.modifyData.request_data.others = isArray(data.request_data.others) ? data.request_data.others[0] : data.request_data.others;
      this.pageInfo.title = data.description;
      this.getStaffData();
      if (!data?.request_data.id) {
        this.setMapData();
      }
    } else {
      this.getStaffData();
    }
  }

  getStaffData() {
    if (this.staff_id) {
      this.dataLoading = true;
      this.staffApi.getStaffDetails(this.staff_id).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.staffData = res.result
       
          if (this.staffData?.spouce) {
            this.spouseDetail = this.staffData?.spouce;
          }
          if(!this.staffData?.staff_cross_id){
            delete this.segment['FAMILY_INFO']
          }
          this.setMapData();
        }
      }).catch(err => {
        console.log('content not getting loaded',err)
        this.alertController.showToast('Content not getting loaded', 'error');
      }).finally(() => {
        this.dataLoading = false
      })
    }
  }

  setEduData() {
    const eduA = this.staffData?.education?.filter((a: any) => +a.type == 1) || []
    const eduT = this.staffData?.education?.filter((a: any) => +a.type == 2) || []
    let eduMA = [], eduMT = []
    if (this.type == 'MODIFICATION') {
      eduMA = this.modifyData?.request_data?.education?.filter((a: any) => +a.type == 1) || []
      eduMT = this.modifyData?.request_data?.education?.filter((a: any) => +a.type == 2) || []
    }
    this.staffEduAcadmic?.setData(eduA, eduMA);
    this.staffEduTheology?.setData(eduT, eduMT);
  }

  setPayrollExpData() {
    const exp = this.staffData?.expAllotment || [],
      modifyExp = this.modifyData?.request_data?.expAllotment;
    this.payrollDynForm?.setInputData(exp, modifyExp)
    this.onActionInPayroll(exp?.length ? exp : modifyExp)
  }
  payrollExpCal: number = 0;
  onActionInPayroll(data: any[]) {
    this.payrollExpCal = 0;
    data?.forEach((a: any) => {
      +a?.type == 2 ? this.payrollExpCal -= +(a?.total_exp) : this.payrollExpCal += +(a?.total_exp);
    });
  }
  setExpData() {
    if (Array.isArray(this.modifyData?.request_data?.experience) || Array.isArray(this.staffData.experience)) {
      const eduA = this.staffData.experience?.filter((a: any) => +a.type == 1)
      const eduT = this.staffData.experience?.filter((a: any) => +a.type == 2)
      let eduMA = [], eduMT = []
      if (this.type == 'MODIFICATION') {
        eduMA = this.modifyData?.request_data?.experience?.filter((a: any) => +a.type == 1) || []
        eduMT = this.modifyData?.request_data?.experience?.filter((a: any) => +a.type == 2) || []
      }
      this.staffExpMinstrial?.setData(eduT, eduMT);
      this.staffExpSecular?.setData(eduA, eduMA);
    }
  }

  setGemsExpData() {
    const exp = this.staffData.expGems || [],
      mExp = this.modifyData?.request_data?.expGems || [];
    this.staffExpGems?.setData(exp, mExp);
  }

  setTrainingData() {
    const exp = this.staffData.training || [],
      mExp = this.modifyData?.request_data?.training || [];
    this.staffTraining?.setData(exp, mExp);
  }

  setMapData() {
    const colorCode = +this.staffData?.staff_status_id == 1 ? 'success' : +this.staffData?.staff_status_id == 2 ? 'info' : 'danger';
    this.staffData.statusName = `<span class="badge badge-${colorCode}">${this.staffData?.staff_statusName}</span>`;
    this.staffData.others = this.staffData.others?.length ? this.staffData.others[0] : {};
    // this.staffData.stay_on_sikaria_campusName = +this.staffData.others.stay_on_sikaria_campus || this.staffData.stay_on_sikaria_campus ? "Yes" : 'No';
    this.staffData.is_cross_culture = +this.staffData.others.is_cross_culture || this.staffData.is_cross_culture ? "Yes" : 'No';
    this.staffData.stateName = this.staffData.others.stateName || '';
    this.staffData.distance_from_km = this.staffData.others.distance_from_km || ''
    if (this.staffData?.address || this.modifyData?.request_data?.address?.length > 0) {
      this.mapAddress(this.staffData.address);
    }
    if(!isEmptyObj(this.modifyData?.request_data)){
      const s =  this.modifyData.request_data;
      s.fullName = s.name ?  s.name :  this.staffData.name;
      s.dName = s.dName ?  s.dName :  this.staffData.dName;
      s.deName = s.deName ?  s.deName :  this.staffData.deName;
      s.email_id = s.email_id ? s.email_id : this.staffData.email_id
      s.profile_img_path = s.profile_img_path ? s.profile_img_path : this.staffData.profile_img_path
      this.profileWidget?.setData(s)
    }else{
      this.profileWidget?.setData(this.staffData)
    }  
    this.setEduData();
    this.setExpData();
    this.setGemsExpData();
    this.setTrainingData();
    this.setPayrollExpData();
    if(this.staffData.mobile_no > 10){

      if (this.staffData.mobile_no.startsWith('91') && this.staffData.mobile_no.length === 12) {
        this.staffData.mobile_no= this.staffData.mobile_no.substring(2); // Remove the first two characters (country code)
      } 
      if (this.staffData.mobile_no.length === 10) {
        this.staffData.mobile_no=  '+91 ' + this.staffData.mobile_no;
        return this.staffData.mobile_no
      } 
    }
  }

  mapAddress(data: Array<any>) {
    if (data && data != undefined) {
      data.forEach((a: any) => {
        a.full_address = [a.street, a.address,a.address_line, a.cityName, a.pName, a.vName, a.subDistrictName, a.districtName, a.stateName, a.countryName + ','+ (+a.pincode ? +a.pincode : '')].filter(a => a).join('\n') || 'Nil';
        if (+a.isPresent == 1) {
          this.presentAddress = a
          if (isEmptyObj(this.premanentAddress)) {
            this.premanentAddress = a
          }
        }
        if (+a.isPermanent == 1) {
          this.premanentAddress = a;
        }
      })
    }

    if (this.modifyData?.request_data?.address?.length > 0) {
      const data = this.modifyData?.request_data?.address
      data.forEach((a: any) => {
        a.full_address = [a.street, a.address,a.address_line, a.cityName, a.pName, a.vName, a.subDistrictName, a.districtName, a.stateName, a.countryName, (+a.pincode ? +a.pincode : '')].filter(a => a).join('\n') || 'Nil';
        if (a.isPermanent) {
          this.modifyPermanentAddress = a
        }
        if (a.isPresent) {
          this.modifyPresentAddress = a
        }
      })
    }

  }
  onSuccessApprove(res: any) {
    if (this.type == 'MODIFICATION' && !this.staffData.id) {
      const info: infoModalData = {
        content: `Staff Employee ID <b> ${res.key.staff_emp_code} </b>`
      };
      this.modalService.openInfoModal(info);
    }
  }



  approveRequest = (payload: any) => {
    let API: Promise<any>;
    if (this.type == 'RELIVE' || this.type == 'REJOIN') {
      payload.deleted_at = this.type == 'RELIVE' ? mysqlDataTime() : '';
      API = this.staffApi.reliveStaff(this.staffData.staff_emp_id, this.modifyData.request_data);
    } else {
      API = this.staffApi.saveStaffDetails(payload);
    }
    return API;
  }

  edit() {
    this.router.navigate([this.urlService.STAFF.ADD.URL], { queryParams: { id: this.myProfileView ? 'my_profile' : this.staff_id } })
  }
  download() {
    this.staffApi.profileDownload(this.staff_id, this.staffData)
  }
}