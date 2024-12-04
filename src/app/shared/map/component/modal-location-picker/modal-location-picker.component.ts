import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { isArray } from 'src/app/helper/class/utilityHelper';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-modal-location-picker',
  templateUrl: './modal-location-picker.component.html',
  styleUrls: ['./modal-location-picker.component.scss']
})
export class ModalLocationPickerComponent implements OnInit {
  currentLocation: Array<any> = []
  initialLocation: Array<any> = [];
  showMap: boolean = false;
  mapReady: boolean = false;
  @ViewChild('mapComp', { static: true, read: MapComponent }) mapComp: MapComponent | undefined;
  public onClose: Subject<any> = new Subject();
  constructor(private _bsModalRef: BsModalRef) { }

  ngOnInit(): void { }

  setInput(data: any) {
    if (isArray(data.latLng)) {
      if (data.latLng[0] && data.latLng[1]) {
        this.initialLocation = data.latLng
        this.currentLocation = this.initialLocation;
      }
    }
    this.showMap = true
  }

  onMapEvent(ev: any) {
    console.log('map event', ev)
    if (ev.type == "ON_MARKER_DRAG_END") {
      this.currentLocation = ev.data;
    }
    if (ev.type == "CLICK") {
      this.mapComp?.clearAllMapMarker()
      this.mapComp?.addMarker(ev?.data?.latlng.lat, ev?.data?.latlng.lng)
      //latlng
    }

    if (ev.type == 'MAP_READY') {
      let lat: number = 25.3271091, long: number = 84.7577;
      if (isArray(this.initialLocation)) {
        lat = this.initialLocation[0];
        long = this.initialLocation[1];
      }
      this.mapReady = true;
      setTimeout(() => {
        this.setLocation([lat, long]),
          this.mapComp?.addMarker(lat, long)
      }, 1000)
    }
  }

  setLocation(loc: Array<number>) {
    if (loc[0] && loc[1]) {
      console.log('map instance', this.mapComp)
      this.mapComp?.setMapLatLong(loc[0], loc[1], 11)
    }
  }

  public onCancel(status = true): void {
    this.onClose.next(status ? this.currentLocation : false);
    this._bsModalRef.hide();
  }

}
