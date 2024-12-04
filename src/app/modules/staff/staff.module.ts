import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'src/app/editor/editor.module';
import { FeatureModalModule } from 'src/app/shared/feature-modal/feature-modal.module';
import { FormHelperModule } from 'src/app/shared/form/form-hepler.module';
import { MapModule } from 'src/app/shared/map/map.module';
import { ImageUploadModule, SharedModule } from 'src/app/shared/shared.module';
import { ReportsStatsComponent } from './component/reports-stats/reports-stats.component';
import { StaffDedicationListComponent } from './component/staff-dedication-list/staff-dedication-list.component';
import { StaffDedicationViewComponent } from './component/staff-dedication-view/staff-dedication-view.component';
import { StaffEducationComponent } from './component/staff-education/staff-education.component';
import { StaffExpGemsComponent } from './component/staff-exp-gems/staff-exp-gems.component';
import { StaffExperienceComponent } from './component/staff-experience/staff-experience.component';
import { StaffNewDedicationComponent } from './component/staff-new-dedication/staff-new-dedication.component';
import { StaffOtherDetailComponent } from './component/staff-other-detail/staff-other-detail.component';
import { StaffTrainingComponent } from './component/staff-training/staff-training.component';
import { StaffTransferViewComponent } from './component/staff-transfer-view/staff-transfer-view.component';
import { routingComponents, StaffRoutingModule } from './staff-routing.module';
import { PayrollSettingComponent } from './component/payroll-setting/payroll-setting.component';
import { ProgressReportListComponent } from './component/progress-report-list/progress-report-list.component';
import { NewProgressReportComponent } from './component/new-progress-report/new-progress-report.component';
import { ProgressReportInfoComponent } from './component/progress-report-info/progress-report-info.component';
import { NewGoalsReportComponent } from './component/new-goals-report/new-goals-report.component';
import { GoalsReportListComponent } from './component/goals-report-list/goals-report-list.component';
import { StatisticsReportComponent } from './component/statistics-report/statistics-report.component';

@NgModule({
  declarations: [
    StaffEducationComponent,
  
    
    // StatisticsReportComponent,

    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StaffRoutingModule,
    CalendarModule,
    AutoCompleteModule,
    SharedModule,
    ImageUploadModule,
    FormHelperModule,
  ],
  exports: [StaffEducationComponent]
})
export class EducationModule { };

@NgModule({
  declarations: [
    routingComponents,
    StaffExperienceComponent,
    StaffExpGemsComponent,
    StaffTrainingComponent,
    StaffOtherDetailComponent,
    StaffTransferViewComponent,
    StaffNewDedicationComponent,
    StaffDedicationListComponent,
    ReportsStatsComponent,
    StaffDedicationViewComponent,
    ProgressReportListComponent,
    ProgressReportListComponent,
    NewProgressReportComponent,
    ProgressReportInfoComponent,
    NewGoalsReportComponent,
    GoalsReportListComponent,
    StatisticsReportComponent,
    PayrollSettingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StaffRoutingModule,
    CalendarModule,
    AutoCompleteModule,
    EditorModule,
    SharedModule,
    EducationModule,
    ImageUploadModule,
    FeatureModalModule,
    MapModule,
    FormHelperModule,
  ]
})
export class StaffModule { }