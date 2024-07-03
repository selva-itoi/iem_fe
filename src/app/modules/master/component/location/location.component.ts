import { Component, OnInit, ViewChild } from '@angular/core';
import { VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { formBuilderData } from 'src/app/helper/interface/response';
import { MasterComponent } from '../master/master.component';

@Component({
  selector: 'app-location',
  templateUrl: '../general-master/general-master.component.html',
})
export class LocationComponent implements OnInit {
  segment = {
    COUNTRY: 'country',
    STATE: 'state',
    DISTRICT: 'district',
    SUBDISTRICT: 'sub district',
    CITY: 'city',
    PANCHAYAT: 'panchayat',
    VILLAGE: 'village',
    WARD: 'ward'
  }
  COL: any ={};
  COUNTRY_COL: formBuilderData[] = [
    {
      colName: 'countryName',
      title: 'Country Name',

      validator: [{ name: 'required', error: 'Name should not be blank' }],
      filter: true,
      sort: true
    },
    {
      colName: 'countryPhoneCode',
      title: 'Phone Code',

      validator: [{ name: 'required', error: 'Phone code should not be blank' },
      { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Phone code should be valid' }],
      filter: true,
      sort: true
    }
  ]
  COUNTRY_FORM_COL: formBuilderData[] = [{
    colName: 'country_id',
    title: 'Country',
    selectKeyName: 'countryName',
    type: 'select',
    apiTblName: 'country',
    event: {
      name: 'change',
      apiTblName: 'state',
      valueAssign: 'state_id'
    },
    visible: false,
    validator: [{ name: 'required', error: 'Country should not be blank' }],
    filter: true,
    sort: true
  }]
  STATE_FORM_COL: any = [{
    colName: 'stateName',
    title: 'State Name',
    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Name should not be blank' }]
  }];

  STATE_COL: formBuilderData[] = [...this.COUNTRY_FORM_COL, ...this.STATE_FORM_COL];
  STATE_FORM: any = [{
    colName: 'state_id',
    title: 'State',
    selectKeyName: 'stateName',
    type: 'select',
    filter: true,
    sort: true,
    event: {
      name: 'change',
      apiTblName: 'district',
      valueAssign: 'district_id'
    },

    validator: [{ name: 'required', error: 'State should not be blank' }]
  }]
  DISTRICT_FORM: any = [{
    colName: 'district_id',
    title: 'District',
    selectKeyName: 'districtName',
    sort: true,
    filter: true,
    event: {
      name: 'change',
      apiTblName: 'subdistrict',
      valueAssign: 'sub_district_id'
    },
    type: 'select',
    validator: [{ name: 'required', error: 'District should not be blank' }]
  }]

  DISTRICT_FORM_COL: any = [{
    colName: 'districtName',
    title: 'District Name',

    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Name should not be blank' }]
  }]
  DISTRICT_COL: formBuilderData[] = [...this.COUNTRY_FORM_COL, ...this.STATE_FORM, ...this.DISTRICT_FORM_COL]
  SUB_DISTRICT_FORM_COL: any = [{
    colName: 'subDistrictName',
    title: 'Sub District Name',
    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Name should not be blank' }]
  }];
  SUB_DISTRICT_FROM: any = [{
    colName: 'sub_district_id',
    title: 'Sub District',
    selectKeyName: 'subDistrictName',
    sort: true,
    filter: true,
    type: 'select',

    event: {
      name: 'change',
      apiTblName: 'panchayat',
      valueAssign: 'panchayat_id'
    },
    validator: [{ name: 'required', error: 'Sub District should not be blank' }]
  }]
  SUBDISTRICT_COL: formBuilderData[] = [...this.COUNTRY_FORM_COL, ...this.STATE_FORM, ...this.DISTRICT_FORM, ...this.SUB_DISTRICT_FORM_COL];

  PANCHAYAT_FORM_COL: formBuilderData[] = [
    {
      colName: 'pName',
      title: 'Panchayat Name',
      sort: true,
      filter: true,
      validator: [{ name: 'required', error: 'Name should not be blank' }]
    },
  ];
  P_SUB_COL: any = cloneData(this.SUBDISTRICT_COL);
  V_SUB_COL: any = cloneData(this.SUBDISTRICT_COL);
  PANCHAYAT_COL: formBuilderData[] = [...this.P_SUB_COL.splice(0, 3), ...this.SUB_DISTRICT_FROM, ...this.PANCHAYAT_FORM_COL];
  VILLAGE_FORM_COL: any = [{
    colName: 'panchayat_id',
    title: 'Panchayat',
    selectKeyName: 'pName',
    sort: true,
    filter: true,
    type: 'select',

    validator: [{ name: 'required', error: 'Panchayat should not be blank' }]
  },
  {
    colName: 'vName',
    title: 'Village Name',
    sort: true,
    filter: true,
    validator: [{ name: 'required', error: 'Name should not be blank' }]
  },]
  VILLAGE_COL: formBuilderData[] = [...this.V_SUB_COL.splice(0, 3), ...this.SUB_DISTRICT_FROM, ...this.VILLAGE_FORM_COL];
  CITY_COL: any = JSON.parse(JSON.stringify(this.PANCHAYAT_COL));
  WARD_COL: any = JSON.parse(JSON.stringify(this.VILLAGE_COL));
  //@ts-ignore
  allKeys: Array<'COUNTRY' | 'DISTRICT'> = Object.keys(this.segment);
  currentSegment:any

  @ViewChild('masterPage') masterPage: MasterComponent | undefined
  constructor() { }

  ngOnInit(): void {
    this.CITY_COL[4].colName = 'cityName';
    this.CITY_COL[4].title = 'City Name';
    this.WARD_COL[4].colName = 'city_id';
    this.WARD_COL[4].title = 'City Name';
    this.WARD_COL[4].selectKeyName = 'cityName';
    this.WARD_COL[3].event.apiTblName = 'city';
    this.WARD_COL[3].event.valueAssign = 'city_id';
    this.WARD_COL[5].title = 'Ward Name';
    this.WARD_COL[5].colName = 'wardName';
    console.log(this.WARD_COL)
    this.allKeys.forEach(a => {
      //@ts-ignore
      this.COL[a] = this[a + '_COL']
    })
  }
  addNew(st:any) {
    this.masterPage?.edit()
  }
  tblAction(ev: any) {
    console.log('on tbl action called general 1', ev);

   
}
}