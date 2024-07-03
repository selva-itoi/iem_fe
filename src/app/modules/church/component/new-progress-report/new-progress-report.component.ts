import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilderData, ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery, whereField } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { CHURCH_PROGRESS_REPORT } from '../../helper/church-form';
import { ChurchApiService } from '../../service/church-api.service';
import { FormDocComponent } from 'src/app/shared/form/component/form-doc/form-doc.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-progress-report',
  templateUrl: './new-progress-report.component.html',
  styleUrls: ['./new-progress-report.component.scss']
})
export class NewProgressReportComponent implements OnInit {
  pageInfo: pageInfo = {} as pageInfo
  urlService = UrlServices.PAGE_URL;
  loading: boolean = false;
  dataLoading: boolean = false;
  mode: 'VIEW' | 'APPROVE' | 'NEW' = 'NEW'
  basicFormData: formBuilderData[] = []
  LIST_COL: tableColum[] = cloneData(CHURCH_PROGRESS_REPORT).filter((a: any) => a.colName != 'church_name')
  actionBtn: tableButton[] = [
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View', type: 'VIEW' },
  ]
  tableConfig: tableBuilder = {
    name: 'Progress List',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: false
  }
  progressId: any
  progressData: any;
  churchData: any = {}
  hasPermission: boolean = false
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined
  @ViewChild('docForm') docForm: FormDocComponent | undefined;
  constructor(private auth: AuthService, private modalService: ModalService, private navigationServe: NavigationService,
    private churchApi: ChurchApiService, private alertService: AlertService, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.progressId = this.activateRoute.snapshot.queryParams['id'] || ''
    const ty = this.activateRoute.snapshot.queryParams['type'] || '';
    if (this.progressId) {
      this.mode = 'APPROVE';
      this.hasPermission = this.auth.checkPermission('CHURCH_PROGRESS', 'VERIFY');
      this.getDetails();
    }
    if (ty.toUpperCase() == 'VIEW' && this.progressId) {
      this.mode = 'VIEW';
    }
    this.pageInfo = {
      title: !this.progressId ? 'New Progress Report' : 'Progress Report Details',
      buttonShowBtn: this.auth.checkPermission('CHURCH', 'ADD'),
      button: {
        title: 'All Progress',
        url: this.urlService.CHURCH.PROGRESS_REPORT_LIST.URL,
        queryParams: {}
      }
    }
    this.basicFormData = [{ colName: 'description', title: 'Description', type: 'TEXTAREA', validator: [{ name: 'required' }] }, { colName: 'remarks', title: 'Remarks', type: 'TEXTAREA', validator: [{ name: 'required' }] },
    { colName: 'is_email', title: 'Email Send', type: 'checkbox', selectKeyName: 'name', selectPrimaryKey: 'id', event: { isCallback: true, name: 'change' }, data: [{ name: 'Yes', id: 1 }] }, { colName: 'prayer_points', title: 'Prayer Points', type: 'TEXTAREA' },
    { colName: 'report_status_id', title: 'Report Status', type: 'select', apiTblName: 'church_progress', selectKeyName: 'church_progressName', selectPrimaryKey: 'id', validator: [{ name: 'required' }] }]
  }

  getDetails() {
    this.dataLoading = true
    this.churchApi.getProgressDetails(this.progressId).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.progressData = res.result;
        this.churchData = res.result['church']
        if (+this.progressData.status == 2) {
          this.mode = 'APPROVE';
        } else {
          this.mode = 'VIEW';
        }
        this.mapData()
      }
    }).catch(() => this.alertService.showToast('Unable to get Data', 'error')
    ).finally(() => this.dataLoading = false)
  }

  openSearchModal() {
    this.modalService.openSearchModal({ type: 'CHURCH',whereField : [{colName : 'is_donation_allow',value :1}] }).then(async (res: any) => {
      if (res) {
        this.churchData = res;
      }
    });
  }
  onChange(ev: any) { }

  mapData() {
    setTimeout(() => {
      this.basicForm?.setData(this.progressData)
    }, 800);
    if (this.progressData?.doc.length) {
      setTimeout(() => {
        this.docForm?.setData(this.progressData.doc || [])
      }, 800);
    }
  }

  apiPayload() {
    const payload = this.basicForm?.apiPayload() || {};
    payload.church_fk_id = !this.progressId ? this.churchData?.id : this.progressData?.church_fk_id;
    payload.doc = this.docForm?.apiPayload() || [];
    if (this.progressId) {
      payload.id = this.progressData.id
    }
    return payload
  }

  onSubmit(type: 'SAVE' | 'APPROVE' | 'REJECT' = 'SAVE', reason: any = '') {
    if (!this.basicForm?.isValid() && type == 'SAVE') {
      return
    }
    const apiData = this.apiPayload();
    if (type != 'SAVE') {
      apiData.status = type == 'APPROVE' ? 1 : 3
      apiData.status_reason = reason
    }
    this.loading = true;
    this.churchApi.saveProgressReport(apiData).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Progress Report Saved Sucsessfully', 'success')
        this.goBack()
      }
    }).catch(err => {
      this.alertService.showToast('Unable to save the Record', 'error');
    }).finally(() => this.loading = false)

  }
  onApprove(type: 'APPROVE' | 'REJECT') {
    const formField: formBuilderData[] = [{ colName: 'reason', title: 'Reason', validator: [{ name: 'required' }] }],
      title = type == 'APPROVE' ? 'Confirm Approve' : 'Confirm Reject'
    this.modalService.openConfirmDialog({ title: title, message: '', formField: formField, isFormField: true, type: 'FORM' }).then((res: any) => {
      if (res) {
        this.onSubmit(type, res.reason)
      }
    })
  }
  goBack() {
    this.navigationServe.back();
  }

}
