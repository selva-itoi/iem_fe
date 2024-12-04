import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RESPONSE_CODE, STATUS_TBL } from 'src/app/helper/class/app-constant';
import { downloadHelper } from 'src/app/helper/class/downloadHelper';
import { ResponseData, formBuilderData, tableAction, tableBuilder, tableButton, tblFilterQuery } from 'src/app/helper/interface/response';
import { userPermission } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { EditMasterComponent } from '../edit-master/edit-master.component';
import { UrlServices } from 'src/app/helper/class/url-services';
import { Router } from '@angular/router';


@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  data: any;
  urlService = UrlServices.PAGE_URL
  @Input() title: any;
  @Input() tbl: any;
  @Input() addBtn: boolean = true;
  @Input() tblCol: formBuilderData[] = {} as formBuilderData[];
  @Input() isLazy: boolean = false;
  @Input() globalFilterField: Array<any> = [];
  @Input() isAddress: boolean = false;
  @Input() getApi: string = '';
  @Input() saveApi: string = '';
  @Input() addressKeys: any = [];
  @Input() defaultEdit: boolean = true;
  showFilter: boolean = false;
  cols: Array<any> = [];
  statusArray: any = STATUS_TBL;
  @Input() hideBasic: boolean = false;
  @Input() getListApi: string = '';
  @Input() dynamicValidator = [];
  @ViewChild('tblDiv') tblDiv: undefined | TableListComponent;
  @Output() onTblAction: EventEmitter<{ id: string | number, data: tableAction }> = new EventEmitter();
  show_tbl: boolean = false;
  listData: any = [];
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Edit Info', type: 'EDIT', permission: {} as userPermission, },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View Info', type: 'VIEW', permission: {} as userPermission },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Delete Info', type: 'DELETE', permission: {} as userPermission, condition: [{ key: 'status', value: 1, operation: '==' }] },
    { name: '', icon: 'icon-lock-open text-info', title: 'Active Info', type: 'ACTIVE', permission: {} as userPermission, condition: [{ key: 'status', value: 0, operation: '==' }] }
  ]
  tableConfig: tableBuilder = {
    name: 'Master list',
    addBtn: this.addBtn,
    column: [],
    action: this.actionBtn,
    isLazy: true,
    showFilter: true,
    exportBtn: true
  }
  constructor(private masterApi: MasterApiService,
    private router: Router,
    private alertService: AlertService,
    private downloadHelper: downloadHelper,
    private modalService: ModalService) { }


  ngOnInit(): void {
    this.initTbl()
  }

  tblAction = (id: string | number, type: tableAction, segment:any): Promise<any> => {
    switch (type) {
      case 'EDIT':
      if(segment?.promotionalName && segment.promoId ){
        this.router.navigate([this.urlService.MASTER.PROMOTIONAL_OFFICE.URL], { queryParams: { id: segment.promoId } })
      }else if (this.defaultEdit) {
          this.edit(id, this.editComponent);
        }
        break;

      case 'ADD':
        this.edit();
        break;

      case 'VIEW':
        const data = this.listData.result ? this.listData.result.data.find((a: any) => a.id == id) : {};
        if (data?.status) {
          const status = data.status != 1 ? 'InActive' : 'Active';
          data.statusName = `<span class="badge badge-${data.status != 1 ? 'danger' : 'success'}" >${status}</span>`
        }
        this.modalService.openInfoModal({ formData: this.tblCol, title: `${this.title.replace(/_/gi, ' ')} Info`, sourceData: data, btn: 'Close' }, 'modal-lg');
        break;

      case 'DELETE':
        if(segment?.promotionalName && segment.promoId ){
          return this.delete(segment.promoId);
        }else{
          return this.delete(id);
        }
        break;

      case 'EXPORT':
        this.exportData()
        break;
      case 'ACTIVE':
        if(segment?.promotionalName && segment.promoId ){
          return this.delete(segment.promoId);
        }else{
          return this.delete(id, true);
        }
        break;

    }
    this.onTblAction.emit({ id: id, data: type });
    return Promise.resolve(true);
  }
  exportLoading: boolean = false
  exportData() {
    this.exportLoading = true;
    const col: any = [{ colName: 'id', title: 'ID' }];
    this.tableConfig.column.forEach((a: formBuilderData) => {
      const b: any = {};
      //@ts-ignore
      b.colName = a.colName || a.name,
        b.title = a.title;
      if (a.type == 'DATE') {
        b.type = 'DATE';
      } else if (a.type == 'select' || a.type == 'AUTOCOMPLETE' || a.type == 'MULTISELECT') {
        b.colName = a.selectKeyName || a.colName + 'Name';
      }
      if (a.type == 'checkbox') {
        b.type = 'BOOLEAN';
      }
      col.push(b);
    });
    this.masterApi.exportData(this.tbl, { col: col }).then(async (res: any) => {
      this.downloadHelper.downloadFile(res);
    }).catch(err => this.alertService.showToast('Unable to download Report', 'info'))
      .finally(() => { this.exportLoading = false });
  }


  async initTbl() {
    this.cols = [];
    //@ts-ignore
    this.tblCol = [...this.tblCol, ...[{ colName: 'status', title: 'Status', type: 'select', hidden: true, colType: 'DROPDOWN', selectKeyName: 'statusName', filterCol: { type: 'DROPDOWN', data: [{ label: 'Active', key: 1, color: 'success' }, { label: 'InActive', key: 0, color: 'danger' }] }, filter: true, sort: true, defaultValue: 1 }]];
    await this.tblCol.forEach(a => {
      if (a.filter && !this.showFilter) {
        this.showFilter = true; // if any one has filter show filter will be true
      }
      if (a.visible) {
        this.cols.push({ field: a.selectKeyName ? a.selectKeyName : a.colName, header: a.title, type: 'text', sort: a.sort ? true : false, filter: a.filter ? true : false });
      }
    });
    this.cols.push({ field: 'status', header: 'Status', type: 'status', sort: false, filter: false });
    if (!this.isLazy) {
      this.cols.push({ field: 'created_at', header: 'Date', type: 'date', sort: false, filter: false })
    }
    this.tableConfig.column = this.tblCol;
    this.tableConfig.action = this.actionBtn;
    this.tableConfig.addBtn = this.addBtn;
    this.show_tbl = true;
  }


  getListData = async (e: tblFilterQuery): Promise<any> => {
    let isFull = false;
    this.tblCol.map((a: formBuilderData) => {
      if (a.selectKeyName) {
        isFull = true;
      }
    });
    if (this.getListApi) {
      return this.listData = await this.masterApi[this.getListApi]?.(e);
    } else {
      return this.listData = await this.masterApi.getFullData(this.tbl, [], isFull, e);
    }
  }

  editComponent: any = EditMasterComponent;
  async edit(id: string | number = '', component: any = this.editComponent, agr: any = { id: id, title: this.title.replace(/_/gi, ' '), tbl: this.tbl, tblCol: this.tblCol, isAddress: this.isAddress, hideBasic: this.hideBasic, getApi: this.getApi, saveApi: this.saveApi, addressKeys: this.addressKeys }) {
    this.modalService.openModal(component, agr, 'modal-lg').then((res: any) => {
      if (res) {
        this.tblDiv?.reload();
      }
    });
  }

  delete(id: string | number, isActiveAction = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const title = isActiveAction ? 'Make Active ' : 'Remove ',
        msg = isActiveAction ? 'Are you sure to active this ' : 'Are you sure to remove this',
        toast = isActiveAction ? 'has been active!..' : 'has been removed!..'
      this.modalService.openConfirmDialog({ title: title + this.title, message: msg + this.title + ' ?' }).then((res: any) => {
        if (res) {
          this.masterApi.saveData(this.tbl, { status: +isActiveAction, id: id }).then((res: ResponseData | any) => {
            if (res.statusCode == RESPONSE_CODE.SUCCESS) {
              this.alertService.showToast(this.title + toast, 'success');
              resolve({ reload: true });
            } else
              resolve({ reload: false })
          })
        }
      }).catch(err => {
        resolve({ reload: false })
      });
    });
  }
}