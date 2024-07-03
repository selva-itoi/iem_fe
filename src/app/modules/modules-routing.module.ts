import { NgModule } from '@angular/core';
import { UrlServices } from '../helper/class/url-services';
import { RouterModule, Routes } from '@angular/router';
import { DashbaordComponent } from './component/dashbaord/dashbaord.component';
import { AccessDeniedComponent } from './component/access-denied/access-denied.component';

const routes: Routes = [
  {
    path: UrlServices.DASHBOARD_ROUTE,
    component: DashbaordComponent,
    data: {
      title: 'Dashboard'
    },
    canActivate: []
  },
  {
    path: UrlServices.PAGE_URL.STAFF.ADD.URL.split(/[/]+/)?.[1],
    loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule),
  },
  {
    path: UrlServices.PAGE_URL.SPONSOR.ADD.URL.split(/[/]+/)?.[1],
    loadChildren: () => import('./sponsor/sponsor.module').then(m => m.SponsorModule),
  },
  {
    path: UrlServices.PAGE_URL.MASTER.ADDRESS.URL.split(/[/]+/)?.[1],
    loadChildren: () => import('./master/master.module').then(m => m.MasterModule),
  },
  {
    path: UrlServices.PAGE_URL.USER.ROLE.URL.split(/[/]+/)?.[1],
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
  },
  {
    path: UrlServices.PAGE_URL.CHILD.ADD.URL.split(/[/]+/)?.[1],
    loadChildren: () => import('./child/child.module').then(m => m.ChildModule),
  },
  {
    path: UrlServices.PAGE_URL.EMAIL.ADD.URL.split(/[/]+/)?.[1],
    loadChildren: () => import('./email/email.module').then(m => m.EmailModule),
  },
  {
    path: UrlServices.PAGE_URL.CHURCH.ADD.URL.split(/[/]+/)?.[1],
    loadChildren: () => import('./church/church.module').then(m => m.ChurchModule),
  },

  {
    path: UrlServices.PAGE_URL.REPORT.STAFF_FLAT_REPORT.URL.split(/[/]+/)?.[1],
    loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
  },
  {
    path: UrlServices.PAGE_URL.DONATION.CAMPAIGN_LIST.URL.split(/[/]+/)?.[1],
    loadChildren: () => import('./donation/donation.module').then(m => m.DonationModule),
  },
  {
    path: UrlServices.PAGE_URL.ACCOUNT.LIST.URL.split(/[/]+/)?.[1],
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
  },
  {
    path: UrlServices.ACCESS_DENIED_ROUTE,
    component: AccessDeniedComponent,
    data: {
      title: 'Access Denied'
    },
    canActivate: []
  },
  {
    path: '',
    redirectTo: UrlServices.AUTH_PAGE.LOGIN_URL,
    pathMatch:'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
