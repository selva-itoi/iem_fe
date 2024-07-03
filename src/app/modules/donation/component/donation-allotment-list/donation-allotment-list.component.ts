import { Component, OnInit } from '@angular/core';
import { UrlServices } from 'src/app/helper/class/url-services';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { AuthService } from 'src/app/helper/service/auth.service';

@Component({
  selector: 'app-donation-allotment-list',
  templateUrl: './donation-allotment-list.component.html',
  styleUrls: ['./donation-allotment-list.component.scss']
})
export class DonationAllotmentListComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  pageInfo: pageInfo = {} as pageInfo
  wherePending = [{ colName: 'status', value: 2 }];
  segment = {
    LIST: 'All List',
    PENDING: 'pending',
  }
  currentSegment: string = this.segment.LIST
  segmentVisited: any = { LIST: true };
  globalWherePending =[{colName :'status', value : 2}]
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'Allotment',
      // buttonShowBtn: this.auth.checkPermission('CAMPAIGN_PAYMENT', 'ADD'),
      // button: {
      //   title: 'New Allotment',
      //   icon: 'icon-plus-outline',
      //   url: this.urlService.COLLECTION.PAYMENT_NEW.URL,
      //   queryParams: {}
      // }
    }
  }
}