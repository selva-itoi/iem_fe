import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ADDRESS_MAP_INFO, COMMON_INFO_UPDATE_INFO, MODIFY_INFO_UPDATE_INFO } from 'src/app/core/helper/core_form_helper';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { ResponseData } from 'src/app/helper/interface/response';
import { AuthService } from 'src/app/helper/service/auth.service';
import { StaffApiService } from '../../service/staff-api.service';
import { StaffExpGemsComponent } from '../staff-exp-gems/staff-exp-gems.component';

@Component({
  selector: 'app-staff-transfer-view',
  templateUrl: './staff-transfer-view.component.html',
  styleUrls: ['./staff-transfer-view.component.scss']
})
export class StaffTransferViewComponent implements OnInit {
  modifyMode: boolean = false;
  modifyData: any = {};
  transfer_id: number | string = '';
  transferData: any = {};
  addressData: any
  dataLoading: boolean = false;
  public onClose: Subject<boolean> = new Subject();
  presentAddress: any = {};
  loading: boolean = false;
  hasPermissionApprove: boolean = false;
  segment: any = {
    BASIC: 'Basic',
    ADDRESS: 'Address'
  }
  showData: any = [...ADDRESS_MAP_INFO];
  @ViewChild('officeForm') officeForm: StaffExpGemsComponent | undefined;
  @ViewChild('staffExpGems') staffExpGems: StaffExpGemsComponent | undefined;
  @ViewChild('spouseExpGems') spouseExpGems: StaffExpGemsComponent | undefined;
  @ViewChild('spouseOfficeForm') spouseOfficeForm: StaffExpGemsComponent | undefined;
  updateInfo: any = COMMON_INFO_UPDATE_INFO;
  constructor(
    private staffApi: StaffApiService,
    private auth: AuthService,
    public _bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void { }

  setInput(data: any) {
    this.modifyData = {};
    this.modifyMode = false;
    this.transfer_id = data.id || '';
    if (data.request_data) {
      this.modifyData = data;
      this.modifyMode = true;
      this.updateInfo = MODIFY_INFO_UPDATE_INFO;
      this.transferData = data.request_data;
      this.addressData = typeof (this.transferData?.address) == 'object' ? this.transferData?.['address'] : this.transferData;
      this.transferData.spouse_fk_id ? this.segment['SPOUSE'] = 'Spouse' : ''
      this.hasPermissionApprove = this.auth.checkPermission('STAFF_TRANSFER', 'VERIFY');
      this.mapDataTransfer();
    } else {
      this.getData();
    }
  }

  splitPrev(d: any) {
    const prev = d.filter((a: any) => +a.action != 1),
      to = d.filter((a: any) => +a.action == 1);
    return { prev: prev, active: to };
  }

  mapDataTransfer() {
    if (Array.isArray(this.transferData.expGems) && this.transferData.expGems.length) {
      const d = this.transferData.expGems;
      const staffSplit = this.splitPrev(d);
      this.staffExpGems?.setData(staffSplit.prev)
      this.officeForm?.setData(staffSplit.active);
    }
    if (Array.isArray(this.transferData.spouseExp) && this.transferData.spouseExp.length) {
      const spouceSplit = this.splitPrev(this.transferData.spouseExp);
      if(spouceSplit.prev.length){
        this.spouseExpGems?.setData(spouceSplit.prev)
      }
      if(spouceSplit.active.length){
      this.spouseOfficeForm?.setData(spouceSplit.active);
      }
    }
  }


  getData() {
    if (!this.transfer_id) {
      return;
    }
    this.dataLoading = true;
    this.staffApi.getTransferByid(this.transfer_id).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.transferData = res.result
        this.addressData = this.transferData
        this.mapDataTransfer();
      }
    }).finally(() => {
      this.dataLoading = false;
    })
  }

  approveRequest = (payload: any) => {
    return this.staffApi.saveStaffTransfer(payload)
  }
  close(status = false) {
    this._bsModalRef.hide();
    this.onClose.next(status);
  }
}