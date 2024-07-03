import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { PermissionGuard } from 'src/app/helper/guard/permission.guard';
import { ApplicationFormsComponent } from './component/application-forms/application-forms.component';
import { EditEmailTemplateComponent } from './component/edit-email-template/edit-email-template.component';
import { EditHomesComponent } from './component/edit-homes/edit-homes.component';
import { EmailTemplateComponent } from './component/email-template/email-template.component';
import { GeneralMasterComponent } from './component/general-master/general-master.component';
import { HomesInfoComponent } from './component/homes-info/homes-info.component';
import { HomesComponent } from './component/homes/homes.component';
import { LocationComponent } from './component/location/location.component';
import { MobileAppComponent } from './component/mobile-app/mobile-app.component';
import { OfficeComponent } from './component/office/office.component';
import { PayroleMasterComponent } from './component/payrole-master/payrole-master.component';
import { NewPromotionalOfficeComponent } from './component/new-promotional-office/new-promotional-office.component';
import { MagazineComponent } from './component/magazine/magazine.component';
const routes: Routes = [
  {
    path: UrlServices.PAGE_URL.MASTER.ADDRESS.URL.split(/[/]+/).pop(),
    component: LocationComponent,
    data: {
      title: 'Location Master',
      permission: UrlServices.PAGE_URL.MASTER.ADDRESS.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.MASTER.OFFICE.URL.split(/[/]+/).pop(),
    component: OfficeComponent,
    data: {
      title: 'Office Departments',
      permission: UrlServices.PAGE_URL.MASTER.OFFICE.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.MASTER.HOMES.URL.split(/[/]+/).pop(),
    component: HomesComponent,
    data: {
      title: 'Manage Homes/ Projects',
      permission: UrlServices.PAGE_URL.MASTER.HOMES.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.MASTER.VIEW_HOMES.URL.split(/[/]+/).pop(),
    component: HomesInfoComponent,
    data: {
      title: 'Homes/Projects Details',
      permission: UrlServices.PAGE_URL.MASTER.VIEW_HOMES.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.MASTER.UPDATE_HOMES.URL.split(/[/]+/).pop(),
    component: EditHomesComponent,
    data: {
      title: 'Manage Homes/ Projects',
      permission: UrlServices.PAGE_URL.MASTER.UPDATE_HOMES.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.MASTER.UPDATE_EMAIL.URL.split(/[/]+/).pop(),
    component: EditEmailTemplateComponent,
    data: {
      title: 'Manage Email Templates',
      permission: UrlServices.PAGE_URL.MASTER.UPDATE_EMAIL.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.MASTER.EMAIL.URL.split(/[/]+/).pop(),
    component: EmailTemplateComponent,
    data: {
      title: 'Manage Email Templates',
      permission: UrlServices.PAGE_URL.MASTER.EMAIL.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.MASTER.FORMS.URL.split(/[/]+/).pop(),
    component: ApplicationFormsComponent,
    data: {
      title: 'Manage Application Forms',
      permission: UrlServices.PAGE_URL.MASTER.FORMS.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.MASTER.GENERAL.URL.split(/[/]+/).pop(),
    component: GeneralMasterComponent,
    data: {
      title: 'Manage General Category',
      permission: UrlServices.PAGE_URL.MASTER.GENERAL.permission
    }
  },
  {
    path: UrlServices.PAGE_URL.MASTER.MOBILE.URL.split(/[/]+/).pop(),
    component: MobileAppComponent,
    data: {
      title: 'Mobile App',
      permission: UrlServices.PAGE_URL.MASTER.MOBILE.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.MASTER.PAYROLE.URL.split(/[/]+/).pop(),
    component: PayroleMasterComponent,
    data: {
      title: 'Payrole',
      permission: UrlServices.PAGE_URL.MASTER.PAYROLE.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.MASTER.MAGAZINE.URL.split(/[/]+/).pop(),
    component: MagazineComponent,
    data: {
      title: 'Magazine',
      permission: UrlServices.PAGE_URL.MASTER.MAGAZINE.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.MASTER.PROMOTIONAL_OFFICE.URL.split(/[/]+/).pop(),
    component: NewPromotionalOfficeComponent,
    data: {
      title: 'Church Ministry Area',
      permission: UrlServices.PAGE_URL.MASTER.PROMOTIONAL_OFFICE.permission
    },
    canActivate: [PermissionGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
export const routingComponents = [LocationComponent,GeneralMasterComponent, OfficeComponent,ApplicationFormsComponent,EmailTemplateComponent,EditEmailTemplateComponent,EditHomesComponent,HomesComponent,HomesInfoComponent];