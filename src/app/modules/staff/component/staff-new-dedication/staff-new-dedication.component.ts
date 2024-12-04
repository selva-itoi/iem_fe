import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { AppConstant, RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { EmailApiService } from 'src/app/modules/email/service/email-api.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { StaffApiService } from '../../service/staff-api.service';

@Component({
  selector: 'app-staff-new-dedication',
  templateUrl: './staff-new-dedication.component.html',
  styleUrls: ['./staff-new-dedication.component.scss']
})
export class StaffNewDedicationComponent implements OnInit {

  urlService: any = UrlServices.PAGE_URL;
  dataForm: any;
  dataLoading: boolean = false;
  dedicationData: any;
  loading: boolean = false;
  isModifyRequest: boolean = false;
  submitted: boolean = false;
  sponsorData: any = {};
  staffData: Array<any> = [];

  dateRange = AppConstant.DEFAULT_DATE_RANGE;
  dateFormat = AppConstant.DATE_FORMAT;
  save_disabled: boolean = false;

  _bsModalRef: BsModalRef = {} as BsModalRef;
  isModal: boolean = false;
  modifyData: any = {};
  modifyMode: boolean = false;
  dedicationId: string | number = '';
  public onClose: Subject<boolean> = new Subject();
  btnText: string = 'Save';
  infoText: string = '';
  currentStatus = 'SAVE';
  nStatusId: number = 0;
  loadingPreview: boolean = false;
  sendingEmail: boolean = false;
  pageInfo: pageInfo = {} as pageInfo;
  constructor(private staffApi: StaffApiService,
    private auth: AuthService, private alertService: AlertService, private emailApi: EmailApiService,
    private activatedRoute: ActivatedRoute, private modalService: ModalService,
    private navigation: NavigationService) { }

  ngOnInit(): void {
    this.initForm();
    const showBtnList = this.auth.checkPermission('DEDICATION', 'VIEW_ALL');
    this.dedicationId = this.activatedRoute.snapshot.queryParams.id || '';
    this.pageInfo = { title: this.dedicationId ? 'Update ' : 'New ' + 'Dedication ', buttonShowBtn: showBtnList, button: { url: this.urlService.STAFF.DEDICATION_LIST.URL, title: 'All Dedication' } };
    if (!this.dedicationId) {
      const res = this.auth.checkPermission('DEDICATION', 'PROCESS');
      this.btnText = res ? 'Submit' : '';
      this.infoText = !res ? "you don't have a permission to process" : '';
      this.nStatusId = 3;
    } else {
      this.getDetails();
    }
  }


  setInput(data: any) {
    this.modifyData = data || {};
    this.modifyMode = true;
    this.isModal = true;
  }

  initForm() {
    this.dataForm = new UntypedFormGroup({
      place: new UntypedFormControl('', [Validators.required, Validators.pattern(VALIDATOR_PATTERNS.TEXT)]),
      staff_fk_id: new UntypedFormControl('', [Validators.required]),
      sponsor_fk_id: new UntypedFormControl('', [Validators.required]),
      date_time: new UntypedFormControl('', [Validators.required]),
      accompany_staff_fk_id: new UntypedFormControl(),
      arrival_date_time: new UntypedFormControl('', [Validators.required]),
      dept_date_time: new UntypedFormControl('', [Validators.required]),
      m_arrival_date_time: new UntypedFormControl('', [Validators.required]),
      m_dept_date_time: new UntypedFormControl('', [Validators.required]),
      remarks: new UntypedFormControl('')
    });
  }


  openModalSearch(type: 'SPONSOR' | 'STAFF' = 'STAFF', selection: 'DEDICATE' | 'ACCOMPANY' = 'ACCOMPANY') {
    const skipKey = type == 'SPONSOR' ? 'id' : 'id';
    if (type == 'STAFF' && selection == 'DEDICATE') {
      this.staffData[0] = {};
    } else if (type == 'STAFF') {
      this.staffData[1] = {};
    } else {
      this.sponsorData = {};
    }

    this.modalService.openSearchModal({ type: type, skipKey: skipKey, skipData: [], activeOnly: true }).then(async (res: any) => {
      const formData: any = {};
      if (res[skipKey]) {
        if (res.deleted_at != null) {
          this.alertService.showToast("You can't select Inactive User", 'info');
          return;
        }
        if (type == 'STAFF' && selection == 'DEDICATE') {
          this.staffData[0] = res || {};
          formData.staff_fk_id = res[skipKey];
        } else if (type == 'STAFF') {
          this.staffData[1] = res || {};
          formData.accompany_staff_fk_id = res[skipKey];
        } else {
          this.sponsorData = res || {};
          formData.sponsor_fk_id = res[skipKey];
        }
        this.dataForm.patchValue(formData);
      }
    });
  }

  checkAllValid(): boolean {
    return this.dataForm.valid;
  }

  applyFormValue(data: any) {
    if (data) {
      const mapData: any = {};
      Object.keys(this.dataForm.controls).forEach((e: string) => {
        mapData[e] = data[e] ? data[e] : '';
        if (e.search(/date/gi) !== -1) {
          mapData[e] = data[e] ? new Date(data[e]) : '';
        }
      });
      this.dataForm.patchValue(mapData);
    }
  }

  getDetails() {
    if (this.dedicationId) {
      this.dataLoading = true;
      this.staffApi.getDedicationByid(this.dedicationId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (res.result) {
            this.dedicationData = res.result;
            this.sponsorData = this.dedicationData?.sponsorData || {};
            this.staffData[0] = this.dedicationData?.staffData[0] || {};
            this.staffData[1] = this.dedicationData?.staffData[1] || {};
            const status = +this.dedicationData.status;
            if (status == 3) {
              const res = this.auth.checkPermission('DEDICATION', 'PROCESS');
              this.btnText = res ? 'Process' : '';
              this.infoText = !res ? "you don't have a permission to process" : '';
              this.nStatusId = 2;
            } else if (status == 2) {
              const res = this.auth.checkPermission('DEDICATION', 'VERIFY');
              this.btnText = res ? 'Approve' : '';
              this.infoText = !res ? "you don't have a permission to Approve" : '';
              this.nStatusId = 1;
            } else if (status == 1) {
              this.btnText = '';
              this.infoText = 'Dedication has been approved';
            } else if (status == 4) {
              this.btnText = '';
              this.infoText = 'Dedication waiting for allotment staff';
            }
            this.applyFormValue(res.result);
          }
        }
      }).finally(() => {
        this.dataLoading = false;
      });
    }
  }


  apiPayload() {
    const payload = this.dataForm.value;
    payload.last_modify_by = this.auth.currentUserValue.user_id;
    if (this.nStatusId) {
      payload.status = this.nStatusId;
    } else {
      payload.status = 2;
    }
    if (this.dedicationId) {
      payload.id = this.dedicationId;
    }
    return payload;
  }


  onSubmit() {
    if (this.checkAllValid()) {
      this.saveDetails();
    }
  }
  textInfo = '';
  saveDetails() {
    this.loading = true;
    this.textInfo = 'Saving dedication Details';
    this.staffApi.saveDedication(this.apiPayload()).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.save_disabled = true;
        this.alertService.showToast('SuccessFully Saved', 'success');
        if (!this.dedicationData.staff_fk_id) {
          this.showPreview(true);
        } else
          this.close();
      }
    }).catch((err: any) => {
      this.alertService.showToast('Failed to save', 'error');
    }).finally(() => {
      this.textInfo = '';
      this.loading = false;
    })
  }

  close(status = false) {
    if (!this.isModal) {
      this.navigation.back();
      return;
    }
    this._bsModalRef.hide();
    this.onClose.next(status);
  }

  async sendEmail() {
    this.sendingEmail = true;
    this.emailApi.sendEmailRef(4, this.dataForm.value, this.sponsorData, 'sponsor_id').then(res => {
    }).finally(() => this.sendingEmail = false)
  }

  showPreview(is_sent = false) {
    const apiLoad = this.dataForm.value;
    apiLoad.accompany_staff_emp_id = this.staffData[1]?.staff_emp_id || ''
    apiLoad.accompany_name = this.staffData[1]?.name || '';
    if (!this.dataForm.valid) {
      this.alertService.showToast('Make sure all the field are valid');
      return;
    }

    if (!is_sent) {
      let data: any = { payload: apiLoad, id: 8 };
      data.config = { is_pdf: false, is_preview: true };
      this.textInfo = 'Fetching email....'
      this.loadingPreview = true;
      this.modalService.showPreviewModal(data, 'modal-lg').finally(() => this.loadingPreview = false).then(res => { this.textInfo = '', this.loadingPreview = false });
    } else {
      this.textInfo = 'Email Sending..'
      this.emailApi.sendEmailRef(8, apiLoad).then(res => {
      }).finally(() => { this.sendingEmail = false, this.textInfo = '' })
    }
  }
}