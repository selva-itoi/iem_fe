import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { isEmptyObj, toMonthName } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, whereField } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { SponsorApiService } from 'src/app/modules/sponsor/service/sponsor-api.service';
import { StaffBasicComponent } from 'src/app/shared/feature-modal/staff-basic/staff-basic.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { StaffApiService } from '../../service/staff-api.service';
import { StaffReportApiService } from '../../service/staff-report-api.service';

@Component({
  selector: 'app-staff-monthly-report-new',
  templateUrl: './staff-monthly-report-new.component.html',
  styleUrls: ['./staff-monthly-report-new.component.scss']
})
export class StaffMonthlyReportNewComponent implements OnInit, OnDestroy {
  urlService: any = UrlServices.PAGE_URL;
  dataForm: UntypedFormGroup = {} as UntypedFormGroup;
  dataLoading: boolean = false;
  loading: boolean = false;
  loadingPreview: boolean = false;
  langLoading: boolean = false;
  infoReportStatus: string = '';
  staffData: any = {};
  staff_emp_id: string | number = '';
  submitted: boolean = false;
  yearRange = '';
  maxDate = new Date();
  minDate = new Date();
  MASTER_LANG: Array<any> = [];
  reportData: any = {};
  showSelectStaff: boolean = true;
  onChangeSubscribe: Subscription = new Subscription();
  textSave: string = 'Submit';
  textInfo: string = '';
  showActionBtn: boolean = false;
  langInfo: string = '';
  sponsorData: Array<any> = [];
  sendingEmail: boolean = false;
  emailBtn: boolean = false;
  report_lang_id: number | string = '';
  showListBtn: boolean = false
  staff_id: any = {};
  queryParams: any = {};
  info_message: string = '';
  availableLang: Array<any> = [];
  pageInfo: pageInfo = { title: 'Staff Monthly Report' };
  isViewMode: boolean = false;
  showLang: boolean = false;
  constructor(private auth: AuthService, private modalService: ModalService,
    private staffApi: StaffApiService, private alertService: AlertService,
    private staffReportApi: StaffReportApiService,
    private sponsorApi: SponsorApiService,
    private navigation: NavigationService,
    private activatedRoute: ActivatedRoute,
    private masterApi: MasterApiService) { }

