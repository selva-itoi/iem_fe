import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FeatureModalModule } from 'src/app/shared/feature-modal/feature-modal.module';
import { FormHelperModule } from 'src/app/shared/form/form-hepler.module';
import { ImageUploadModule, SharedModule } from 'src/app/shared/shared.module';
import { ShareDonationModule } from '../donation/share-donation/share-donation.module';
import { AllotmentInfoComponent } from './component/allotment-info/allotment-info.component';
import { AssignInfoComponent } from './component/assign-info/assign-info.component';
import { DonationInfoComponent } from './component/donation-info/donation-info.component';
import { DonationListComponent } from './component/donation-list/donation-list.component';
import { NewDonationComponent } from './component/new-donation/new-donation.component';
import { NewSponsorshipComponent } from './component/new-sponsorship/new-sponsorship.component';
import { SponsorshipDonationRefComponent } from './component/sponsorship-donation-ref/sponsorship-donation-ref.component';
import { ViewSponsorComponent } from './component/view-sponsor/view-sponsor.component';
import { SponsorRoutingModule, routingComponents } from './sponsor-routing.module';
import { MagazineListComponent } from './component/magazine-list/magazine-list.component';
import { NewMagazineComponent } from './component/new-magazine/new-magazine.component';
import { TableModule } from 'primeng/table';
import { TopListComponent } from './component/top-list/top-list.component';

@NgModule({
  declarations: [
    routingComponents,
    NewSponsorshipComponent,
    AllotmentInfoComponent,
    ViewSponsorComponent,
    DonationListComponent,
    DonationInfoComponent,
    NewDonationComponent,
    SponsorshipDonationRefComponent,
    MagazineListComponent,
    NewMagazineComponent,
    AssignInfoComponent,
    TopListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SponsorRoutingModule,
    CalendarModule,
    SharedModule,
    FeatureModalModule,
    ImageUploadModule,
    FormHelperModule,
    ShareDonationModule,
    FormsModule,
    TableModule,

  ]
})
export class SponsorModule { }
