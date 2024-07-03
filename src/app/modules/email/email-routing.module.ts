import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { PermissionGuard } from 'src/app/helper/guard/permission.guard';
import { EmailAddComponent } from './component/email-add/email-add.component';
import { EmailListComponent } from './component/email-list/email-list.component';

const routes: Routes = [{
  path: UrlServices.PAGE_URL.EMAIL.LIST.URL.split(/[/]+/).pop(),
  component: EmailListComponent,
  data: {
    title: 'EMAIL List',
    permission: UrlServices.PAGE_URL.EMAIL.LIST.permission
  },
  canActivate: [],
},
{
  path: UrlServices.PAGE_URL.EMAIL.ADD.URL.split(/[/]+/).pop(),
  component: EmailAddComponent,
  data: {
    title: 'New EMAIL',
    permission: UrlServices.PAGE_URL.EMAIL.ADD.permission,
    queryParam: 'UPDATE' // permission
  },
  canActivate: [],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRoutingModule { }
export const routingComponents = [EmailAddComponent,EmailListComponent]