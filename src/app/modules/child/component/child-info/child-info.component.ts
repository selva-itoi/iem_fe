import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ObjectString } from 'src/app/core/helper/core.data.interface';
import { ADDRESS_MAP_INFO, APPROVE_COL, RELIVE_COL } from 'src/app/core/helper/core_form_helper';
import { AppConstant, MODIFICATION_PERMISSION, RESPONSE_CODE, STATUS_CHILD } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilder, formBuilderData } from 'src/app/helper/interface/response';
import { AuthService } from 'src/app/helper/service/auth.service';
import { StaffEducationComponent } from 'src/app/modules/staff/component/staff-education/staff-education.component';
import { ChildSbilingRefComponent } from 'src/app/shared/feature-modal/child-sbiling-ref/child-sbiling.component';
import { CHILD_BASIC_FORM, CHILD_OTHERS_FORM } from '../../helper/child-form';
import { ChildApiService } from '../../service/child-api.service';
import { ChildPhysicalComponent } from '../child-physical/child-physical.component';
import { ParentsComponent } from '../parents/parents.component';

@Component({
  selector: 'app-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.scss'],
})
export class ChildInfoComponent implements OnInit {
  type: 'MODIFICATION' | 'VIEW' | 'RELIVE' | 'REJOIN' = 'VIEW';
  gender = AppConstant.GENDER
  STATUS = STATUS_CHILD
  dataLoading = false;
  loading: boolean = false;
  childData: any;
  modifyMode: boolean = false;
  modifyData: any = {};
  isDeleteMode: boolean = false;
  _bsModalRef: BsModalRef = {} as BsModalRef;
  isModal: boolean = false;
  isRequest: boolean = false; // modification Request
  child_id: any | number = '';
  segment: ObjectString = {
    BASIC: 'Basic',
    ADDRESS: 'Address',
    GAURDIAN: 'Parent Detail',
    SIBILING: 'Sibling',
    EDUCATION: 'Education',
    PHYSICAL: 'Physical',
    OTHERS: 'Others'
  }
  sponsorshipTable: formBuilder[] = [];
  staffEmpId: any;
  modification_request_data: any = {};
  hasPermissionViewSponsorship: boolean = false;
  basicFormData: any = [...cloneData(CHILD_BASIC_FORM).map(a => {if(a.colName == 'child_id'){a.hidden =false} return a }).slice(0, -1), ...RELIVE_COL, ...APPROVE_COL];
  otherFormData: any = CHILD_OTHERS_FORM;
  addressFormData: formBuilderData[] = cloneData(ADDRESS_MAP_INFO)
  pageInfo: pageInfo = {} as pageInfo;
  urlService = UrlServices.PAGE_URL;
  @ViewChild('childEdu') childEdu: StaffEducationComponent | undefined;
  @ViewChild('childPhysical') childPhysical: ChildPhysicalComponent | undefined;
  @ViewChild('parentsDiv') parentsDiv: ParentsComponent | undefined;
  @ViewChild('childSibiling') childSibiling: ChildSbilingRefComponent | undefined;

  constructor(private childApi: ChildApiService,
    private auth: AuthService,
    private injector: Injector,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.child_id = this.activatedRoute.snapshot.queryParams.id || '';
    const showBtnList = this.auth.checkPermission('CHILD', 'VIEW_ALL');
    this.pageInfo = {
      title: this.isModal ? 'Child Request' : 'Child Info',
      buttonShowBtn: this.isModal ? false : showBtnList,
      button: {
        title: 'Child List',
        url: this.urlService.CHILD.LIST.URL,
      },
      info_text: this.child_id || ''
    }
    if (!this.child_id) {
      this.isModal = true;
      this._bsModalRef = this.injector.get<BsModalRef>(BsModalRef);
    } else {
      this.getData();
    }
    this.hasPermissionViewSponsorship = this.auth.checkPermission('CHILD', 'VIEW_SPONSORSHIP');
    if (this.hasPermissionViewSponsorship) {
      this.segment.SPONSORSHIP = 'Sponsor';
    }
  }

  setInput(data: any) {
    this.type = 'MODIFICATION';
    if (this.type == 'MODIFICATION') {
      delete this.segment.SPONSORSHIP
    }
    this.modifyData = cloneData(data) || {};
    this.modifyMode = true;
    this.child_id = data.ref_id || '';
    console.log(data);
    if (data.action_id) {
      if (+data.action_id == MODIFICATION_PERMISSION.RELIVE || +data.action_id == MODIFICATION_PERMISSION.MAKE_ACTIVE) {
        this.isDeleteMode = true;
      }
    }
    if (data.request_data) {
      this.isRequest = true;
      this.modification_request_data = data.request_data;
      if (!this.child_id) {
        this.mapFormValue();
      }
    }
    this.getData();
  }

  mapFormValue() {
    if (this.childData || this.modifyData) {
      const reqData = this.modifyData?.request_data
      console.log('call basic form ', this.childData)
      // this.childData.others = this.childData.others;
      this.childPhysical?.setData(this.childData?.physical, reqData?.physical ? reqData?.physical : []);
      this.childEdu?.setData(this.childData?.education, reqData?.education ? reqData?.education : []);
      this.childSibiling?.setData(this.childData?.sibiling, reqData?.sibiling ? reqData?.sibiling : []);
      this.parentsDiv?.setData(this.childData?.parents, reqData?.parents ? reqData?.parents : []);
    }
  }
  getData() {
    if (this.child_id) {
      this.childApi.getDetail(this.child_id).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.childData = res.result;
          const keys = ['physical']
          // if (!isEmptyObj(this.modification_request_data)) {
          //   Object.keys(this.modification_request_data).forEach((a: any) => {
          //     if (keys.includes(a)) {
          //       Object.keys(this.modification_request_data[a]).forEach((b: any) => {
          //         this.childData[a][b] = this.modification_request_data[a][b];
          //       })
          //     } else {
          //       this.childData[a] = this.modification_request_data[a];
          //     }
          //   })
          // }
          this.staffEmpId = this.childData.father_child_id || this.childData.mom_child_id || '';
          this.mapFormValue()
        }
      })
    }
  }

  approveRequest = (payload: any) => {
    let API: Promise<any>;
    if (this.isDeleteMode) {
      payload.deleted_at = this.type == 'RELIVE' ? mysqlDataTime() : '';
      API = this.childApi.relive(this.childData.child_id, payload);
    } else {
      API = this.childApi.saveDetails(payload);
    }
    return API
  }

  edit() {
    this.router.navigate([this.urlService.CHILD.ADD.URL], { queryParams: { id: this.child_id } })
  }
}