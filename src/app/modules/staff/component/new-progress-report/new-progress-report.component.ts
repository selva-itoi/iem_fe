import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { cloneData, isArray } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilderData, whereField } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { StaffBasicComponent } from 'src/app/shared/feature-modal/staff-basic/staff-basic.component';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { NEW_FIELD_PROGRESS_FORM, NEW_PROGRESS_FORM } from '../../helper/staff_form';
import { StaffApiService } from '../../service/staff-api.service';
import { StaffReportApiService } from '../../service/staff-report-api.service';
import { UrlServices } from 'src/app/helper/class/url-services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-progress-report',
  templateUrl: './new-progress-report.component.html',
  styleUrls: ['./new-progress-report.component.scss']
})
export class NewProgressReportComponent implements OnInit, OnDestroy {

  pageInfo: pageInfo = {} as pageInfo
  additionalField: formBuilderData[] = [{ colName: 'report_year', type: 'DATE', title: 'Report Month & Year ', dateFormat: 'mm/yy', dateViewMode: 'month', event: { isCallback: true, name: 'change' }, }]
  // basicFormData: formBuilderData[] = cloneData(NEW_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')
  staffData: any
  dataLoading: boolean = false
  loading: boolean = false
  current_date = new Date()
  report_date_month = new FormControl()
  reportData: any
  showField: boolean = false
  reportId: any
  basicFormData: any = {}
  urlService = UrlServices.PAGE_URL
  staff_id: any = '';
  info_message: any = '';
  showSelectStaff: boolean = true;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined
  constructor(private auth: AuthService, private modalService: ModalService,
    private staffApi: StaffApiService, private alertService: AlertService, private activateRoute: ActivatedRoute,
    private navigation: NavigationService, private staffReportApi: StaffReportApiService) { }


