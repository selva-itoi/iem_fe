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
import { ChildApiService } from '../../service/child-api.service';
import { ChildBasicInfoComponent } from '../child-basic-info/child-basic-info.component';

@Component({
  selector: 'app-child-report-list',
  templateUrl: './child-report-list.component.html',
  styleUrls: ['./child-report-list.component.scss']
})
export class ChildReportListComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  reportList: any;
  reportPendingList: any;
  reportDraftList: any;
  LIST_COL: tableColum[] = [
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
      colName: 'child_id',
      title: 'Child ID',
      sort: false,
      filter: true,
      colType: 'VIEW_INFO'
    },
    {
      colName: 'homeName',
      title: 'Home',
      sort: true,
      filter: true,
    },
    {
      colName: 'to_report_month',
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
      colName: 'to_report_year',
      title: 'Year',
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
  isMk:boolean =false;
  isHome:boolean=false;
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Report Edit', type: 'EDIT', permission: { moduleName: 'MONTHLY_REPORT_CHILD', actionName: 'UPDATE' }, condition: [{ key: 'status', operation: '!=', value: '1' }] },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Report View', type: 'VIEW', permission: { moduleName: 'MONTHLY_REPORT_CHILD', actionName: 'READ' } },
    { name: '', icon: 'icon-trash text-danger', title: 'Report Delete', type: 'DELETE', permission: { moduleName: 'MONTHLY_REPORT_CHILD', actionName: 'DELETE' }, condition: [{ key: 'status', operation: '!=', value: '1' }] }
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

  segement = {
    LIST: 'Report List',
    PENDING: 'Pending',
    // DRAFT: 'Draft'
  }
  segmentVisited = {
    LIST: true,
    PENDING: false,
    DRAFT: false
  }
  modifyModule: Concrete<keyof modulInterface>[] = ['MONTHLY_REPORT_CHILD']
  currentSegment: string = this.segement.LIST;
  pageInfo: pageInfo = {} as pageInfo;
  constructor(private childApi: ChildApiService, private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private masterApi: MasterApiService,
    private auth: AuthService) { }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.showAddBtn = this.auth.checkPermission('MONTHLY_REPORT_CHILD', 'ADD');
    this.isMk = this.auth.checkPermission('CHILD', 'MANAGE_MK_CHILD'),
    this.isHome = this.auth.checkPermission('CHILD', 'MANAGE_HOME_CHILD');
    this.pageInfo = {
      title: 'Manage Report List',
      buttonShowBtn: this.showAddBtn,
      button: {
        title: 'Add New',
        url: this.urlService.CHILD.REPORT_ADD.URL,
        queryParams: {}
      }
    }
  }


  returnZero() {
    return 0;
  }

  viewInfoHandler(id: any, data: any) {
    data.child_id = id;
    this.modalService.openModal(ChildBasicInfoComponent, data, 'modal-lg');
  }
  mapCondition(e:any){
    if(!(this.isMk && this.isHome)){
      if(this.isHome){
        e.whereField?.push({colName:'child_type',value :2,operation:'AND'});
      }else{
        e.whereField?.push({colName:'child_type',value :1,operation:'AND'});
      }
    }
    return e;
  }

  changeSegment(s: string) {
    this.currentSegment = s;
    //@ts-ignore
    const key: 'DRAFT' | 'LIST' | 'PENDING' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.segmentVisited[key] = true;
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['MONTHLY_REPORT_CHILD'], ['VIEW_ALL']) || [];
    e.whereField?.push({ colName: 'save_draft', value: '0', operation: 'AND' })
    e=this.mapCondition(e);
    return this.reportList = await this.childApi.getReportList(e)
  }

  getListPendingData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['MONTHLY_REPORT_CHILD'], ['VIEW_ALL']) || [];
    e.whereField?.push({ colName: 'status', value: '2,3', operation: 'IN' })
    e.whereField?.push({ colName: 'save_draft', value: '0', operation: 'AND' })
    e=this.mapCondition(e);
    return this.reportPendingList = await this.childApi.getReportList(e)
  }

  getMyDraftData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['MONTHLY_REPORT_CHILD'], [], []) || [];
    e.whereField?.push({ colName: 'save_draft', value: '1', operation: 'AND' })
    e=this.mapCondition(e);
    //e.whereField?.push({ colName: 'staff_report_lang.last_modify_by', value: this.auth.currentUserValue.user_id, operation: 'AND' })
    return this.reportDraftList = await this.childApi.getReportList(e)
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([UrlServices.PAGE_URL.CHILD.REPORT_ADD.URL], { queryParams: { report_id: id } })
        break;

      case 'ADD':
        this.router.navigate([UrlServices.PAGE_URL.CHILD.REPORT_ADD.URL])
        break;

      case 'VIEW':
        this.showPdfPreview(id);
        break;

      case 'DELETE':
        return this.deleteReport(id);
        break;
    }
    return Promise.resolve(true);
  }

  showPdfPreview(id: any) {
    let data: any = { payload: { child_report_id: id }, id: 5 };
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
          this.childApi.deleteReport(id).then((res: any) => {
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
