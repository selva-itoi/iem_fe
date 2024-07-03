import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { NEW_PROGRESS_FORM, PROGRESS_LIST } from '../../helper/staff_form';
import { ModalService } from 'src/app/shared/service/modal.service';
import { StaffReportApiService } from '../../service/staff-report-api.service';
import { ProgressReportInfoComponent } from '../progress-report-info/progress-report-info.component';
import { AuthService } from 'src/app/helper/service/auth.service';

@Component({
  selector: 'app-goals-report-list',
  templateUrl: './goals-report-list.component.html',
  styleUrls: ['./goals-report-list.component.scss']
})
export class GoalsReportListComponent implements OnInit {

  urlService = UrlServices.PAGE_URL
  pageInfo: pageInfo = {} as pageInfo
  LIST_COL: tableColum[] = cloneData(PROGRESS_LIST).filter((a: any) => a.colName != 'report_date')
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Goals Edit', type: 'EDIT', permission: { moduleName: 'CHILD', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Goals View', type: 'VIEW', permission: { moduleName: 'CHILD', actionName: 'READ' } }]
  tableConfig: tableBuilder = {
    name: 'Child list',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
  }
  goalsData: any
  segment = {
    ALL: 'All',
    PENDING: 'Pending'
  }
  segmentVisited: any = {}
  currentSegment: string = this.segment.ALL;
  staff_id: any
  info_message: any
  constructor(private staffReportApi: StaffReportApiService, private router: Router, private auth: AuthService,
    private modalService: ModalService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let queryId = this.activatedRoute.snapshot.queryParams.id || '';
    let queryParams: any = {};
    if (queryId == 'my_report') {
      this.staff_id = this.auth.currentUserValue.staff_fk_id;
      // this.showAddBtn = true;
      queryParams = { id: 'my_report' };
      this.info_message = this.staff_id ? '' : 'You are not a Staff';
    }
    this.pageInfo = {
      title: 'Manage Goals Report', buttonShowBtn: true,
      button: {
        title: 'New goal Report',
        url: this.urlService.STAFF.NEW_GOALS_REPORT.URL,
        icon: 'pi pi-plus',
        queryParams: queryParams
      }
    }
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.auth.getPermittedId(['CHILD'], ['VIEW_ALL'], ['home']) || [];
    if (this.staff_id) {
      e.queryParams = e.queryParams || [];
      e.queryParams.push({ colName: 'staff_fk_id', value: this.staff_id, matchMode: 'equals', operation: 'AND' });
    }
    return this.goalsData = await this.staffReportApi.getGoalReportList(e).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res?.result?.data.map((a: any) => {
          a.from_date = new Date(a.from_date).getFullYear() || a.from_date;
          return a
        })
      }
      return res
    })
  }

  tblAction = (id: string | number, type: tableAction, data: any): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([this.urlService.STAFF.NEW_GOALS_REPORT.URL], { queryParams: { id: id } })
        break
      case 'VIEW':
        this.router.navigate([this.urlService.STAFF.PROGRESS_REPORT_INFO.URL], { queryParams: { id: id, type: 'goal' } })
        // this.modalService.openModal(ProgressReportInfoComponent, data, 'modal-lg')
        break
    }
    return Promise.resolve(true);
  }

}
