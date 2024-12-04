import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResponseData } from 'src/app/helper/interface/response';
import { ChildApiService } from 'src/app/modules/child/service/child-api.service';
import { SponsorApiService } from 'src/app/modules/sponsor/service/sponsor-api.service';
import { StaffApiService } from 'src/app/modules/staff/service/staff-api.service';

@Component({
  selector: 'profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.scss']
})
export class ProfileWidgetComponent implements OnInit {
  data: any = {};
  @Input() public set profileData(data: any) {
    if (data) {
      this.mapData(data);
    }
  }
  @Input() type: 'STAFF' | 'SPONSOR' | 'CHILD' | 'PARENTS' | 'STAFF_PAYROLL' = 'STAFF';
  @Input() widgetType: 'CARD' | 'SMALL' = 'CARD';
  @Input() public set refId(id: any) {
    if (id) {
      this.getBasic(id);
    }
  }
  @Output() OnGetData: EventEmitter<any> = new EventEmitter();
  loading: boolean = false;
  basicData: any = {};
  constructor(private staffApi: StaffApiService, private sponsorApi: SponsorApiService,
    private childApi: ChildApiService) { }

  ngOnInit(): void { }

  getBasic(id: any) {
    this.loading = true;
    const api: any = this.type == 'STAFF' ? this.staffApi.getBasic(id) : this.type == 'CHILD' ? this.childApi.getBasic(id) : this.sponsorApi.getBasic(id);
    api.then((res: ResponseData | any) => {
      if (res.result) {
        this.basicData = res.result;
        this.OnGetData.emit(this.basicData);
        this.mapData(res.result);
      }
    }).finally(() => this.loading = false);
  }
  get basicInfo() { return this.basicData };

  setData(data: any) {
    if (data && data != undefined) {
      this.mapData(data)
    }
  }

  mapData(res: any) {
    let mapData = { name: '', description: '', colLText: '', colRText: '' },
      merge: any = ['fullName', 'deName', 'email_id', 'staff_emp_id'];
    this.data.col = [{ name: 'deName', title: 'Department' }, { name: 'email_id', title: 'Email' }, { name: 'mobile_no', title: 'Mobile' }, { name: 'staff_emp_id', title: 'ID', viewType: 'STAFF_EMP_ID' }]
    switch (this.type) {
      case 'CHILD':
        merge = ['name', 'homeName', 'email_id', 'mobile_no', 'child_id',];
        this.data.col = [{ name: 'homeName', title: 'Home Name' }, { name: 'email_id', title: 'Email' }, { name: 'mobile_no', title: 'Mobile' }, { name: 'child_id', title: 'ID', viewType: 'CHILD_ID' }]
        break;
      case 'STAFF_PAYROLL':
        merge = ['name', 'deName', 'email_id', 'staff_emp_id'];
        this.data.col = [{ name: 'deName', title: 'Department' }, { name: 'email_id', title: 'Email' }, { name: 'mobile_no', title: 'Mobile' }, { name: 'staff_emp_id', title: 'ID', viewType: 'STAFF_EMP_ID' }]
        break;
      case 'SPONSOR':
        merge = ['name', 'promotionalName', 'email_id', 'sponsor_id', 'mobile_no'];
        this.data.col = [{ name: 'promotionalName', title: 'Church Ministry Area' }, { name: 'email_id', title: 'Email' }, { name: 'mobile_no', title: 'Mobile' }, { name: 'sponsor_id', title: 'ID', viewType: 'SPONSOR_ID' }]
        break;
      case 'PARENTS':
        merge = ['name', 'occupation', 'email_id', 'aadhar', 'mobile_no'];
        this.data.col = [{ name: 'occupation', title: 'occupation' }, { name: 'email_id', title: 'Email' }, { name: 'mobile_no', title: 'Mobile' }, { name: 'staff_emp_id', title: 'ID', viewType: 'STAFF_EMP_ID' }]
        break;
    }
    this.data.result = res;
    Object.keys(mapData).forEach((a: string, i: any) => {
      this.data[a] = res[merge[i]] || ''
    })
    this.data['profile_img_path'] = res['profile_img_path'] || '';
  }
}