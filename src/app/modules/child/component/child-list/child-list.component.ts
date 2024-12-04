import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { MODIFICATION_PERMISSION, MODULE_NAME, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, isEmptyObj, mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { SponsorshipAllotmentRefListComponent } from 'src/app/shared/feature-modal/sponsorship-allotment-ref-list/sponsorship-allotment-ref-list.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { CHILD_LIST_TBL } from '../../helper/child-form';
import { ChildApiService } from '../../service/child-api.service';
import { ChildBasicInfoComponent } from '../child-basic-info/child-basic-info.component';


@Component({
  selector: 'app-child-list',
  templateUrl: './child-list.component.html',
  styleUrls: ['./child-list.component.scss']
})
export class ChildListComponent implements OnInit {
  childList: any;
  urlService = UrlServices.PAGE_URL;
  LIST_COL = CHILD_LIST_TBL;
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Child Edit', type: 'EDIT', permission: { moduleName: 'CHILD', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Child View', type: 'VIEW', permission: { moduleName: 'CHILD', actionName: 'READ' } },
    { name: '', class: 'bg-purple', icon: 'icon-envelope', title: 'Send Email', type: 'PRINT', permission: { moduleName: 'CHILD', actionName: 'UPDATE' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Child Relieve', type: 'DELETE', permission: { moduleName: 'CHILD', actionName: 'RELIVE' } }
  ]

  inActiveActionBtn: tableButton[] = [
    { name: '', class: 'btn-primary', icon: 'icon-lock-open', type: 'ACTIVE', permission: { moduleName: 'CHILD', actionName: 'RELIVE' } }
  ]

  showAddBtn: boolean = false;

  tableConfig: tableBuilder = {
    name: 'Child list',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  outBoxListCol: tableColum[] = cloneData(this.LIST_COL).splice(0, 4);

  inActiveTblConfig: tableBuilder = {
    name: 'Child Out box',
    addBtn: false,
    column: this.outBoxListCol,
    action: this.inActiveActionBtn,
    isLazy: true,
    showFilter: true
  }
  segement = {
    LIST: 'Child list',
    MODIFYREQUEST: 'pending',
    OUTBOX: 'outbox'
  }
  segmentVisited = {
    LIST: true,
    MODIFYREQUEST: false,
    OUTBOX: false
  }
  modifyModule: Concrete<keyof modulInterface>[] = ['CHILD']
  currentSegment: string = this.segement.LIST;
  isMk: boolean = false;
  isHome: boolean = false;
  constructor(private childApi: ChildApiService, private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private modifyrequest: ModifyService,
    private navigation: NavigationService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.showAddBtn = this.auth.checkPermission('CHILD', 'ADD');
    this.isMk = this.auth.checkPermission('CHILD', 'MANAGE_MK_CHILD'),
      this.isHome = this.auth.checkPermission('CHILD', 'MANAGE_HOME_CHILD');
    if (this.isMk && this.isHome) {
      this.LIST_COL.map((a: tableColum) => { if (a.colName == 'child_type') { a.visible = true; } return a });
    }
    this.outBoxListCol.push(
      {
        colName: 'deleted_at',
        title: 'Relive at',
        sort: false,
        filter: false,
        colType: 'DATE'
      }, {
      colName: 'reason_relive',
      title: 'Reason',
      sort: false,
      filter: false,
    })
  }

  close() {
    this.navigation.back();
  }

  returnZero() {
    return 0;
  }
  changeSegment(s: string) {
    this.currentSegment = s;
    //@ts-ignore
    const key: 'OUTBOX' | 'LIST' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.segmentVisited[key] = true;
  }
  mapCondition(e: any) {
    if (!(this.isMk && this.isHome)) {
      if (this.isHome) {
        e.whereField?.push({ colName: 'child_type', value: 2, operation: 'AND' });
      } else {
        e.whereField?.push({ colName: 'child_type', value: 1, operation: 'AND' });
      }
    }
    return e;
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.auth.getPermittedId(['CHILD'], ['VIEW_ALL'], ['home', 'child_type']) || [];
    e.whereField = this.auth.getPermittedId(['CHILD'], ['VIEW_ALL']) || [];

    e = this.mapCondition(e);
    return this.childList = await this.childApi.getList(e).then((res: ResponseData | any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result.data.map((a: any) => {
          a.parent = `<strong>${a?.parent_name}</strong><br><strong class="text-info">${a?.staff_cross_id}</strong>`
        })
      }
      return res
    });
  }

  getListDeletedData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.auth.getPermittedId(['CHILD'], ['VIEW_ALL'], ['home', 'child_type']) || [];
    e.whereField = this.auth.getPermittedId(['CHILD'], ['VIEW_ALL']) || [];

    e = this.mapCondition(e);
    return this.childList = await this.childApi.getListOnlyDeleted(e)
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([this.urlService.CHILD.ADD.URL], { queryParams: { id: id } })
        break;

      case 'ADD':
        this.router.navigate([this.urlService.CHILD.ADD.URL])
        break;

      case 'VIEW':
        this.router.navigate([this.urlService.CHILD.VIEW.URL], { queryParams: { id: id } })
        break;

      case 'DELETE':
        return this.relive(id, false);
        break;

      case 'ACTIVE':
        return this.relive(id, true)
        break;
      case 'PRINT':
        this.modalService.openModal(SponsorshipAllotmentRefListComponent, { show: 'ACTIVE', child_id: id }, 'modal-lg', 1).then(async (res: any) => {
        });
        break;
    }
    return Promise.resolve(true);
  }

  viewInfoHandler(id: any, data: any) {
    data.child_id = id;
    this.modalService.openModal(ChildBasicInfoComponent, data, 'modal-lg');
  }

  apiPayloadModify(data: any, isActiveAction = false) {
    const payload: modifyApi = {} as modifyApi;
    payload.created_by = this.auth.currentUserValue.user_id,
      payload.action_id = isActiveAction ? MODIFICATION_PERMISSION.MAKE_ACTIVE : MODIFICATION_PERMISSION.RELIVE;
    payload.description = isActiveAction ? data.name + ' has Requested to Rejoin' : data.name + ' has Requested to Relieve';
    payload.ref_id = data.child_id || '';
    payload.home = data.home;
    payload.module_id = MODULE_NAME.CHILD;
    return payload;
  }


  relive(id: string | number, isActiveAction = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const title = isActiveAction ? 'Make Active' : 'Relieve',
        msg = !isActiveAction ? 'Are you sure to Relieve this Child' : 'Are you sure to Make Active this Child';
      this.modalService.openConfirmDialog({ title: title, message: msg, formField: [], isFormField: !isActiveAction }).then((dataConfirm: any) => {
        if (dataConfirm) {
          const data = this.childList.result.data.find((a: any) => a.child_id == id);
          this.childApi.checkRequestExists(data).then(res => {
            if (res) {
              const apiPayload = this.apiPayloadModify(data, isActiveAction);
              if (isActiveAction) {
                data.deleted_at = '';
              } else {
                data.deleted_at = mysqlDataTime();
              }
              const payloadData = isEmptyObj(dataConfirm) ? {} : dataConfirm;
              payloadData.staff_emp_id = data.staff_emp_id;
              this.modifyrequest.saveModification(apiPayload, payloadData).then((res) => {
              }).finally(() => resolve({ reload: true }));
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
