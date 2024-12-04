import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatureModalModule } from '../shared/feature-modal/feature-modal.module';
import { FormHelperModule } from '../shared/form/form-hepler.module';
import { AccessDeniedComponent } from './component/access-denied/access-denied.component';
import { DashbaordComponent } from './component/dashbaord/dashbaord.component';
import { WidgetModule } from './component/widget/widget.module';
import { ModulesRoutingModule } from './modules-routing.module';
import { ModulesComponent } from './modules.component';

@NgModule({
  declarations: [
    DashbaordComponent,
    ModulesComponent,
    AccessDeniedComponent,
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    FormHelperModule,
    FeatureModalModule,
    WidgetModule,
    FormsModule
  ],
})
export class ModulesModule { }