import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { AppConstant, MODIFICATION_PERMISSION, MODULE_NAME, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, isEmptyObj, mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { ResponseData, formBuilderData, formDynamicValidator, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { STAFF_LIST_TBL } from '../../helper/staff_form';
import { StaffApiService } from '../../service/staff-api.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  staffList: any;
  urlService = UrlServices.PAGE_URL;
  LIST_COL: tableColum[] = cloneData(STAFF_LIST_TBL)

  actionBtn: tableButton[] = [
    { name: '', class: 'bg-indigo', icon: 'icon-cloud-download', title: 'Staff Download', type: 'DOWNLOAD', permission: { moduleName: 'STAFF', actionName: 'UPDATE' } },
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Staff Edit', type: 'EDIT', permission: { moduleName: 'STAFF', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Staff View', type: 'VIEW', permission: { moduleName: 'STAFF', actionName: 'READ' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Staff Relieve', type: 'DELETE', permission: { moduleName: 'STAFF', actionName: 'RELIVE' } }
  ]

  inActiveActionBtn: tableButton[] = [
    { name: '', icon: 'icon-lock-open text-info', type: 'ACTIVE', permission: { moduleName: 'STAFF', actionName: 'RELIVE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Staff View', type: 'VIEW', permission: { moduleName: 'STAFF', actionName: 'READ' } },
  ]

  showAddBtn: boolean = false;
  outBoxListCol: tableColum[] = cloneData(this.LIST_COL).splice(0, 5);

  tableConfig: tableBuilder = {
    name: 'Staff list',
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }

  inActiveTblConfig: tableBuilder = {
    name: 'Staff Out box',
    column: this.outBoxListCol,
    action: this.inActiveActionBtn,
    isLazy: true,
    showFilter: true
  }

  segement = {
    LIST: 'staff list',
    MODIFYREQUEST: 'pending',
    OUTBOX: 'staff outbox'
  }
  segmentVisited: any = {
    LIST: false,
    MODIFYREQUEST: false,
    OUTBOX: false
  }
  modifyModule: Concrete<keyof modulInterface>[] = ['STAFF']
  currentSegment: string = '';
  pageInfo: pageInfo = {} as pageInfo;
  isSRD: boolean = false;
  constructor(private staffApi: StaffApiService, private router: Router,
    private modalService: ModalService, private activateRoute: ActivatedRoute,
    private alertService: AlertService,
    private modifyrequest: ModifyService,
    private navigation: NavigationService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.activateRoute.fragment.subscribe((fragment: any) => {
      const a: 'LIST' = fragment ? fragment.toUpperCase() : null;
      fragment ? this.segmentVisited[a] = true : this.segmentVisited.LIST = true
      fragment ? this.currentSegment = this.segement[a] : this.currentSegment = this.segement.LIST
    })
    this.showAddBtn = this.auth.checkPermission('STAFF', 'ADD');
    const showAllot = this.auth.checkPermission('STAFF', 'VIEW_SPONSORSHIP');
    this.isSRD = (this.auth.checkPermission('MONTHLY_REPORT_STAFF', 'PROCESS') || this.auth.checkPermission('MONTHLY_REPORT_STAFF', 'VERIFY')) && !this.auth.checkPermission('STAFF', 'VERIFY');
    this.LIST_COL.map((a: any) => { if (a.colName == 'total_active_alloted') { a.visible = showAllot } return a })
    this.outBoxListCol.push(
      {
        colName: 'effect_from',
        title: 'Relieved on',
        sort: false,
        filter: false,
        colType: 'DATE'
      },
      {
        colName: 'deleted_at',
        title: 'Created on',
        sort: false,
        filter: false,
        colType: 'DATE'
      },
      {
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
    // e.whereField = this.auth.getPermittedId(['STAFF'], ['VIEW_ALL'], ['region', 'zone', 'department', 'trust', 'ad_office']) || [];
    if (this.isSRD) {
      e.whereField?.push({ colName: 'allow_sponsor_allotment', value: 1 });
    }
    return this.staffList = await this.staffApi.getList(e).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result.data.map((a: any) => {
          a.allow_sponsor_allotment = +a.allow_sponsor_allotment ? 'Yes' : 'No';
        })
      }
      return res;
    });
  }

  getListDeletedData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.auth.getPermittedId(['STAFF'], ['VIEW_ALL'], ['region', 'zone', 'department', 'ad_office', 'trust']\) || [];

    e.whereField = this.auth.getPermittedId(['STAFF'], ['VIEW_ALL']) || [];
    if (!e.sort) {
      e.sort = [{ colName: 'deleted_at', sortOrder: 'desc' }]
    }
    return this.staffList = await this.staffApi.getListOnlyDeleted(e)
  }

  tblAction = (id: string | number, type: tableAction, data: any): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([this.urlService.STAFF.ADD.URL], { queryParams: { id: id } })
        break;

      case 'ADD':
        this.router.navigate([this.urlService.STAFF.ADD.URL])
        break;

      case 'VIEW':
        this.router.navigate([this.urlService.STAFF.VIEW.URL], { queryParams: { id: id } })
        break;

      case 'DELETE':
        return this.reliveStaff(id, false);
        break;

      case 'ACTIVE':
        return this.reliveStaff(id, true)
        break;
      case 'DOWNLOAD':
        return this.staffApi.profileDownload(id, data);
        break;

    }
    return Promise.resolve(true);
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

  staff_relive: formBuilderData[] = [{
    colName: 'staff_status_id', title: 'status', apiTblName: 'staff_status', type: 'select', selectKeyName: 'staff_statusName', selectPrimaryKey: 'id', event: { name: 'change', isCallback: true, },
    apiFilter: { operation: '!=', value: '1', keyName: 'id' }, validator: [{ name: 'required', error: 'Status is Required' }]
  },
  {
    colName: 'reason_relive',
    title: 'Reason',
    validator: [{ name: 'required', error: 'Reason is Required' }]
  },
  {
    colName: 'died_on',
    title: 'Date of Death',
    validator: [],
    type: 'DATE',
    defaultValue: new Date(),
    monthNavigator: true,
    yearNavigator: true,
    dateFormat: AppConstant.DATE_FORMAT,
    dateRange: AppConstant.DEFAULT_DATE_RANGE,
  },
  {
    colName: 'effect_from',
    title: 'Effect From',
    validator: [],
    type: 'DATE',
    defaultValue: new Date(),
    monthNavigator: true,
    yearNavigator: true,
    dateFormat: AppConstant.DATE_FORMAT,
    dateRange: AppConstant.DEFAULT_DATE_RANGE,
  }]
  dynamicValidator: formDynamicValidator[] = [{
    controlName: 'staff_status_id',
    validatorControl: ['died_on'],
    hideControl: ['died_on'],
    value: '4',
    operation: '==',
    validator: [{ name: 'required' }]
  },
  {
    controlName: 'staff_status_id',
    validatorControl: ['effect_from'],
    hideControl: ['effect_from'],
    value: '4',
    operation: '!=',
    // validator: [{ name: 'required', error: 'Effect From Date is Required' }]
  }]
  reliveStaff(id: string | number, isActiveAction = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const title = isActiveAction ? 'Make Active' : 'Relieve',
        msg = !isActiveAction ? 'Are you sure to Relieve this Staff' : 'Are you sure to Make Active this Staff',
        formField: formBuilderData[] = !isActiveAction ? this.staff_relive : [{ colName: 'do_join', title: 'Date Of Join', type: 'DATE', validator: [{ name: 'required' }] }]
      this.modalService.openConfirmDialog({ title: title, message: msg, formField: formField, isFormField: true, dynamicValidator: this.dynamicValidator }).then((dataConfirm: any) => {
        if (dataConfirm) {
          const data = this.staffList.result.data.find((a: any) => a.staff_emp_id == id);
          this.staffApi.checkRequestExists(data).then(res => {
            if (res) {
              const apiPayload:any = this.apiPayloadModify(data, isActiveAction);
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