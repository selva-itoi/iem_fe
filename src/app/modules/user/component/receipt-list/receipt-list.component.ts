import { Component, OnInit, ViewChild } from '@angular/core';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { RECEIPT_DATA } from '../../helper/user_form';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { UserApiService } from '../../services/user-api.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { AuthService } from 'src/app/helper/service/auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/shared/service/modal.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent implements OnInit {
  pageInfo: pageInfo = {} as pageInfo

  segement = {
    ACTIVE: 'Active Receipt book',
    PENDING: 'Closed Receipt book',

  }
  @ViewChild('active') active: TableListComponent | undefined;
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Volunter Edit', type: 'EDIT', permission: { moduleName: 'STAFF', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Volunter View', type: 'VIEW', permission: { moduleName: 'STAFF', actionName: 'READ' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Volunter Relieve', type: 'DELETE', permission: { moduleName: 'STAFF', actionName: 'RELIVE' } },
    { name: '', class: 'bg-info', icon: 'icon-eye', title: 'Receipt View', type: 'ADD', permission: { moduleName: 'STAFF', actionName: 'READ' } },

  ]
  RECEIPT_BOOK: tableColum[] = cloneData(RECEIPT_DATA)
  tableConfig: tableBuilder = {
    name: 'Active Receipt List',
    action: this.actionBtn,
    column: this.RECEIPT_BOOK,
    showFilter: true,
    isLazy: true
  }
  tableClosed: tableBuilder = {
    name: 'Closed Receipt List',
    action: [],
    column: this.RECEIPT_BOOK,
    showFilter: true,
    isLazy: true
  }


  currentSegment: string = '';
  segmentVisited: any = { ACTIVE: true }
  urlService = UrlServices.PAGE_URL


  constructor(private userApi: UserApiService, private auth: AuthService, private router: Router,private modalService: ModalService) { }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'Receipt book',
      buttonShowBtn: this.auth.checkPermission('USER', 'VIEW_ALL'),
      button: {
        title: 'New Receipt',
        url: this.urlService.USER.NEW_RECEIPT.URL
      }
    }
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([this.urlService.USER.NEW_RECEIPT.URL], { queryParams: { id: id } })
        break;
      case 'VIEW':
        this.router.navigate([this.urlService.USER.RECEIPT_INFO.URL], { queryParams: { id: id } })
        break;
      case 'ADD':
        this.router.navigate([this.urlService.USER.RECEIPT_DATA.URL], { queryParams: { id: id } })
        break;

      case 'DELETE':
        // this.activeid = id
        this.delete(id)
        break;
    }
    return Promise.resolve(true);
  }
  getListData = async (e: tblFilterQuery): Promise<any> => {

    return this.userApi.getreceiptdetails(e).then((res: any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        res?.result?.data.map((a: any) => {
          if (a.gender_id == 1) {
            a.gender_id = 'Male'
          }
          if (a.gender_id == 2) {
            a.gender_id = 'Female'
          }
          if (a.status == 1) {
            a.status = `<span class="badge badge-success">Active</span>`
          }
        })
      }
      return res
    })

  }
  getclosedData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = [{colName:'status',value:2}]
    return this.userApi.getreceiptdetails(e).then((res: any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        res?.result?.data.map((a: any) => {
          if (a.gender_id == 1) {
            a.gender_id = 'Male'
          }
          if (a.gender_id == 2) {
            a.gender_id = 'Female'
          }
          if (a.status == 2) {
            a.status = `<span class="badge badge-danger">Closed</span>`
          }
        })
      }
      return res
    })

  }
  delete(id:any){
    this.modalService.openConfirmDialog({ message: 'Are You Sure want to delete this volunteer ?', btnOK: 'Delete' }).then((res: any) => {
      if (res) {
        this.userApi.Recepitdelete(id)
        setTimeout(() => {
          this.active?.reload()
        },800);
      }
    })

  }


}
