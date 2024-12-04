import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilderData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { ACCOUNT_FORM, ACCOUNT_FORM_table } from '../../helper/account-form';
import { AccountApiService } from '../../service/account-api.service';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {

  urlService = UrlServices.PAGE_URL
  pageInfo: pageInfo = {} as pageInfo;
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Edit', type: 'EDIT',  condition: [{ key: 'status', value: 3, operation: '!=' }] },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View', type: 'VIEW', condition: [{ key: 'status', value: 3, operation: '!=' }] },
  ]
  LIST_COL: formBuilderData[] = cloneData(ACCOUNT_FORM_table).map((a: any) => { a.filter = true, a.sort = true; return a })
  tableConfig: tableBuilder = {
    name: 'Account List',
    action: this.actionBtn,
    column: this.LIST_COL,
    showFilter: true,
    isLazy: true
  }
  LOG_COL: tableColum[] = [{ colName: 'account_name', title: 'Account' }, { colName: 'description', title: 'Description' },
  { colName: 'created_byName', title: 'Created By' }, { colName: 'created_at', title: 'Created On' }]
  LogTbleConfig: tableBuilder = {
    name: 'Account Log List',
    action: [],
    column: this.LOG_COL,
    // showFilter: true
    isLazy: true
  }
  action_COL = cloneData(this.LIST_COL).toSpliced(7, 0, { colName: 'des_notification', title: 'Description' })
  actionTblConfig: tableBuilder = {
    name: 'Account Action List',
    action: [{ name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View', type: 'VIEW' }],
    column: this.action_COL,
    showFilter: true,
  }
  segement = {
    ACTIVE: 'Active Account',
    MASTER:'Master Account',
    PENDING: 'Pending',
    CLOSED: 'Closed Account',
    // LOG: 'Log',
    // ACTION: 'Action Needed'
  }
  currentSegment: string = '';
  segmentVisited: any = { ACTIVE: true }
  modifyModule: Concrete<keyof modulInterface>[] = ['ACCOUNT']
  constructor(private accountApi: AccountApiService,
    private router: Router) { }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'Manage Account',
      buttonShowBtn: true,
      button: {
        title: 'New Account', url: this.urlService.ACCOUNT.NEW_ACCOUNT.URL,
        icon: 'pi pi-plus'
      }
    }
  }

  tblAction = (id: string | number, type: tableAction, data: any): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([this.urlService.ACCOUNT.NEW_ACCOUNT.URL], { queryParams: { id: id } })
        break;
      case 'VIEW':
        this.router.navigate([this.urlService.ACCOUNT.ACCOUNT_VIEW.URL], { queryParams: { id: id } })
        break;
      case 'APPROVE':

        break;
    }
    return Promise.resolve(true);
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    if (this.currentSegment == this.segement.CLOSED) {
      e.whereField = [{ colName: 'status', value: 3 }]
    } 
     if(this.currentSegment == this.segement.PENDING) {
      e.whereField = [{ colName: 'status', value: 2 }]
    }if(this.currentSegment == this.segement.ACTIVE){
      e.whereField = [{ colName: 'status', value: 1 }]
    }
    if(this.currentSegment == this.segement.MASTER){
      e.whereField = [{ colName: 'category', value: 1 }]
    }
    return this.accountApi.getList(e).then((res:any)=>{
        if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
          res?.result?.data.map((a: any) => {
            if (a.type == 6) {
              a.type = 'Staff'
            }
            if (a.type == 7) {
              a.type = 'Area Secretary'
            }
            if (a.type == 4) {
              a.type = 'Church Ministry Area'
            }
            if (a.type == 1) {
              a.type = 'Master'
            }
            if (a.status == 1) {
             a.status = `<span class="badge badge-success">Active</span>`
            }
            if (a.status == 2) {
              a.status = `<span class="badge badge-warning">Hold</span>`
             }
             if (a.status == 3) {
              a.status = `<span class="badge badge-danger">Closed</span>`
             }
          })
        }
        return res
      })


  }
  getListActionData = async (e: tblFilterQuery): Promise<any> => {
    return this.accountApi.getListNotification() || [];
  }
  getListLogData = async (e: tblFilterQuery): Promise<any> => {
    return this.accountApi.getListLog(e).then((res:ResponseData) => {
      if(res?.statusCode == RESPONSE_CODE.SUCCESS){
        res?.result?.data.map((a:any) => {
          a.account_name = `<span><strong>${a?.accountName || ''}</strong></span><br><span><strong class="text-info" >${a?.account_code || ''}</strong></span>`
        })
      }
      return res
    }) ;
  }
}
