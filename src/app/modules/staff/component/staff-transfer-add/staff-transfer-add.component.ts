import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressComponent } from 'src/app/core/component/address/address.component';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { MODULE_NAME, PERMISSION, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { ResponseData, formBuilderData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { GEMS_EXP_FORM, STAFF_OFFICE_FORM, STAFF_TRANSFER_FORM } from '../../helper/staff_form';
import { StaffApiService } from '../../service/staff-api.service';
import { StaffExpGemsComponent } from '../staff-exp-gems/staff-exp-gems.component';

@Component({
  selector: 'app-staff-transfer-add',
  templateUrl: './staff-transfer-add.component.html',
  styleUrls: ['./staff-transfer-add.component.scss']
})
export class StaffTransferAddComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  loading: boolean = false;
  spouseLoading: boolean = false;
  spouseError: string = '';
  submitted: boolean = false;
  showActive: boolean = false;
  staffData: any = {}
  staffFamilyData: any = {}
  spouseData: any = {};
  alterForm: any
  pageInfo: pageInfo = {
    title: 'New Staff Transfer',
    buttonShowBtn: true,
    button: {
      title: 'All Transfer',
      url: this.urlService.STAFF.TRANSFER_LIST.URL
    }
  }
  staffShowData: mapInfoView[] = [{ name: 'regionName', title: 'Region' }, { name: 'zoneName', title: 'zone' }, { name: 'dName', title: 'Department' },
  //  { name: 'adName', title: 'MS Office' },
    { name: 'fieldName', title: 'Field' }, { name: 'trustName', title: 'Establishment Name' }, { name: 'branchName', title: 'Branch' }, { name: 'staff_cross_id', title: 'Cross Ref' }];
  disabled_save: boolean = false;
  statusErrorMsg: string = '';
  spouseForm: any
  formData: formBuilderData[] = cloneData(STAFF_TRANSFER_FORM)
  fromForm = cloneData(GEMS_EXP_FORM).splice(0, 1).map((a: any) => { a.visible = false; return a; });
  staffForm = cloneData(STAFF_OFFICE_FORM).map((a: any) => { if (['branch', 'designation', 'trust'].includes(a.colName)) { a.validator = [] }; if (['trust', 'home'].includes(a.colName)) { a.visible = false; } return a; })
  officeFormData: formBuilderData[] = [...this.fromForm, ...this.staffForm, ...this.formData];
  segment: any = {
    BASIC: 'Basic',
    ADDRESS: 'Address',
  }
  @ViewChild('address') address: AddressComponent | undefined;
  @ViewChild('officeForm') officeForm: StaffExpGemsComponent | undefined;
  @ViewChild('spouseOfficeForm') spouseOfficeForm: StaffExpGemsComponent | undefined;
  @ViewChild('staffExpGems') staffExpGems: StaffExpGemsComponent | undefined;
  @ViewChild('spouseExpGems') spouseExpGems: StaffExpGemsComponent | undefined
  constructor(private staffApi: StaffApiService,
    private auth: AuthService,
    private navigation: NavigationService,
    private modalService: ModalService, private alertService: AlertService) { }

  ngOnInit(): void { }


  onChange(ev: any) {
    if (ev?.event.controlName == 'field') {
      if (ev?.support[0]) {
        this.address?.applyFormValue(ev.support[0])
      }
    }
  }

  resetSpouse() {
    this.spouseError = '';
    this.spouseData = {};
  }

  openSearchModal() {
    this.showActive = false;
    this.modalService.openSearchModal({ type: 'STAFF', skipKey: 'staff_emp_id', skipData: [this.staffData.staff_emp_id], activeOnly: true }).then(async (res: any) => {
      if (res.staff_emp_id) {
        this.staffData = {};
        if (res.deleted_at != null) {
          this.alertService.showToast("You can't Transfer Inactive Staff", 'info');
          return;
        }
        if (+res.modify_request) {
          this.alertService.showToast("Staff Profile is under Admin approval", 'info');
          return;
        }
        this.resetSpouse();
        this.staffApi.getBasic(res.staff_emp_id, true).then((basic: ResponseData) => {
          if (basic.statusCode == RESPONSE_CODE.SUCCESS) {
            this.showActive = true;
            this.staffData = basic.result
            if (basic.result.staff_cross_id) {
              this.modalService.openConfirmDialog({ title: 'Confirm  spouse Transfer', message: ' Do you want to transfer spouse also?' }).then(res => {
                if (res) {
                  this.staffApi.getFamilyByStaff(this.staffData.id).then((res: ResponseData | any) => {
                    this.spouseData = res?.result?.family
                    if (this.spouseData.id) {
                      this.isSpouse()
                    }
                    console.log('Spouse Data', this.spouseData);
                  })
                } else {
                  if (this.segment.hasOwnProperty('SPOUSE')) {
                    delete this.segment.SPOUSE
                  }
                }
              })
            } else {
              if (this.segment.hasOwnProperty('SPOUSE')) {
                delete this.segment.SPOUSE
              }
            }
          }
        });
      }
    });
  }

  isSpouse() {
    this.segment.SPOUSE = 'Spouse'
    let common = ['region', 'zone', 'field', 'church', 'ad_office']
    let allow = ['branch', 'designation', 'trust', 'home']
    let commonfield = cloneData(STAFF_OFFICE_FORM).filter((a: any) => allow.includes(a.colName))
    this.spouseForm = [...commonfield, ...this.formData]
  }

  isValid() {
    const add = this.address?.isValidForm(),
      staff = this.officeForm?.apiPayload().length;
    return !isEmptyObj(this.staffData) && add && staff;
  }

  apiPayloadModify = (key: any) => {
    const payload: modifyApi = {} as modifyApi,
      ofD = this.officeForm?.apiPayload() || [];
    payload.created_by = this.auth.currentUserValue.user_id,
      payload.action_id = PERMISSION.ADD,
      payload.description = this.staffData.name + ' Requested to Transfer',
      payload.ref_id = this.staffData.staff_emp_id || '',
      payload.department = ofD[0]?.department,
      payload.zone = ofD[0]?.zone,
      payload.region = ofD[0]?.region,
      payload.ad_office = ofD[0]?.ad_office;
    payload.trust = ofD[0]?.trust;
    payload.module_id = MODULE_NAME.STAFF_TRANSFER;
    payload.request_data = this.apiPayload();
    return payload;
  }

  apiPayload() {
    const payload: any = this.address?.apiPayload(),
      ofD = this.officeForm?.apiPayload() || [],
      sD = this.staffExpGems?.apiPayload() || [],
      spouceOf = this.spouseOfficeForm?.apiPayload() || [],
      spouceEx = this.spouseExpGems?.apiPayload() || [];
    payload['expGems'] = [...ofD, ...sD];
    if (this.spouseData.id) {
      payload['spouseExp'] = [...spouceEx,...spouceOf]
    }
    payload.last_modify_by = this.auth.currentUserValue.user_id;
    payload.staff_emp_id = this.staffData.staff_emp_id;
    payload.staff_fk_id = this.staffData?.id;
    payload.spouse_fk_id = this.spouseData?.id;
    payload.spouseDetails = this.spouseData;
    payload.staffDetails = this.staffData;
    return payload;
  }

  goBack() {
    this.navigation.back();
  }


  checkSegmentStatus = (key: any) => {
    switch (key) {
      case 'BASIC':
        return this.officeForm?.apiPayload()?.length ? true : false;
        break;

      case 'ADDRESS':
        return this.address?.isValidForm();
        break;
      case 'SPOUSE':
        if(this.spouseOfficeForm){
          return this.spouseOfficeForm?.apiPayload()?.length ? true : false;
        }
        return true;
        break;
    }
    return true;
  }
}