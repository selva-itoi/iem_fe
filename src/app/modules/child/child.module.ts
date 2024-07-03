import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'src/app/editor/editor.module';
import { FeatureModalModule } from 'src/app/shared/feature-modal/feature-modal.module';
import { FormHelperModule } from 'src/app/shared/form/form-hepler.module';
import { ImageUploadModule, SharedModule } from 'src/app/shared/shared.module';
import { EducationModule } from '../staff/staff.module';
import { ChildRoutingModule, routingComponents } from './child-routing.module';
import { ChildBasicInfoComponent } from './component/child-basic-info/child-basic-info.component';
import { ChildInfoComponent } from './component/child-info/child-info.component';
import { ChildPhysicalComponent } from './component/child-physical/child-physical.component';
import { ParentsComponent } from './component/parents/parents.component';
import { ChildSearchContainerComponent } from './component/child-search-container/child-search-container.component';
import { ChildEduYearlyUpdateComponent } from './component/child-edu-yearly-update/child-edu-yearly-update.component';
import { ChildEduYearlyListComponent } from './component/child-edu-yearly-list/child-edu-yearly-list.component';


@NgModule({
  declarations: [
    routingComponents,
    ParentsComponent,
    ChildPhysicalComponent,
    ChildBasicInfoComponent,
    ChildInfoComponent,
    ChildSearchContainerComponent,
    ChildEduYearlyUpdateComponent,
    ChildEduYearlyListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    ChildRoutingModule,
    SharedModule,
    ImageUploadModule,
    EducationModule,
    EditorModule,
    FeatureModalModule,
    FormHelperModule
  ]
})
export class ChildModule { }