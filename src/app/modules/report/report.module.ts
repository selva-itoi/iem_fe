import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FeatureModalModule } from 'src/app/shared/feature-modal/feature-modal.module';
import { FormHelperModule } from 'src/app/shared/form/form-hepler.module';
import { ExportComponent } from './component/export/export.component';
import { ReportRoutingModule } from './report-routing.module';
@NgModule({
  declarations: [
    ExportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReportRoutingModule,
    FormHelperModule,
    FeatureModalModule,
  ]
})
export class ReportModule { }