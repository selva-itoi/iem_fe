import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { AppConstant, PERMISSION, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { ResponseData } from 'src/app/helper/interface/response';
import { SponsorApiService } from 'src/app/modules/sponsor/service/sponsor-api.service';

@Component({
  selector: 'app-sponsor-basic',
  templateUrl: './sponsor-basic.component.html',
  styleUrls: ['./sponsor-basic.component.scss']
})
export class SponsorBasicComponent implements OnInit {

  sponsorData: any = {};
  public onClose: Subject<boolean> = new Subject();
  isDeleted: boolean = false;
  isRestore: boolean = false;
  isModifyRequest: boolean = true;
  loadingData: boolean = false;
  isModal: boolean = false;

  showData: mapInfoView[] = [{ name: 'name', title: 'Name' }, { name: 'sponsor_id', title: 'Donor ID' }, { title: 'Gender', name: 'genderName' },
  { title: 'Date of Birth', name: 'dob', type: 'DATE' }, { title: 'Date of Marriage', name: 'do_marraige', type: 'DATE' }, { title: 'Mobile No', name: 'mobile_no' },
  { title: 'E-mail', name: 'email_id' }, { title: 'Church Ministry Area', name: 'promotionalName' }, { title: 'Report Language ', name: 'langName' },
  { name: 'newsletterStatus', title: 'Newsletter' }, { name: 'whatsAppStatus', title: 'Is WhatsApp' },
  { title: 'Active From', name: 'created_at', type: 'DATE' }, { title: 'Address', name: 'addr' },
  { title: 'Status', name: 'statusName' }, { title: 'Last Update', name: 'updated_at', type: 'DATE' }
  ]

  constructor(private _bsModalRef: BsModalRef, private sponsorApi: SponsorApiService) { }

  ngOnInit(): void { }

  setInput(data: any) {
    this.isModal = true
    if (data.action_id) {
      if (+data.action_id == PERMISSION.DELETE) {
        this.isDeleted = true;
      }
      this.isModifyRequest = true;
    }
    this.sponsorData = data.request_data || {};
    if (isEmptyObj(this.sponsorData)) {
      this.getData(data.sponsor_id);
    } else {
      this.mapData();
    }
  }
  mapData() {
    this.sponsorData.statusName = this.sponsorData?.deleted_at ? 'In Active' : 'Active';
    const adrKey = ['street', 'address', 'cityName', 'pName', 'districtName', 'stateName', 'countryName'];
    this.sponsorData.whatsAppStatus = +this.sponsorData.is_whats_app ? 'Yes' : 'No';
    this.sponsorData.newsletterStatus = +this.sponsorData.newsletter ? 'Yes' : 'No';
    const addVal: Array<any> = [];
    adrKey.forEach(e => {
      if (this.sponsorData[e]) {
        addVal.push(this.sponsorData[e]);
      }
    })
    this.sponsorData.addr = addVal.join(',');
  }

  getData(id: string | number) {
    if (id) {
      this.loadingData = true;
      this.sponsorApi.getBasic(id).then((res: ResponseData | any |any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (!isEmptyObj(res.result)) {
            this.sponsorData = res.result;
            this.mapData();
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
