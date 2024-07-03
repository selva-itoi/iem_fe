import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { PermissionGuard } from 'src/app/helper/guard/permission.guard';
import { ChildEduYearlyListComponent } from './component/child-edu-yearly-list/child-edu-yearly-list.component';
import { ChildEduYearlyUpdateComponent } from './component/child-edu-yearly-update/child-edu-yearly-update.component';
import { ChildInfoComponent } from './component/child-info/child-info.component';
import { ChildListComponent } from './component/child-list/child-list.component';
import { ChildReportAddComponent } from './component/child-report-add/child-report-add.component';
import { ChildReportListComponent } from './component/child-report-list/child-report-list.component';
import { NewChildComponent } from './component/new-child/new-child.component';

const routes: Routes = [
  {
    path: UrlServices.PAGE_URL.CHILD.LIST.URL.split(/[/]+/).pop(),
    component: ChildListComponent,
    data: {
      title: 'Child List',
      permission: UrlServices.PAGE_URL.CHILD.LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHILD.ADD.URL.split(/[/]+/).pop(),
    component: NewChildComponent,
    data: {
      title: 'New Child',
      permission: UrlServices.PAGE_URL.CHILD.ADD.permission,
      queryParam: 'UPDATE' // permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHILD.VIEW.URL.split(/[/]+/).pop(),
    component: ChildInfoComponent,
    data: {
      title: 'Child Info',
      permission: UrlServices.PAGE_URL.CHILD.VIEW.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHILD.REPORT_LIST.URL.split(/[/]+/).pop(),
    component: ChildReportListComponent,
    data: {
      title: 'Child Report list',
      permission: UrlServices.PAGE_URL.CHILD.REPORT_LIST.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHILD.REPORT_ADD.URL.split(/[/]+/).pop(),
    component: ChildReportAddComponent,
    data: {
      title: 'Child Report Manage',
      permission: UrlServices.PAGE_URL.CHILD.REPORT_ADD.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.CHILD.EDU_YEARLY_UPDATE_LIST.URL.split(/[/]+/).pop(),
    component: ChildEduYearlyListComponent,
    data: {
      title: 'Child Education Yearly Update',
      permission: UrlServices.PAGE_URL.CHILD.EDU_YEARLY_UPDATE_LIST.permission,
    },
    canActivate: [PermissionGuard],
  },
  // {
  //   path: 'edu-update',
  //   component: ChildEduYearlyUpdateComponent,
  //   data: {
  //     title: 'Child Education Yearly Update',
  //     permission: UrlServices.PAGE_URL.CHILD.EDU_YEARLY_UPDATE.permission,
  //   },
  //   canActivate: [PermissionGuard],
  // },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildRoutingModule { }
export const routingComponents = [ChildInfoComponent, NewChildComponent, ChildListComponent,ChildReportAddComponent,ChildReportListComponent]