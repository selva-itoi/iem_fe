import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { PermissionGuard } from 'src/app/helper/guard/permission.guard';
import { CampaignListComponent } from './component/campaign-list/campaign-list.component';
import { NewCampaignComponent } from './component/new-campaign/new-campaign.component';
import { DonationAllotmentListComponent } from './component/donation-allotment-list/donation-allotment-list.component';
import { TopListComponent } from '../sponsor/component/top-list/top-list.component';

const routes: Routes = [
  {
    path: UrlServices.PAGE_URL.DONATION.CAMPAIGN_LIST.URL.split(/[/]+/).pop(),
    component: CampaignListComponent,
    data: {
      title: 'Campaign List',
      permission: UrlServices.PAGE_URL.DONATION.CAMPAIGN_LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.DONATION.NEW_CAMPAIGN.URL.split(/[/]+/).pop(),
    component: NewCampaignComponent,
    data: {
      title: 'New Campaign',
      permission: UrlServices.PAGE_URL.DONATION.NEW_CAMPAIGN.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.DONATION.DONATION_ALLOTMENT_LIST.URL.split(/[/]+/).pop(),
    component: DonationAllotmentListComponent,
    data: {
      title: 'Donation ALLotment',
      permission: UrlServices.PAGE_URL.DONATION.DONATION_ALLOTMENT_LIST.permission,
     // queryParam: 'UPDATE' // permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.DONATION.TOP_LIST.URL.split(/[/]+/).pop(),
    component: TopListComponent,
    data: {
      title: 'Donation ALLotment',
      permission: UrlServices.PAGE_URL.DONATION.TOP_LIST.permission,
     // queryParam: 'UPDATE' // permission
    },
    canActivate: [PermissionGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationRoutingModule { }
