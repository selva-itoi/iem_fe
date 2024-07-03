import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ADDRESS_MAP_INFO } from 'src/app/core/helper/core_form_helper';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { MODIFICATION_PERMISSION, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { isEmptyObj, mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilderData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { CHURCH_LOCATION_TYPE, CHURCH_OTHERS_FORM, CHURCH_SEGMENT, CHURCH_TRAINING_FORM, churchBasicForm, churchBuildingForm, churchDemoGraphic, churchProgramForm } from '../../helper/church-form';
import { ChurchApiService } from '../../service/church-api.service';
import { ChurchDocComponent } from '../church-doc/church-doc.component';
import { CouncilMemberComponent } from '../council-member/council-member.component';

@Component({
  selector: 'app-church-info',
  templateUrl: './church-info.component.html',
  styleUrls: ['./church-info.component.scss']
})
export class ChurchInfoComponent implements OnInit {
  church_id: number | string = '';
  type: 'MODIFICATION' | 'VIEW' | 'RELIVE' | 'REJOIN' | any = 'VIEW';
  churchData: any = {};
  dataLoading: boolean = false;
  loading: boolean = false;
  segment = CHURCH_SEGMENT
  _bsModalRef: BsModalRef = {} as BsModalRef;
  pageInfo: pageInfo = {} as pageInfo
  isModal: boolean = false;
  showData: formBuilderData[] = [];
  showAdders: mapInfoView[] = [];
  showBasicEnd: mapInfoView[] = [];
  churchBuildingForm = churchBuildingForm;
  churchDemoGraphic = churchDemoGraphic;
  churchProgramForm = churchProgramForm;
  CHURCH_TRAINING_FORM = CHURCH_TRAINING_FORM;
  CHURCH_OTHERS_FORM = CHURCH_OTHERS_FORM;
  modifyData: any = {};
  hasPermissionApprove: boolean = false
  @ViewChild('churchDoc') churchDoc: ChurchDocComponent | undefined;
  @ViewChild('councilView') councilView: CouncilMemberComponent | undefined;
  public onClose: Subject<boolean> = new Subject();
  constructor(private churchApi: ChurchApiService,
    private activatedRoute: ActivatedRoute,
    private injector: Injector,
    private auth: AuthService,
    private navigation: NavigationService,
    private alertController: AlertService) { }

  ngOnInit(): void {
    this.church_id = this.activatedRoute.snapshot.queryParams.id || '';
    this.pageInfo = { title: 'Church Details' };
    if (!this.church_id) {
      this.type = 'MODIFICATION';
      this.isModal = true;
      this._bsModalRef = this.injector.get<BsModalRef>(BsModalRef);
    }
    this.showData = churchBasicForm
    this.showAdders = ADDRESS_MAP_INFO;
    this.showBasicEnd = [{ name: 'statusName', title: 'status' }, { name: 'reason_pending_mode', title: 'Remarks Status' }, { name: 'updated_at', type: 'DATE', title: 'Last updated' },
    { name: 'reason_relive', title: 'Remarks' }]
    if (this.church_id) {
      this.getChurchData();
    }
  }
  setInput(data: any) {
    this.modifyData = data || {};
    this.church_id = data.ref_id || '';
    this.type = 'MODIFICATION';
    if (data.action_id) {
      if (+data.action_id == MODIFICATION_PERMISSION.RELIVE || +data.action_id == MODIFICATION_PERMISSION.MAKE_ACTIVE) {
        this.type = +data.action_id == MODIFICATION_PERMISSION.RELIVE ? 'RELIVE' : 'REJOIN';
      }
    }
    if (data.request_data && !isEmptyObj(data.request_data)) {
      this.pageInfo.title = data.description;
      if (this.type == 'RELIVE' || this.type == 'REJOIN') {
        this.church_id = data.request_data.id || data.ref_id
      }
      this.setMapData();
      this.hasPermissionApprove = this.auth.checkPermission('CHURCH', 'VERIFY');
    }
    this.getChurchData();
  }

  setMapData() {
    const colorCode = +this.churchData?.status == 1 ? 'success' : +this.churchData?.status == 2 ? 'info' : 'danger';
    this.churchData.statusName = `<span class="badge badge-${colorCode}">${this.churchData?.statusName}</span>`;
    this.churchDoc?.setData(this.churchData?.doc);
    if (this.type == 'MODIFICATION') {
      const reqData = this.modifyData?.request_data?.committee
      this.councilView?.setData(this.churchData?.committee, reqData ? reqData : [])
    }
  }

  getChurchData() {
    if(!this.church_id){
      return;
    }
    this.dataLoading = true;
    this.churchApi.getDetails(this.church_id).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.churchData = res.result;
        this.setMapData();
        this.churchData.locationTypeName = CHURCH_LOCATION_TYPE.find(a => a.key == this.churchData.location_type)?.name;
        // this.churchData.statusName = +this.churchData?.status == 1 ? 'Active' : 'Pending';
      }
    }).catch(err => {
      this.alertController.showToast('Content not getting loaded', 'error');
    }).finally(() => {
      this.dataLoading = false
    })
  }

  close(status = false) {
    if (this.isModal) {
      this.onClose.next(true);
      this._bsModalRef.hide();
    } else
      this.navigation.back();
  }



  approveRequest = (payload: any) => {
    if (isEmptyObj(payload)) {
      return 'empty data';
    }
    payload.modify_request = 0;
    payload.last_modify_by = this.auth.currentUserValue.user_id;
    let API: Promise<any>;
    if (this.type == 'RELIVE' || this.type == 'REJOIN') {
      payload.deleted_at = this.type == 'RELIVE' ? mysqlDataTime() : '';
      API = this.churchApi.reliveChurch(this.churchData.church_id, payload);
    } else {
      API = this.churchApi.saveDetails(payload);
    }
    return API
  }
}
