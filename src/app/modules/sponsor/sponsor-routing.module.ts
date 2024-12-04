import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { PermissionGuard } from 'src/app/helper/guard/permission.guard';
import { AssignInfoComponent } from './component/assign-info/assign-info.component';
import { DonationListComponent } from './component/donation-list/donation-list.component';
import { GiftsAddComponent } from './component/gifts-add/gifts-add.component';
import { GiftsListComponent } from './component/gifts-list/gifts-list.component';
import { ManageSponsorPageComponent } from './component/manage-sponsor-page/manage-sponsor-page.component';
import { NewDonationComponent } from './component/new-donation/new-donation.component';
import { NewSponsorComponent } from './component/new-sponsor/new-sponsor.component';
import { NewSponsorshipComponent } from './component/new-sponsorship/new-sponsorship.component';
import { SponsorListComponent } from './component/sponsor-list/sponsor-list.component';
import { SponsorshipAllotmentComponent } from './component/sponsorship-allotment/sponsorship-allotment.component';
import { SponsorshipListComponent } from './component/sponsorship-list/sponsorship-list.component';
import { ViewSponsorComponent } from './component/view-sponsor/view-sponsor.component';
import { MagazineListComponent } from './component/magazine-list/magazine-list.component';
import { NewMagazineComponent } from './component/new-magazine/new-magazine.component';


const routes: Routes = [{
  path: UrlServices.PAGE_URL.SPONSOR.LIST.URL.split(/[/]+/).pop(),
  component: SponsorListComponent,
  data: {
    title: 'Donor List',
    permission: UrlServices.PAGE_URL.SPONSOR.LIST.permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.VIEW.URL.split(/[/]+/).pop(),
  component: ViewSponsorComponent,
  data: {
    title: 'Sponsor View',
    permission: UrlServices.PAGE_URL.SPONSOR.VIEW.permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.ADD.URL.split(/[/]+/).pop(),
  component: NewSponsorComponent,
  data: {
    title: 'Sponsor Manage',
    permission: UrlServices.PAGE_URL.SPONSOR.ADD.permission,
    queryParam: 'UPDATE' // permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP_ADD.URL.split(/[/]+/).pop(),
  component: NewSponsorshipComponent,
  data: {
    title: 'Sponsorship',
    permission: UrlServices.PAGE_URL.SPONSOR.ADD.permission,
    queryParam: 'UPDATE' // permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP.URL.split(/[/]+/).pop(),
  component: SponsorshipListComponent,
  data: {
    title: 'Sponsorship',
    permission: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP.permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP_ALLOTMENT.URL.split(/[/]+/).pop(),
  component: SponsorshipAllotmentComponent,
  data: {
    title: 'Sponsorship Allotment',
    permission: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP_ALLOTMENT.permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.SPONSOR_GIFT.URL.split(/[/]+/).pop(),
  component: GiftsListComponent,
  data: {
    title: 'Sponsor Gifts',
    permission: UrlServices.PAGE_URL.SPONSOR.SPONSOR_GIFT.permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.SPONSOR_GIFT_ADD.URL.split(/[/]+/).pop(),
  component: GiftsAddComponent,
  data: {
    title: 'Sponsor Gifts Update',
    permission: UrlServices.PAGE_URL.SPONSOR.SPONSOR_GIFT_ADD.permission,
    queryParam: 'UPDATE' // permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.DONATION_LIST.URL.split(/[/]+/).pop(),
  component: DonationListComponent,
  data: {
    title: 'Donation List',
    permission: UrlServices.PAGE_URL.SPONSOR.DONATION_LIST.permission,
    queryParam: 'MANAGE_COLLECTION' // permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.NEW_DONATION.URL.split(/[/]+/).pop(),
  component: NewDonationComponent,
  data: {
    title: 'New Donation',
    permission: UrlServices.PAGE_URL.SPONSOR.NEW_DONATION.permission,
   // queryParam: 'UPDATE' // permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.ASSIGN_INFO.URL.split(/[/]+/).pop(),
  component: AssignInfoComponent,
  data: {
    title: 'Assign Info',
    permission: UrlServices.PAGE_URL.SPONSOR.ASSIGN_INFO.permission,
   // queryParam: 'UPDATE' // permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.MAGAZINE_LIST.URL.split(/[/]+/).pop(),
  component: MagazineListComponent,
  data: {
    title: 'Magazine List',
    permission: UrlServices.PAGE_URL.SPONSOR.MAGAZINE_LIST.permission,
   // queryParam: 'UPDATE' // permission
  },
  canActivate: [PermissionGuard],
},
{
  path: UrlServices.PAGE_URL.SPONSOR.NEW_MAGAZINE.URL.split(/[/]+/).pop(),
  component: NewMagazineComponent,
  data: {
    title: 'New Magazine',
    permission: UrlServices.PAGE_URL.SPONSOR.NEW_MAGAZINE.permission,
   // queryParam: 'UPDATE' // permission
  },
  canActivate: [PermissionGuard],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SponsorRoutingModule { }
export const routingComponents = [NewSponsorComponent, SponsorshipAllotmentComponent, SponsorshipListComponent, SponsorListComponent, ManageSponsorPageComponent,GiftsAddComponent,GiftsListComponent];
