import { Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { createSearchTableQuery, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';

interface addressConfig {
  hideBasic?: boolean,
  isView?: boolean
  hideDistictExtension?: boolean
}
interface addressData {
  config?: addressConfig,
  title?: string,
  id?: string | number,
  tbl?: any,
  hideBasic?: boolean,
  //hideDistictExtension: boolean,
  isView?: boolean
}
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {
  @Input() title: string = 'address';
  @Input() public set id(s: any) {
    if (!isEmptyObj(s) && s) {
      this.data['id'] = s;
      this.getData();
    }
  }
  hideMe: boolean = false; // to hide all fields;
  data: addressData = {} as addressData;
  @Input() submitted: boolean = false;
  autocompleteValue: Array<any> = [];
  autocompleteLevelValue: Array<any> = [];
  addressForm: FormGroup | any = {} as FormGroup;
  addressData: any = {};
  filterKey: string = 'wardName';
  districtData: any = [];
  subDistrictData: any = [];
  stateData: any = [];
  countryData: any = [];
  LEVEL = {
    CITY: 'cityName',
    PANCHAYAT: 'pName'
  }
  levelFilterKey: string = this.LEVEL.CITY;
  isPresent: boolean = false;
  isPermanent: boolean = false;
  isReadonly: any = null;
  collectionData: any = [];
  masterLoading: any = {};
  @ViewChild('autocomplete') autocomplete: any;
  isModal: boolean = false;
  @Input() isPage = false;
  _bsModalRef: BsModalRef = {} as BsModalRef;
  public onClose: Subject<boolean> = new Subject();
  initialFormValue: any = {};
  constructor(private masterApi: MasterApiService,
    private injector: Injector,
    private alertService: AlertService) {
    this.initForm();
  }

  ngOnDestroy(): void { }


  ngOnInit(): void {
    if (!this.isPage) {
      this._bsModalRef = this.injector.get<BsModalRef>(BsModalRef);
    } else {
      this.setInput({ id: null });
    }
    this.getFullData([], 'countryData');
  }
  setReadOnly(status: boolean) {
    Object.keys(this.addressForm.controls).forEach(e => {
      this.addressForm.get(e).disable();
    })
  }
  hideAll(status = true) {
    this.hideMe = status;
  }

  hideBasic(status: boolean = false) {
    this.data.hideBasic = status;
    console.log('after hide', this.data)
  }

  removeValidators() {
    const formControl = ['district', 'street', 'pincode', 'district', 's_district', 'level', 'locationSearch', 'levelSearch']
    formControl.forEach((e: any) => {
      this.addressForm.get(e).clearValidators();
      this.addressForm.get(e).updateValueAndValidity();
    });
  }

  async initForm() {
    const group: any = {};
    group.country = new FormControl('', [Validators.required]);
    group.state = new FormControl('', [Validators.required]);
    group.district = new FormControl('', [Validators.required]);
    group.address_line = new FormControl('');
    if (!this.data?.hideBasic) {
      group.street = new FormControl('', );
      group.pincode = new FormControl('', [Validators.pattern(VALIDATOR_PATTERNS.PINCODE)]);
    }

    // if (!this.data?.hideDistictExtension) {
    group.level = new FormControl(this.LEVEL.CITY, );
    group.s_district = new FormControl('', []);
    group.locationSearch = new FormControl('' );
    group.levelSearch = new FormControl('', );
    //}

    group.address = new FormControl('', []);
    this.addressForm = new FormGroup(group);
  }

  apiPayload() {
    console.log(this.addressForm, 'address formvaluee api ')
    let payload: any = this.addressForm.value;
    payload.isPresent = this.isPresent;
    payload.isPermanent = this.isPermanent;
    payload.city = 0;
    payload.panchayat = 0;
    payload.village = 0;
    payload.ward = 0;
    const location = this.addressForm.value.locationSearch || '0';
    const levelSearch = this.addressForm.value.levelSearch || '0';
    if (this.addressForm.value.level == this.LEVEL.CITY) {
      payload.city = levelSearch;
      payload.ward = location;
      payload.wardName = this.autocompleteValue.find((a: any) => a.id == payload.ward)?.wardName;
      payload.cityName = this.autocompleteLevelValue.find((a: any) => a.id == payload.city)?.cityName;
    } else {
      payload.panchayat = levelSearch;
      payload.village = location
      payload.vName = this.autocompleteValue.find((a: any) => a.id == payload.village)?.vName;
      payload.pName = this.autocompleteLevelValue.find((a: any) => a.id == payload.panchayat)?.pName;
    }
    payload.countryName = this.countryData.find((a: any) => a.id == payload.country)?.countryName;
    payload.stateName = this.stateData.find((a: any) => a.id == payload.state)?.stateName;
    payload.districtName = this.districtData.find((a: any) => a.id == payload.district)?.districtName;
    payload.subdistrictName = this.subDistrictData.find((a: any) => a.id == payload.s_district)?.subdistrictName;
    return payload;
  }

  onSelectAutocomplete(ev: any) {
    console.log(this.apiPayload())
    console.log('on select', ev)
    console.log(this.addressForm.value)
  }

  onChangeLevel(apiCall: boolean = true) {
    console.log('on changes call');
    this.levelFilterKey = this.addressForm.value.level;
    this.filterKey = this.levelFilterKey == this.LEVEL.CITY ? 'wardName' : 'vName';
    if (this.addressForm.value.s_district && apiCall) {
      this.getFullData([], 'autocompleteLevelValue', true);
      this.autocompleteValue = [];
    }
  }

  filterItems(ev: any, type: 'LOCATION' | 'LEVEL' = 'LOCATION') {
    if (!ev.query) {
      return;
    }
    if (!this.addressForm.value.levelSearch?.id && type == 'LOCATION') {
      return;
    }
    if (!this.addressForm.value.s_district && type == 'LEVEL') {
      return;
    }

    this.levelFilterKey = this.addressForm.value.level;
    this.filterKey = this.levelFilterKey == this.LEVEL.CITY ? 'wardName' : 'vName';
    console.log(this.filterKey, 'filter key')
    const key: string = type == 'LEVEL' ? this.levelFilterKey : this.filterKey;
    const query = {
      filters: {
        [key]: {
          value: ev.query,
          matchMode: "contains"
        }
      },
      rows: 10,
      first: 0
    }
    const filterQuery = createSearchTableQuery(query);
    let tbl: string = '',
      cond: Array<any> = [this.addressForm.value.s_district]
    if (type == 'LOCATION') {
      cond = [this.addressForm.value.levelSearch?.id || 0];
      tbl = this.levelFilterKey == this.LEVEL.CITY ? 'ward' : 'village';
    } else {
      //@ts-ignore
      tbl = Object.keys(this.LEVEL).find((key: any) => this.LEVEL[key] === this.addressForm.value.level);
    }
    this.masterApi.getFullData(tbl.toLowerCase(), cond, false, filterQuery).then((res: ResponseData) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        if (type == 'LOCATION') {
          this.autocompleteValue = res.result.data;
        } else {
          this.autocompleteLevelValue = res.result.data;
        }
      }
    })
  }

  setInput(data: any) {
    console.log(data)
    if (!isEmptyObj(data)) {
      this.isModal = true;
    }
    this.data = data;
    if (data.title) {
      this.title = data.title;
    }
    console.log(data)
    this.initForm();
    this.getData();
  }


  getData() {
    if (!this.data.id) {
      return
    }
    const api: any = this.data.tbl == 'field' ? this.masterApi.getFieldByid(this.data.id) : this.masterApi.getById(this.data.tbl, this.data.id);
    api.then((res: ResponseData) => {
      if (res.statusCode == 200) {
        if (!isEmptyObj(res.result)) {
          this.addressData = res.result;
          console.log('call api ', this.addressData);
          this.apiCallDependent();
        }
      }
    })
  }

  apiCallDependent() {
    const country = this.addressData.country,
      subDistrict = this.addressData.s_district,
      district = this.addressData.district,
      state = this.addressData.state;
    this.getFullData([country], 'stateData');
    this.getFullData([state], 'districtData');
    this.getFullData([district], 'subDistrictData');
    this.getFullData([+this.addressData.s_district], 'autocompleteLevelValue');
    this.getFullData([+this.addressData.city || +this.addressData.panchayat], 'autocompleteValue');
  }


  applyFormValue(data: any = {}) {
    console.log(data, 'incoming data')
    this.addressData = data;
    console.log(this.countryData[data.country])
    if (isEmptyObj(data)) {
      return
    }
    console.log(this.addressForm);
    this.apiCallDependent();
  }

  updateAddressByField(id: string) {
    if (id) {
      this.masterApi.getFieldByid(id).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.applyFormValue(res.result);
        }
      })
    }
  }

  updateFormValue() {
    if (isEmptyObj(this.addressData)) {
      return;
    }
    const aValue: any = {};
    Object.keys(this.addressForm.controls).forEach(key => {
      aValue[key] = this.addressData[key];
      if (key == 'locationSearch' || key == 'levelSearch') {
        let keyFid = '';
        let k = '';
        if (key == 'levelSearch') {
          if (this.addressData.city && this.addressData.city != '0') {
            keyFid = this.LEVEL.CITY;
            k = 'city';
          } else if (this.addressData.panchayat && this.addressData.panchayat != '0') {
            keyFid = this.LEVEL.PANCHAYAT;
            k = 'panchayat';
          }
          aValue['level'] = keyFid;
        } else {
          if (this.addressData.ward && this.addressData.ward != '0') {
            keyFid = 'wardName';
            k = 'ward';
          } else if (this.addressData.village && this.addressData.village != '0') {
            keyFid = 'vName';
            k = 'village';
          }
        }
        aValue[key] = this.addressData[k]// { id: this.addressData[k], [keyFid]: this.addressData[keyFid] }
      }
    });
    this.addressForm.patchValue(aValue);
    this.initialFormValue = this.addressForm.value;
    console.log(this.initialFormValue, 'initial form vaklue');
    this.onChangeLevel(false);
  }


  disableAllField(status = true) {
    Object.keys(this.addressForm.controls).forEach(value => {
      if (status) {
        this.addressForm.controls[value].disable();
      } else {
        this.addressForm.controls[value].enable();
      }
    });
  }

  isValidForm() {
    this.submitted = true;
    console.log(this.addressForm, 'address from valid')
    return this.addressForm.valid;
  }

  getFullData(cond: any = [], pValue: 'autocompleteValue' | 'countryData' | 'stateData' | 'subDistrictData' | 'districtData' | 'autocompleteLevelValue', isEvent = false) {
    const country = this.addressForm.value.country,
      state = this.addressForm.value.state,
      district = this.addressForm.value.district;
    let tbl: string = pValue.split("Data")[0].toLowerCase() || 'country';
    // subDistrict = this.addressForm.value.subDistrict;
    const patchData: any = {};
    if (isEvent) {
      switch (pValue) {
        case 'countryData':
          patchData['country'] = '';
          patchData['state'] = '';
          patchData['district'] = '';
          patchData['s_district'] = '';
          patchData['levelSearch'] = '';
          patchData['locationSearch'] = '';
          break;
        case 'stateData':
          cond.push(country);
          patchData['state'] = '';
          patchData['district'] = '';
          patchData['s_district'] = '';
          patchData['levelSearch'] = '';
          patchData['locationSearch'] = '';
          break;
        case 'districtData':
          patchData['district'] = '';
          patchData['s_district'] = '';
          patchData['levelSearch'] = '';
          patchData['locationSearch'] = '';
          cond.push(state);
          break;
        case 'subDistrictData':
          patchData['s_district'] = '';
          patchData['levelSearch'] = '';
          patchData['locationSearch'] = '';
          cond.push(district);
          break;

        case 'autocompleteLevelValue':
          patchData['levelSearch'] = '';
          patchData['locationSearch'] = '';
          tbl = this.addressForm.value.level == this.LEVEL.CITY ? 'city' : 'panchayat';
          cond.push(this.addressForm.value.s_district)
          break;

        case 'autocompleteValue':
          patchData['locationSearch'] = '';
          tbl = this.addressForm.value.level == this.LEVEL.CITY ? 'ward' : 'village';
          cond.push(this.addressForm.value.levelSearch)
          break;
      }
      this.addressForm.patchValue(patchData);
    }

    if (tbl == 'autocompleteLevelValue'.toLocaleLowerCase()) {
      tbl = +this.addressData.city ? 'city' : 'panchayat';
    }
    if (tbl == 'autocompleteValue'.toLocaleLowerCase()) {
      tbl = +this.addressData.ward ? 'ward' : 'village';
    }


    this.masterLoading[pValue] = true;
    if (pValue) {
      this.masterApi.getFullData(tbl.toLowerCase(), cond, false).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this[pValue] = res.result;
        } else {
          this[pValue] = [];
        }
        if (!isEvent) {
          this.updateFormValue();
        }
      }).finally(() => {
        this.masterLoading[pValue] = false;
      });
    }
  }

  isFormChange() {
    const src = JSON.stringify(this.initialFormValue);
    const to = JSON.stringify(this.addressForm.value);
    return !(src === to);
  }

  submit() {
    this.submitted = true;
    if (!this.isValidForm()) {
      return;
    }
    if (this.isFormChange()) {
      this.alertService.showToast('No change you made', 'info');
      return;
    }

    const payload = this.apiPayload();
    this.close(payload);
  }

  close(data: any = false) {
    if (!this.isModal) {
      return;
    }
    this._bsModalRef.hide();
    this.onClose.next(data);
  }

}