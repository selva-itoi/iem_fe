import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { StaffReportApiService } from '../../service/staff-report-api.service';

@Component({
  selector: 'app-staff-monthly-report-list',
  templateUrl: './staff-monthly-report-list.component.html',
  styleUrls: ['./staff-monthly-report-list.component.scss']
})
export class StaffMonthlyReportListComponent implements OnInit, OnDestroy {
  urlService = UrlServices.PAGE_URL;
  reportList: any;
  reportPendingList: any;
  reportDraftList: any;
  LIST_COL: tableColum[] = [
    {
      colName: 'zone',
      title: 'Zone/State',
      colType: 'DROPDOWN',
      filterCol: { apiName: 'zone', type: 'DROPDOWN', selectKeyName: 'zoneName', selectPrimaryKey: 'id' },
      sort: true,
      filter: true,
    },
    {
      colName: 'name',
      title: 'Name',

      sort: true,
      filter: true,
    },
    {
      colName: 'id',
      title: 'id',
      visible: false,
      isPrimary: true,
    },
    {
      colName: 'staff_emp_id',
      title: 'Emp ID',
      sort: false,
      filter: true,
      colType: 'STAFF_EMP_ID'
    },
    {
      colName: 'staff_cross_id',
      title: 'Cross ID',
      sort: false,
      filter: true,
      colType: 'VIEW_INFO'
    },

    {
      colName: 'report_month',
      title: 'Month',

      sort: true,
      filter: true,
      colType: 'DROPDOWN',
      filterCol: {
        type: 'DROPDOWN',
        data: [{ key: 1, label: 'Jan' }, { key: 2, label: 'Feb' }, { key: 3, label: 'Mar' }, { key: 4, label: 'Apr' }, { key: 5, label: 'May' }, { key: 6, label: 'June' }, { key: 7, label: 'July' }, { key: 8, label: 'Aug' }, { label: 'Sep', key: 9 }, { label: 'Oct', key: 10 }, { label: 'Nov', key: 11 }, { key: 12, label: 'Dec' }],
      }
    },
    {
      colName: 'report_year',
      title: 'Year',

      sort: true,
      filter: true,
    },
    {
      colName: 'langName',
      title: 'Lang',

      sort: true,
      filter: true,
    },
    {
      title: 'Status',
      colName: 'status',

      sort: true,
      filter: true,
      colType: 'DROPDOWN',
      filterCol: {
        type: 'DROPDOWN',
        data: [
          { label: 'Processed', key: 2, color: 'info' },
          { label: 'Approved', key: 1, color: 'success' },
          { label: 'Submitted', key: 3, color: 'warning' },
        ]
      }
    },
    {
      colName: 'updated_at',
      title: 'Last Update',

      sort: false,
      filter: true,
      colType: 'DATE'
    },
  ];

  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Report Edit', type: 'EDIT', permission: { moduleName: 'MONTHLY_REPORT_STAFF', actionName: 'UPDATE' }, condition: [{ key: 'status', operation: '!=', value: '1' }] },
    { name: '', class: 'bg-orange', icon: 'icon-doc', title: 'Report Document View', type: 'PRINT', permission: { moduleName: 'MONTHLY_REPORT_STAFF', actionName: 'READ' } },
    { name: '', class: 'bg-pink', icon: 'icon-eye', title: 'Report View', type: 'VIEW', permission: { moduleName: 'MONTHLY_REPORT_STAFF', actionName: 'READ' } },
    { name: '', icon: 'icon-trash text-danger', title: 'Report Delete', type: 'DELETE', permission: { moduleName: 'MONTHLY_REPORT_STAFF', actionName: 'DELETE' }, condition: [{ key: 'status', operation: '!=', value: '1' }] }
  ]

  showAddBtn: boolean = false;
  inActiveTblConfig: tableBuilder = {
    name: 'Pending',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  draftTblConfig = cloneData(this.inActiveTblConfig)

  segement = {
    LIST: 'Report List',
    PENDING: 'Pending',
    DRAFT: 'Draft'
  }
  segmentVisited = {
    LIST: true,
    PENDING: false,
    DRAFT: false
  }
  modifyModule: Concrete<keyof modulInterface>[] = ['MONTHLY_REPORT_STAFF']
  currentSegment: string = this.segement.LIST;
  myProfileView: boolean = false;
  staff_id: any = '';
  queryParams: any;
  info_message: string = '';
  navigationSubscription: Subscription = {} as Subscription;
  constructor(private staffReportApi: StaffReportApiService, private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private navigation: NavigationService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService) {
   // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.draftTblConfig.action[0].permission = {};
    this.showAddBtn = this.auth.checkPermission('MONTHLY_REPORT_STAFF', 'ADD');
    let queryId = this.activatedRoute.snapshot.queryParams.id || '';
    if (queryId == 'my_report') {
      this.staff_id = this.auth.currentUserValue.staff_fk_id;
      this.showAddBtn = true;
      this.queryParams = { id: 'my_report' };
      this.info_message = this.staff_id ? '' : 'You are not a Staff';
    }
  }

  returnZero() {
    return 0;
  }

  changeSegment(s: string) {
    this.currentSegment = s;
    //@ts-ignore
    const key: 'DRAFT' | 'LIST' | 'PENDING' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.segmentVisited[key] = true;
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = await this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['VIEW_ALL'], ['region', 'zone', 'department', 'trust', 'ad_office']) || [];
    e.whereField = await this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['VIEW_ALL']) || [];

    if (this.staff_id) {
      e.queryParams = e.queryParams || [];
      e.queryParams.push({ colName: 'staff_fk_id', value: this.staff_id, matchMode: 'equals', operation: 'AND' });
    }
    e.whereField?.push({ colName: 'save_draft', value: '0', operation: 'AND' })
    return await this.staffReportApi.getList(e)
  }

  getListPendingData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['VIEW_ALL'], ['region', 'zone', 'department', 'ad_office', 'trust']) || [];
    e.whereField = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['VIEW_ALL']) || [];

    e.whereField?.push({ colName: 'status', value: [2, 3], operation: 'IN' })
    e.whereField?.push({ colName: 'save_draft', value: '0', operation: 'AND' })
    if (this.staff_id) {
      e.queryParams = e.queryParams || [];
      e.queryParams.push({ colName: 'staff_fk_id', value: this.staff_id, matchMode: 'equals', operation: 'AND' });
    }
    return this.reportPendingList = await this.staffReportApi.getList(e)
  }

  getMyDraftData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], [], []) || [];
    e.whereField?.push({ colName: 'save_draft', value: '1', operation: 'AND' })
    e.whereField?.push({ colName: 'staff_report_lang.last_modify_by', value: this.auth.currentUserValue.user_id, operation: 'AND' })
    if (this.staff_id) {
      e.queryParams = e.queryParams || [];
      e.queryParams.push({ colName: 'staff_fk_id', value: this.staff_id, matchMode: 'equals', operation: 'AND' });
    }
    return this.reportDraftList = await this.staffReportApi.getList(e)
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([UrlServices.PAGE_URL.STAFF.REPORT_ADD.URL], { queryParams: { report_lang_id: id, id: this.currentSegment == this.segement.DRAFT ? 'draft' : '' } })
        break;
      case 'VIEW':
        this.router.navigate([UrlServices.PAGE_URL.STAFF.REPORT_ADD.URL], { queryParams: { report_lang_id: id, id: this.currentSegment == this.segement.DRAFT ? 'draft' : '', mode: 'view' } });
        break;
      case 'PRINT':
        this.showPdfPreview(id);
        break;
      case 'DELETE':
        return this.deleteReport(id);
        break;
    }
    return Promise.resolve(true);
  }

  showPdfPreview(id: any) {
    let data: any = { payload: { staff_report_id: id }, id: 4 };
    data.config = { is_pdf: true, is_preview: true };
    this.modalService.showPreviewModal(data);
  }

  deleteReport(id: string | number): Promise<any> {
    return new Promise((resolve, reject) => {
      const title = 'Delete Report',
        msg = 'Are you sure to Delete this Report';
      this.modalService.openConfirmDialog({ title: title, message: msg }).then((res: any) => {
        if (res) {
          //const data = this.reportList.result.data.find((a: any) => a.id == id);
          this.staffReportApi.deleteReport(id).then((res: ResponseData | any) => {
            if (res.statusCode == RESPONSE_CODE.SUCCESS) {
              this.alertService.showToast('Report Has been moved to trash', 'success');
              resolve({ reload: true })
            } else {
              this.alertService.showToast("Unable to delete the report ", 'error');
              resolve({ reload: false })
            }
          }).catch(err => {
            resolve({ reload: false })
          })
        }
      });
    });
  }

  close() {
    this.navigation.back();
  }
}