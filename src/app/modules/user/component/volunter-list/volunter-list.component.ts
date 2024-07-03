import { Component, OnInit, ViewChild } from '@angular/core';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilderData, formDynamicValidator, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { NEW_VOLUNTER, VOLUNTER_LIST_COL } from '../../helper/user_form';
import { AuthService } from 'src/app/helper/service/auth.service';
import { UrlServices } from 'src/app/helper/class/url-services';
import { Router } from '@angular/router';
import { UserApiService } from '../../services/user-api.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { ModalService } from 'src/app/shared/service/modal.service';
import { NewVolunterComponent } from '../new-volunter/new-volunter.component';

@Component({
  selector: 'app-volunter-list',
  templateUrl: './volunter-list.component.html',
  styleUrls: ['./volunter-list.component.scss']
})
export class VolunterListComponent implements OnInit {

  urlService = UrlServices.PAGE_URL
  activeid:any
  requiredField = ['volunter_name', 'mobile_no', 'promotionl_office', 'gender']
  // LIST_COL: formBuilderData[] = [...cloneData(NEW_VOLUNTER).filter((a: any) => this.requiredField.includes(a.colName)), ...[{ colName: 'created_at', title: 'Created On', colType: 'DATE', filter: true, sort: true }, { colName: 'updated_at', title: 'Updated On', colType: 'DATE', filter: true, sort: true }]]
  LIST_COL: tableColum[] = cloneData(VOLUNTER_LIST_COL)
  pageInfo: pageInfo = {} as pageInfo
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Volunter Edit', type: 'EDIT', permission: { moduleName: 'STAFF', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Volunter View', type: 'VIEW', permission: { moduleName: 'STAFF', actionName: 'READ' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Volunter Relieve', type: 'DELETE', permission: { moduleName: 'STAFF', actionName: 'RELIVE' } }
  ]
  actionBtnInactive: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Volunter Active', type: 'EDIT', permission: { moduleName: 'STAFF', actionName: 'UPDATE' } },
  ]


  tableConfig: tableBuilder = {
    name: 'Area Secretary List',
    action: this.actionBtn,
    column: this.LIST_COL,
    showFilter: true,
    isLazy: true
  }
  tableConfigInactive: tableBuilder = {
    name: 'Volunter Inactive List',
    action: this.actionBtnInactive,
    column: this.LIST_COL,
    showFilter: true,
    isLazy: true
  }
  segement = {
    ACTIVE: 'Active Account',
    PENDING: 'In Active',

  }

  @ViewChild('pending') pending: NewVolunterComponent | undefined

  currentSegment: string = '';
  segmentVisited: any = { ACTIVE: true }
  volunterList: any
  constructor(private auth: AuthService, private router: Router, private userApi: UserApiService,private modalService: ModalService) {
    this.pageInfo = {
      title: 'Manage Area Secretary',
      buttonShowBtn: this.auth.checkPermission('USER', 'VIEW_ALL'),
      button: {
        title: 'New Area Secretary',
        icon: 'pi pi-plus',
        url: this.urlService.USER.NEW_VOLUNTER.URL
      }
    }
  }

  ngOnInit(): void {
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.auth.getPermittedId(['CHILD'], ['VIEW_ALL'], ['home']) || [];
    e.whereField = [{ colName: 'status', value: 1 }]

    return this.volunterList = await this.userApi.getListVolunter(e).then((res: any) => {
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
  getpendingData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = [{ colName: 'status', value: 0 }]
    return this.volunterList = await this.userApi.getListVolunter(e).then((res: any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        res?.result?.data.map((a: any) => {
          if (a.gender_id == 1) {
            a.gender_id = 'Male'
          }
          if (a.gender_id == 2) {
            a.gender_id = 'Female'
          }
          if (a.status == 0) {
            a.status = `<span class="badge badge-danger">In Active</span>` 
           }
        })
      }
      return res
    })

  }


  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([this.urlService.USER.NEW_VOLUNTER.URL], { queryParams: { id: id } })
        break;
      case 'VIEW':
        this.router.navigate([this.urlService.USER.VIEW_VOLUNTER.URL], { queryParams: { id: id } })
        break;

      case 'DELETE':
        this.activeid = id
        this.delete(id)
        break;
    }
    return Promise.resolve(true);
  }
  tblActioninactive = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.activeid = id
        this.activevolunteer(id)
        break;
    
    }
    return Promise.resolve(true);
  }
  deletepayload(){
    const data:any = {}
    data.id =  this.activeid
    data.status = 0
    return data
  }
  delete(id:any){
    this.modalService.openConfirmDialog({ message: 'Are You Sure want to delete this volunteer ?', btnOK: 'Delete' }).then((res: any) => {
      if (res) {
        this.userApi.volunteerDelete(this.deletepayload()) 
      }
    })

  }
  
  payload(){
   const data:any = {}
   data.id =  this.activeid 
   data.status = 1
   return data
  }
  
  activevolunteer(id:any){
    this.modalService.openConfirmDialog({ message: 'Are You Sure want to Active this Volunteer ?', btnOK: 'Active' }).then((res: any) => {
      if (res) { 
        this.userApi.volunteerDelete(this.payload())
    }
    })
  }
 
}
