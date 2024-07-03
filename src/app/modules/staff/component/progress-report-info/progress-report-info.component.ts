import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { NEW_GOAL_FORM, NEW_PROGRESS_FORM } from '../../helper/staff_form';
import { ActivatedRoute } from '@angular/router';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { StaffApiService } from '../../service/staff-api.service';
import { StaffReportApiService } from '../../service/staff-report-api.service';

@Component({
  selector: 'app-progress-report-info',
  templateUrl: './progress-report-info.component.html',
  styleUrls: ['./progress-report-info.component.scss']
})
export class ProgressReportInfoComponent implements OnInit {

  info_message: any
  dataLoading: boolean = false
  staffData: any
  loading: boolean = false
  isModal: boolean = false
  pageInfo: pageInfo = {} as pageInfo;
  basicFormData: any
  reportId: any
  reportData: any
  goalForm = [{ colName: 'from_date', title: 'Financial Year' }]
  progressForm = [{ colName: 'from_date', title: 'Financial Year' }, { colName: 'report_date', title: 'Reporting Month' }]
  type: 'goal' | 'progress' = 'progress'
  constructor(private staffApi: StaffApiService, private activateRoute: ActivatedRoute,
    private navigation: NavigationService, private staffReportApi: StaffReportApiService) { }

  ngOnInit(): void {
    this.reportId = this.activateRoute.snapshot.queryParams['id'] || '';
    this.type = this.activateRoute.snapshot.queryParams['type'] || '';
    if (this.type == 'goal') {
      this.basicFormData = [...this.goalForm, ...cloneData(NEW_GOAL_FORM)]
    } else {
      this.basicFormData = [...this.progressForm, ...cloneData(NEW_PROGRESS_FORM)]
    }
    if (this.reportId) {
      this.getReportDetails()
    }
  }

  getReportDetails() {
    this.dataLoading = true
    const Api = this.type == 'progress' ? this.staffReportApi.getProgressReportDetails(this.reportId) : this.staffReportApi.getGoalReportDetails(this.reportId)
    Api.then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.reportData = res.result
        if (res.result?.from_date) {
          this.reportData.from_date = new Date(this.reportData?.from_date).getFullYear()
        }
        if(res.result?.report_date){
          this.reportData.from_date = new Date(this.reportData?.report_date).getFullYear()
          this.reportData.report_date = new Date(this.reportData?.report_date).getMonth() + 1
        }
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
          const d: any = { staff_fk_id: this.staffData.id };
          d.spouce_fk_id = this.staffData.spouce_fk_id || ''
          // this.dataForm.patchValue(d);
          // this.getAvailableLang();
        }
      }).finally(() => { this.dataLoading = false }).catch(err => { this.staffData = {} });
    }
  }

  close() {
    this.navigation.back();
  }

}
