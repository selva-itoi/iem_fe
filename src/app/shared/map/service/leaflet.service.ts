import * as L from 'leaflet';
import { latLng, Layer, Marker, tileLayer } from 'leaflet';
import { BehaviorSubject, Observable } from 'rxjs';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { markerConfig, markerTooltip } from 'src/app/helper/interface/map-interface';

export class LeafletService {
  public map: any;
  cartodbAttribution = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap Contributors</a>';

  //https://m3.mapserver.mapy.cz/base-m/{z}-{x}-{y}
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: this.cartodbAttribution,
    //tileSize: 512,
    //zoomOffset: -1
  });
  //satellite = tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  satellite = tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    detectRetina: true,
    attribution: this.cartodbAttribution
  });

  lat = 20.5937;
  long = 98.9629;
  zoom = 5;
  layers: Layer[] = [];
  allMarker: Marker[] = []
  options = {
    zoom: this.zoom,
    minZoom: 2,
    zoomControl: false,
    center: latLng({ lat: this.lat, lng: this.long }),
  };
  leagend: any;
  zoomeControllerShow = true;
  layerControllerShow = true;
  baseLayers = {
    "Street Map": this.streetMaps,
    "Satellite Map": this.satellite
  };
  mapLoadingStatus: boolean = false
  observeEvents: any;
  mapCurrentLayerType: 'COUNTRY' | any;

  constructor() {
    this.observeEvents = new BehaviorSubject<any>(null);
  }

  setEvents(type: any, data: any) {
    this.observeEvents.next({ type: type, data: data })
  }
  getObserverEvents(): Observable<any> {
    return this.observeEvents.asObservable();
  }

  mapReady(map: L.Map) {
    this.mapLoadingStatus = true;
    map.addLayer(this.streetMaps);
    if (this.layerControllerShow)
      map.addControl(L.control.layers(this.baseLayers));
    if (this.zoomeControllerShow)
      map.addControl(L.control.zoom({ position: 'bottomright' }));

    setTimeout(() => {
      map.invalidateSize();
    }, 0);
    this.map = map;
    map.on({
      zoomend: (e) => this.observeEvents.next({ type: 'zoomEvent', data: e.target }),//this.zommEvent(e.target)
      click: (e) => this.observeEvents.next({ type: 'CLICK', data: e }),
    });
    this.mapLoadingStatus = false;
    this.setEvents('MAP_READY', true);
  }

  addMarker(lat: number, long: number, config: markerConfig = { draggable: true }, tooltip: markerTooltip = { label: '' }) {
    const myIcon = L.icon({
      //iconUrl: 'marker-icon.png',
      iconRetinaUrl: config?.icon_url ? config.icon_url + '-2x.png' : 'assets/images/marker-icon-2x.png',
      shadowUrl: 'assets/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
      //shadowUrl: "http://leafletjs.com/examples/custom-icons/leaf-shadow.png",
      //iconSize: [25, 41],
      // iconAnchor: [12, 41],
      //popupAnchor: [-3, -76],
      // shadowSize: [1, 1],
      //popupAnchor: [-3, -76],
      iconUrl: config?.icon_url ? config.icon_url + '.png' : 'assets/images/marker-icon.png',
      //shadowUrl: 'my-icon-shadow.png',
      //shadowSize: [68, 95],
      //shadowAnchor: [22, 94]

    });
    //const html = "<b>usr " + tooltip.label + "</b><br/>tweet " + i;
    const latLng: any = L.latLng(lat, long)
    const marker: Marker = L.marker(latLng, { draggable: config.draggable, icon: myIcon }).addTo(this.map);
    if (tooltip.label) {
      marker.bindPopup(tooltip.label);
    }
    const self = this;
    marker.on('dragend', function (e: any) {
      self.setEvents('ON_MARKER_DRAG_END', [marker.getLatLng().lat, marker.getLatLng().lng]);
    });
    this.allMarker.push(marker);
    this.map.addLayer(marker);
  }

  addCircleMarker(label: any, center: any, draggable: boolean = false) {
    if (label && center) {
      let CircleMarker: any = new L.CircleMarker(center, {
        radius: 0.1,
      }).bindTooltip(label, { permanent: true, direction: "center", className: "map-label-circle" }).openTooltip();
      CircleMarker.myTag = "circleMarker";
      this.map ? this.map.addLayer(CircleMarker) : '';
    }
  }

  addPopup(layer: any, edit = false) {
    var popupContent;
    if (edit && layer.feature.surveyed && layer.feature.surveyorId != "") {
      popupContent = '<p>Do you want to edit this ' + layer.feature.surveyLevel + ' ?</p>';
      popupContent += '<button  class="btn btn-primary button-edit map-layer-edit-btn">Edit</button> <button  class="btn btn-danger button-delete map-layer-delete-btn">Delete</button>';
    } else if (edit && layer.feature.surveyed && layer.feature.surveyorId == "") {
      // already surveyed by others need to open info
      popupContent = '<p>Survey Details</p>';
      popupContent += '<button  class="btn btn-success button-edit map-layer-add-btn">Add Survey</button> <button  class="btn btn-danger button-edit map-layer-remove-btn">Remove Survey </button> <button  class="btn btn-info button-delete map-layer-view-btn">View Details</button>';
    } else {
      return;
    }
    layer.bindPopup(popupContent).on("popupopen", (binData: any) => {
      // if (this.leafletUtility.checkExistsLayers(binData.target.feature)) {
      //   binData.target.layerSelected = true;
      // } else {
      //   binData.target.layerSelected = false;
      // }
      this.setEvents('POPUP_OPEN', binData.target);
    });
  }

  updateMapByLat(lat: number, long: number, zoom = 10) {
    if (typeof +lat != 'number' || typeof +long != 'number') {
      return;
    }
    if(+lat == 0 && +long==0){
      return;
    }
    this.map.flyTo([+lat, +long], zoom, {
      animate: true,
      duration: 1.5
    });
  }

  updateMapLocation(bounds: L.Bounds, zoom = 10) {
    this.map ? this.map.flyToBounds(bounds, { animate: true, duration: 0.25 }) : '';

  }

  closeAllPopup() {
    this.map.closePopup();
  }

  public getmapinstance(): any {
    return this.map;
  }

  clearAllMapMarker() {
    this.allMarker.forEach((a: Marker) => {
      if(a instanceof L.Marker){
        this.map.removeLayer(a);
      }
      
    })
  }

  clearMap() {
    //this.previousLayer = _.cloneDeep(this.layers[this.layers.length - 1]);
    this.layers = [];
    //this.currentJsonLayer;
  }

  destroy_map() {

    if (this.map) {
      //this.currentJsonLayer = null;
      this.layers = [];
      this.observeEvents.next();
      this.map.off();
      this.map.remove();
      this.map = null;
    }
  }
}