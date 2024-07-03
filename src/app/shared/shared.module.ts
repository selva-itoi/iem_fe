import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { AddressComponent } from '../core/component/address/address.component';
import { ImageUploadComponent } from '../core/component/image-upload/image-upload.component';
import { ImageLoadDirective } from '../helper/directive/image-load.directive';
import { FilterPipe } from '../helper/pipe/filter.pipe';
import { ImageDocGridComponent } from './component/image-doc-grid/image-doc-grid.component';
import { GoBackDirective } from './directive/go-back.directive';
import { LazyLoadRowDirective } from './directive/lazy-load-row.directive';
import { NoDoubleClickDirective } from './directive/no-double-click.directive';
import { SortPipe } from './pipe/sort.pipe';
import { DateFormatPipe } from './pipe/date-format.pipe';

@NgModule({
  declarations: [
    ImageUploadComponent,
    ImageLoadDirective,
    ImageDocGridComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [ImageUploadComponent, ImageLoadDirective, ImageDocGridComponent,]
})
export class ImageUploadModule { }



@NgModule({
  declarations: [
    AddressComponent,
    FilterPipe,
    NoDoubleClickDirective,
    DateFormatPipe,
    GoBackDirective,
    LazyLoadRowDirective,
    SortPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    DropdownModule,
    TableModule,
    CalendarModule,
    ImageUploadModule
  ],
  exports: [AddressComponent, DateFormatPipe, NoDoubleClickDirective, FilterPipe, GoBackDirective, LazyLoadRowDirective,SortPipe]
})
export class SharedModule { }
