import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleManagementComponent } from './page/role-management/role-management.component';
import { UrlServices } from 'src/app/helper/class/url-services';
import { RouterModule, Routes } from '@angular/router';
import { EditRoleComponent } from './component/edit-role/edit-role.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { RolePermissionComponent } from './page/role-permission/role-permission.component';
import { ManageUserComponent } from './page/manage-user/manage-user.component';
import { EditUserComponent } from './component/edit-user/edit-user.component';
import { PermissionGuard } from 'src/app/helper/guard/permission.guard';
import { FormHelperModule } from 'src/app/shared/form/form-hepler.module';
import { FeatureModalModule } from 'src/app/shared/feature-modal/feature-modal.module';
import { VolunterListComponent } from './component/volunter-list/volunter-list.component';
import { NewReceiptComponent } from './component/new-receipt/new-receipt.component';
import { NewVolunterComponent } from './component/new-volunter/new-volunter.component';
import { ReceiptDataComponent } from './component/receipt-data/receipt-data.component';
import { ReceiptInfoComponent } from './component/receipt-info/receipt-info.component';
import { ReceiptListComponent } from './component/receipt-list/receipt-list.component';
import { VolunterInfoComponent } from './component/volunter-info/volunter-info.component';
import { VolunterStatsComponent } from './component/volunter-stats/volunter-stats.component';

const routes: Routes = [
  {
    path: UrlServices.PAGE_URL.USER.ROLE.URL.split(/[/]+/).pop(),
    component: RoleManagementComponent,
    data: {
      title: 'Role Management',
      permission: UrlServices.PAGE_URL.USER.ROLE.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'permission',
    component: RolePermissionComponent,
    data: {
      title: 'Role Permission',
      permission: UrlServices.PAGE_URL.USER.ROLE.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.USER.LIST.URL.split(/[/]+/).pop(),
    component: ManageUserComponent,
    data: {
      title: 'Manage User',
      permission: UrlServices.PAGE_URL.USER.LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.USER.ADD.URL.split(/[/]+/).pop(),
    component: EditUserComponent,
    data: {
      title: 'Modify User',
      permission: UrlServices.PAGE_URL.USER.ADD.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.USER.VOLUNTER_LIST.URL.split(/[/]+/).pop(),
    component: VolunterListComponent,
    data: {
      title: 'Volunter List',
      permission: UrlServices.PAGE_URL.USER.VOLUNTER_LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.USER.NEW_VOLUNTER.URL.split(/[/]+/).pop(),
    component: NewVolunterComponent,
    data: {
      title: 'New Volunter',
      permission: UrlServices.PAGE_URL.USER.NEW_VOLUNTER.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.USER.VIEW_VOLUNTER.URL.split(/[/]+/).pop(),
    component: VolunterInfoComponent,
    data: {
      title: 'Volunter Info',
      permission: UrlServices.PAGE_URL.USER.VIEW_VOLUNTER.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.USER.RECEIPT_LIST.URL.split(/[/]+/).pop(),
    component: ReceiptListComponent,
    data: {
      title: 'Receipt Info',
      permission: UrlServices.PAGE_URL.USER.RECEIPT_LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.USER.NEW_RECEIPT.URL.split(/[/]+/).pop(),
    component: NewReceiptComponent,
    data: {
      title: 'Receipt Info',
      permission: UrlServices.PAGE_URL.USER.NEW_RECEIPT.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.USER.RECEIPT_INFO.URL.split(/[/]+/).pop(),
    component: ReceiptInfoComponent,
    data: {
      title: 'Receipt Info',
      permission: UrlServices.PAGE_URL.USER.RECEIPT_INFO.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.USER.RECEIPT_DATA.URL.split(/[/]+/).pop(),
    component: ReceiptDataComponent,
    data: {
      title: 'Receipt Info',
      permission: UrlServices.PAGE_URL.USER.RECEIPT_DATA.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.USER.VOLUNTER_STATS.URL.split(/[/]+/).pop(),
    component: VolunterStatsComponent,
    data: {
      title: 'Receipt Info',
      permission: UrlServices.PAGE_URL.USER.VOLUNTER_STATS.permission
    },
    canActivate: [PermissionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [
    
  ],
})
export class UserRoutingModule { }

@NgModule({
  declarations: [
    RoleManagementComponent,
    EditRoleComponent,
    RolePermissionComponent,
    ManageUserComponent,
    EditUserComponent,
    NewVolunterComponent,
    VolunterListComponent,
    VolunterInfoComponent,
    ReceiptListComponent,
    NewReceiptComponent,
    ReceiptInfoComponent,
    ReceiptDataComponent,
    VolunterStatsComponent,
    
    
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    FormHelperModule,
    SharedModule,
    UserRoutingModule,
    FeatureModalModule
  ]
})
export class UserModule { }