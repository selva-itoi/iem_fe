import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilder, ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { churchCongregationForm, churchProgramForm, CHURCH_HISTORY_FORM, CHURCH_REPORT_BASIC_FORM, CHURCH_TRAINING_FORM } from '../../helper/church-form';
import { ChurchApiService } from '../../service/church-api.service';

@Component({
  selector: 'app-new-church-report',
  templateUrl: './new-church-report.component.html',
  styleUrls: ['./new-church-report.component.scss'],
  providers: [DatePipe]
})
export class NewChurchReportComponent implements OnInit, OnDestroy, AfterViewInit {
  churchId: string | number = '';
  reportId: string | number = '';
  urlService = UrlServices.PAGE_URL;
  dataLoading: boolean = false;
  loading: boolean = false;
  disabled_save: boolean = false;
  showActionBtn: boolean = false;
  churchData: any = {};
  reportData: any = {};
  pageInfo: pageInfo = {} as pageInfo
  churchShowData: mapInfoView[] = [];
  basicShowData: mapInfoView[] = [];
  textSave: string = 'Submit';
  textInfo: string = '';
  segement = {
    BASIC: 'Basic',
    CONGREGATION: 'Congregation',
    PROGRAM: 'Programs',
    TRAINING: 'Training',
    OTHERS: 'Others',
  }
  currentSegment: string = this.segement.BASIC;
  pSegment: string | undefined = '';
  nSegment: string | undefined = this.segement.CONGREGATION;
  segementError: any = {}
  infoLastReport: string = '';
  programFormData: formBuilder[] = churchProgramForm;
  congregationFormData: formBuilder[] = churchCongregationForm;
  basicFormData: formBuilder[] = CHURCH_REPORT_BASIC_FORM;
  trainingFormData: formBuilder[] = CHURCH_TRAINING_FORM;
  othersFormData: formBuilder[] = CHURCH_HISTORY_FORM;
  onChangeSubscribe: Subscription = new Subscription();
  loadingTotal: boolean = false
  isViewMode: boolean = false;
  @ViewChild('programForm') programForm: FormGeneratorComponent | undefined;
  @ViewChild('trainingForm') trainingForm: FormGeneratorComponent | undefined;
  @ViewChild('congregationForm') congregationForm: FormGeneratorComponent | undefined;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('othersForm') othersForm: FormGeneratorComponent | undefined;
  //@ViewChild('committee') committee: CouncilMemberComponent | undefined;

  constructor(private navServe: NavigationService,
    private churchApi: ChurchApiService,
    private auth: AuthService,
    private datepipe: DatePipe,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService) { }


  ngOnInit(): void {
    this.reportId = this.activatedRoute.snapshot.queryParams.report_id || '';
    this.isViewMode = this.activatedRoute.snapshot.queryParams.mode == 'view' ? true : false;
    if (this.isViewMode) {
      this.textSave = '';
    }
    this.churchShowData = [{ title: 'Church Name', name: 'church_name' }, { title: 'Church ID', name: 'church_id' }, { title: 'zone', name: 'zoneName' }]
    this.basicShowData = [{ title: 'From Date', name: 'from_date', type: 'DATE' }, { title: 'To Date', name: 'to_date', type: 'DATE' }]
    this.pageInfo = {
      title: this.reportId ? 'Update ' : 'New ' + 'church Report',
      buttonShowBtn: this.auth.checkPermission('SIX_MONTH_CHURCH_REPORT', 'VIEW_ALL'),
      button: {
        title: 'Report List',
        url: this.urlService.CHURCH.REPORT_LIST.URL,
      }
    }
    if (this.reportId) {
      this.getReportData(this.reportId);
    } else {
      this.mapPermission();
    }
  }
  ngAfterViewInit(): void {
    this.subscribe();
  }

  get validSegement() {
    let result: any = false;
    if (this.currentSegment) {
      switch (this.currentSegment) {
        case 'Basic':
          result = !this.basicForm?.isValid();
          break;
        case 'Congregation':
          result = !this.congregationForm?.isValid();
          break;
        case 'Programs':
          result = !this.programForm?.isValid();
          break;
        case 'Training':
          result = !this.trainingForm?.isValid();
          break;
        case 'Others':
          result = !this.othersForm?.isValid();
          break;
      }
    }
    return result;
  }

  subscribe() {
    console.log('call subscribe')
    this.unsubscribe();
    this.onChangeSubscribe = this.basicForm?.dataForm?.controls.from_date.valueChanges.subscribe((res: any) => {
      if (res) {
        const date = this.convertDatePipe(res);
        this.checkReportExists(date);
      }
    })
  }

  convertDatePipe(res: any) {
    return this.datepipe.transform(res, 'yyyy-MM-dd');
  }

