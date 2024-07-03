import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { MODIFICATION_PERMISSION, MODULE_NAME, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { ResponseData, formField, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { CHURCH_LIST_TBL } from '../../helper/church-form';
import { ChurchApiService } from '../../service/church-api.service';
import { ChurchBasicComponent } from '../church-basic/church-basic.component';

@Component({
  selector: 'app-church-list',
  templateUrl: './church-list.component.html',
  styleUrls: ['./church-list.component.scss']
})
export class ChurchListComponent implements OnInit {

  churchList: any;
  urlService = UrlServices.PAGE_URL;
  LIST_COL = CHURCH_LIST_TBL;

  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Church Edit', type: 'EDIT', permission: { moduleName: 'CHURCH', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Church View', type: 'VIEW', permission: { moduleName: 'CHURCH', actionName: 'READ' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Church Relieve', type: 'DELETE', permission: { moduleName: 'CHURCH', actionName: 'RELIVE' } }
  ]

  inActiveActionBtn: tableButton[] = [
    { name: '', class: 'btn-primary', icon: 'icon-lock-open', type: 'ACTIVE', permission: { moduleName: 'CHURCH', actionName: 'RELIVE' } }
  ]

  showAddBtn: boolean = false;

  tableConfig: tableBuilder = {
    name: 'Church list',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  outBoxListCol: tableColum[] = JSON.parse(JSON.stringify(this.LIST_COL));

  inActiveTblConfig: tableBuilder = {
    name: 'Church Out box',
    addBtn: false,
    column: this.outBoxListCol,
    action: this.inActiveActionBtn,
    isLazy: true,
    showFilter: true
  }

  segement = {
    LIST: 'Church list',
    MODIFYREQUEST: 'pending',
    OUTBOX: 'outbox'
  }
  currentSegment: string = this.segement.LIST;
  segmentVisited: any = { LIST: true }
  modifyModule: Concrete<keyof modulInterface>[] = ['CHURCH']
  pageInfo: pageInfo = {} as pageInfo
  constructor(private churchApi: ChurchApiService, private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private modifyrequest: ModifyService,
    private navigation: NavigationService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.showAddBtn = this.auth.checkPermission('CHURCH', 'ADD');
    this.pageInfo = {
      title: 'Manage Church View All',
      buttonShowBtn: this.showAddBtn,
      button: {
        title: 'New Church',
        url: this.urlService.CHURCH.ADD.URL,
        queryParams: {}
      }
    }
    this.outBoxListCol.push({
      colName: 'reason_relive',
      title: 'Reason',

      sort: false,
      filter: false,
    })
  }

  close() {
    this.navigation.back();
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['CHURCH'], ['VIEW_ALL']) || [];
    return this.churchList = await this.churchApi.getList(e).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result?.data.map((a: any) => {
          a.is_donation_allow = +a.is_donation_allow ? 'Yes' : 'No'
        })
      }
      return res
    })
  }

  getListDeletedData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['CHURCH'], ['VIEW_ALL']) || [];
    return this.churchList = await this.churchApi.getListOnlyDeleted(e)
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([this.urlService.CHURCH.ADD.URL], { queryParams: { id: id } })
        break;

      case 'ADD':
        this.router.navigate([this.urlService.CHURCH.ADD.URL])
        break;

      case 'VIEW':
        this.router.navigate([this.urlService.CHURCH.VIEW.URL], { queryParams: { id: id } })
        break;

      case 'DELETE':
        return this.reliveStaff(id, false);
        break;

      case 'ACTIVE':
        return this.reliveStaff(id, true)
        break;
    }
    return Promise.resolve(true);
  }

  viewInfoHandler(id: any, data: any) {
    data.church_id = id;
    this.modalService.openModal(ChurchBasicComponent, data, 'modal-lg');
  }

  apiPayloadModify(data: any, isActiveAction = false) {
    const payload: modifyApi = {} as modifyApi;
    payload.created_by = this.auth.currentUserValue.user_id,
      payload.action_id = isActiveAction ? MODIFICATION_PERMISSION.MAKE_ACTIVE : MODIFICATION_PERMISSION.RELIVE;
    payload.description = isActiveAction ? data.name + ' has Requested to Rejoin' : data.name + ' has Requested to Relieve';
    payload.ref_id = data.staff_emp_id || '';
    payload.department = data.department;
    payload.zone = data.zone;
    payload.region = data.region;
    payload.module_id = MODULE_NAME.STAFF;
    return payload;
  }



  reliveStaff(id: string | number, isActiveAction = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const title = isActiveAction ? 'Make Active' : 'Relieve',
        msg = !isActiveAction ? 'Are you sure to Relieve this Staff' : 'Are you sure to Make Active this Staff';
      const formFiled: formField[] = [{
        label: 'Reason',
        isRequired: true,
        controlName: 'reason_relive',
        type: 'TEXT',
        validator: [{ error: 'Reason for leave is required', name: 'required' }]
      }];

      this.modalService.openConfirmDialog({ title: title, message: msg, formField: [], isFormField: !isActiveAction }).then((res: any) => {
        if (res) {
          const data = this.churchList.result.data.find((a: any) => a.staff_emp_id == id);
          this.churchApi.checkRequestExists(data).then(res => {
            if (res) {
              const apiPayload = this.apiPayloadModify(data, isActiveAction);
              if (typeof res === 'object') {
                Object.assign(data, res)
              }
              this.modifyrequest.saveModification(apiPayload, data).then((res) => {
                if (res) {
                  //this.childApi.updateRequest(data.staff_emp_id, { modify_request: true });
                }
              });
              resolve({ reload: true })
            } else {
              this.alertService.showToast("Some Request are pending to approve, you can't make new request ", 'info');
              resolve({ reload: false })
            }
          })
        }
      }).catch(err => {
        resolve({ reload: false })
      });
    });

  }

}
