import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { ChurchApiService } from '../../service/church-api.service';
import { ChurchBasicComponent } from '../church-basic/church-basic.component';

@Component({
  selector: 'app-church-report-list',
  templateUrl: './church-report-list.component.html',
  styleUrls: ['./church-report-list.component.scss']
})
export class ChurchReportListComponent implements OnInit {
  reportList: any;
  urlService = UrlServices.PAGE_URL;
  LIST_COL: tableColum[] = [
    {
      colName: 'church_name',
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
      colName: 'church_id',
      title: 'Church ID',

      sort: false,
      filter: true,
      colType: 'VIEW_INFO'
    },
    {
      colName: 'from_date',
      title: 'From',

      sort: true,
      filter: true,
      colType: 'DATE',
    },
    {
      colName: 'to_date',
      title: 'To',

      sort: true,
      filter: true,
      colType: 'DATE',
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
  segement = {
    LIST: 'Church list',
    DRAFT: 'Draft'
  }
  segmentVisited: any = { LIST: true, }
  currentSegment: string = this.segement.LIST;

  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Report Edit', type: 'EDIT', permission: { moduleName: 'SIX_MONTH_CHURCH_REPORT', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Report View', type: 'VIEW', permission: { moduleName: 'SIX_MONTH_CHURCH_REPORT', actionName: 'READ' } },
    { name: '', class: 'btn-primary', icon: 'icon-printer', title: 'Pdf', type: 'PRINT', permission: { moduleName: 'SIX_MONTH_CHURCH_REPORT', actionName: 'READ' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Report Relieve', type: 'DELETE', permission: { moduleName: 'SIX_MONTH_CHURCH_REPORT', actionName: 'RELIVE' } }
  ]
  inActiveActionBtn: tableButton[] = [
    { name: '', icon: 'icon-lock-open text-info', type: 'ACTIVE', permission: { moduleName: 'CHURCH', actionName: 'RELIVE' } }
  ]
  showAddBtn: boolean = false;
  tableConfig: tableBuilder = {
    name: 'Pending',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  globalFilter=[]
  pageInfo: pageInfo = {} as pageInfo
  modifyModule: Concrete<keyof modulInterface>[] = ['SIX_MONTH_CHURCH_REPORT']
  constructor(private churchApi: ChurchApiService, private auth: AuthService,
    private modalService: ModalService,
    private router: Router, private alertService: AlertService, private masterApi: MasterApiService) { }

  ngOnInit(): void {
    this.globalFilter = this.auth.getPermittedId(['MONTHLY_REPORT_CHILD'], ['VIEW_ALL'], ['home']) || [];
    this.showAddBtn = this.auth.checkPermission('SIX_MONTH_CHURCH_REPORT', 'ADD');
    this.pageInfo = {
      title: 'Manage Church Report List',
      buttonShowBtn: this.showAddBtn,
      button: {
        title: 'Add New',
        url: this.urlService.CHURCH.REPORT_ADD.URL,
        queryParams: {}
      }
    }
  }
  returnZero() {
    return 0;
  }
  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([UrlServices.PAGE_URL.CHURCH.REPORT_ADD.URL], { queryParams: { report_id: id } })
        break;

      case 'ADD':
        this.router.navigate([UrlServices.PAGE_URL.CHURCH.REPORT_ADD.URL])
        break;

      case 'VIEW':
        this.router.navigate([UrlServices.PAGE_URL.CHURCH.REPORT_ADD.URL], { queryParams: { report_id: id, mode: 'view' } });
        break;

      case 'DELETE':
        //return this.deleteReport(id);
        break;

      case 'PRINT':
        this.showPdfPreview(id);
        break;
    }
    return Promise.resolve(true);
  }

  showPdfPreview(id: any) {
    let data: any = { payload: { report_id: id }, id: 9 };
    data.config = { is_pdf: true, is_preview: true };
    this.modalService.showPreviewModal(data, 'modal-full');
  }

  viewInfoHandler(id: any, data: any) {
    data.child_id = id;
    this.modalService.openModal(ChurchBasicComponent, data, 'modal-lg');
  }
  changeSegment(s: string) {
    this.currentSegment = s;
    //@ts-ignore
    const key: 'DRAFT' | 'LIST' | 'PENDING' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.segmentVisited[key] = true;
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.globalFilter;
    e.whereField?.push({ colName: 'save_draft', value: '0'})
    return this.reportList = await this.churchApi.getReportList(e)
  }

  getMyDraftData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.globalFilter;
    e.whereField?.push({ colName: 'save_draft', value: '1' })
    return await this.churchApi.getReportList(e)
  }


  deleteReport(id: string | number): Promise<any> {
    return new Promise((resolve, reject) => {
      const title = 'Delete Report',
        msg = 'Are you sure to Delete this Report';
      this.modalService.openConfirmDialog({ title: title, message: msg, isFormField: false }).then((res: any) => {
        if (res) {
          this.churchApi.deleteReport(id).then((res: any) => {
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


}