import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { cloneData, isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { NEW_FIELD_GOAL_FORM, NEW_FIELD_PROGRESS_FORM, NEW_GOAL_FORM, NEW_PROGRESS_FORM, STAFF_OFFICE_FORM } from '../../helper/staff_form';
import { ResponseData, whereField } from 'src/app/helper/interface/response';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { StaffApiService } from '../../service/staff-api.service';
import { StaffBasicComponent } from 'src/app/shared/feature-modal/staff-basic/staff-basic.component';
import { AlertService } from 'src/app/helper/service/alert.service';
import { ActivatedRoute } from '@angular/router';
import { StaffReportApiService } from '../../service/staff-report-api.service';
import { UrlServices } from 'src/app/helper/class/url-services';

@Component({
  selector: 'app-new-goals-report',
  templateUrl: './new-goals-report.component.html',
  styleUrls: ['./new-goals-report.component.scss']
})
export class NewGoalsReportComponent implements OnInit {

  pageInfo: pageInfo = {} as pageInfo
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('goalsForm') goalsForm: FormGeneratorComponent | undefined
  basicFormData: any;
  financial_year_data = [{ name: new Date().getFullYear() - 1 }, { name: new Date().getFullYear() }, { name: new Date().getFullYear() + 1 }, { name: new Date().getFullYear() + 2 }, { name: new Date().getFullYear() + 3 }, { name: new Date().getFullYear() + 4 }, { name: new Date().getFullYear() + 5 }, { name: new Date().getFullYear() + 6 }]
  financial_year = new FormControl('', Validators.required)
  radioForm: any;
  loading: boolean = false;
  goalsReportData: any
  goalsReportId: any
  staffData: any
  staffId: any;
  urlService = UrlServices.PAGE_URL
  showField: boolean = false
  yearLoader: boolean = false
  dataLoading: boolean = false
  goalsFormData: any
  staff_id: any
  info_message: any;
  showSelectStaff: boolean = true
  radioGroup = [{ name: 'region', title: 'Region' }, { name: 'zone', title: 'Zone/State' }, { name: 'field', title: 'Field' }, { name: 'state', title: 'State' }]
  constructor(private navSer: NavigationService, private auth: AuthService,
    private staffApi: StaffApiService,
    private modalService: ModalService, private staffReportApi: StaffReportApiService,
    private alertService: AlertService, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.goalsFormData = cloneData(NEW_GOAL_FORM)


    //  let aa:any={}
    //    aa= this.auth?.currentUserValue?.role
    //   aa[0].dName
    // if(aa[0].dName=='Church Ministries'){
    //   this.goalsFormData = cloneData(NEW_GOAL_FORM)
    // }
    // if(aa[0].dName=='Field Ministries'){
    //   this.goalsFormData = cloneData(NEW_FIELD_GOAL_FORM)
    // }



    this.goalsReportId = this.activateRoute.snapshot.queryParams['id'] || '';
    const showListBtn = this.auth.checkPermission('MONTHLY_REPORT_STAFF', 'VIEW_ALL'),
      profile_view = this.goalsReportId == 'my_report' ? true : false;
    this.pageInfo.buttonShowBtn = profile_view ? false : showListBtn;
    if (this.goalsReportId != 'my_report') {
      // this.financial_year.disable()
      // this.getReportDetails()
    }
    this.pageInfo = {
      title: this.goalsReportId ? 'Goals Report' : 'New Goals Report',

      // title: this.goalsReportId != 'my_report' ? 'Update Goals Report' : 'New Goals Report',
      buttonShowBtn: true,
      button: {
        title: 'Goal Report List',
        url: this.urlService.STAFF.GOALS_REPORT_LIST.URL,
        queryParams: { id: profile_view ? 'my_report' : '' }
      }
    }
    if (this.goalsReportId == 'my_report') {
      let aa: any = {}
      aa = this.auth?.currentUserValue.staff.dName

      if (aa == 'Church Ministries') {
        // basicFormData: formBuilderData[] = cloneData(NEW_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')

        this.goalsFormData = cloneData(NEW_GOAL_FORM)
      }
      if (aa == 'Field Ministries') {
        this.goalsFormData = cloneData(NEW_FIELD_GOAL_FORM)
      }
      this.goalsReportId = ''
      this.staff_id = this.auth.currentUserValue.staff_fk_id;
      if (!this.staff_id) {
        this.info_message = 'You are not a Staff';
      }
    }

    if (this.goalsReportId) {
      this.showSelectStaff = false
      this.financial_year.disable()
      this.getReportDetails()
    } else if (this.staff_id) {
      this.staffId = this.staff_id
      this.getFamilyByStaff(this.staff_id);
      this.showSelectStaff = false;
    }
    this.formInit();
  }

  formInit() {
    this.radioForm = new FormGroup({
      radiobtn: new FormControl('region'),
    })
    this.radioChange()
  }

  getReportDetails() {
    this.dataLoading = true
    this.staffReportApi.getGoalReportDetails(this.goalsReportId).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.goalsReportData = res.result
        this.setMapData()
        if (this.goalsReportData?.staff_emp_id) {
          this.getFamilyByStaff(this.goalsReportData?.staff_emp_id)
        }
      }
    }).finally(() => this.dataLoading = false)
  }

  onChange(e: any) { }

  radioChange() {
    this.basicFormData = []
    let value = this.radioForm.value.radiobtn;
    let allowField = ['field'];
    if (value == 'zone') {
      allowField = ['region', 'zone'];
    } else if (value == 'region') {
      allowField = ['region'];
    } else if (value == 'field') {
      allowField = ['region', 'zone', 'field'];
    } else if (value == 'state') {
      allowField = ['state_office']
    }
    const fieldData = cloneData(STAFF_OFFICE_FORM).filter((a: any) => allowField.includes(a.colName)).map((b: any) => { b.validator = [{ name: 'required' }], b.groupTitle = ''; return b });
    this.basicFormData = fieldData;
    setTimeout(() => {
      this.basicForm?.initForm();
      if (!isEmptyObj(this.goalsReportData)) {
        this.basicForm?.setData(this.goalsReportData);
      }
    }, 800);
  }

  openStaffModal() {
    // const wh: whereField[] = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['ADD'], ['region', 'zone']) || [];
    const wh: whereField[] = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['ADD']) || [];

    this.modalService.openSearchModal({ type: 'STAFF', whereField: wh, activeOnly: true, filterShow: true }).then(async (res: any) => {
      if (res) {
        this.staffId = res.id;
        this.financial_year.setValue('')
        this.getFamilyByStaff(res.staff_emp_id);
      }
    });
  }

  setMapData() {
    if (this.goalsReportData) {
      const financial_year_data = new Date(this.goalsReportData?.from_date).getFullYear()
      let text = financial_year_data.toString();
      this.financial_year.setValue(text);
      setTimeout(() => {
        this.goalsForm?.setData(this.goalsReportData)
      }, 800);
    }
  }

  showBasicStaff(id: any) {
    this.modalService.openModal(StaffBasicComponent, { staff_emp_id: id }, 'modal-lg')
  }
  getFamilyByStaff(emp_id: string | number) {
    if (emp_id) {
      this.staffData = {};
      this.dataLoading = true;
      this.staffApi.getStaffDetails(emp_id).then((result: ResponseData) => {
        if (result.statusCode == RESPONSE_CODE.SUCCESS) {
          this.staffData = result.result;

          
          if (this.goalsReportId != 'my_report'){
            if (this.staffData.dName == 'Church Ministries') {
              // basicFormData: formBuilderData[] = cloneData(NEW_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')
  
              this.goalsFormData = cloneData(NEW_GOAL_FORM)
            }
            if (this.staffData.dName == 'Field Ministries') {
  
                this.goalsFormData = cloneData(NEW_FIELD_GOAL_FORM)
            }
          }
          // console.log(this.staffData.dName,'this.staffData.dName')
          // if(this.staffData.dName=='Church Ministries'){
          //   // basicFormData: formBuilderData[] = cloneData(NEW_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')

          //    this.goalsFormData = cloneData(NEW_PROGRESS_FORM)
          // }
          // if(this.staffData.dName=='Field Ministries'){
          //   this.goalsFormData = cloneData(NEW_FIELD_PROGRESS_FORM)
          // }
          const d: any = { staff_fk_id: this.staffData.id };
          d.spouce_fk_id = this.staffData.spouce_fk_id || ''
          // this.dataForm.patchValue(d);
          // this.getAvailableLang();
        }
      }).finally(() => { this.dataLoading = false }).catch((err: any) => { this.staffData = {} });
    }
  }

  getAvailablereport() {
    const value = this.financial_year.value
    if (!value) {
      this.showField = false
      return
    }
    if (this.staffId && value) {
      this.yearLoader = true
      this.staffReportApi.getReportByYear(this.staffId, value).then((res: any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (!isArray(res?.result)) {
            this.showField = true;
          } else {
            this.showField = false;
          }
        }
      }).finally(() => this.yearLoader = false)
    }
  }
  mapRadio() {
    if (!isEmptyObj(this.goalsReportData)) {
      let rv = '';
      if (this.goalsReportData.fieldName) {
        rv = 'field'
      } else if (this.goalsReportData.zoneName) {
        rv = 'zone';
      } else if (this.goalsReportData.regionName) {
        rv = 'region';
      }
      this.radioForm?.setValue({ radiobtn: rv });
    }
  }
  apiPayload() {
    const payload = this.goalsForm?.apiPayload() || {};
    payload.from_date = this.financial_year.value
    payload.staff_fk_id = this.staffData?.id || '';
    if (this.goalsReportId) {
      payload.id = this.goalsReportId
    }
    return payload
  }

  onSubmit() {
    if (!this.goalsForm?.isValid()) {
      return
    }
    this.loading = true
    this.staffReportApi.saveGoalReport(this.apiPayload()).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Report Save Succesfully', 'success')
        this.goBack()
      } else {
        this.alertService.showToast('Unable to Save Data', 'error')
      }
    }).catch(() => {
      this.alertService.showToast('Unable to Save Data', 'error')
    }).finally(() => this.loading = false)
  }

  goBack() {
    this.navSer.back()
  }

}
