import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { tableAction, tableBuilder, tableButton, tableColum, tblFilter, tblFilterQuery } from 'src/app/helper/interface/response';
import { AuthService } from 'src/app/helper/service/auth.service';
import { DONATION_PENDING } from '../../helper/sponsor-form';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss']
})
export class DonationListComponent implements OnInit {
  urlService: any = UrlServices.PAGE_URL;
  globalWhere: tblFilter[] = [];
  pageInfo: pageInfo = {
    title: 'Donation List', buttonShowBtn: true, button: {
      title: 'New Donation',
      url: this.urlService.SPONSOR.NEW_DONATION.URL
    },
  }
  type: 'DONATION' | 'COLLECTION' = 'DONATION'
  segement = {
    LIST: 'donation list',
    MODIFYREQUEST: 'pending',
    DONOR_PENDING: 'donor pending'
  }
  LIST_COL: tableColum[] = DONATION_PENDING

  actionBtn: tableButton[] = [
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Sponsorship View', type: 'VIEW', permission: { moduleName: 'SPONSORSHIP', actionName: 'READ' } },
  ]

  tableConfig: tableBuilder = {
    name: 'Sponsorship list',
    addBtn: false,
    column: this.LIST_COL,
    action: [],
    isLazy: true,
    showFilter: true
  }
  segmentVisited: any = {
    LIST: false,
    MODIFYREQUEST: false,
    OUTBOX: false
  }
  currentSegment: string = '';
  globalWherePending: tblFilter[] = [];
  staffShowData: mapInfoView[] = [
    { name: 'accountName', title: 'Total Donations in year' }, { name: 'account_code', title: 'Total Donation Amount' }, { name: 'ref_code', title: 'Total Donations in this Month ' }, { name: 'typeName', title: 'Total Donation Amount inthis Month' }, { name: 'current_balance', title: 'Total New Donations in this month' },];
  constructor(private router: Router, private auth: AuthService, private activateRoute: ActivatedRoute, private SponsorApi: SponsorApiService) { }
  ngOnInit(): void {
    this.type = this.activateRoute.snapshot.queryParams['type'] || 'DONATION';
    this.globalWherePending = [{ colName: 'status', value: 2}]
    if (this.type == 'COLLECTION') {
      this.globalWhere = [{ colName: 'sub_program_id', value: 4 }]
    }
  }
  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    console.log(type)
    switch (type) {
      case 'VIEW':
        break;
     
        // this.modalService.openConfirmDialog({ btnOK: 'Approve', btnCancel: 'Reject',message :'','isFormField':true,title:'',formField:[{colName:'remark',title:'Remarks',validator:[{name:'required'}]}]}).then(res=>{

        // })
    }
    return Promise.resolve(true);
  }
  getListData = async (e: tblFilterQuery): Promise<any> => {
  
  return this.SponsorApi.GetDonorpendingList(e)
  }
}
