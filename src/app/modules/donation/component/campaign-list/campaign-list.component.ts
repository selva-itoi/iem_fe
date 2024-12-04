import { Component, OnInit } from '@angular/core';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { CAMPAIGN_LIST_FORM } from '../../helper/donation_form';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {

  urlService: any = UrlServices.PAGE_URL;
  LIST_COL: tableColum[] = cloneData(CAMPAIGN_LIST_FORM)
  pageInfo: pageInfo = {} as pageInfo;
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Staff Edit', type: 'EDIT', permission: { moduleName: 'STAFF', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Staff View', type: 'VIEW', permission: { moduleName: 'STAFF', actionName: 'READ' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Staff Relieve', type: 'DELETE', permission: { moduleName: 'STAFF', actionName: 'RELIVE' } }
  ]
  tableConfig: tableBuilder = {
    name: 'Staff list',
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }

  constructor() { }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'Manage Campaign List',
      buttonShowBtn: true,
      button: {
        title: 'New Campaign',
        url: this.urlService.DONATION.NEW_CAMPAIGN.URL
      },
    }
  }


  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.auth.getPermittedId(['STAFF'], ['VIEW_ALL'], ['region', 'zone', 'department', 'trust', 'ad_office']) || [];
    // return this.staffList = await this.staffApi.getList(e).then((res: ResponseData | any) => {
    //   if (res.statusCode == RESPONSE_CODE.SUCCESS) {
    //     res.result.data.map((a: any) => {
    //       a.allow_sponsor_allotment = +a.allow_sponsor_allotment ? 'Yes' : 'No';
    //     })
    //   }
    //   return res;
    // });
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      // case 'EDIT':
      //   this.router.navigate([this.urlService.STAFF.ADD.URL], { queryParams: { id: id } })
      //   break;

      // case 'VIEW':
      //   this.router.navigate([this.urlService.STAFF.VIEW.URL], { queryParams: { id: id } })
      //   break;

    }
    return Promise.resolve(true);
  }
}
