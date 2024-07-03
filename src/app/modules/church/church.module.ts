import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FeatureModalModule } from 'src/app/shared/feature-modal/feature-modal.module';
import { FormHelperModule } from 'src/app/shared/form/form-hepler.module';
import { ImageUploadModule, SharedModule } from 'src/app/shared/shared.module';
import { ShareDonationModule } from '../donation/share-donation/share-donation.module';
import { ChurchRoutingModule, routingComponents } from './church-routing.module';
import { ChurchBasicComponent } from './component/church-basic/church-basic.component';
import { ChurchCollectionComponent } from './component/church-collection/church-collection.component';
import { ChurchDocComponent } from './component/church-doc/church-doc.component';
import { ChurchReportListComponent } from './component/church-report-list/church-report-list.component';
import { CouncilMemberComponent } from './component/council-member/council-member.component';
import { MemberInfoComponent } from './component/member-info/member-info.component';
import { MemberListComponent } from './component/member-list/member-list.component';
import { NewChurchReportComponent } from './component/new-church-report/new-church-report.component';
import { NewMemberComponent } from './component/new-member/new-member.component';
import { NewProgressReportComponent } from './component/new-progress-report/new-progress-report.component';
import { ProgressReportInfoComponent } from './component/progress-report-info/progress-report-info.component';
import { ProgressReportListComponent } from './component/progress-report-list/progress-report-list.component';
import { ReportListComponent } from './component/report-list/report-list.component';



@NgModule({
  declarations: [
    ChurchBasicComponent,
    routingComponents,
    CouncilMemberComponent,
    ChurchDocComponent,
    NewChurchReportComponent,
    ReportListComponent,
    NewMemberComponent,
    MemberListComponent,
    MemberInfoComponent,
    ChurchReportListComponent,
    ChurchCollectionComponent,
    ProgressReportListComponent,
    NewProgressReportComponent,
    ProgressReportInfoComponent
  ],
  imports: [
    CommonModule,
    ChurchRoutingModule,
    ReactiveFormsModule,
    FormHelperModule,
    ImageUploadModule,
    FeatureModalModule,
    SharedModule,
    ShareDonationModule,
  ]
})
export class ChurchModule { }
