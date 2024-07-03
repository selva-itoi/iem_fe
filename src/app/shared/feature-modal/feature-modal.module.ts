import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormHelperModule } from '../form/form-hepler.module';
import { ModifyListComponent } from './modify-list/modify-list.component';
import { InfoMapComponent } from './info-map/info-map.component';
import { PageBreadcrumbComponent } from './page-breadcrumb/page-breadcrumb.component';
import { RouterModule } from '@angular/router';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { ImageUploadModule, SharedModule } from '../shared.module';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { ProfileWidgetComponent } from './profile-widget/profile-widget.component';
import { SponsorBasicComponent } from './sponsor-basic/sponsor-basic.component';
import { StaffBasicComponent } from './staff-basic/staff-basic.component';
import { SponsorshipAllotmentRefListComponent } from './sponsorship-allotment-ref-list/sponsorship-allotment-ref-list.component';
import { TabHeadComponent } from './tab-head/tab-head.component';
import { SponsorshipRefComponent } from './sponsorship-ref/sponsorship-ref.component';
import { ChildSbilingRefComponent } from './child-sbiling-ref/child-sbiling.component';
import { ModifyHeadInfoComponent } from './tab-head/modify-head-info/modify-head-info.component';
import { BrowseStaffWidgetsComponent } from './tab-head/browse-staff-widgets/browse-staff-widgets.component';


@NgModule({
  declarations: [
    ModifyListComponent,
    SponsorshipAllotmentRefListComponent,
    ProfileWidgetComponent,
    SponsorBasicComponent,
    StaffBasicComponent,
    InfoMapComponent,
    PageBreadcrumbComponent,
    PageLoaderComponent,
    InfoModalComponent,
    TabHeadComponent,
    SponsorshipRefComponent,
    ChildSbilingRefComponent,
    ModifyHeadInfoComponent,
    BrowseStaffWidgetsComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormHelperModule,
    ImageUploadModule,
    SharedModule
  ],
  exports: [ModifyListComponent, SponsorshipAllotmentRefListComponent, InfoMapComponent, ProfileWidgetComponent, PageBreadcrumbComponent, PageLoaderComponent, ChildSbilingRefComponent,
    TabHeadComponent, SponsorshipRefComponent, ModifyHeadInfoComponent,BrowseStaffWidgetsComponent]
})
export class FeatureModalModule { }
