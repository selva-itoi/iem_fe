import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { PermissionGuard } from 'src/app/helper/guard/permission.guard';
import { NewStaffComponent } from './component/new-staff/new-staff.component';
import { ReportsStatsComponent } from './component/reports-stats/reports-stats.component';
import { StaffDedicationListComponent } from './component/staff-dedication-list/staff-dedication-list.component';
import { StaffInfoComponent } from './component/staff-info/staff-info.component';
import { StaffListComponent } from './component/staff-list/staff-list.component';
import { StaffMonthlyReportListComponent } from './component/staff-monthly-report-list/staff-monthly-report-list.component';
import { StaffMonthlyReportNewComponent } from './component/staff-monthly-report-new/staff-monthly-report-new.component';
import { StaffNewDedicationComponent } from './component/staff-new-dedication/staff-new-dedication.component';
import { StaffTransferAddComponent } from './component/staff-transfer-add/staff-transfer-add.component';
import { StaffTransferListComponent } from './component/staff-transfer-list/staff-transfer-list.component';
import { ProgressReportListComponent } from './component/progress-report-list/progress-report-list.component';
import { NewProgressReportComponent } from './component/new-progress-report/new-progress-report.component';
import { ProgressReportInfoComponent } from './component/progress-report-info/progress-report-info.component';
import { NewGoalsReportComponent } from './component/new-goals-report/new-goals-report.component';
import { GoalsReportListComponent } from './component/goals-report-list/goals-report-list.component';
import { StatisticsReportComponent } from './component/statistics-report/statistics-report.component';


const routes: Routes = [
  {
    path: UrlServices.PAGE_URL.STAFF.LIST.URL.split(/[/]+/).pop(),
    component: StaffListComponent,
    data: {
      title: 'Staff List',
      permission: UrlServices.PAGE_URL.STAFF.LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.ADD.URL.split(/[/]+/).pop(),
    component: NewStaffComponent,
    data: {
      title: 'New Staff',
      permission: UrlServices.PAGE_URL.STAFF.ADD.permission,
      queryParam: 'UPDATE' // permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.VIEW.URL.split(/[/]+/).pop(),
    component: StaffInfoComponent,
    data: {
      title: 'Staff Info',
      permission: UrlServices.PAGE_URL.STAFF.VIEW.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.TRANSFER_LIST.URL.split(/[/]+/).pop(),
    component: StaffTransferListComponent,
    data: {
      title: 'Manage Staff Transfer',
      permission: UrlServices.PAGE_URL.STAFF.TRANSFER_LIST.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.TRANSFER_ADD.URL.split(/[/]+/).pop(),
    component: StaffTransferAddComponent,
    data: {
      title: 'New Staff Transfer',
      permission: UrlServices.PAGE_URL.STAFF.TRANSFER_ADD.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.REPORT_ADD.URL.split(/[/]+/).pop(),
    component: StaffMonthlyReportNewComponent,
    data: {
      title: 'Manage Staff Monthly Reports',
      permission: UrlServices.PAGE_URL.STAFF.REPORT_ADD.permission,
      queryParam: 'UPDATE'
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.REPORT_LIST.URL.split(/[/]+/).pop(),
    component: StaffMonthlyReportListComponent,
    data: {
      title: 'View All Staff Monthly Report',
      permission: UrlServices.PAGE_URL.STAFF.REPORT_LIST.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.DEDICATION_LIST.URL.split(/[/]+/).pop(),
    component: StaffDedicationListComponent,
    data: {
      title: 'View All Staff Dedication',
      permission: UrlServices.PAGE_URL.STAFF.DEDICATION_LIST.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.DEDICATION_ADD.URL.split(/[/]+/).pop(),
    component: StaffNewDedicationComponent,
    data: {
      title: 'update Staff Dedication',
      permission: UrlServices.PAGE_URL.STAFF.DEDICATION_ADD.permission,
      queryParam: 'UPDATE' // permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.REPORT_STATS.URL.split(/[/]+/).pop(),
    component: ReportsStatsComponent,
    data: {
      title: 'Staff Reports stats',
      permission: UrlServices.PAGE_URL.STAFF.REPORT_STATS.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.PROGRESS_REPORT_LIST.URL.split(/[/]+/).pop(),
    component: ProgressReportListComponent,
    data: {
      title: ' Progress Report List',
      permission: UrlServices.PAGE_URL.STAFF.PROGRESS_REPORT_LIST.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.NEW_PROGRESS_REPORT.URL.split(/[/]+/).pop(),
    component: NewProgressReportComponent,
    data: {
      title: 'New Progress Report',
      permission: UrlServices.PAGE_URL.STAFF.NEW_PROGRESS_REPORT.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.PROGRESS_REPORT_INFO.URL.split(/[/]+/).pop(),
    component: ProgressReportInfoComponent,
    data: {
      title: 'Progress Report Info',
      permission: UrlServices.PAGE_URL.STAFF.PROGRESS_REPORT_INFO.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.NEW_GOALS_REPORT.URL.split(/[/]+/).pop(),
    component: NewGoalsReportComponent,
    data: {
      title: ' New Goals Report ',
      permission: UrlServices.PAGE_URL.STAFF.NEW_GOALS_REPORT.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.GOALS_REPORT_LIST.URL.split(/[/]+/).pop(),
    component: GoalsReportListComponent,
    data: {
      title: 'Goals Report List',
      permission: UrlServices.PAGE_URL.STAFF.GOALS_REPORT_LIST.permission,
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.STAFF.STATISTICS_REPORT.URL.split(/[/]+/).pop(),
    component: StatisticsReportComponent,
    data: {
      title: 'Statistics Report',
      permission: UrlServices.PAGE_URL.STAFF.STATISTICS_REPORT.permission,
    },
    canActivate: [PermissionGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
export const routingComponents = [StaffListComponent, StaffInfoComponent, NewStaffComponent, StaffMonthlyReportListComponent, StaffMonthlyReportNewComponent, StaffTransferListComponent, StaffTransferAddComponent]