  ngOnDestroy(): void {
    if (this.onChangeSubscribe) {
      this.onChangeSubscribe.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.report_lang_id = this.activatedRoute.snapshot.queryParams.report_lang_id || '';
    this.isViewMode = this.activatedRoute.snapshot.queryParams.mode ? true : false;
    this.staff_id = this.activatedRoute.snapshot.queryParams.staff_id || '';
    const queryId = this.activatedRoute.snapshot.queryParams.id || '',
      showListBtn = this.auth.checkPermission('MONTHLY_REPORT_STAFF', 'VIEW_ALL'),
      profile_view = queryId == 'my_report' ? true : false;
    this.pageInfo.buttonShowBtn = profile_view ? false : showListBtn;
    this.pageInfo.button = {
      title: 'View All Report',
      url: this.urlService.STAFF.REPORT_LIST.URL,
      queryParams: { id: profile_view ? 'my_report' : '' }
    }
    if (queryId == 'my_report') {
      this.staff_id = this.auth.currentUserValue.staff_fk_id;
      if (!this.staff_id) {
        this.info_message = 'You are not a Staff';
      }
    }
    this.initForm();
    this.setYearRange();
    if (this.report_lang_id) {
      this.getReportDetails(this.report_lang_id);
      this.showSelectStaff = false;
    } else if (this.staff_id) {
      this.getFamilyByStaff(this.staff_id);
      this.showSelectStaff = false;
      this.showActionBtn = true;
    } else {
      this.mapPermission();
    }
    if (this.auth.checkPermission('MONTHLY_REPORT_STAFF', 'VERIFY') || this.auth.checkPermission('MONTHLY_REPORT_STAFF', 'PROCESS')) {
      this.showLang = true;
    }
  }

  getMasterLanguage() {
    this.masterApi.getFullData('lang', []).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.MASTER_LANG = res.result;
      }
    })
  }

  mapPermission() {
    this.textSave = '';
    if (!this.reportData.id) {
      this.textSave = 'Submit';
      this.showActionBtn = true
      return;
    }
    this.reportData.monthName = toMonthName(this.reportData?.report_month);
    if (+this.reportData.status == 1) {
      this.getSponsorDetailsByLang();
      this.textInfo = 'Report Has been Approved';
      this.showActionBtn = false;
      this.emailBtn = this.auth.checkPermission('MONTHLY_REPORT_STAFF', 'VERIFY');
    } else if (+this.reportData.status == 2) {
      this.showActionBtn = this.auth.checkPermission('MONTHLY_REPORT_STAFF', 'VERIFY');
      this.getSponsorDetailsByLang();
      this.textInfo = 'Report Waiting for Approval';
      this.textSave = 'Approve';
    } else if (+this.reportData.status == 3) {
      this.showActionBtn = this.auth.checkPermission('MONTHLY_REPORT_STAFF', 'PROCESS');
      this.textInfo = 'Report waiting to verification';
      this.textSave = 'Verify';
    } else if (+this.reportData.status == 0) {
      this.textSave = 'Submit';
      this.showActionBtn = true;
    } else {
      this.showActionBtn = false;
    }
    if (this.reportData.save_draft == '1') {
      this.textInfo = 'Report is on Draft';
    }
  }

  getSponsorDetailsByLang() {
    if (this.dataForm.value.staff_fk_id) {
      const ref_id: Array<any> = [this.dataForm.value.staff_fk_id],
        spouse = this.dataForm.value.spouce_fk_id;
      if (spouse) {
        ref_id.push(spouse)
      } this.dataLoading = true;
      this.sponsorApi.getListRefSponsorByLang(ref_id, this.dataForm.value.lang_id).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.sponsorData = res.result
        }
      }).finally(() => this.dataLoading = false).catch((err => { this.alertService.showToast('Unable to get Data', 'info') }));
    }
  }

  showSponsorInfo(id: any) {
    this.modalService.openSponsorInfo({ sponsor_id: id })
  }

  getAvailableLang() {
    this.MASTER_LANG = [];
    if (!isEmptyObj(this.staffData) && this.dataForm.value.report_month) {
      this.langLoading = true;
      let emp_id = this.staffData.id;
      if (this.staffData.spouce_fk_id) {
        emp_id = emp_id + ',' + this.staffData.spouce_fk_id;
      }
      const report_year = this.dataForm.value.report_year || '';
      const report_month = this.dataForm.value.report_month || '';
      this.staffReportApi.getReportAvailableLang(emp_id, report_month, report_year).then((result: ResponseData) => {
        if (result.statusCode == RESPONSE_CODE.SUCCESS) {
          this.availableLang = result.result || [];
          let report_id = '';
          if (Array.isArray(this.availableLang)) {
            const l: Array<any> = [];
            this.availableLang.forEach((e: any) => {
              if (e.lang_id && !e.report_year) {
                if (l.indexOf(e.lang_id) < 0) {
                  l.push(e.lang_id);
                  this.MASTER_LANG.push({ lang_id: e.lang_id, langName: e.langName })
                }
              }
              if (e.report_id) {
                report_id = e.report_id;
              }
            });
            // report id Only calc 
            this.dataForm.patchValue({ report_id: report_id });
            console.log('master lang', this.MASTER_LANG)
            if (!this.availableLang.length) {
              this.alertService.showToast('There is no sponsorship has alloted against with staff', 'info');
              this.dataForm.patchValue({ report_year: '', report_month: '' });
            } else {
              this.dataForm.patchValue({ lang_id: this.availableLang[0]?.lang_id })
            }
          }
        }
      }).finally(() => { this.langLoading = false });
    }
  }

  setYearRange() {
    const d = new Date();
    const currentYear = d.getFullYear().toString();
    d.setMonth(d.getMonth() - 4);
    this.yearRange = d.getFullYear().toString() + ':' + currentYear;
    this.minDate = d;
  }

  getLastMonth() {
    const now = new Date();
    if (now.getMonth() == 0) {
      return new Date(now.getFullYear() - 1, 11, 1);
    }
    return new Date(now.getFullYear(), now.getMonth() - 1, 1);
  }

  initForm() {
    this.dataForm = new UntypedFormGroup({
      staff_fk_id: new UntypedFormControl('', [Validators.required]),
      spouce_fk_id: new UntypedFormControl(''),
      lang_id: new UntypedFormControl('', [Validators.required]),
      report_date_month: new UntypedFormControl(this.getLastMonth()),
      report_month: new UntypedFormControl(this.getLastMonth()?.getMonth() + 1, [Validators.required]),
      report_year: new UntypedFormControl(this.getLastMonth()?.getFullYear(), [Validators.required]),
      brief_ministry: new UntypedFormControl('', [Validators.required]),
      praise_points: new UntypedFormControl('', [Validators.required]),
      prayer_points: new UntypedFormControl('', [Validators.required]),
      family_news: new UntypedFormControl('', [Validators.required]),
      promise_verse: new UntypedFormControl('', [Validators.required]),
      report_id: new UntypedFormControl(''),
      src_file: new UntypedFormControl(''),
      typing_lang: new UntypedFormControl('3')
    });
    this.onChangeSubscribe && this.onChangeSubscribe.unsubscribe();
    this.onChangeSubscribe = this.dataForm.controls.report_date_month.valueChanges.subscribe((res: any) => {
      if (res) { // not allow if edit
        if (!this.report_lang_id) {
          const date = new Date(res);
          this.dataForm.patchValue({
            report_month: date.getMonth() + 1,
            report_year: date.getFullYear(),
          })
          this.getAvailableLang();
        }
      }
    })
  }

  mapFormValue(data: any) {
    if (!isEmptyObj(data)) {
      let dataValue: any = {};
      Object.keys(this.dataForm.controls).forEach((e: any) => {
        dataValue[e] = data[e] ? data[e] : (data?.src_content[e] ? data.src_content[e] : '');
        console.log('key after => ', e, ' value => ', dataValue[e]);
      });
      const dateMap = `${data.report_year || ''}-${data.report_month || ''}-01`;
      console.log('report data value => ', dataValue.report_year, dateMap)
      dataValue['report_date_month'] = new Date(dateMap);
      this.dataForm.patchValue(dataValue);
    }
  }
  //get from editor
  onDescriptionChange(e: any, controlName: string) {
    this.dataForm.patchValue({ [controlName]: e })
  }

  openStaffModal() {
    const wh: whereField[] = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['ADD'], ['region', 'zone']) || [];
    this.modalService.openSearchModal({ type: 'STAFF', whereField: wh, activeOnly: true, filterShow: true }).then(async (res: any) => {
      if (res) {
        this.getFamilyByStaff(res.staff_emp_id);
      }
    });
  }

  showBasicStaff(id: any) {
    this.modalService.openModal(StaffBasicComponent, { staff_emp_id: id }, 'modal-lg')
  }

  getFamilyByStaff(emp_id: string | number) {
    if (emp_id) {
      this.staffData = {};
      this.dataLoading = true;
      this.staffApi.getFamilyByStaff(emp_id).then((result: ResponseData) => {
        if (result.statusCode == RESPONSE_CODE.SUCCESS) {
          this.staffData = result.result;
          const d: any = { staff_fk_id: this.staffData.id };
          d.spouce_fk_id = this.staffData.spouce_fk_id || ''
          this.dataForm.patchValue(d);
          this.getAvailableLang();
        }
      }).finally(() => { this.dataLoading = false }).catch(err => { this.staffData = {} });
    }
  }

  apiPayload() {
    const apiPayload: any = this.dataForm.value;
    apiPayload.staff_emp_id = this.staffData.staff_emp_id || '',
      apiPayload.spouce_emp_id = this.staffData.spouce_emp_id || '';
    if (this.reportData.id) {
      apiPayload.id = this.reportData.id;
    }
    apiPayload.sponsor = this.sponsorData
    return apiPayload;
  }

  showPreview() {
    const apiLoad = this.dataForm.value;
    if (!this.dataForm.valid) {
      this.alertService.showToast('Please make sure all the required filed is not empty');
      return;
    }
    apiLoad.staff_emp_id = this.staffData.staff_emp_id || '',
      apiLoad.spouce_emp_id = this.staffData.spouce_emp_id || '';
    if (this.sponsorData.length) {
      apiLoad.sponsor_id = this.sponsorData[0]?.sponsor_id || '';
    }
    if (!this.dataForm.value.lang_id) {
      this.alertService.showToast('Please select report language to show preview');
      return;
    }
    this.loadingPreview = true;
    let data: any = { payload: apiLoad, id: 4 };
    data.config = { is_pdf: true, is_preview: true };
    this.modalService.showPreviewModal(data).finally(() => this.loadingPreview = false);
  }


  onSubmit() {
    const data = this.apiPayload(),
      report_status = +this.reportData.status;
    this.submitted = true;
    data.save_draft = 0;
    if (this.reportData.id) {
      if (report_status == 2) {
        data.status = 1;
      } else if (report_status == 3) {
        data.status = 2;
      } else if (!report_status) {
        data.status = 3;
      }
    }
    this.saveReport(data);
  }

  saveDraft() {
    const data = this.apiPayload();
    if (!data.report_year) {
      this.alertService.showToast('please select Date of Report', 'info');
      return;
    }
    data.save_draft = 1;
    if (isEmptyObj(this.reportData)) {
      data.status = 0;
      this.alertService.showToast('Report should not be Empty', 'info');
      return;
    }
    this.saveReport(data);
  }

  getReportDetails(reportId: string | number) {
    if (reportId) {
      this.dataLoading = true;
      this.staffReportApi.getReportById(reportId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (!isEmptyObj(res.result)) {
            this.reportData = res.result;
            this.staffData = res.result.staff || {};
            if (res.result.family) {
              this.staffData.family = res.result.family || {}
            }
            this.mapFormValue(this.reportData);
            this.mapPermission();
          }
        }
      }).finally(() => { this.dataLoading = false; }).catch((err => { console.log(err, ' unable to get the details'); this.alertService.showToast('Unable to get Data', 'info') }));
    }
  }

  disabled_save = false;
  saveReport(data: any) {
    if (this.dataForm.valid) {
      if (+data.status == 2 && !this.sponsorData) {
        this.alertService.showToast('No sponsor available ', 'info')
        return;
      }
      this.loading = true;
      this.staffReportApi.save(data).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          let textInfo;
          if (data.save_draft) {
            textInfo = "Successfully Report Drafted..";
          } else if (+data.status == 1) {
            textInfo = "Report Approved Successfully";
          } else if (+data.status == 2) {
            textInfo = "Report Verified Successfully";
          } else {
            textInfo = "Report Updated Successfully";
          }
          this.disabled_save = true;
          this.alertService.showToast(textInfo, 'success');
          this.goBack();
        }
      }).finally(() => this.loading = false)
    } else {
      this.alertService.showToast('Some of the field not valid', 'info')
    }
  }
  sendEmail() {
    if (this.report_lang_id) {
      this.sendingEmail = true;
      this.staffReportApi.sendMail(this.report_lang_id, this.apiPayload()).then(res => {
        this.alertService.showToast('Mail Has been Sent', 'success');
      }).finally(() => this.sendingEmail = false)
    }
  }
  goBack() {
    this.navigation.back();
  }
}