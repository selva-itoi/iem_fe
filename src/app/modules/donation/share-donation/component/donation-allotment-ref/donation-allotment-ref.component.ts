import { Component, Input, OnInit } from '@angular/core';
import { infoModalData } from 'src/app/core/helper/core.data.interface';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilter, tblFilterQuery, whereField } from 'src/app/helper/interface/response';
import { DONATION_ALLOTMENT_LIST } from 'src/app/modules/sponsor/helper/sponsor-form';
import { SponsorApiService } from 'src/app/modules/sponsor/service/sponsor-api.service';
import { ModalService } from 'src/app/shared/service/modal.service';

@Component({
  selector: 'donation-allotment-ref',
  templateUrl: './donation-allotment-ref.component.html',
  styleUrls: ['./donation-allotment-ref.component.scss']
})
export class DonationAllotmentRefComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  @Input() mode: 'ALLOTMENT' | 'COLLECTION' = 'ALLOTMENT'
  @Input() whereField: whereField[] = []
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Sponsorship Edit', type: 'EDIT', permission: { moduleName: 'SPONSORSHIP', actionName: 'UPDATE' }, condition: [{ key: 'is_edit', operation: '==', value: true }] },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Sponsorship View', type: 'VIEW', permission: { moduleName: 'SPONSORSHIP', actionName: 'READ' } },
  ]
  LIST_COL: tableColum[] = DONATION_ALLOTMENT_LIST
  tableConfig: tableBuilder = {
    name: 'list',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  donationAllotmentList: any;
  globalWherePending: tblFilter[] = []
  constructor(private sponsorApi: SponsorApiService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.globalWherePending = [...this.whereField, ...[{ colName: 'sub_program_id', value: '4' }]];
  }


  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = [...this.globalWherePending, ...e.whereField || []];
    return await this.sponsorApi.getDonationAllotmentList(e).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.donationAllotmentList = res?.result?.data || []
      }
      return res
    })
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    const formData = cloneData(DONATION_ALLOTMENT_LIST),
      sorceData = this.donationAllotmentList.find((a: any) => a.id == id) || {},
      data: infoModalData = { sourceData: sorceData, title: 'Donation Allotment Info', formData: formData }
    switch (type) {
      case 'VIEW':
        this.modalService.openInfoModal(data, 'modal-lg');
        break;
      case 'ASSIGN':
      // this.router.navigate([UrlServices.PAGE_URL.SPONSOR.ASSIGN_INFO.URL],{queryParams:{id:id}})
      break;
    }
    return Promise.resolve(true);
  }

}
