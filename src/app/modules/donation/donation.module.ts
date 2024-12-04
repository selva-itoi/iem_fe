import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonationRoutingModule } from './donation-routing.module';
import { CampaignListComponent } from './component/campaign-list/campaign-list.component';
import { FormHelperModule } from 'src/app/shared/form/form-hepler.module';
import { SharedModule } from 'primeng/api';
import { FeatureModalModule } from 'src/app/shared/feature-modal/feature-modal.module';
import { NewCampaignComponent } from './component/new-campaign/new-campaign.component';
import { DonationAllotmentListComponent } from './component/donation-allotment-list/donation-allotment-list.component';
import { ShareDonationModule } from './share-donation/share-donation.module';


@NgModule({
  declarations: [
    CampaignListComponent,NewCampaignComponent, DonationAllotmentListComponent
  ],
  imports: [
    CommonModule,
    DonationRoutingModule,
    FormHelperModule,
    SharedModule,
    FeatureModalModule,
    ShareDonationModule
  ]
})
export class DonationModule { }
