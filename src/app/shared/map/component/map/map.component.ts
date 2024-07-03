import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { markerConfig, markerTooltip } from 'src/app/helper/interface/map-interface';
import { AlertService } from 'src/app/helper/service/alert.service';
import { LeafletService } from '../../service/leaflet.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [LeafletService]
})
export class MapComponent implements OnInit {
  @Input() type: 'PICKER' | 'LOCATION_POINTER' = 'PICKER';
  mapEventSubscription: Subscription = {} as Subscription;
  @Output() onMapEvent: EventEmitter<{ type: string, data: any }> = new EventEmitter();
  currentLocationPointer: Array<number> = [];
  mapReady: boolean = false
  @Input() public set locationPointer(latLng: Array<any>) {
    this.currentLocationPointer = latLng;
    console.log('location', latLng)
    setTimeout(() => { this.setLocation(latLng, true, false) }, 1000)
  }
  //public LeafletService :LeafletService=new LeafletService()
  constructor(public LeafletService: LeafletService, private ref: ChangeDetectorRef,
    private elf: ElementRef,
    private alertService: AlertService) { }
  ngOnInit(): void {

    this.mapEventSubscription = this.LeafletService.getObserverEvents().subscribe((message: any) => {
      if (message) {
        this.onMapEvent.emit(message);
        switch (message.type) {
          case "zoomEvent":
            this.zoomController(message.data)
            break;
          case "MAP_READY":
            this.mapReady = true;
            // if (this.type == 'LOCATION_POINTER') {
            //   if (isArray(this.currentLocationPointer)) {
            //     setTimeout(() => {this.setLocation(this.currentLocationPointer,true)},1000)
            //   }
            // }
            break;
          case "POPUP_OPEN":
            this.popupController(message.data)
            break;
          case "notification":
            this.alertService.showToast(message.data.type, message.data.message)
            break;
        }
      }
    });
  }

  setLocation(loc: Array<number>, isMarker: boolean = false, draggable = true) {
    if (!this.mapReady) {
      return;
    }
    if (loc[0] == undefined) {
      return;
    }
    const l = loc[0], lng = loc[1];
    this.LeafletService?.updateMapByLat(l, lng, 11);
    if (isMarker)
      this.LeafletService?.addMarker(l, lng, { draggable: draggable })
  }

  clearAllMapMarker() {
    this.LeafletService.clearAllMapMarker();
  }
  setMapLatLong(lat: number, long: number, zoom = 10) {
    if (+lat && + long) {
      this.LeafletService.updateMapByLat(lat, long, zoom)
    }
  }

  addMarker(lat: number, long: number, config: markerConfig = { draggable: true }, tooltip: markerTooltip = { label: '' }) {
    this.LeafletService.addMarker(lat, long, config, tooltip)
  }

  removeElements(els: any) {
    let element: any = Array.from(els) //convert array;
    element.map((a: any) => a.remove());
  }

  popupController(layer: any) {
    let editBtnElm = this.elf.nativeElement.getElementsByClassName("map-layer-edit-btn"),
      viewBtnElm = this.elf.nativeElement.getElementsByClassName("map-layer-view-btn"),
      addBtnElm = this.elf.nativeElement.getElementsByClassName("map-layer-add-btn"),
      removeBtnElm = this.elf.nativeElement.getElementsByClassName("map-layer-remove-btn"),
      editBtn = editBtnElm[editBtnElm.length - 1] || null,
      addBtn = addBtnElm[addBtnElm.length - 1] || null,
      viewBtn = viewBtnElm[viewBtnElm.length - 1] || null,
      removeBtn = removeBtnElm[removeBtnElm.length - 1] || null;
    //remove btn if already selected
    if (addBtn && removeBtn) {
      if (layer.layerSelected) {
        this.removeElements(addBtnElm);
        addBtn = null;
      } else {
        this.removeElements(removeBtnElm);
        editBtn = null;
      }
    }

    //action for add btn click
    if (addBtn) {
      if (addBtn.eventListeners().length == 0) {
        addBtn.addEventListener("click", (e: any) => {
          this.LeafletService.setEvents('popup-click-add', layer),
            this.LeafletService.closeAllPopup();
        });
      }
    }

    //action for remove btn click
    if (removeBtn) {
      if (removeBtn.eventListeners().length == 0) {
        removeBtn.addEventListener("click", (e: any) => {
          this.LeafletService.setEvents('popup-click-remove', layer),
            this.LeafletService.closeAllPopup();
        });
      }
    }

    //action for view btn click
    if (viewBtn) {
      if (viewBtn.eventListeners().length == 0) {
        viewBtn.addEventListener("click", (e: any) => {
          this.LeafletService.setEvents('popup-click-view', layer),
            this.LeafletService.closeAllPopup();
        });
      }
    }

    //action for edit btn click
    if (editBtn) {
      if (editBtn.eventListeners().length == 0) {
        editBtn.addEventListener("click", (e: any) => {
          this.LeafletService.observeEvents.next({ type: 'popup-click-edit', data: layer }),
            this.LeafletService.closeAllPopup();
        });
      }
    }

    let delBtnElm = this.elf.nativeElement.getElementsByClassName("map-layer-delete-btn");
    let delBtn = delBtnElm[delBtnElm.length - 1] || null;
    if (delBtn) {
      if (delBtn.eventListeners().length == 0) {
        delBtn.addEventListener("click", (e: any) => {
          this.LeafletService.observeEvents.next({ type: 'popup-click-delete', data: layer }),
            this.LeafletService.closeAllPopup();
        });
      }
    }
  }


  zoomController(e: any) {
    let zoomLevel = e.getZoom();
    var tooltip;
    tooltip = this.elf.nativeElement.querySelectorAll('.map-label-circle');
    let ratio: number;

    switch (this.LeafletService?.mapCurrentLayerType) {
      case "COUNTRY":
        if (zoomLevel > 6) {
          ratio = 1.5;
        }
        else {
          ratio = 6;
        }
        break;

      case "STATE":
        if (zoomLevel > 6) {
          ratio = 1.8;
        }
        else {
          ratio = 0;
        }
        break;

      case "DISTRICT":
        if (zoomLevel > 8) {
          ratio = 1.2;
        }
        else {
          ratio = 0;
        }
        break;
      case "SUB-DISTRICT":
        if (zoomLevel > 10) {
          ratio = 0.8;
        }
        else {
          ratio = 0;
        }
        break;

      default:
        if (zoomLevel > 12) {
          ratio = 0.9;
        }
        else {
          ratio = 0.3;
        }
        break;
    }

    if (tooltip) {
      tooltip.forEach((element: any) => {
        element.style.fontSize = ratio * zoomLevel + "px";
      });
    }

  }

  ngOnDestroy(): void {
    this.mapEventSubscription.unsubscribe();
  }
}
