import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ChildApiService } from 'src/app/modules/child/service/child-api.service';
import { EmailApiService } from 'src/app/modules/email/service/email-api.service';
import { SponsorApiService } from 'src/app/modules/sponsor/service/sponsor-api.service';
import { SponsorBasicComponent } from 'src/app/shared/feature-modal/sponsor-basic/sponsor-basic.component';
import { ModalService } from 'src/app/shared/service/modal.service';

@Component({
  selector: 'app-child-report-add',
  templateUrl: './child-report-add.component.html',
  styleUrls: ['./child-report-add.component.scss']
})
export class ChildReportAddComponent implements OnInit {
  urlService: any = UrlServices.PAGE_URL;
  dataForm: UntypedFormGroup = {} as UntypedFormGroup;
  dataLoading: boolean = false;
  loading: boolean = false;
  loadingPreview: boolean = false;
  infoReportStatus: string = '';
  childData: any = {};
  submitted: boolean = false;
  yearRange = '';
  maxDate = new Date();
  minDate = new Date();
  reportData: any = {};
  showSelectChild: boolean = true;
  onChangeSubscribe: Subscription = new Subscription();
  textSave: string = 'Submit';
  textInfo: string = '';
  showActionBtn: boolean = false;
  sponsorData: Array<any> = [];
  sendingEmail: boolean = false;
  emailBtn: boolean = false;
  report_id: number | string = '';
  disabled_save: boolean = false;
  pageInfo: pageInfo = { title: '' }
  isMk:boolean =false;
  isHome:boolean=false;
  constructor(private auth: AuthService, private modalService: ModalService,
    private childApi: ChildApiService, private alertService: AlertService,
    private sponsorApi: SponsorApiService,
    private navigation: NavigationService,
    private activatedRoute: ActivatedRoute,
    private emailApi: EmailApiService) { }

