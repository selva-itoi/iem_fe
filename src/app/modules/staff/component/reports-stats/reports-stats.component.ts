import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmailSenderComponent } from 'src/app/core/component/email-sender/email-sender.component';
import { arrayofData } from 'src/app/core/helper/core.data.interface';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { ResponseData, formBuilder, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { AuthService } from 'src/app/helper/service/auth.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { TableListComponent, tagInfo } from 'src/app/shared/form/component/table-list/table-list.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { StaffReportApiService } from '../../service/staff-report-api.service';
import { uniqueArray } from 'src/app/helper/class/utilityHelper';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';

@Component({
  selector: 'app-reports-stats',
  templateUrl: './reports-stats.component.html',
  styleUrls: ['./reports-stats.component.scss']
})
export class ReportsStatsComponent implements OnInit {
  staffList: any;
  urlService = UrlServices.PAGE_URL;
  yearRange = '';
  maxDate = new Date();
  minDate = new Date();
  MASTER_DATA: arrayofData = {
    lang: [],
  }
  @ViewChild('table') table: TableListComponent | undefined
  MONTH_DATA: Array<any> = [{ key: 1, label: 'Jan' }, { key: 2, label: 'Feb' }, { key: 3, label: 'Mar' }, { key: 4, label: 'Apr' }, { key: 5, label: 'May' }, { key: 6, label: 'June' }, { key: 7, label: 'July' }, { key: 8, label: 'Aug' }, { label: 'Sep', key: 9 }, { label: 'Oct', key: 10 }, { label: 'Nov', key: 11 }, { key: 12, label: 'Dec' }];
  masterLoading: any = {};
  LIST_COL: tableColum[] = [
    {
      colName: 'name',
      title: 'Name',
      sort: true,
      filter: true,
    },
    {
      colName: 'staff_emp_id',
      title: 'Emp ID',

      sort: false,
      filter: true,
      colType: 'STAFF_EMP_ID'
    },
    {
      colName: 'department',
      title: 'Department',
      sort: false,
      filter: true,
      filterCol: {
        type: 'DROPDOWN',
        apiName: 'department',
        selectPrimaryKey: 'id',
        selectKeyName: 'dName'
      }
    },
    {
      colName: 'zone',
      title: 'Zone/State',
      sort: false,
      filter: true,
      filterCol: {
        type: 'DROPDOWN',
        apiName: 'zone',
        selectPrimaryKey: 'id',
        selectKeyName: 'zoneName'
      }
    },
    {
      colName: 'report_date_and_month',
      title: 'Month',
      sort: true,
      filter: false
    },
    {
      colName: 'report_lang_id',
      title: 'Lang',
      sort: false,
      filter: true,
      colType: 'VIEW_TAG_INFO',
      filterCol: {
        type: 'DROPDOWN',
        apiName: 'lang',
        selectPrimaryKey: 'id',
        selectKeyName: 'langName'
      }
    }
  ];
  actionBtn: tableButton[] = []
  showAddBtn: boolean = false;

  tableConfig: tableBuilder = {
    name: 'Report List',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }

  SPONSOR_LIST_COL: tableColum[] = [
    {
      colName: 'sponsor_name',
      title: 'Sponsor Name',
      sort: false,
      filter: true,
    },
    {
      colName: 'sponsor_id',
      title: 'Donor Id',
      sort: false,
      filter: true,
    },
    {
      colName: 'promotionalName',
      title: 'Church Ministry Area',
      sort: false,
      filter: true,
    },
    {
      colName: 'langName',
      title: 'Report Language',
      sort: false,
      filter: true,
    },
    {
      colName: 'staff_emp_ids',
      title: 'Staff',
      colType: 'VIEW_TAG_INFO',
      sort: false,
      filter: true,
    },
  ]


  STATIC_LIST_COL: tableColum[] = [
    {
      colName: 'staff_name',
      title: 'Staff Name',
      sort: false,
      filter: true,
    },
    {
      colName: 'staff_id',
      title: 'Staff Emp Id',
      sort: false,
      filter: true,
    },
    {
      colName: 'department',
      title: 'Department',
      sort: false,
      filter: true,
      filterCol: {
        type: 'DROPDOWN',
        apiName: 'department',
        selectPrimaryKey: 'id',
        selectKeyName: 'dName'
      }
    },
    {
      colName: 'zone',
      title: 'Zone/State',
      sort: false,
      filter: true,
      filterCol: {
        type: 'DROPDOWN',
        apiName: 'zone',
        selectPrimaryKey: 'id',
        selectKeyName: 'zoneName'
      }
    },
    {
      colName: 'region',
      title: 'region',
      sort: false,
      filter: true,
      filterCol: {
        type: 'DROPDOWN',
        apiName: 'region',
        selectPrimaryKey: 'id',
        selectKeyName: 'regionName'
      }
    },
    {
      colName: 'staff_emp_ids',
      title: 'Sponser Report',
      colType: 'VIEW_TAG_INFO',
      sort: false,
      filter: true,
    },
    {
      colName: 'staff_emp_ids',
      title: 'Monthly Report',
      colType: 'VIEW_TAG_INFO',
      sort: false,
      filter: true,
    },
  ]
  sponsorTableConfig: tableBuilder = {
    name: 'Sponsor List',
    addBtn: false,
    column: this.SPONSOR_LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  staticTableConfig: tableBuilder = {
    name: 'Sponsor List',
    addBtn: false,
    column: this.STATIC_LIST_COL,
    action: [],
    isLazy: true,
    showFilter: true
  }
  segment = {
    STAFF: 'Staff',
    SPONSOR: 'Sponsor',
    STATISTICS:'Statistics Report'
  }
  currentSegement = ''
  month_year_col: formBuilder[] = [{ colName: 'report_date_and_month', title: 'Report Month', type: 'DATE', dateViewMode: 'month', dateFormat: 'mm/yy',col_size:12 }]
  report_month: string | any = new Date();
  @ViewChild('tbl') tbl: TableListComponent | undefined;
  @ViewChild('viewPreview') viewPreview: any;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;

  constructor(private staffReportApi: StaffReportApiService, private navigation: NavigationService,
    private masterApi: MasterApiService,
    private router: Router,
    private modalService: ModalService,
    private auth: AuthService) { }

  ngOnInit(): void {
    Object.keys(this.MASTER_DATA).map(a => {
      this.getFullData(a);
    });
  }
  setYearRange() {
    const d = new Date();
    const currentYear = d.getFullYear().toString();
    d.setMonth(d.getMonth() - 4);
    this.yearRange = d.getFullYear().toString() + ':' + currentYear;
    this.minDate = d;

  }

  getFullData(tblName: any, cond = []) {
    if (tblName) {
      this.masterLoading[tblName] = true;
      this.masterApi.getFullData(tblName, cond, false).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          res.result.map((a: any) => {
            if (a.zoneName || a.langName) {
              a.key = a.id,
                a.label = a.zoneName || a.langName
            }
          })
          const map: any = { zone: 'zone', report_lang_id: 'lang' }
          this.LIST_COL.map((a: tableColum) => {
            if (map[a.colName] == tblName) {
              if (a.filterCol) {
                a.filterCol.data = res.result;
              }
            }
          })
          this.MASTER_DATA[tblName] = res.result;
          this.tbl?.initTbl();
        } else {
          this.MASTER_DATA[tblName] = [];
        }
      }).finally(() => {
        this.masterLoading[tblName] = false;
      })
    }
  }

  getReportDate() {
    const rD = this.basicForm?.apiPayload() || {};
    const val = rD['report_date_and_month'] ? rD['report_date_and_month'] : new Date()
    return { colName: 'report_date_and_month', value: val }
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    const rD = this.getReportDate();
    e.queryParams = e.queryParams ? [...e.queryParams, ...[rD]] : [rD];
    e.whereField = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['VIEW_ALL'], ['region', 'zone', 'department', 'trust']) || [];
    //e.whereField?.push({ colName: 'save_draft', value: '0', operation: 'AND' })
    return this.staffList = await this.staffReportApi.getReportStats(e).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result.data.map((a: any) => {
          a.report_date_and_month = a.report_month ? (this.MONTH_DATA.filter((b: any) => b.key == +a.report_month)?.[0]?.label || '') + ('-' + a.report_year) : '<span class="text-info">Not Yet Typed </span>'
          a.report_lang_id = a.report_has_lang_id ? this.getStatus(a) : '<span> No Active Sponsor </span>'
          //a.report_date_and_month = `<span (click)="callFun()" class="text-info">${a.report_date_and_month} </span>`
        })
      }
      return res;
    })
  }

  getStatus(a: any) {
    const has_lang = a.report_has_lang_id.split(',')?.filter(a => +a),
      status_report = a.report_status ? a.report_status.split(',') : [],
      report_lang_primary_id = a.report_lang_primary_id ? a.report_lang_primary_id.split(',') : [],
      report_lang_draft = a.report_lang_draft ? a.report_lang_draft.split(',') : [],
      data = [
        { label: 'Processed', key: 2, color: 'info' },
        { label: 'Draft', key: 0, color: 'primary' },
        { label: 'Approved', key: 1, color: 'success' },
        { label: 'Submitted', key: 3, color: 'warning' },
      ],
      result: Array<any> = [];
    uniqueArray(has_lang).forEach((a: any, i: any) => {
      const status = +status_report[i],
        langName: any = this.MASTER_DATA.lang.find(b => +b.id == +a)?.langName,
        className = +report_lang_draft[i] ? 'primary' : (status ? data.find((a: any) => a.key == status)?.color : 'error'),
        tag: tagInfo = { data: report_lang_primary_id[i] || '', text: `<span class="text-capitalized badge badge-${className}">${langName}</span>` };
      result.push(tag);
    })
    return result;
  }

  sponsorgetListData = async (e: tblFilterQuery): Promise<any> => {
    const rD = this.getReportDate().value;  
    const originalDateString =rD;
    const originalDate = new Date(originalDateString);

    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'numeric', year: 'numeric' }).format(originalDate);

    e.queryParams = e.queryParams ? [...e.queryParams, ...[rD]] : [rD];
    e.whereField = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['VIEW_ALL'], ['region', 'zone', 'department', 'trust']) || [];
    return this.staffList = await this.staffReportApi.getReportStatsSponsor(e).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result.data.map((a: any) => {
          a.staff_emp_ids = a.staff_emp_ids ? this.getStaffIdsStatus(a) : '<span> No Active Staff </span>'
        })
      }
      return res;
    })
  }

  getStaffIdsStatus(d: any) {
    const statusKey = Object.keys(d?.status_with_col),
      data = [
        { label: 'Processed', key: 2, color: 'info' },
        { label: 'Draft', key: 0, color: 'primary' },
        { label: 'Approved', key: 1, color: 'success' },
        { label: 'Submitted', key: 3, color: 'warning' },
      ],
      result: Array<any> = [];
    statusKey.forEach((a: any) => {
      const status = d?.status_with_col?.[a],
        className = (status ? data.find((c: any) => c.key == status)?.color : 'error'),
        tag: tagInfo = { data: a || '', text: `<span class="text-capitalized badge badge-${className}">${a}</span>` };
      result.push(tag)
    })
    return result;
  }
  tagInfoAction = (tag: any, data: any): Promise<any> => {
    if (!tag.data) {
      this.router.navigate([this.urlService.STAFF.REPORT_ADD.URL], { queryParams: { staff_id: data.staff_emp_id } })
    } else {
      this.showPdfPreview(tag?.data);
    }
    return Promise.resolve(true);
  }

  showPdfPreview(id: any) {
    //this.modalService.openModalTemplate(this.viewPreview);
    this.masterApi.generateEmail(4, { staff_report_id: id }).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        let data: any = res.result;
        data.config = { is_pdf: true, is_preview: true };
        this.modalService.openModal(EmailSenderComponent, data, 'modal-md', 1).then((res: any) => {
          console.log('on close', res);
        })
      }
    }).finally(() => this.modalService.close())
  }
  
  search(){
    this.table?.reload()
  }

  close() {
    this.navigation.back();
  }
}
