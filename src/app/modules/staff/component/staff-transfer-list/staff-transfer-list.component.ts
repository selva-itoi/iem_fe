import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MODIFICATION_PERMISSION, MODULE_NAME } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { StaffApiService } from '../../service/staff-api.service';
import { StaffTransferViewComponent } from '../staff-transfer-view/staff-transfer-view.component';

@Component({
  selector: 'app-staff-transfer-list',
  templateUrl: './staff-transfer-list.component.html',
  styleUrls: ['./staff-transfer-list.component.scss']
})
export class StaffTransferListComponent implements OnInit {
  urlService=UrlServices.PAGE_URL
  pageInfo: pageInfo = {
    title: 'All Staff Transfer',
    buttonShowBtn: true,
    button: {
      title: 'New Transfer',
      url: this.urlService.STAFF.TRANSFER_ADD.URL
    }
  }
  transferList: any;
  LIST_COL: tableColum[] = [
    {
      colName: 'transfer_ref',
      title: 'Ref ID',
      
      sort: false,
      isPrimary: true,
      filter: true,
    },
    // {
    //   colName: 'id',
    //   title: 'id',
    //   visible: false,
    //   isPrimary: true,
    // },
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
      colName: 'email_id',
      title: 'Email',
      
      sort: true,
      filter: true,
    },
    {
      colName: 'updated_at',
      title: 'Last Update',
      
      sort: true,
      filter: false,
      colType: 'DATE'
    },
  ];

  actionBtn: tableButton[] = [
    { name: '', icon: 'icon-eye text-info', title: 'Staff Transfer View', type: 'VIEW', permission: { moduleName: 'STAFF_TRANSFER', actionName: 'READ' } },
  ]

  showAddBtn: boolean = false;

  tableConfig: tableBuilder = {
    name: 'Stff list',
    addBtn: true,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  segement = {
    LIST: 'Transfer list',
    MODIFYREQUEST: 'pending',
  }
  segmentVisited = {
    LIST: true,
    MODIFYREQUEST: false,
  }
  modifyModule: Concrete<keyof modulInterface>[] = ['STAFF_TRANSFER']
  currentSegment: string = this.segement.LIST;
  constructor(private staffApi: StaffApiService, private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private modifyrequest: ModifyService,
    private auth: AuthService) { }

  ngOnInit(): void { }

  returnZero() {
    return 0;
  }

  changeSegment(s: string) {
    this.currentSegment = s;
    //@ts-ignore
    const key: 'MODIFYREQUEST' | 'LIST' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.segmentVisited[key] = true;
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.auth.getPermittedId(['STAFF_TRANSFER'], ['VIEW_ALL'], ['region', 'zone', 'department', 'ad_office', 'trust']) || [];
    e.whereField = this.auth.getPermittedId(['STAFF_TRANSFER'], ['VIEW_ALL']) || [];

    return this.transferList = await this.staffApi.getListTransfer(e)
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {

      case 'ADD':
        this.router.navigate([UrlServices.PAGE_URL.STAFF.TRANSFER_ADD.URL])
        break;

      case 'VIEW':
        this.modalService.openModal(StaffTransferViewComponent, { id: id }, 'modal-xl');
        break;
    }
    return Promise.resolve(true);
  }


  apiPayloadModify(data: any, isActiveAction = false) {
    const payload: modifyApi = {} as modifyApi;
    payload.created_by = this.auth.currentUserValue.user_id,
      payload.action_id = MODIFICATION_PERMISSION.ADD;
    payload.description = data.name + ' has Requested to Transfer';
    payload.ref_id = data.staff_emp_id || '';
    payload.department = data.department;
    payload.zone = data.zone;
    payload.region = data.region;
    payload.module_id = MODULE_NAME.STAFF_TRANSFER;
    return payload;
  }

}