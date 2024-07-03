import { Component, OnInit } from '@angular/core';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { tableColum, tableButton, tableBuilder, tblFilterQuery, tableAction } from 'src/app/helper/interface/response';
import { AuthService } from 'src/app/helper/service/auth.service';
import { CHURCH_PROGRESS_REPORT } from '../../helper/church-form';
import { ChurchApiService } from '../../service/church-api.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/shared/service/modal.service';
import { ProgressReportInfoComponent } from '../progress-report-info/progress-report-info.component';

@Component({
  selector: 'app-progress-report-list',
  templateUrl: './progress-report-list.component.html',
  styleUrls: ['./progress-report-list.component.scss']
})
export class ProgressReportListComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  pageInfo: pageInfo = {} as pageInfo
  LIST_COL: tableColum[] = cloneData(CHURCH_PROGRESS_REPORT)
  segement = {
    LIST: 'Progress list',
    PENDING: 'pending',
  }
  currentSegment: string = this.segement.LIST
  segmentVisited: any = { LIST: true }
  actionBtn: tableButton[] = [
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Progress View', type: 'VIEW', permission: { moduleName: 'CHURCH', actionName: 'READ' } },
    { name: '', class: 'btn-info', icon: 'icon-paper-plane', title: 'Approve / Reject', type: 'APPROVE', condition: [{ key: 'status', operation: '==', value: 2 }] }
  ]

  tableConfig: tableBuilder = {
    name: 'Progress List',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  progressList: any
  constructor(private auth: AuthService, private churchApi: ChurchApiService, private router: Router,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'Manage Progress',
      buttonShowBtn: this.auth.checkPermission('CHURCH', 'ADD'),
      button: {
        title: 'New Progress',
        url: this.urlService.CHURCH.NEW_PROGRESS_REPORT.URL,
        queryParams: {}
      }
    }
  }
  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'VIEW':
        this.modalService.openModal(ProgressReportInfoComponent, { id: id }, 'modal-lg');
        break
      case 'APPROVE':
        this.router.navigate([this.urlService.CHURCH.NEW_PROGRESS_REPORT.URL], { queryParams: { id: id } })
        break

    }
    return Promise.resolve(true)
  }
  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = e.whereField || [];
    if(this.currentSegment == this.segement.PENDING){
      e.whereField.push({ colName: 'status', value: 2 })
    }
    return this.progressList = await this.churchApi.getProgressReportList(e);
  }
}
