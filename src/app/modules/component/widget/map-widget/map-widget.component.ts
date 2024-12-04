import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, FormGroup } from '@angular/forms';
import { ResponseData } from 'src/app/helper/interface/response';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { MapComponent } from 'src/app/shared/map/component/map/map.component';

@Component({
  selector: 'map-widget',
  templateUrl: './map-widget.component.html',
  styleUrls: ['./map-widget.component.scss']
})
export class MapWidgetComponent implements OnInit {

  @ViewChild('map') map: MapComponent | undefined;
  LOCATION_DATA: any = {};
  searchControl: UntypedFormControl = new UntypedFormControl('ALL');
  constructor(private masterApi: MasterApiService) { }

  ngOnInit(): void {
    this.getAll('region');
    this.getAll('zone');
    //this.getAll('field');
  }

  getAll(tbl: string) {
    if (!this.LOCATION_DATA[tbl]) {
      this.masterApi.getFullData(tbl, []).then((res: ResponseData | any) => {
        if (res.result) {
          this.LOCATION_DATA[tbl] = res.result;
          this.mapData();
        }
      })
    }
  }

  changeStatus() {
    this.map?.clearAllMapMarker();
    this.mapData();
    // const status = this.searchControl.value.toLocaleLowerCase();
    // if (status == 'all') {
    //   ['region', 'zone', 'field'].forEach(a => {
    //     this.getAll(a);
    //   })
    // }
  }

  mapData() {
    Object.keys(this.LOCATION_DATA).forEach((a: any) => {
      const status: any = this.searchControl.value.toLocaleLowerCase();
      console.log(status)
      if (a == status || status == 'all') {
        this.LOCATION_DATA[a].forEach((b: any) => {
          this.addMarker(b, `assets/images/${a}_marker`,a);
        });
      }
    })
  }

  addMarker(a: any, icon: string = '',key='region') {
    if (+a.lat!==0) {
      this.map?.addMarker(a.lat, a.lng, { draggable: false, icon_url: icon }, { label: a[key+'Name'] });
    }
  }
}