  ngOnDestroy(): void {
    if (this.onChangeSubscribe) {
      this.onChangeSubscribe.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.report_id = this.activatedRoute.snapshot.queryParams.report_id || '';
    this.isMk = this.auth.checkPermission('CHILD', 'MANAGE_MK_CHILD'),
    this.isHome = this.auth.checkPermission('CHILD', 'MANAGE_HOME_CHILD');
    this.pageInfo = {
      title: `${this.report_id ? 'Update' : 'New'} Child Report`,
      buttonShowBtn: this.auth.checkPermission('MONTHLY_REPORT_CHILD', 'VIEW_ALL'),
      button: { title: 'All Report', class : 'btn-primary', url: this.urlService.CHILD.REPORT_LIST.URL, icon: 'icon-grid' }
    }
    this.initForm();
    this.setYearRange();
    if (this.report_id) {
      this.getReportDetails(this.report_id);
      this.showSelectChild = false;
    } else {
      this.mapPermission();
    }
  }

  mapPermission() {
    this.textSave = '';
    console.log('called map permission', this.reportData);

    if (!this.reportData.id) {
      this.textSave = 'Submit';
      this.showActionBtn = true
      return;
    }
    if (+this.reportData.status == 1) {
      this.textInfo = 'Report Has been Approved';
      this.showActionBtn = false;
      this.emailBtn = this.auth.checkPermission('MONTHLY_REPORT_CHILD', 'VERIFY');
    } else if (+this.reportData.status == 2) {
      this.showActionBtn = this.auth.checkPermission('MONTHLY_REPORT_CHILD', 'VERIFY');
      this.getSponsorDetails();
      this.textInfo = 'Report waiting for Approval';
      this.textSave = 'Approve';
    } else if (+this.reportData.status == 3) {
      this.showActionBtn = this.auth.checkPermission('MONTHLY_REPORT_CHILD', 'PROCESS');
      this.textInfo = 'Report waiting to verification';
      this.textSave = 'Verify';
    } else {
      this.showActionBtn = false;
    }
    console.log('map permission ', this.showActionBtn, this.reportData);


  }

  getSponsorDetails() {
    if (+this.reportData.status == 2 && this.showActionBtn) {
      this.dataLoading = true;
      this.sponsorApi.getListSponsorByRef(this.childData.id, 2).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.sponsorData = res.result
        }
        if (!isArray(res.result)) {
          this.disabled_save = true;
          this.alertService.showToast('There is no sponsor been alloted for you');
        }
      }).finally(() => this.dataLoading = false).catch((err => { this.alertService.showToast('Unable to get Data', 'info') }));
    }
  }

  showSponsorInfo(id: any) {
    this.modalService.openSponsorInfo({ sponsor_id: id })
  }


  setYearRange() {
    const d = new Date();
    const currentYear = d.getFullYear().toString();
    d.setMonth(d.getMonth() - 13);
    this.yearRange = d.getFullYear().toString() + ':' + currentYear;
    this.minDate = d;
    console.log(this.yearRange, 'get Full year')
  }

  initForm() {
    this.dataForm = new UntypedFormGroup({
      child_id: new UntypedFormControl('', [Validators.required]),
      child_fk_id: new UntypedFormControl(''),
      from_report_date_month: new UntypedFormControl(new Date()),
      to_report_date_month: new UntypedFormControl(new Date()),
      to_report_month: new UntypedFormControl(new Date().getMonth() + 1, [Validators.required]),
      from_report_month: new UntypedFormControl(new Date().getMonth() + 1, [Validators.required]),
      from_report_year: new UntypedFormControl(new Date().getFullYear(), [Validators.required]),
      to_report_year: new UntypedFormControl(new Date().getFullYear(), [Validators.required]),
      brief: new UntypedFormControl('', [Validators.required]),
      report_id: new UntypedFormControl(''),
      src_file: new UntypedFormControl('')
    });
    this.changeCal();
  }

  changeCal() {
    const fData = new Date(this.dataForm.value.from_report_date_month),
      tData = new Date(this.dataForm.value.to_report_date_month),
      fValue: any = {};
    if (fData) {
      fValue['from_report_month'] = fData.getMonth() + 1;
      fValue['from_report_year'] = fData.getFullYear()
    }
    if (tData) {
      fValue['to_report_month'] = tData.getMonth() + 1;
      fValue['to_report_year'] = tData.getFullYear()
    }
    console.log('on change', fValue);
    this.dataForm.patchValue(fValue)
  }

  mapFormValue(data: any) {
    if (!isEmptyObj(data)) {
      const dataValue: any = {};
      Object.keys(this.dataForm.controls).forEach((e: any) => {
        console.log(data[e], e, data)
        dataValue[e] = data[e] ? data[e] : (data?.src_content[e] ? data.src_content[e] : '');
      });
      const date = `${data.from_report_year || ''}-${data.from_report_month || ''}-01`,
        tdate = `${data.to_report_year || ''}-${data.to_report_month || ''}-01`;
      dataValue.from_report_date_month = new Date(date);
      dataValue.to_report_date_month = new Date(tdate);
      this.dataForm.patchValue(dataValue);
      this.changeCal();
    }
  }
  //get from editor
  onDescriptionChange(e: any) {
    this.dataForm.patchValue({ brief: e })
  }

  mapCondition():Array<any>{
    const whereField:any = []
    if(!(this.isMk && this.isHome)){
      if(this.isHome){
        whereField?.push({colName:'child_type',value :2,operation:'AND'});
      }else{
        whereField?.push({colName:'child_type',value :1,operation:'AND'});
      }
    }
    return whereField;
  }

  openChildModal() {
    this.modalService.openSearchModal({ type: 'CHILD',whereField:this.mapCondition() || [] }).then(async (res: any) => {
      if (res) {
        this.childData = res;
        console.log(this.childData);
        const d: any = { child_id: this.childData.child_id, child_fk_id: this.childData.id };
        this.dataForm.patchValue(d);
      }
    });
  }



  apiPayload() {
    const apiPayload: any = this.dataForm.value;
    if (this.reportData.id) {
      apiPayload.id = this.reportData.id;
    }
    return apiPayload;
  }

  showPreview() {
    const apiLoad = this.dataForm.value;
    if (!this.dataForm.valid) {
      this.alertService.showToast('Please make sure all the required filed is not empty');
      return;
    }
    apiLoad.sponsor_id = this.sponsorData[0]?.ref_id || '';
    this.loadingPreview = true;
    let data: any = { payload: apiLoad, id: 5 };
    data.config = { is_pdf: true, is_preview: true };
    this.modalService.showPreviewModal(data, 'modal-full').finally(() => this.loadingPreview = false);
  }

  sendEmail() {
    this.sendingEmail = true;
    this.emailApi.sendEmailRef(5, this.dataForm.value, this.sponsorData, 'sponsor_id').then(res => {
      console.log(' result of email')
    }).finally(() => {this.sendingEmail = false; alert('')})
  }

  onSubmit() {
    const data = this.apiPayload();
    this.submitted = true;
    data.save_draft = 0;
    if (this.reportData.id) {
      if (+this.reportData.status == 2) {
        if (!isArray(this.sponsorData)) {
          this.alertService.showToast('There is no sponsor been alloted to you, please allot any sponsor');
          return;
        }
        data.status = 1;
      } else if (+this.reportData.status == 3) {
        data.status = 2;
      }
    }
    this.saveReport(data);
  }

  saveDraft() {
    const data = this.apiPayload();
    data.save_draft = 1;
    this.saveReport(data);
  }

  getReportDetails(reportId: string | number) {
    if (reportId) {
      this.dataLoading = true;
      this.childApi.getReportById(reportId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (!isEmptyObj(res.result)) {
            this.reportData = res.result;
            this.childData = res.result.child || {};
            this.mapFormValue(this.reportData);
            this.mapPermission();
          }
        }
      }).finally(() => { this.dataLoading = false; }).catch(((err: any) => { console.log(err, ' unable to get the details'); this.alertService.showToast('Unable to get Data', 'info') }));
    }
  }


  saveReport(data: any) {
    console.log(this.dataForm);
    if (this.dataForm.valid) {
      if (+data.status == 2 && !this.sponsorData) {
        this.alertService.showToast('No sponsor available ', 'info')
        return;
      }
      this.loading = true;
      this.childApi.saveReport(data).then((res: ResponseData | any) => {
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
          if (+data.status == 1) {
            this.sendEmail();
          } else {
            this.goBack();
          }
        }
      }).finally(() => this.loading = false)
    } else {
      this.alertService.showToast('Some of the field not valid', 'info')
    }
  }

  goBack() {
    this.navigation.back();
  }

}
