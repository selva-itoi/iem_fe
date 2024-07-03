import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { NEW_PROGRESS_FORM, PROGRESS_LIST } from '../../helper/staff_form';
import { StaffApiService } from '../../service/staff-api.service';
import { StaffReportApiService } from '../../service/staff-report-api.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { AuthService } from 'src/app/helper/service/auth.service';

@Component({
  selector: 'app-progress-report-list',
  templateUrl: './progress-report-list.component.html',
  styleUrls: ['./progress-report-list.component.scss']
})
export class ProgressReportListComponent implements OnInit {

  pageInfo: pageInfo = {} as pageInfo
  LIST_COL: tableColum[] = cloneData(PROGRESS_LIST)
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Progress Edit', type: 'EDIT', permission: { moduleName: 'MONTHLY_REPORT_STAFF', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Progress View', type: 'VIEW', permission: { moduleName: 'MONTHLY_REPORT_STAFF', actionName: 'READ' } },]
  tableConfig: tableBuilder = {
    name: 'Child list',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
  }
  progressList: any
  urlService = UrlServices.PAGE_URL
  segment = {
    ALL: 'All',
    PENDING: 'Pending'
  }
  info_message : any = '';
  segmentVisited: any = {}
  currentSegment: string = this.segment.ALL;
  staff_id:any ='';
  constructor(private staffReportApi: StaffReportApiService, private router: Router,private activatedRoute : ActivatedRoute,private auth : AuthService) { }

  ngOnInit(): void {
    let queryId = this.activatedRoute.snapshot.queryParams.id || '';
    let queryParams:any ={};
      if (queryId == 'my_report') {
        this.staff_id = this.auth.currentUserValue.staff_fk_id;
        // this.showAddBtn = true;
        queryParams = { id: 'my_report' };
        this.info_message = this.staff_id ? '' : 'You are not a Staff';
      }
    this.pageInfo = {
      title: 'Manage Progress Report', buttonShowBtn: true,
      button: {
        title: 'New Progress Report',
        url: this.urlService.STAFF.NEW_PROGRESS_REPORT.URL,
        icon: 'pi pi-plus',
        queryParams : queryParams
      }
    }
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.auth.getPermittedId(['CHILD'], ['VIEW_ALL'], ['home']) || [];
    if (this.staff_id) {
      e.queryParams = e.queryParams || [];
      e.queryParams.push({ colName: 'staff_fk_id', value: this.staff_id, matchMode: 'equals', operation: 'AND' });
    }
    return this.progressList = await this.staffReportApi.getProgressReportList(e).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result?.data?.map((a: any) => {
          a.from_date = new Date(a.report_date).getFullYear()
          a.report_date = new Date(a.report_date).getMonth() + 1
        })
      }
      return res
    })
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([this.urlService.STAFF.NEW_PROGRESS_REPORT.URL], { queryParams: { id: id } })
        break
      case 'VIEW':
        this.router.navigate([this.urlService.STAFF.PROGRESS_REPORT_INFO.URL], { queryParams: { id: id, type: 'progress' } })
        // this.modalService.openModal(ProgressReportInfoComponent, data, 'modal-lg')
        break
    }
    return Promise.resolve(true);
  }
}
