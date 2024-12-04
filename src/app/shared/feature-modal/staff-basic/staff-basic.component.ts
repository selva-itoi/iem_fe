import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { PERMISSION, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { cloneData, isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { ResponseData } from 'src/app/helper/interface/response';
import { AuthService } from 'src/app/helper/service/auth.service';
import { StaffApiService } from 'src/app/modules/staff/service/staff-api.service';

@Component({
  selector: 'app-staff-basic',
  templateUrl: './staff-basic.component.html',
  styleUrls: ['./staff-basic.component.scss']
})
export class StaffBasicComponent implements OnInit {
  staffData: any = {};
  public onClose: Subject<boolean> = new Subject();
  isDeleted: boolean = false;
  isRestore: boolean = false;
  isModifyRequest: boolean = true;
  isModal: boolean = false;
  spouseDetail: any = {};
  STATUS = [{ name: 'Active', id: 1 }, { name: 'In Active ', id: 0 }];
  loadingData: boolean = false;
  mode: 'STAFF' | 'FAMILY' | 'PAYROLL' = 'STAFF';
  showTab: boolean = false;
  segement = {
    BASIC: 'Basic',
    ALLOTMENT: 'Allotment',
  }
  segmentVisited = {
    BASIC: true,
    ALLOTMENT: false,
  }
  currentSegment: string = this.segement.BASIC;
  showData: mapInfoView[] = [{ name: 'regionName', title: 'Region' }, { name: 'zoneName', title: 'Zone/State' }, { name: 'fieldName', title: 'Field' },{ title: 'Department', name: 'dName' },
  { title: 'Date of Birth', name: 'dob', type: 'DATE' }, { title: 'Gender', name: 'genderName' }, { title: 'Mobile No', name: 'mobile_no' }, { title: 'Branch', name: 'branchName' },
  { title: 'E-mail', name: 'email_id' },
  //  { title: 'MS Office', name: 'adName' },
    { title: 'Active From', name: 'do_join', type: 'DATE' }, { title: 'Remarks', name: 'reason_relive' },
  { title: 'Status', name: 'statusName' }, { title: 'Last Update', name: 'updated_at', type: 'DATE' }
  ]
  showPayRoll: boolean = false
  spouseInfoView: mapInfoView[] = cloneData(this.showData);
  constructor(private _bsModalRef: BsModalRef, private staffApi: StaffApiService,
    private auth: AuthService) { }

  returnZero() {
    return 0;
  }

  changeSegment(s: string) {
    this.currentSegment = s;
    //@ts-ignore
    const key: 'BASIC' | 'ALLOTMENT' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.segmentVisited[key] = true;
  }

  ngOnInit(): void {
    this.showTab = this.auth.checkPermission('STAFF', 'VIEW_SPONSORSHIP');
    this.showPayRoll = this.auth.checkPermission('STAFF', 'MANAGE_PAYROLL') || this.auth.checkPermission('STAFF', 'VERIFY');
  }

  setInput(data: any) {
    this.isModal = true;
    this.mode = data.mode || 'STAFF';
    if (data.action_id) {
      if (+data.action_id == PERMISSION.DELETE) {
        this.isDeleted = true;
      }
      this.isModifyRequest = true;
      this.staffData = data.request_data || {};
    }
    if (isEmptyObj(this.staffData)) {
      if (data.staffData) {
        this.staffData = data.staffData;
      } else
        this.getData(data.staff_emp_id || '', data.staff_cross_id || '');
    }
    if (this.showPayRoll && this.mode == 'PAYROLL') {
      //@ts-ignore
      this.segement['PAYROLL'] = 'Payroll'
    }
  }

  getData(id: string | number, cross_ref = '') {
    if (id || cross_ref) {
      this.loadingData = true;
      let api: any;
      if (this.mode == 'STAFF') {
        api = this.staffApi.getBasic(id, false);
      } else {
        api = cross_ref ? this.staffApi.getStaffByCross(cross_ref) : this.staffApi.getFamilyByStaff(id);
      }
      api.then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (isArray(res.result)) {
            this.staffData = res.result[0];
            this.spouseDetail = res.result[1] || {};
          } else if (!isEmptyObj(res.result)) {
            this.staffData = res.result;
            this.spouseDetail = res.result.family || {};
          }
          this.staffData.statusName = this.staffData.deleted_at ? 'In Active' : 'Active';
          if (!isEmptyObj(this.spouseDetail)) {
            this.staffData.profile_img_path = this.staffData.family_img_path;
            this.spouseDetail.statusName = this.spouseDetail.deleted_at ? 'In Active' : 'Active';
            this.spouseInfoView[0].name = 'fullName';
            this.spouseInfoView[0].title = ' Name ';
            this.spouseInfoView[1].name = 'staff_cross_id';
            this.spouseInfoView[1].title = ' Cross Ref ';
          }

        }
      }).finally(() => {
        this.loadingData = false;
      })
    }
  }

  close(status = false) {
    this._bsModalRef.hide();
    this.onClose.next(status);
  }
}