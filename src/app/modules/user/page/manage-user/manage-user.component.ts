import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { removeTableClass } from 'src/app/helper/class/utilityHelper';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { UserApiService } from '../../services/user-api.service';
import { SponsorBasicComponent } from 'src/app/shared/feature-modal/sponsor-basic/sponsor-basic.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  LIST_COL: tableColum[] = [
    {
      colName: 'user_name',
      title: 'Username',

      sort: true,
      filter: true,
      colType: 'TEXT'
    },
    {
      colName: 'mobile_no',
      title: 'Mobile',

      sort: true,
      filter: true,
    },
    {
      colName: 'fname',
      title: 'Name',

      sort: true,
      filter: true,
    },
    {
      colName: 'email_id',
      title: 'Email',
      sort: true,
      filter: true,
    },
    {
      colName: 'staff_emp_id',
      title: 'Emp ID',
      colType: 'STAFF_EMP_ID',
      sort: true,
      filter: true,
      visible: false
    },
    {
      colName: 'sponsor_id',
      title: 'Donor ID',
      colType: 'VIEW_INFO',
      sort: true,
      filter: true,
      visible: false
    },
    { colName: 'roleName', title: 'Role Name' },
    {
      colName: 'last_login_date',
      title: 'Last login',

      sort: false,
      filter: false,
      colType: 'DATE'
    },
    {
      colName: 'user_id',
      title: 'Id',
      visible: false,
      sort: false,
      isPrimary: true,
      filter: false,
      colType: 'TEXT'
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
    { name: '', class: 'btn-info', icon: 'icon-pencil', type: 'EDIT', permission: { moduleName: 'USER', actionName: 'UPDATE' } },
    { name: '', icon: 'icon-lock text-danger', type: 'INACTIVE', permission: { moduleName: 'USER', actionName: 'DELETE' } }
  ]
  inActiveActionBtn: tableButton[] = [
    { name: '', icon: 'icon-lock-open text-info', type: 'ACTIVE', permission: { moduleName: 'USER', actionName: 'DELETE' } }
  ]
  showAddBtn: boolean = false;

  tableConfig: tableBuilder = {
    name: 'User List',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true,
    globalFilter: false
  }
  inActiveTableConfig = JSON.parse(JSON.stringify(this.tableConfig));
  segement = {
    LIST: 'All User',
    STAFF: 'staff',
    SPONSOR: 'Sponsor',
    INACTIVE: 'InActive'
  }
  segmentVisited: any = {
    LIST: true,
  }
  currentSegment: string = this.segement.LIST;
  @ViewChild('tableList') tableList: TableListComponent | undefined;
  @ViewChild('tableInActiveList') tableInActiveList: TableListComponent | undefined;
  constructor(private userApi: UserApiService,
    private elRef: ElementRef,
    private auth: AuthService,
    private alertService: AlertService,
    private router: Router,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.showAddBtn = this.auth.checkPermission('USER', 'ADD');
    this.inActiveTableConfig.addBtn = false;
    this.inActiveTableConfig.action = this.inActiveActionBtn;
    //this.getData();
  }

  viewInfoHandler(id: any, data: any) {
    data.sponsor_id = id;
    this.modalService.openSponsorInfo(data)
  }
  
  ngAfterViewInit() {
    removeTableClass(this.elRef);
  }

  tblAction = (id: string | number, type: tableAction, data: any = {}): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([UrlServices.PAGE_URL.USER.ADD.URL], { queryParams: { id: id } })
        break;
      case 'INACTIVE':
        this.delete(id);
        break;
      case 'ACTIVE':
        this.delete(id, true);
        break;
    }
    return Promise.resolve(true);
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = [];
    if (this.currentSegment == this.segement.STAFF) {
      e.whereField?.push({ colName: 'staff_fk_id is not null ', value: null })
    }
    if (this.currentSegment == this.segement.SPONSOR) {
      e.whereField?.push({ colName: 'sponsor_fk_id is not null ', value: null })
    }
    return await this.userApi.getAllUser(e);
  }

  getListInActiveData = async (e: tblFilterQuery): Promise<any> => {
    return await this.userApi.getAllInactive(e);
  }

  reloadTable() {
    this.tableList?.reload();
  }

  delete(id: string | number, makeActive = false) {
    let msg = 'Are you sure to lock this User',
      title = 'Remove User',
      apiUrl: 'deleteUser' | 'makeActive' = 'deleteUser';

    if (makeActive) {
      msg = 'Are you sure to Unlock this User';
      title = 'Make Active';
      apiUrl = 'makeActive';
    }

    this.modalService.openConfirmDialog({ message: msg, title: title }).then((res: any) => {
      if (res) {
        this.userApi[apiUrl](id).then((res: ResponseData | any) => {
          if (res.statusCode == RESPONSE_CODE.SUCCESS) {
            if (makeActive) {
              this.tableInActiveList?.reload();
              this.alertService.showToast('User has been Active!..', 'success');
            } else {
              this.reloadTable();
              this.alertService.showToast('User has been Removed!..', 'success');
            }
          } else {
            this.alertService.showToast("Unable to process Request", 'error');
          }
        })
      }
    }).catch(err => {
      this.alertService.showToast("We could'nt complete your request!..", 'error');
    });
  }

  returnZero() {
    return 0;
  }
  changeSegment(s: string) {
    if(this.segement.STAFF == s){
      this.LIST_COL.map((a:any) => {if(a.colName == 'staff_emp_id') a.visible = true; return a});
    }
    if(this.segement.SPONSOR == s){
      this.LIST_COL.map((a:any) => {if(a.colName == 'sponsor_id') a.visible = true; return a});
    }
    this.currentSegment = s;
    //@ts-ignore
    const key: 'OUTBOX' | 'LIST' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.segmentVisited[key] = true;
  }
}
