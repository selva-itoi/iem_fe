import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { MODIFICATION_PERMISSION, MODULE_NAME, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { formBuilder, ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { SponsorBasicComponent } from 'src/app/shared/feature-modal/sponsor-basic/sponsor-basic.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { SPONSORSHIP_TABLE } from '../../helper/sponsor-form';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { AllotmentInfoComponent } from '../allotment-info/allotment-info.component';

@Component({
  selector: 'app-sponsorship-list',
  templateUrl: './sponsorship-list.component.html',
  styleUrls: ['./sponsorship-list.component.scss']
})
export class SponsorshipListComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  sponsorshipList: any;
  LIST_COL: tableColum[] = SPONSORSHIP_TABLE
  pageInfo: pageInfo = { title: 'Manage Sponsorship' }
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Sponsorship Edit', type: 'EDIT', permission: { moduleName: 'SPONSORSHIP', actionName: 'UPDATE' }, condition: [{ key: 'is_edit', operation: '==', value: true }] },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Sponsorship View', type: 'VIEW', permission: { moduleName: 'SPONSORSHIP', actionName: 'READ' } },
    { name: '', icon: 'icon-user text-success', title: 'Sponsorship Allotment', type: 'ACTIVE', permission: { moduleName: 'SPONSORSHIP', actionName: 'ALLOTMENT' }, condition: [{ key: 'freq_payment_id', operation: '>=', value: '2', join: '&&' }, { key: 'status', operation: '!=', value: '1' }] },
    { name: '', class: 'bg-pink', icon: 'icon-logout', title: 'Sponsorship Relieve All', type: 'RELIVE', permission: { moduleName: 'SPONSORSHIP', actionName: 'RELIVE' }, condition: [{ key: 'total_alloted', operation: '!=', value: '0', join: '&&' }, { key: 'status', operation: '!=', value: '1' }] },
  ]
  //commands -> [{user_id : 'name'}],{status : fk_staff_id : staffName : dateTime }}
  inActiveActionBtn: tableButton[] = [
    { name: '', icon: 'icon-lock-open text-info', type: 'ACTIVE', permission: { moduleName: 'SPONSORSHIP', actionName: 'RELIVE' } }
  ]

  tableConfig: tableBuilder = {
    name: 'Sponsorship list',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  outBoxListCol: tableColum[] = cloneData(this.LIST_COL);

  inActiveTblConfig: tableBuilder = {
    name: 'Sponsorship Out box',
    addBtn: false,
    column: this.outBoxListCol,
    action: this.inActiveActionBtn,
    isLazy: true,
    showFilter: true
  }
  segment = {
    LIST: 'All',
    ACTIVE: 'Active',
    MODIFYREQUEST: 'Pending',
  }
  segmentVisited:any = {}
  modifyModule: Concrete<keyof modulInterface>[] = ['SPONSORSHIP']
  currentSegment: string = this.segment.LIST;
  globalWhere: any = [];
  constructor(private sponsorApi: SponsorApiService, private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private modifyrequest: ModifyService,
    private navigation: NavigationService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.pageInfo.button = { title: 'New Sponsorship', url: this.urlService.SPONSOR.SPONSORSHIP_ADD.URL };
    this.pageInfo.buttonShowBtn = this.auth.checkPermission('SPONSORSHIP', 'ADD');
    this.outBoxListCol.push({
      colName: 'reason_relive',
      title: 'Reason',
      sort: false,
      filter: false,
    })
    this.globalWhere = this.auth.getPermittedId(['SPONSORSHIP'], ['VIEW_ALL'], ['promotional_office', 'sponsorship_module']) || [];
    this.globalWhere.forEach((e: any) => {
      if (e.colName == 'sponsorship_module') {
        const val = Array.isArray(e.value) ? e.value.includes('2') : +e.value == 2;
        if (val) {
          const isMk = this.auth.checkPermission('CHILD', 'MANAGE_MK_CHILD'),
            isHome = this.auth.checkPermission('CHILD', 'MANAGE_HOME_CHILD');
          if (isMk || isHome) {
            const cond = { colName: 'child_type', value: 1 };
            if (isMk) {
              this.globalWhere.push(cond);
            } else {
              cond.value = 2;
              this.globalWhere.push(cond);
            }
          }
        }
      }
    });
  }

  close() {
    this.navigation.back();
  }
  viewInfoHandler(id: any, data: any) {
    data.sponsor_id = data.sponsor_id;
    this.modalService.openSponsorInfo(data)
  }


  changeSegment(s: string) {
    this.currentSegment = s;
    //@ts-ignore
    const key: 'OUTBOX' | 'LIST' = Object.keys(this.segment).find((k: any) => this.segment[k] === s);
    this.segmentVisited[key] = true;
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e = this.mapQuery(e);
    return this.sponsorshipList = await this.sponsorApi.sponsorshipGetList(e).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res = this.mapResult(res);
      }
      return res;
    });
  }

  mapQuery(e: tblFilterQuery) {
    e.queryParams?.forEach((el) => {
      if (el.colName == 'status') {
        if(el.value == -1){
          el.value = 1;
        e.queryParams.push({ colName: 'is_monthly', value: 1, matchMode: 'equals' });
        } else if(el.value == 1){
          e.queryParams.push({ colName: 'is_monthly', value: 0, matchMode: 'equals' });
        }
      }
    });
    e.whereField = this.globalWhere || []
    return e;
  }
  mapResult(res: any) {
    res.result.data.map((a: any) => {
      a.total_allotment_count = +a.total_alloted || 0;
      a.total_alloted = a.freq_payment_id > 1 ? +a.total_alloted ? `${a.total_alloted} / <strong>${a.total_support} </strong>` : `Not Yet / <strong>${a.total_support}</strong>` : 'No alloted';
      a.is_edit = +a.total_allotment_count == 0 && +a.status != 1 ? true : false;
      a.status = +a.is_monthly && +a.status == 1 ? -1 : a.status;
      // a.payment_status =`<span color="red">${a.payment_status} </strong>`
    })
    return res;
  }
  getListActive = async (e: tblFilterQuery): Promise<any> => {
    // e = this.mapQuery(e);
    // e.whereField?.push({ colName: 'status', value: 2, matchMode: "=", operation: 'AND' });
    e.whereField = [{ colName: 'status', value: 2 }]
    return this.sponsorshipList = await this.sponsorApi.sponsorshipGetList(e).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res = this.mapResult(res);
      }
      return res;
    });
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([this.urlService.SPONSOR.SPONSORSHIP_ADD.URL], { queryParams: { id: id } })
        break;

      case 'ADD':
        this.router.navigate([this.urlService.SPONSOR.SPONSORSHIP_ADD.URL])
        break;

      case 'VIEW':
        this.modalService.openModal(AllotmentInfoComponent, { ref_id: id }, 'modal-xl')
        break;

      case 'DELETE':
        this.reliveSponsorship(id, true)
        break;
      case 'RELIVE':
        this.reliveSponsorship(id, false)
        break;

      case 'ACTIVE':
        this.router.navigate([this.urlService.SPONSOR.SPONSORSHIP_ALLOTMENT.URL], { queryParams: { sponsorshipId: id } })
        break;
    }
    return Promise.resolve(true);
  }

  apiPayloadModify(data: any, isDelete = false) {
    const payload: modifyApi = {} as modifyApi;
    payload.created_by = this.auth.currentUserValue.user_id,
      payload.action_id = isDelete ? MODIFICATION_PERMISSION.DELETE : MODIFICATION_PERMISSION.RELIVE;
    payload.description = isDelete ? data.name + ' has Requested to Delete' : data.name + ' has Requested to Make Complete Sponsorship';
    payload.ref_id = data.id || '';
    payload.department = data.department;
    payload.zone = data.zone;
    payload.region = data.region;
    payload.sponsorship_module = data.sponsorship_module;
    payload.module_id = MODULE_NAME.SPONSORSHIP;
    return payload;
  }



  reliveSponsorship(id: string | number, isDelete = false) {
    const title = (isDelete ? 'Delete' : 'Relieve') + ' Sponsorship',
      msg = !isDelete ? 'Are you sure to Relieve this Sponsorship ?' : 'Are you sure to Delete this Sponsorship ?';
    const formFiled: formBuilder[] = [
      {
        colName: 'reason_withdraw',
        title: 'Reason',
        validator: [{ name: 'required', error: 'Reason is Required' }]
      }];

    this.modalService.openConfirmDialog({ title: title, message: msg, formField: formFiled, isFormField: true }).then((dataConfirm: any) => {
      if (dataConfirm) {
        const data = this.sponsorshipList.result.data.find((a: any) => a.id == id);
        this.sponsorApi.checkRequestExists(data).then(res => {
          if (res) {
            const apiPayload = this.apiPayloadModify(data, isDelete);
            const payloadData = isEmptyObj(dataConfirm) ? {} : dataConfirm;
            this.modifyrequest.saveModification(apiPayload, { ...data, ...payloadData }).then((res) => {
              if (res) {
                //  this.sponsorApi.updateSponsorshipRequest(data.id, { modify_request: true });
              }
            });
          } else {
            this.alertService.showToast("sponsorship already is on pending to Approval, you can't raise new request ", 'info');
          }
        })
      }
    });
  }

}