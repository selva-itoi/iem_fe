import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { ExportComponent } from './component/export/export.component';

const routes: Routes = [{
  path: UrlServices.PAGE_URL.REPORT.STAFF_FLAT_REPORT.URL.split(/[/]+/).pop(),
  component: ExportComponent,
  data: {
    title: 'Report Export',
   // permission: UrlServices.PAGE_URL.REPORT.STAFF_FLAT_REPORT.permission,
   // queryParam: 'FLAT_REPORT'
  },
  canActivate: [],
},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