  onChange(ev: any) {
    if (['church_id', 'from_date', 'to_date'].includes(ev?.controlName)) {
      this.getBelieversTotal();
    }
    console.log('on change', ev)
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
      //this.emailBtn = this.auth.checkPermission('MONTHLY_REPORT_CHILD', 'VERIFY');
    } else if (+this.reportData.status == 2) {
      this.showActionBtn = this.auth.checkPermission('MONTHLY_REPORT_CHILD', 'VERIFY');
      //this.getSponsorDetails();
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

  checkReportExists(date: any) {
    this.infoLastReport = '';
    if (!this.churchId || this.reportId) {
      return;
    }
    this.churchApi.checkReportExists(date).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        if (isArray(res.result)) {
          this.infoLastReport = "Report Already Exists last Report Date  " + this.convertDatePipe(res.result[0].from_date) + ' to ' + this.convertDatePipe(res.result[0].to_date);
          this.alertService.showToast('Report Already Exists, Please select other ranges');
        }
      }
    }).catch(err => {
      this.disabled_save = true;
      this.alertService.showToast('Unable to fetch the Data', 'error');
    }).finally(() => this.loading = false)
  }

  getReportData(id: any) {
    this.loading = true;
    this.churchApi.getReport(id).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.reportData = res.result;
        this.churchData = res.result?.church || {};
        this.applyFormValue();
        this.selectChurch(this.churchData);
        this.mapPermission();
      }
    }).catch(err => {
      this.alertService.showToast('Unable to fetch the Data', 'error');
    }).finally(() => this.loading = false)
  }

  getBelieversTotal() {
    const b = this.basicForm?.apiPayload();
    if (b.from_date && b.to_date && b.church_fk_id) {
      this.loadingTotal = true;
      this.textInfo = 'Getting Believers Data';
      this.churchApi.getBelieversTotal(b).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.congregationForm?.setValue('new_baptism', res.result.total_baptised_believers || 0)
          this.congregationForm?.setValue('new_believers', res.result.total_believers || 0)
        }
      }).finally(() => { this.loadingTotal = false, this.textInfo = '' })
    }
  }
  applyFormValue() {
    if (!isEmptyObj(this.reportData)) {
      this.basicForm?.setData(this.reportData);
      this.trainingForm?.setData(this.reportData);
      this.programForm?.setData(this.reportData);
      this.congregationForm?.setData(this.reportData);
      this.othersForm?.setData(this.reportData);
    }
  }

  selectChurch(res: any) {
    this.churchData = res;
    if (this.churchData.id) {
      this.basicForm?.setValue('church_fk_id', this.churchData.id)
      this.basicForm?.setValue('church_id', this.churchData.church_id)
    }
  }

  getCountOfMember() {

  }
  openSearchModal() {
    this.modalService.openSearchModal({ type: 'CHURCH' }).then(async (res: any) => {
      if (res) {
        this.selectChurch(res);
      }
    });
  }

  checkAllValid() {
    this.segementError.BASIC = !this.basicForm?.isValid();
    this.segementError.CONGREGATION = !this.congregationForm?.isValid();
    this.segementError.TRAINING = !this.trainingForm?.isValid();
    this.segementError.PROGRAM = !this.programForm?.isValid();
    this.segementError.OTHERS = !this.othersForm?.isValid();
    return Object.values(this.segementError).some((a: any) => a == true);
  }
  apiPayload() {
    const payload: any = this.basicForm?.getFormValue();
    Object.assign(payload, this.othersForm?.getFormValue());
    payload.program = this.programForm?.getFormValue();
    payload.congregation = this.congregationForm?.getFormValue();
    payload.training = this.trainingForm?.getFormValue();
    // payload.committee = this.committee?.apiPayload();
    if (this.reportId) {
      payload.id = this.reportId;
    }
    return payload;
  }

  onSubmit() {
    if (this.checkAllValid()) {
      return;
    }
    if (this.infoLastReport) {
      this.alertService.showToast('Report Exists', 'info');
      return;
    }
    const data = this.apiPayload();
    if (this.reportData.id) {
      if (+this.reportData.status == 2) {
        data.status = 1;
      } else if (+this.reportData.status == 3) {
        data.status = 2;
      }
    } else {
      data.status = 3;
    }
    this.saveReport(data);
  }

  saveDraft() {
    const data = this.apiPayload();
    data.save_draft = 1;
    this.saveReport(data);
  }

  saveReport(data: any) {
    this.loading = true;
    this.churchApi.saveReport(data).then((res: ResponseData | any) => {
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
        this.alertService.showToast('Successfully saved your changes', 'success');
      }
    }).catch(err => {
      this.alertService.showToast('Unable to save the Record', 'error');
    }).finally(() => { this.loading = false; this.disabled_save = true; })
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
  close() {
    this.navServe.back();
  }

  unsubscribe() {
    this.onChangeSubscribe && this.onChangeSubscribe.unsubscribe();
  }
  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
