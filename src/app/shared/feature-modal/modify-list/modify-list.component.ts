import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MODIFICATION_PERMISSION, MODULE_NAME } from 'src/app/helper/class/app-constant';
import { jsonParse, mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { AccountInfoComponent } from 'src/app/modules/account/component/account-info/account-info.component';
import { ChildBasicInfoComponent } from 'src/app/modules/child/component/child-basic-info/child-basic-info.component';
import { ChildEduYearlyUpdateComponent } from 'src/app/modules/child/component/child-edu-yearly-update/child-edu-yearly-update.component';
import { ChildInfoComponent } from 'src/app/modules/child/component/child-info/child-info.component';
import { ChurchInfoComponent } from 'src/app/modules/church/component/church-info/church-info.component';
import { AllotmentInfoComponent } from 'src/app/modules/sponsor/component/allotment-info/allotment-info.component';
import { AssignInfoComponent } from 'src/app/modules/sponsor/component/assign-info/assign-info.component';
import { DonationInfoComponent } from 'src/app/modules/sponsor/component/donation-info/donation-info.component';
import { StaffInfoComponent } from 'src/app/modules/staff/component/staff-info/staff-info.component';
import { StaffTransferViewComponent } from 'src/app/modules/staff/component/staff-transfer-view/staff-transfer-view.component';
import { StaffBasicComponent } from 'src/app/shared/feature-modal/staff-basic/staff-basic.component';
import { TableListComponent } from '../../form/component/table-list/table-list.component';
import { ModalService } from '../../service/modal.service';

@Component({
  selector: 'app-modify-list',
  templateUrl: './modify-list.component.html',
  styleUrls: ['./modify-list.component.scss']
})
export class ModifyListComponent implements OnInit {
  STATUS: any = [{ label: "Rejected", key: "3", color: 'danger' },
  { label: "Accepted", key: "1", color: 'success' },
  { label: "pending", key: "2", color: 'warning' },
  ]

  PERMISSION = Object.entries(MODIFICATION_PERMISSION).map(a => {
    return { key: a[1], label: a[0], color: 'info' }
  });

  LIST_COL: tableColum[] = [
    {
      colName: 'zoneName',
      title: 'Zone/State',
      visible: false,
      colType: 'TEXT'
    },
    {
      colName: 'description',
      title: 'Description',
      sort: true,
      filter: true,
    },
    {
      colName: 'ref_id',
      title: 'Ref ID',
      filter: true,
      colType: 'VIEW_INFO'
    },
    {
      colName: 'id',
      title: 'Id',
      visible: false,
      isPrimary: true,
      colType: 'TEXT'
    },
    {
      colName: 'action_id',
      title: 'Action',
      sort: true,
      filter: true,
      colType: 'DROPDOWN',
      filterCol: {
        data: this.PERMISSION,
        type: 'DROPDOWN'
      }
    },
    {
      colName: 'module_id',
      title: 'Module',
      sort: true,
      filter: true,
      colType: 'DROPDOWN',
      filterCol: {
        data: Object.entries(MODULE_NAME).map(a => {
          return { key: a[1], label: a[0], color: 'info' }
        }),
        type: 'DROPDOWN'
      }
    },
    {
      colName: 'status',
      title: 'Status',
      sort: true,
      filter: true,
      colType: 'DROPDOWN',
      filterCol: {
        data: this.STATUS,
        type: 'DROPDOWN'
      }
    },
    {
      colName: 'created_at',
      title: 'Created',
      filter: true,
      colType: 'DATE'
    },
    {
      colName: 'created_name',
      title: 'Created By',
      colType: 'TEXT'
    },
  ];

  actionBtn: tableButton[] = [{ name: '', icon: 'icon-eye text-info', type: 'VIEW' }]
  showAddBtn: boolean = false;

  tableConfig: tableBuilder = {
    name: 'Modification Request',
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true,
  }
  @Input() module: Concrete<keyof modulInterface>[] = [];
  @Input() whereStatus: number[] = [];
  @Input() size: 'SMALL' | 'BIG' = 'BIG';
  colName: Array<any> = ['region', 'zone', 'department', 'institution', 'promotional_office', 'ad_office', 'trust', 'sponsorship_module', 'home'];
  whereColum: Array<any> = [];
  @ViewChild('tableList') tableList: TableListComponent | undefined;
  constructor(private modalService: ModalService, private auth: AuthService, private modifyRequest: ModifyService) { }

  ngOnInit(): void {
    if (this.size == 'SMALL') {
      this.tableConfig.column = [this.LIST_COL[1], this.LIST_COL[8]]
    }
    this.module.forEach(e => {
      switch (e) {
        case 'CHILD':
          // this.whereColum = ['home', 'child_type'];
           this.whereColum = [];
          break;
        case 'STAFF':
          this.whereColum = ['region', 'zone', 'department', 'ad_office', 'trust'];
          break;
        case 'SPONSOR':
          this.whereColum = ['promotional_office'];
          break;
        case 'CHURCH':
          this.whereColum = [];
          break;
        case 'SPONSORSHIP':
          // this.whereColum = ['sponsorship_module'];
          break;
        case 'ASSET':
          this.whereColum = ['region', 'zone', 'department', 'ad_office', 'trust', 'home'];
          break;
        case 'DONATION_ALLOTMENT':
          this.whereColum = ['church']
          break;
        case 'ACCOUNT':
          this.whereColum = [];
          break;
        default:
          this.whereColum = [];
          break;
      }
    });
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = [];
    if (this.module.length) {
      e.whereField = this.auth.getPermittedId(this.module, ['VERIFY'], this.whereColum);
    } else {
      // e.whereField?.push({ colName: 'created_by', value: this.auth.currentUserValue.user_id });
    }
    if (this.whereStatus.length) {
      e.whereField?.push({ colName: 'status', value: this.whereStatus, operation: 'AND' });
      if (this.module.length) {
        const module_id: Array<any> = [];
        this.module.forEach((a: Concrete<keyof modulInterface>) => {
          module_id.push(MODULE_NAME[a])
        });
        e.whereField?.push({ colName: 'module_id', value: module_id, operation: 'AND' })
      }
    }
    return await this.modifyRequest.getList(e);
  }

  tblAction = (id: string | number, type: tableAction, data: any = {}): Promise<any> => {
    switch (type) {
      case 'VIEW':
        this.viewHandler(data);
        break;
    }
    return Promise.resolve(true);
  }

  viewInfoHandler(id: any, d: any) {
    const module = +d.module_id || '';
    let styleClass = 'modal-lg';
    const data = d.request_data;
    if (!module || !id) {
      return;
    }
    let component: any;
    switch (module) {
      case MODULE_NAME.STAFF_TRANSFER:
        data.staff_emp_id = id
        component = StaffBasicComponent;
        break;
      case MODULE_NAME.STAFF:
        data.staff_emp_id = id
        component = StaffBasicComponent;
        break;
      case MODULE_NAME.CHILD:
        data.child_id = id
        component = ChildBasicInfoComponent;
        break;
      case MODULE_NAME.SPONSORSHIP:
        component = AllotmentInfoComponent;
        break;
      case MODULE_NAME.DONATION_ALLOTMENT:
        component = DonationInfoComponent;
        break;
      case MODULE_NAME.ACCOUNT:
        data.type = 'INFO'
        component = AccountInfoComponent;
        break;
    }
    this.modalService.openModal(component, data, styleClass);
  }

  viewHandler(data: any) {
    let styleClass = 'modal-xl';
    if(typeof data.request_data=='string'){
      const d = jsonParse(data.request_data);
      delete data.request_data;
      data.request_data = d;
    }
    data.request_data['updated_at'] = data.created_at;
    switch (+(data.module_id)) {
      case MODULE_NAME.STAFF_TRANSFER:
        this.openModal(StaffTransferViewComponent, data, styleClass);
        break;
      case MODULE_NAME.STAFF:
        this.openStaffModal(data);
        break;
      case MODULE_NAME.CHILD:
        this.openModal(ChildInfoComponent, data, styleClass);
        break;
      case MODULE_NAME.CHILD_EDUCATION:
        data.type = 'VERIFICATION';
        this.openModal(ChildEduYearlyUpdateComponent, data, styleClass);
        break;
      case MODULE_NAME.SPONSORSHIP:
        //if (+data.action_id == PERMISSION.ALLOTMENT) {
        this.openModal(AllotmentInfoComponent, data, styleClass);
        //}
        break;
      case MODULE_NAME.CHURCH:
        this.openModal(ChurchInfoComponent, data, styleClass);
        break;
      case MODULE_NAME.DONATION_ALLOTMENT:
        this.openModal(AssignInfoComponent, data, styleClass);
        break;
      case MODULE_NAME.ACCOUNT:
        this.openModal(AccountInfoComponent, data, styleClass);
        break;
    }
  }


  openStaffModal(data: any) {
    let styleClass = 'modal-xl';
    if (+data.action_id == MODIFICATION_PERMISSION.RELIVE) {
      data.request_data.deleted_at = mysqlDataTime();
    } else if (+data.action_id == MODIFICATION_PERMISSION.MAKE_ACTIVE) {
      data.request_data.deleted_at = null;
    }
    const component = StaffInfoComponent;
    this.openModal(component, data, styleClass);
  }


  openModal(component: any, data: any, styleClass: string = 'modal-sm') {
    this.modalService.openModal(component, data, styleClass).then(res => {
      if (res) {
        this.reloadTable();
      }
    });
  }

  reloadTable() {
    this.tableList?.reload();
  }
}
