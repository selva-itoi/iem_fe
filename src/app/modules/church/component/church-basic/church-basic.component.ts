import { Component, OnInit } from '@angular/core';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { ChurchApiService } from '../../service/church-api.service';

@Component({
  selector: 'app-church-basic',
  templateUrl: './church-basic.component.html',
  styleUrls: ['./church-basic.component.scss']
})
export class ChurchBasicComponent implements OnInit {
  church_id: any;
  loading: boolean = false
  churchData: any = {}
  isModal: boolean = false;
  pageInfo: pageInfo = {} as pageInfo;
  showData: mapInfoView[] = [];
  constructor(private churchApi: ChurchApiService, private alertService: AlertService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'Church Info',
      buttonShowBtn: false,
    }
    this.showData = [{ name: 'church_name', title: "Name" }, { name: 'church_id', title: "Church Id" }, { name: 'zoneName', title: "zone Name" }, { name: 'fieldName', title: "Field Name" },
    { title: 'Est Date', name: 'established', type: 'DATE' }, { name: 'near_gems_church', title: 'Near Gems' }, { name: 'staff_emp_id', title: 'Staff Id' }, { name: 'staffName', title: 'Staff Name' },
    { name: 'updated_at', title: 'Last Updated At', type: "DATETIME" }]

  }

  setInput(data: any) {
    this.isModal = true;
    if (data.church_id) {
      this.church_id = data.church_id;
      this.getChurchData(this.church_id)
    }
  }

  getChurchData(id: any) {
    this.loading = true;
    this.churchApi.getBasic(id).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.churchData = res.result || {};
      }
    }).catch(err => {
      this.alertService.showToast('Unable to fetch the Data', 'error');
    }).finally(() => this.loading = false)
  }

  close() {
    if (this.isModal)
      this.modalService.close();
  }
}
