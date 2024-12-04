import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConstant } from 'src/app/helper/class/app-constant';
import { downloadHelper } from 'src/app/helper/class/downloadHelper';
import { cloneData, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { whereField } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { CHILD_PARENT_FORM, CHILD_SIBLING_FORM } from 'src/app/modules/child/helper/child-form';
import { CHURCH_TRAINING_FORM, churchCommitteeMember, churchMemberForm, churchProgramForm } from 'src/app/modules/church/helper/church-form';
import { SPONSORSHIP_TABLE } from 'src/app/modules/sponsor/helper/sponsor-form';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { CHECKBOX_FROM, CHILD_EXPORT_REPORT, CHURCH_EXPORT_REPORT, MEMBER_EXPORT_REPORT, SPONSOR_ALLOTMENT_COL, SPONSOR_EXPORT_REPORT, STAFF_EXPORT_REPORT, STAFF_REPORT_ADDRESS_COL, STAFF_REPORT_EDU_COL, STAFF_REPORT_EXP_COL, STAFF_REPORT_GEMS_EXP_COL, STAFF_REPORT_TRAINING_COL } from '../../helper/report_forms';
import { ReportApiService } from '../../service/report-api.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  module: 'STAFF' | 'SPONSOR' | 'CHURCH' | 'CHILD' | 'CHURCH_MEMBER' = 'STAFF';
  pageInfo: pageInfo = {} as pageInfo;
  loading: boolean = false;
  basicFormData: any = [];
  loadForm: boolean = false;
  // downloadHelper = new downloadHelper();
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('sponsorForm') sponsorForm: FormGeneratorComponent | undefined;
  constructor(private activatedRoute: ActivatedRoute, private reportApi: ReportApiService,
    private alertService: AlertService, private auth: AuthService,private downloadHelper :downloadHelper) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.loadForm = false;
      this.module = params?.id?.toUpperCase() || 'STAFF';
      this.initPage();
    });
  }
  initPage() {
    if (!this.auth.checkPermission(this.module, 'FLAT_REPORT')) {
      this.auth.redirectToDenied();
    }
    this.pageInfo.title = 'Export Report ' + this.module.toLowerCase();
    this.pageInfo.buttonShowBtn = true;
    this.formGen();
  }

  formGen() {
    this.basicFormData = [];
    switch (this.module) {
      case 'SPONSOR':
        this.basicFormData = SPONSOR_EXPORT_REPORT;
        break;
      case 'CHILD':
        this.basicFormData = CHILD_EXPORT_REPORT
        break;
      case 'CHURCH':
        this.basicFormData = CHURCH_EXPORT_REPORT
        break;
      case 'CHURCH_MEMBER':
        this.basicFormData = MEMBER_EXPORT_REPORT;
        break;
      default:
        this.basicFormData = STAFF_EXPORT_REPORT;
        break;
    }
    const d: any = CHECKBOX_FROM;
    d.colName = 'is_active_only';
    d.title = 'Active Record Only';
    d.defaultValue = true;
    const dt = this.basicFormData.find((a: any) => a.colName == 'is_active_only');
    if (isEmptyObj(dt)) {
      this.basicFormData.push(d);
    }
    setTimeout(() => {
      this.loadForm = true;
    }, 800);
  }

  onChange(ev: any) {
  }

  get isValid() {
    return this.basicForm?.isValid();
  }

  payload() {
    const payload: any = this.basicForm?.getFormValue();
    let basicFilter = payload.basic ? payload.basic.split(',') : [];
    let basicData = cloneData(this.basicFormData?.find((a: any) => a.colName == 'basic')?.data);
    if (payload.address_col) {
      basicData = [...basicData, ...cloneData(this.basicFormData?.find((a: any) => a.colName == 'address_col')?.data)]
      basicFilter = [...basicFilter, ...payload.address_col.split(',')]
    }
    if (payload.others_col) {
      basicData = [...basicData, ...cloneData(this.basicFormData?.find((a: any) => a.colName == 'others_col')?.data)];
      basicFilter = [...basicFilter, ...payload.others_col.split(',')]
    }
    if (payload.is_summary) {
      const f: any = [...cloneData(churchProgramForm), ...cloneData(CHURCH_TRAINING_FORM)];
      basicData = [...basicData, ...f]
      basicFilter = [...basicFilter, ...cloneData(f).map((a: any) => a = a.colName)];
    }
    let basic = basicData.filter((a: any) => basicFilter?.includes(a.colName))
    payload.condition = this.getWhereCond(payload);
    payload.basic = basic;
    //church
    if (payload.is_member) {
      payload.member = cloneData(churchMemberForm).filter((a: any) => !['id', 'church_fk_id'].includes(a.colName)).map((a: any) => { a.title = 'member_' + a.title; a.colName = a.selectKeyName || a.colName; return a });
    }
    if (payload.is_committee) {
      payload.committee = cloneData(churchCommitteeMember).filter((a: any) => !['id', 'member_fk_id', 'staff_fk_id'].includes(a.colName)).map((a: any) => { a.title = 'committee_' + a.title; a.colName = a.selectKeyName || a.colName; return a });
    }

    if (payload.is_sponsorship) {
      payload.sponsorship = cloneData(SPONSORSHIP_TABLE).filter((a: any) => !['id', 'promotionalName', 'payment_status', 'name'].includes(a.colName)).map((a: any) => { a.title = 'Sponsorship_' + a.title; return a });
    }
    if (payload.is_allotment) {
      payload.allotment = cloneData(SPONSOR_ALLOTMENT_COL).map((a: any) => { a.title =this.titleMap('Allot_',a.title); return a });
    }
    if (payload.is_address) {
      payload.address = STAFF_REPORT_ADDRESS_COL.map(a => { a.title =this.titleMap('Addr_',a.title); return a });
    }
    if (payload.is_education) {
      let d = cloneData(STAFF_REPORT_EDU_COL);
      if (this.module == 'CHILD') {
        d = d.filter((a: any) => !['to_date'].includes(a.colName)).map((b: any) => { if (b.colName == 'from_date') { b.title = 'Course Year' } return b; })
      }
      payload.education = cloneData(d).map((a: any) => { a.title = 'Edu_' + a.title; return a });
    }
    if (payload.is_training) {
      payload.training = cloneData(STAFF_REPORT_TRAINING_COL).map((a: any) => { a.title = 'Training_' + a.title; return a });
    }
    if (payload.is_exp_gems) {
      payload.expGems = cloneData(STAFF_REPORT_GEMS_EXP_COL).map((a: any) => { a.title = `Exp${AppConstant.ORG_NAME}_${a.title}`; return a });
    }
    if (payload.is_experience) {
      payload.experience = cloneData(STAFF_REPORT_EXP_COL).map((a: any) => { a.title = 'Exp_' + a.title; return a });
    }
    if (payload.is_sibling) {
      payload.sibling = cloneData(CHILD_SIBLING_FORM).map((a: any) => { a.title = 'Sibling_' + a.title; return a });
    }
    if (payload.is_parent) {
      payload.parent = cloneData(CHILD_PARENT_FORM).map((a: any) => { a.title = 'Parent_' + a.title; return a });
    }
    // if (payload.is_a) {
    //   payload.experience = cloneData(STAFF_REPORT_EXP_COL).map((a: any) => { a.title =this.titleMap('Exp_',a.title); return a });
    // }
    return payload;
  }

  titleMap(txt: any, v: any) {
    return v.includes(txt) ? v : txt+v;
  }

  getWhereCond(formV: any) {
    const cond: whereField[] = [],
      validKey = ['region', 'zone', 'department', 'promotional_office', 'field', 'church']
    Object.keys(formV).forEach(a => {
      if (validKey.includes(a) && formV[a]) {
        cond.push({ colName: a, value: formV[a], operation: 'AND' })
      }
    })
    return cond;
  }

  onSubmit() {
    this.loading = true;
    const apiPayload = this.payload();
    this.reportApi.genReport(this.module, apiPayload, apiPayload.condition).then(async (res: any) => {
      this.downloadHelper.downloadFile(res);
      this.basicForm?.reset();
    }).catch(err => this.alertService.showToast('Unable to download Report', 'info'))
      .finally(() => { this.loading = false });
  }

  close() {

  }
}
