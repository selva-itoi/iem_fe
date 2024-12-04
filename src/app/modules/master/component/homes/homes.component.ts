import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { MasterApiService } from '../../service/master-api.service';

@Component({
  selector: 'app-homes',
  templateUrl: './homes.component.html',
  styleUrls: ['./homes.component.scss']
})
export class HomesComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  sponsorList: any;
  LIST_COL: tableColum[] = [
    {
      colName: 'homeName',
      title: 'Name',
      sort: true,
      filter: true,
    },
    {
      colName: 'id',
      title: 'id',
      visible: false,
      sort: false,
      filter: true,
      isPrimary: true
    },
    {
      colName: 'type',
      title: 'Category',
      sort: true,
      filter: true,
      selectKeyName : 'home_typeName',
      filterCol: {
        selectKeyName: 'home_typeName',
        apiName: 'home_type',
        type: 'DROPDOWN',
        selectPrimaryKey: 'id'
    }
    },
    {
      colName: 'home_no',
      title: 'Reg No',
      sort: true,
      filter: true
    },
    {
      colName: 'mobile_no',
      title: 'Mobile No',
      sort: false,
      filter: true,
    },
    {
      colName: 'email_id',
      title: 'Email ID',
      sort: true,
      filter: true,
    },
    {
      colName: 'total',
      title: 'Total',
      sort: true,
      filter: true,
    },
    {
      colName: 'updated_at',
      title: 'Last Update',
      sort: false,
      filter: true,
      colType: 'DATE'
    },
  ];
  pageInfo: pageInfo = { title: '' };

  actionBtn: tableButton[] = [
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View', type: 'VIEW', permission: { moduleName: 'MASTER', actionName: 'MANAGE_HOMES' } },
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Edit', type: 'EDIT', permission: { moduleName: 'MASTER', actionName: 'MANAGE_HOMES' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Delete', type: 'DELETE', permission: { moduleName: 'MASTER', actionName: 'MANAGE_HOMES' } }
  ]

  dataLoading: boolean = false;
  tableConfig: tableBuilder = {
    name: 'Home List',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }

  constructor(private masterApi: MasterApiService, private router: Router,
    private modalService: ModalService, private alertService: AlertService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'Manage Homes/Project', buttonShowBtn: this.auth.checkPermission('MASTER', 'MANAGE_HOMES'), button: {
        title: 'Add New', url: this.urlService.MASTER.UPDATE_HOMES.URL,icon:'pi pi-plus',class : 'btn-primary'
      }
    }
  }


  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['MASTER'], ['MANAGE_HOMES'], []) || [];
    return this.sponsorList = await this.masterApi.getFullData('home', [], true, e).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result.data.map((a: any) => a.total = (+a.no_of_boys) + (+a.no_of_girls) )
      }
      return res;
    })
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([UrlServices.PAGE_URL.MASTER.UPDATE_HOMES.URL], { queryParams: { id: id } })
        break;
      case 'DELETE':
        return this.delete(id)
        break;
        case 'VIEW':
       this.router.navigate([UrlServices.PAGE_URL.MASTER.VIEW_HOMES.URL], { queryParams: { id: id } })
        break;
    }
    return Promise.resolve(true);
  }

  delete(id: string | number) {
    return new Promise((resolve, reject) => {
      this.modalService.openConfirmDialog({ title: 'Remove Home/Project', message: 'Are you sure to remove this Home  ?' }).then((res: any) => {
        if (res) {
          this.masterApi.saveData('home', { status: 0, id: id, deleted_at: mysqlDataTime(), last_modify_by: this.auth.currentUserValue.user_id }).then((res: ResponseData | any) => {
            if (res.statusCode == RESPONSE_CODE.SUCCESS) {
              this.alertService.showToast('Home / Project has been removed!..', 'success');
              resolve({ reload: true })
            }
          }).catch(err => {
            this.alertService.showToast('unable to complete the action', 'error');
            reject(false)
          })
        }
      });
    });
  }

}
