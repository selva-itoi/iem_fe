import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { COMMON_INFO_UPDATE_INFO } from 'src/app/core/helper/core_form_helper';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { ResponseData } from 'src/app/helper/interface/response';
import { StaffApiService } from '../../service/staff-api.service';

@Component({
  selector: 'app-staff-dedication-view',
  templateUrl: './staff-dedication-view.component.html',
  styleUrls: ['./staff-dedication-view.component.scss']
})
export class StaffDedicationViewComponent implements OnInit {

  public onClose: Subject<boolean> = new Subject();
  loadingData: boolean = false;
  dedicationData: any = {};
  sponsorData: any = {};
  staffShowData: mapInfoView[] = [];
  dedicationShowData: mapInfoView[] = [];
  staffData: any = {};
  staffAccData: any = {};
  dedicatedUpdateInfo:any= COMMON_INFO_UPDATE_INFO
  constructor(private _bsModalRef: BsModalRef, private staffApi: StaffApiService) { }

  ngOnInit(): void {
  }

  setInput(data: any) {
    if (data.id) {
      this.getData(data.id);
    }
  }


  getData(id: string | number) {
    if (id) {
      this.loadingData = true;
      this.staffApi.getDedicationByid(id).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (!isEmptyObj(res.result)) {
            this.dedicationData = res.result;
            this.sponsorData = this.dedicationData.sponsorData;
            if (isArray(res.result.staffData)) {
              this.staffData = res.result.staffData[0];
              this.staffAccData = res.result.staffData[1] || {};
            }
            Object.keys(this.dedicationData).map((a: any) => {
              if (a == 'status') {
                this.dedicationData.status_name = +this.dedicationData[a] == 1 ? 'Approved' : +this.dedicationData[a] == 2 ? 'Processed' : 'Pending';
              }
            })
            this.setViewData();
          }
        }
      }).finally(() => {
        this.loadingData = false
      })
    }
  }

  setViewData() {
    this.staffShowData = [{ title: 'Name', name: 'fullName' }, { title: 'Zone/State', name: 'zoneName' }, { title: 'Emp Id', name: 'staff_emp_id', isClickable:true}, { title: 'Department', name: 'deName' },
    { title: 'Date of Join', name: 'do_join', type: 'DATE' }]
    this.dedicationShowData = [{ title: 'Place', name: 'place' }, { title: 'Dedication Date', name: 'date_time', type: 'DATETIME' }, { title: 'Arrival Date', name: 'm_arrival_date_time', type: 'DATETIME' }, { title: 'Dept Date', name: 'm_dept_date_time', type: 'DATETIME' },
    { title: 'Remarks', name: 'remarks' }, { title: 'Status', name: 'status_name' }];
  }

  close(status = false) {
    this._bsModalRef.hide();
    this.onClose.next(status);
  }
}
