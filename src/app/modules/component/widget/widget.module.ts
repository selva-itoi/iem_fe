import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MapModule } from 'src/app/shared/map/map.module';
import { ImageUploadModule } from 'src/app/shared/shared.module';
import { BirthdayWidgetComponent } from './birthday-widget/birthday-widget.component';
import { ClockComponent } from './clock/clock.component';
import { MapWidgetComponent } from './map-widget/map-widget.component';



@NgModule({
  declarations: [ClockComponent, BirthdayWidgetComponent, MapWidgetComponent],
  imports: [CommonModule,ImageUploadModule,MapModule,ReactiveFormsModule],
  exports: [BirthdayWidgetComponent,ClockComponent,MapWidgetComponent]
})
export class WidgetModule { }
