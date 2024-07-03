import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { FeatureModalModule } from 'src/app/shared/feature-modal/feature-modal.module';
import { FormHelperModule } from 'src/app/shared/form/form-hepler.module';
import { ImageUploadModule } from 'src/app/shared/shared.module';
import { DonationListRefComponent } from './component/donation-list-ref/donation-list-ref.component';
import { DonationAllotmentRefComponent } from './component/donation-allotment-ref/donation-allotment-ref.component';



@NgModule({
  declarations: [DonationListRefComponent, DonationAllotmentRefComponent],
  imports: [
    CommonModule,
    SharedModule,
    FeatureModalModule,
    ImageUploadModule,
    FormHelperModule
  ],
  exports : [DonationListRefComponent,DonationAllotmentRefComponent]
})
export class ShareDonationModule { }