  ngOnInit(): void {
    // this.basicFormData = cloneData(NEW_PROGRESS_FORM)
    this.basicFormData = cloneData(NEW_PROGRESS_FORM)


    //     let aa:any={}
    //     aa= this.auth?.currentUserValue?.role
    //    aa[0].dName
    //  if(aa[0].dName=='Church Ministries'){
    //   // basicFormData: formBuilderData[] = cloneData(NEW_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')

    //    this.basicFormData = cloneData(NEW_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')
    // }
    // if(aa[0].dName=='Field Ministries'){
    //   this.basicFormData = cloneData(NEW_FIELD_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')
    // }


    this.reportId = this.activateRoute.snapshot.queryParams['id'] || '';
    const showListBtn = this.auth.checkPermission('MONTHLY_REPORT_STAFF', 'VIEW_ALL'),
      profile_view = this.reportId == 'my_report' ? true : false;
    this.pageInfo.buttonShowBtn = profile_view ? false : showListBtn;
    this.pageInfo = {
      // title: this.reportId != 'my_report'? 'Update Progress Report' : 'New Progress Report',
      title: this.reportId ? 'Progress Report' : 'New Progress Report',

      buttonShowBtn: true,
      button: {
        title: 'Progress Report List',
        url: this.urlService.STAFF.PROGRESS_REPORT_LIST.URL,
        queryParams: { id: profile_view ? 'my_report' : '' }
      }
    }
    if (this.reportId == 'my_report') {
      let aa: any = {}
      aa = this.auth?.currentUserValue.staff.dName

      if (aa == 'Church Ministries') {
        // basicFormData: formBuilderData[] = cloneData(NEW_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')

        this.basicFormData = cloneData(NEW_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')
      }
      if (aa == 'Field Ministries') {
        this.basicFormData = cloneData(NEW_FIELD_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')
      }
      this.reportId = ''
      this.staff_id = this.auth.currentUserValue.staff_fk_id;
      if (!this.staff_id) {
        this.info_message = 'You are not a Staff';
      }
    }
    if (this.reportId) {
      this.showSelectStaff = false
      this.report_date_month.disable()
      this.getReportDetails()
    } else if (this.staff_id) {
      this.getFamilyByStaff(this.staff_id);
      this.showSelectStaff = false;
    }
  }

  openStaffModal() {
    // const wh: whereField[] = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['ADD'], ['region', 'zone']) || [];
    const wh: whereField[] = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['ADD']) || [];
    this.modalService.openSearchModal({ type: 'STAFF', whereField: wh, activeOnly: true, filterShow: true }).then(async (res: any) => {
      if (res) {
        this.getFamilyByStaff(res.staff_emp_id);
      }
    });
  }

  checkIsExistReport() {
    const value = this.report_date_month.value,
      month = new Date(value).getMonth() + 1,
      year = new Date(value).getFullYear(),
      id = this.staffData.id;
    this.staffReportApi.getReportByMonth(id, year, month).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.reportData = res.result
        if (!isArray(res?.result)) {
          this.showField = true;
        } else {
          this.showField = false;
        }
      }
    })
  }

  setMapData() {
    if (this.reportId) {
      const date = new Date(this.reportData?.report_date)
      this.report_date_month.setValue(date);
      setTimeout(() => {
        this.basicForm?.setData(this.reportData)
      }, 800);
    }
  }

  getReportDetails() {
    this.dataLoading = true
    this.staffReportApi.getProgressReportDetails(this.reportId).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.reportData = res.result
        this.setMapData()
        if (res.result?.staff_emp_id) {
          this.getFamilyByStaff(res.result?.staff_emp_id)
        }
      }
    }).finally(() => this.dataLoading = false)
  }

  getFamilyByStaff(emp_id: string | number) {
    if (emp_id) {
      this.staffData = {};
      this.dataLoading = true;
      this.staffApi.getStaffDetails(emp_id).then((result: ResponseData) => {
        if (result.statusCode == RESPONSE_CODE.SUCCESS) {
          this.staffData = result.result;


          if (this.reportId != 'my_report') {
            if (this.staffData.dName == 'Church Ministries') {
              // basicFormData: formBuilderData[] = cloneData(NEW_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')

              this.basicFormData = cloneData(NEW_PROGRESS_FORM)
            }
            if (this.staffData.dName == 'Field Ministries') {

              this.basicFormData = cloneData(NEW_FIELD_PROGRESS_FORM).filter((a: any) => a.colName != 'financial_year')
            }
          }

          const d: any = { staff_fk_id: this.staffData.id };
          d.spouce_fk_id = this.staffData.spouce_fk_id || ''
          if (!this.reportId) {
            this.report_date_month.setValue(this.current_date)
            this.checkIsExistReport()
          }
          // this.dataForm.patchValue(d);
          // this.getAvailableLang();
        }
      }).finally(() => { this.dataLoading = false }).catch(err => { this.staffData = {} });
    }
  }
  showBasicStaff(id: any) {
    this.modalService.openModal(StaffBasicComponent, { staff_emp_id: id }, 'modal-lg')
  }


  onChange(ev: any) { }

  apiPayload() {
    const payload = this.basicForm?.apiPayload() || {};
    payload.staff_fk_id = this.staffData.id || ''
    const reportDate = new Date(this.report_date_month.value);
    payload.report_date = `${reportDate.getFullYear()}-${reportDate.getMonth() + 1}`
    if (this.reportId) {
      payload.id = this.reportId
    }
    return payload
  }

  onSubmit() {
    if (!this.basicForm?.isValid()) {
      return
    }
    this.loading = true
    this.staffReportApi.saveProgressReport(this.apiPayload()).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Progress Report Successfully Saved', 'success')
        this.goBack()
      }
    }).catch(() => {
      this.alertService.showToast('Unable to save data', 'error')
    }).finally(() => this.loading = false)
  }

  goBack() {
    this.navigation.back();
  }

  ngOnDestroy(): void {

  }

}
