import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { EditorModule } from 'src/app/editor/editor.module';
import { FeatureModalModule } from 'src/app/shared/feature-modal/feature-modal.module';
import { FormHelperModule } from 'src/app/shared/form/form-hepler.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditMasterComponent } from './component/edit-master/edit-master.component';
import { EditPayrollPolicyComponent } from './component/edit-payroll-policy/edit-payroll-policy.component';
import { MasterComponent } from './component/master/master.component';
import { MobileAppComponent } from './component/mobile-app/mobile-app.component';
import { NewPayrollHeadComponent } from './component/new-payroll-head/new-payroll-head.component';
import { PayroleMasterComponent } from './component/payrole-master/payrole-master.component';
import { MasterRoutingModule, routingComponents } from './master-routing.module';
import { NewPromotionalOfficeComponent } from './component/new-promotional-office/new-promotional-office.component';
import { MagazineComponent } from './component/magazine/magazine.component';
@NgModule({
  declarations: [
    routingComponents,
    EditMasterComponent,
    MasterComponent,
    MobileAppComponent,
    PayroleMasterComponent,
    NewPayrollHeadComponent,
    EditPayrollPolicyComponent,
    NewPromotionalOfficeComponent,
    MagazineComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormHelperModule,
    FormsModule,
    TableModule,
    ChipsModule,
    CalendarModule,
    DropdownModule,
    MasterRoutingModule,
    SharedModule,
    FormHelperModule,
    EditorModule,
    FeatureModalModule
  ]
})
export class MasterModule { }
