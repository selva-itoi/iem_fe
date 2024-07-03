import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { PermissionGuard } from 'src/app/helper/guard/permission.guard';
import { ChurchCollectionComponent } from './component/church-collection/church-collection.component';
import { ChurchInfoComponent } from './component/church-info/church-info.component';
import { ChurchListComponent } from './component/church-list/church-list.component';
import { ChurchReportListComponent } from './component/church-report-list/church-report-list.component';
import { MemberListComponent } from './component/member-list/member-list.component';
import { NewChurchReportComponent } from './component/new-church-report/new-church-report.component';
import { NewChurchComponent } from './component/new-church/new-church.component';
import { NewMemberComponent } from './component/new-member/new-member.component';
import { NewProgressReportComponent } from './component/new-progress-report/new-progress-report.component';
import { ProgressReportListComponent } from './component/progress-report-list/progress-report-list.component';
import { ProgressReportInfoComponent } from './component/progress-report-info/progress-report-info.component';

const routes: Routes = [
  {
    path: UrlServices.PAGE_URL.CHURCH.LIST.URL.split(/[/]+/).pop(),
    component: ChurchListComponent,
    data: {
      title: 'Church List',
      permission: UrlServices.PAGE_URL.CHURCH.LIST.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHURCH.ADD.URL.split(/[/]+/).pop(),
    component: NewChurchComponent,
    data: {
      title: 'Church Manage',
      permission: UrlServices.PAGE_URL.CHURCH.ADD.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHURCH.VIEW.URL.split(/[/]+/).pop(),
    component: ChurchInfoComponent,
    data: {
      title: 'Church View',
      permission: UrlServices.PAGE_URL.CHURCH.VIEW.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHURCH.MEMBER_ADD.URL.split(/[/]+/).pop(),
    component: NewMemberComponent,
    data: {
      title: 'Church Member Add',
      permission: UrlServices.PAGE_URL.CHURCH.MEMBER_ADD.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHURCH.MEMBER_LIST.URL.split(/[/]+/).pop(),
    component: MemberListComponent,
    data: {
      title: 'Church Member List',
      permission: UrlServices.PAGE_URL.CHURCH.MEMBER_LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHURCH.REPORT_ADD.URL.split(/[/]+/).pop(),
    component: NewChurchReportComponent,
    data: {
      title: 'Church Report',
      permission: UrlServices.PAGE_URL.CHURCH.REPORT_ADD.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHURCH.REPORT_LIST.URL.split(/[/]+/).pop(),
    component: ChurchReportListComponent,
    data: {
      title: 'Church All Report',
      permission: UrlServices.PAGE_URL.CHURCH.REPORT_LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHURCH.CHURCH_COLLECTION.URL.split(/[/]+/).pop(),
    component: ChurchCollectionComponent,
    data: {
      title: 'Church Collection',
      permission: UrlServices.PAGE_URL.CHURCH.CHURCH_COLLECTION.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHURCH.PROGRESS_REPORT_LIST.URL.split(/[/]+/).pop(),
    component: ProgressReportListComponent,
    data: {
      title: 'Progress Report',
      permission: UrlServices.PAGE_URL.CHURCH.PROGRESS_REPORT_LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHURCH.NEW_PROGRESS_REPORT.URL.split(/[/]+/).pop(),
    component: NewProgressReportComponent,
    data: {
      title: 'Progress Report',
      permission: UrlServices.PAGE_URL.CHURCH.NEW_PROGRESS_REPORT.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHURCH.PROGRESS_REPORT_VIEW.URL.split(/[/]+/).pop(),
    component: ProgressReportInfoComponent,
    data: {
      title: 'Progress Report Info',
      permission: UrlServices.PAGE_URL.CHURCH.PROGRESS_REPORT_VIEW.permission
    },
    canActivate: [PermissionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChurchRoutingModule { }
export const routingComponents = [ChurchInfoComponent, ChurchListComponent, NewChurchComponent]