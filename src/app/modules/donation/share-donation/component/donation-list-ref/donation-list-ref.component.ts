import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { isArray } from 'src/app/helper/class/utilityHelper';
import { downloadHelper } from 'src/app/helper/class/downloadHelper';
import { tableColum, tableButton, tableBuilder, tblFilterQuery, ResponseData, tableAction, tblFilter } from 'src/app/helper/interface/response';
import { MasterComponent } from 'src/app/modules/master/component/master/master.component';
import { DonationInfoComponent } from 'src/app/modules/sponsor/component/donation-info/donation-info.component';
import { SPONSOR_DONATION_LIST } from 'src/app/modules/sponsor/helper/sponsor-form';
import { SponsorApiService } from 'src/app/modules/sponsor/service/sponsor-api.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';

@Component({
  selector: 'donation-list-ref',
  templateUrl: './donation-list-ref.component.html',
  styleUrls: ['./donation-list-ref.component.scss']
})
export class DonationListRefComponent implements OnInit {
  LIST_COL: tableColum[] = SPONSOR_DONATION_LIST
  @Input() type: 'ALL' | 'SPONSOR' | 'COLLECTION' = 'ALL';
  @Input() ref_id: any;
  @Input() globalWhere: tblFilter[] = [];
  @ViewChild('masterPage') masterPage: MasterComponent | undefined

  actionBtn: tableButton[] = [
    // { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Edit', type: 'EDIT', permission: { moduleName: 'DONATION', actionName: 'UPDATE' }, condition: [{ key: 'is_edit', operation: '==', value: true }] },
    { name: '', class: 'bg-orange text-white', icon: 'icon-eye', title: 'View', type: 'VIEW' },
    { name: '', class: 'bg-indigo', icon: 'icon-cloud-download', title: 'Download', type: 'DOWNLOAD' },


    { name: '', type: 'APPROVE', class: 'btn-info', icon: 'icon-paper-plane', condition: [{ key: 'status', operation: '==', value: 4 }] }
    // { name: '', class: 'bg-indigo text-white', iconClass: 'icon-user-follow', title: 'Assign', type: 'ASSIGN', permission: { moduleName: 'DONATION_ALLOTMENT', actionName: 'ADD' } }
  ]
  tableConfig: tableBuilder = {
    name: 'Sponsorship list',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  donationList: any = [];
  constructor(private modalService: ModalService, private alertService: AlertService, private sponsorApi: SponsorApiService, private router: Router, private downloadHelper: downloadHelper, private authservice: AuthService) { }

  ngOnInit(): void {

  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = e.whereField ? [...e.whereField, ...this.globalWhere] : this.globalWhere;
    if (this.type == 'SPONSOR') {
      const cond = { colName: 'sponsor_fk_id', value: this.ref_id };
      e.whereField.push(cond);
    } else if (this.type == 'COLLECTION') {
      const cond = { colName: 'sub_program_id', value: 4 };
      e.whereField.push(cond);
      if (isArray(e.whereField)) {
        e.whereField = [...new Set(e.whereField)]
      }
    }
    if (this.authservice.getUser().role?.length) {
      if (this.authservice.getUser().role[0].roleName == "ADMIN") {
        e.whereField = [{ colName: 'account_fk_id', value: 1 }]
      }

    }
    if (this.authservice.getUser().volunteer_fk_id) {
      if (this.authservice.getUser().account?.length) {
        e.whereField = [{ colName: 'account_fk_id', value: this.authservice.getUser().account[0].account_fk_id }]

      }

    }

    return this.donationList = await this.sponsorApi.getDonationList(e).then((res: ResponseData) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result.data.map((a: any) => {
          // a.sponsorName = `<span>${a.sponsorName} ${a.sponsor_id}</span>`;
          return a
        })
      }
      return res;
    });
  }
  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    console.log(type)
    switch (type) {
      case 'VIEW':
        this.modalService.openModal(DonationInfoComponent, { ref_id: id }, 'modal-lg');
        break;
      case 'APPROVE':
        // this.router.navigate([UrlServices.PAGE_URL.SPONSOR.ASSIGN_INFO.URL], { queryParams: { id: id } })
        this.modalService.openModal(DonationInfoComponent, { ref_id: id, type: type }, 'modal-lg');
        break;
      case 'DOWNLOAD':
        this.sponsorApi.printsponserreceipt(id).then(async (res: any) => {
          this.downloadHelper.downloadFile(res);
          this.alertService.showToast('Receipt Downloaded', 'info')
        })
          .catch(err => this.alertService.showToast('Unable to download Receipt', 'info'))
        break
      // this.modalService.openConfirmDialog({ btnOK: 'Approve', btnCancel: 'Reject',message :'','isFormField':true,title:'',formField:[{colName:'remark',title:'Remarks',validator:[{name:'required'}]}]}).then(res=>{

      // })
    }
    return Promise.resolve(true);
  }
}
