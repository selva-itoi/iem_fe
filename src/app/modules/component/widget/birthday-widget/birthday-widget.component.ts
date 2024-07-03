import { Component, Input, OnInit } from '@angular/core';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { isExistsKey } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { SponsorApiService } from 'src/app/modules/sponsor/service/sponsor-api.service';
import { StaffApiService } from 'src/app/modules/staff/service/staff-api.service';
import { SponsorBasicComponent } from 'src/app/shared/feature-modal/sponsor-basic/sponsor-basic.component';
import { StaffBasicComponent } from 'src/app/shared/feature-modal/staff-basic/staff-basic.component';
import { ModalService } from 'src/app/shared/service/modal.service';

@Component({
  selector: 'birthday-widget',
  templateUrl: './birthday-widget.component.html',
  styleUrls: ['./birthday-widget.component.scss']
})
export class BirthdayWidgetComponent implements OnInit {
  @Input() type: 'BIRTHDAY' | 'ANNIVERSARY' = 'BIRTHDAY';
  @Input() mode: 'SPONSOR' | 'STAFF' = 'STAFF';
  dataLoading: boolean = false;
  DATA_MEMBER_REMEMBER: any = { TODAY: '', WEEK: '', MONTH: '' }
  constructor(private staffApi: StaffApiService, private sponsorApi: SponsorApiService,private alertservice:AlertService,
    private modalService: ModalService) { }
  segement = {
    TODAY: 'TODAY',
    WEEK: 'In 7 Days',
    MONTH: 'In 30 Days'
  }
  segmentVisited: any = { TODAY: true }
  currentSegment: any = this.segement.TODAY;
  days: any
  ngOnInit(): void {
    this.getAllMemberRemember(this.type)
  }

  ngAfterViewInit(): void { }
  returnZero() {
    return 0;
  }

  changeSegment(s: string) {
    //@ts-ignore
    const key: 'TODAY' | 'WEEK' | 'MONTH' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    const days = key == 'TODAY' ? '0' : key == 'MONTH' ? '30' : '7'
    this.days = days
    this.currentSegment = s
    this.getAllMemberRemember(this.type, days);
    this.segmentVisited[key] = true;
  }

  showProfile(data: any) {
    const com = this.mode == 'STAFF' ? StaffBasicComponent : SponsorBasicComponent;
    this.modalService.openModal(com, { staff_emp_id: data?.staff_emp_id || '', sponsor_id: data?.sponsor_id || '' }, 'modal-xl')
  }


  getAllMemberRemember(type: 'BIRTHDAY' | 'ANNIVERSARY' = 'BIRTHDAY', days = '0') {
    if (!isExistsKey(this.DATA_MEMBER_REMEMBER, [type, days])) {
      this.dataLoading = true;
      const api = this.mode == 'STAFF' ? this.staffApi.getRememberAll({ page: 0, rows: 10 }, type, days) : this.sponsorApi.getRememberAll({ page: 0, rows: 10 }, type, days);
      api.then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.DATA_MEMBER_REMEMBER[this.currentSegment] = res.result;
        }
      }).finally(() => this.dataLoading = false)
    }
  }

  exportDoc() {
    const api = this.mode == 'STAFF' ? this.staffApi.exportBirthday({ page: 0, rows: 10 }, this.type, this.days || '0') : this.sponsorApi.exportBirthday({ page: 0, rows: 10 }, this.type, this.days || '0')
    //@ts-ignore
    api.then((res: ResponseData | any) => {

    }).catch(() => this.alertservice.showToast('Unable to download','error'))
  }
}
