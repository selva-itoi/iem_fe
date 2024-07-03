import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormHelperModule } from 'src/app/shared/form/form-hepler.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmailRoutingModule, routingComponents } from './email-routing.module';



@NgModule({
  declarations: [
    routingComponents
  ],
  imports: [
    CommonModule,
    EmailRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormHelperModule
  ]
})
export class EmailModule { }
