import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './component/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ModalLocationPickerComponent } from './component/modal-location-picker/modal-location-picker.component';
import { MapFormComponent } from './component/map-form/map-form.component';



@NgModule({
  declarations: [
    MapComponent,
    ModalLocationPickerComponent,
    MapFormComponent
  ],
  imports: [
    CommonModule,
    LeafletModule
  ],
  exports:[MapComponent]
})
export class MapModule { }
