import { Component, OnInit, ViewChild } from '@angular/core';
import { VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { formBuilderData } from 'src/app/helper/interface/response';
import { MasterComponent } from '../master/master.component';
import { Router } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';

@Component({
  selector: 'app-office',
  templateUrl: '../general-master/general-master.component.html'
})
export class OfficeComponent implements OnInit {
  promoAddressKey: Array<string> = ['street', 'pincode'];
  segment = {
    COUNTRY:'Country',
    STATE:'State',
    DISTRICT:'District',
    ZONE: 'Zone',
    // AD_OFFICE: 'MS Office',
    REGION: 'Region',
    BRANCH: 'Branch',
    FIELD: 'Field',
    DEPARTMENT: 'Department',
    DESIGNATION: 'Designation',
    TRUST: 'Establishment',
    PROMOTIONAL_OFFICE: 'Church Ministry Area',
    RELIGION: 'Religion',
    COMMUNITY: 'Community',
    CHURCH_DESIGNATION: 'Church Designation',
    ASSET_TYPE: 'Asset Type',
    ASSET_CATEGORY: 'Asset Category',
    ASSET_SUB_CATEGORY: 'Ast.Sub Category',
    DAILY_WORDS: 'Daily Words',
    SPONSORSHIP_PROGRAM: 'Sponsorship Program',
    LANG: 'Language'
  }
  COL: any = {};
  ASSET_TYPE_COL = [{
    colName: 'asset_typeName',
    filter: true,
    sort: true,
    title: 'Asset Type Name',
    validator: [{ name: 'required' }]
  }];
  ASSET_CATEGORY_COL: formBuilderData[] = [{
    colName: 'asset_type_id',
    apiTblName: 'asset_type',
    type: 'select',
    selectKeyName: 'asset_typeName',
    title: 'Asset Type',
    validator: [{ name: 'required' }],
  },
  {
    colName: 'asset_categoryName',
    title: 'Asset Category Name',
    validator: [{ name: 'required' }]
  }];
  ASSET_SUB_CATEGORY_COL: formBuilderData[] = [{
    colName: 'asset_category_id',
    type: 'select',
    selectKeyName: 'asset_categoryName',
    apiTblName: 'asset_category',
    title: 'Asset Category',
    validator: [{ name: 'required' }],
  },
  {
    colName: 'sub_cat_short_code',
    filter: true,
    sort: true,
    title: 'Short Code',
    validator: [{ name: 'required', error: 'Short Code should not be blank' }]
  },
  {
    colName: 'asset_sub_categoryName',
    title: 'Asset Sub Category Name',
    validator: [{ name: 'required' }]
  }];
  //@ts-ignore
  allKeys: Array<'ZONE' | 'AD_OFFICE'> = Object.keys(this.segment);
  RELIGION_COL: formBuilderData[] = [{
    colName: 'religionName',
    filter: true,
    sort: true,
    title: 'Religion Name',
    validator: [{ name: 'required' }]
  }
  ];
  COMMUNITY_COL: formBuilderData[] = [{
    colName: 'communityName',
    filter: true,
    sort: true,
    title: 'Community Name',
    validator: [{ name: 'required', error: 'Community Name should not be blank' }]
  }
  ];
  LOCATION_COL: formBuilderData[] = [{
    colName: "lat",
    title: 'Lat',
    event: { funName: 'pickLocation', name: 'click' },
    readonly: true,
    visible: false
  },
  {
    colName: "lng",
    title: 'Long',
    event: { funName: 'pickLocation', name: 'click' },
    readonly: true,
    visible: false
  }]

  COUNTRY_COL: formBuilderData[] = [
    {  
      colName: 'countryName',
      title: 'Country',
      validator: [{ name: 'required' }],

    },
    {  
      colName: 'countryPhoneCode',
      title: 'Country Code',
      validator: [{ name: 'required' }],

    },
  ]
    STATE_COL: formBuilderData[] = [
      {  
        colName: 'country_id',
        title: 'Country',
        apiTblName: 'country',
        type: 'select',
        selectKeyName: 'countryName',
        selectPrimaryKey: 'id',
         validator: [{ name: 'required' }],
      },
      {  
        colName: 'stateName',
        title: 'State',
        validator: [{ name: 'required' }]

      },
    ]
    DISTRICT_COL: formBuilderData[] = [
      {  
        colName: 'country_id',
        title: 'Country',
        apiTblName: 'country',
        type: 'select',
        selectKeyName: 'countryName',
        selectPrimaryKey: 'id',
         validator: [{ name: 'required' }],
      },
      {  
        colName: 'state_id',
        title: 'State',
        apiTblName: 'state',
        type: 'select',
        selectKeyName: 'stateName',
        selectPrimaryKey: 'id',
       
        validator: [{ name: 'required' }]
      },
      {  
        colName: 'districtName',
        title: 'Distrit',
       
        validator: [{ name: 'required' }]
       
      },
    ]

  FIELD: formBuilderData[] = [
    {
      colName: 'stateName',
      title: 'State',
      hidden: true,
      filter: true,
      sort: true,
    },
    {
      colName: 'districtName',
      title: 'District Name',
      hidden: true,
      filter: true,
      sort: true,
    },
    {
      colName: 'subdistrictName',
      title: 'Sub District Name',
      hidden: true,
      filter: true,
      sort: true
    },
    {
      colName: 'cityPanchayatName',
      title: 'Panchayat/city',
      selectKeyName: 'cityPanchayatName',
      hidden: true,
      filter: true,
      sort: true,
    },

    {
      colName: 'villageWardName',
      title: 'Village/ward',
      selectKeyName: 'villageWardName',
      hidden: true,
      filter: true,
      sort: true,
    },
    {
      colName: 'region_id',
      title: 'Region',
      selectKeyName: 'regionName',
      selectPrimaryKey: 'id',
      type: 'select',
      apiTblName: 'region',
      visible: false,
      filter: true,
      sort: true,
      event: {
        name: 'change',
        apiTblName: 'zone',
        valueAssign: 'zone'
      },
      validator: [{ name: 'required' }]
    },
    {
      colName: 'zone',
      title: 'Zone/State Name',
      selectKeyName: 'zoneName',
      selectPrimaryKey: 'id',
      sort: true,
      filter: true,
      type: 'select',
      validator: [{ name: 'required' }]
    },
    {
      colName: 'fieldName',
      title: 'Field Name',
      selectKeyName: 'fieldName',
      filter: true,
      sort: true,
      validator: [{ name: 'required' }]
    },
  ];
  MODIFY_COL: formBuilderData[] = [{ colName: 'created_at', title: 'Created On', colType: 'DATE', hidden: true, visible: true }, { colName: 'updated_at', title: 'Last Update', colType: 'DATE', hidden: true, visible: true }];
  FIELD_COL = [...this.FIELD, ...this.LOCATION_COL, ...this.MODIFY_COL]
  BRANCH_COL: formBuilderData[] = [{
    colName: 'branchName',

    filter: true,
    sort: true,
    title: 'Branch Name',
    validator: [{ name: 'required', error: 'Branch Name should not be blank' }]
  }];

  REGION: formBuilderData[] = [
    {
      colName: 'regionName',
      filter: true,
      sort: true,
      title: 'Region Name',
      validator: [{ name: 'required', error: 'Region Name should not be blank' }]
    },
    // {
    //   colName: 're_short_code',
    //   filter: true,
    //   sort: true,
    //   title: 'Short Code',
    //   validator: [{ name: 'required', error: 'Short Code should not be blank' }]
    // },
    {
      colName: 'email_id',
      title: 'Email ID',
      filter: true,
      sort: true,
      validator: [{ name: 'required', error: 'Email Id should not be blank' },
      { name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL, error: 'Email Id should be valid' }]
    },
    {
      colName: 'mobile_no',
      title: 'Phone Number',
      filter: true,
      sort: true,
      validator: [{ name: 'required', error: 'Phone should not be blank' },
        // { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Phone should be valid' }
      ]
    },
    {
      colName: 'contact_name',
      title: 'Contact Name',
      filter: true,
      sort: true,
      validator: [{ name: 'required', error: 'Contact should not be blank' },
      { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Contact Name should be valid' }]
    }];

    LANG: formBuilderData[]=[
      {
        colName: 'langName',
        title: 'Language Name',
        filter: true,
        sort: true,
        validator: [{ name: 'required' }]
      },
    ]
  //@ts-ignore
  ZONE: formBuilderData[] = [
    {
      colName: 'region_id',
      title: 'Region',
      selectKeyName: 'regionName',
      type: 'select',
      apiTblName: 'region',
      filter: true,
      sort: true,
      visible: false,
      validator: [{ name: 'required' }]
    },
    {
      colName: 'zoneName',
      filter: true,
      sort: true,
      title: 'Zone Name',
      validator: [{ name: 'required', error: 'Zone Name should not be blank' }]
    },
    // {
    //   colName: 'ze_short_code',
    //   filter: true,
    //   sort: true,
    //   title: 'Short Code',
    //   validator: [{ name: 'required', error: 'Short Code should not be blank' }]
    // },
    {
      colName: 'email_id',
      title: 'Email ID',
      filter: true,
      sort: true,
      validator: [{ name: 'required', error: 'Email Id should not be blank' },
      { name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL, error: 'Email Id should be valid' }]
    },
    {
      colName: 'mobile_no',

      title: 'Phone Number',
      filter: true,
      sort: true,
      validator: [{ name: 'required', error: 'Phone should not be blank' },
        // { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Phone should be valid' }
      ]
    },
    {
      colName: 'contact_name',
      title: 'Contact Name',
      filter: true,
      sort: true,
      validator: [{ name: 'required', error: 'Contact should not be blank' },
      { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Contact Name should be valid' }]
    }];

  ZONE_COL = [...this.ZONE]
  REGION_COL = [...this.REGION]
  LANG_COL = [...this.LANG]
  DESIGNATION_COL: formBuilderData[] = [
    {
      colName: 'branch_id',
      title: 'Branch',
      selectKeyName: 'branchName',
      type: 'select',
      apiTblName: 'branch',
      filter: true,
      sort: true,

      validator: [{ name: 'required', error: 'Branch should not be blank' }]
    },
    {
      colName: 'deName',
      filter: true,
      sort: true,
      title: 'Designation Name',
      validator: [{ name: 'required', error: 'Designation Name should not be blank' }]
    }];

  AD_OFFICE_COL: formBuilderData[] = [{
    colName: 'adName',
    title: 'Office Name',
    filter: true,
    sort: true,

    validator: [{ name: 'required', error: 'Office Name should not be blank' }]
  },
  {
    colName: 'adEmail_id',
    title: 'Email',

    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Email should not be blank' },
    { name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL, error: 'Email should be valid' }]
  },
  {
    colName: 'adPhone',
    filter: true,
    sort: true,
    title: 'Mobile',

    validator: [{ name: 'required', error: 'mobile should not be blank' },
    { name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Mobile should be valid' }]
  },
  {
    colName: 'contact_name',
    filter: true,
    sort: true,
    title: 'Contact Name',
    validator: [{ name: 'required', error: 'Contact should not be blank' },
    { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Contact Name should be valid' }]
  },
  {
    colName: 'adPhone1',
    title: 'Phone',
    filter: true,
    sort: true,
    visible: false,
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Mobile should be valid' }]
  }

  ];

  DEPARTMENT_COL: formBuilderData[] = [{
    colName: 'dName',
    title: 'Dept Name',
    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Name should not be blank' }]
  },
  // {
  //   colName: 'ad_id',
  //   title: 'MS Office',
  //   type: 'select',
  //   selectKeyName: 'adName',
  //   selectPrimaryKey: 'id',
  //   filter: true,
  //   sort: true,
  //   apiTblName: 'ad_office',

  //   validator: [{ name: 'required', error: 'Ad Office should not be blank' }]
  // },

  {
    colName: 'dEmail_id',
    title: 'Email',

    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Email should not be blank' },
    { name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL, error: 'Email should be valid' }]
  },
  {
    colName: 'dPhone',
    title: 'Mobile',

    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Mobile should not be blank' },
    { name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Mobile should be valid' }]
  },
  {
    colName: 'contact_name',

    title: 'Contact Name',
    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Contact should not be blank' },
    { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Contact Name should be valid' }]
  },
  {
    colName: 'dPhone1',
    title: 'Phone',
    visible: false,
    filter: true,
    sort: true,
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Phone should be valid' }]
  },
  {
    colName: 'region_id',
    title: 'Region',
    selectKeyName: 'regionName',
    type: 'select',
    apiTblName: 'region',
    filter: true,
    sort: true,
    validator: [{ name: 'required' }]
  },
  {
    colName: 'de_short_code',
    filter: true,
    sort: true,
    title: 'Short Code',
    validator: [{ name: 'required', error: 'Short Code should not be blank' }]
  },
  ];


  TRUST_COL: formBuilderData[] = [{
    colName: 'trustName',
    title: 'Establishment Name',

    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Establishment Name should not be blank' }]
  },
  {
    colName: 'email_id',
    title: 'Email',

    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Email should not be blank' },
    { name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL, error: 'Email should be valid' }]
  },
  {
    colName: 'phone',
    title: 'Mobile',
    filter: true,
    sort: true,

    validator: [{ name: 'required', error: 'Mobile should not be blank' },
    { name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Mobile should be valid' }]
  },
  {
    colName: 'contact_name',

    filter: true,
    sort: true,
    title: 'Contact Name',
    validator: [{ name: 'required', error: 'Contact should not be blank' },
    { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Contact Name should be valid' }]
  },
  {
    colName: 'phone1',
    title: 'Phone',
    visible: false,
    filter: true,
    sort: true,
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Phone should be valid' }]
  },
  {
    colName: 'address',
    title: 'Address',
    validator: [{ name: 'required' }],
    type: 'TEXTAREA'
  },
  {
    colName: 'pincode',
    title: 'Pincode',
    validator: [{ name: 'required' }]
  },
  {
    colName: 'logo_img',
    title: 'Logo',
    type: 'FILE',
    visible: false
  },
  {
    colName: 'water_mark_img',
    title: 'Watermark Image',
    type: 'FILE',
    visible: false
  }
  ];

  PROMOTIONAL_COL: formBuilderData[] = [
    {
      colName: 'promotional_id',
      title: 'Promo ID',
      sort: true,
      filter: true,
      readonly: true,
      hidden: true
    },
    {
      colName: 'promotionalName',
      title: 'Church Ministry Area',
      filter: true,
      sort: true,
      validator: [{ name: 'required' }]
    },
    {
      colName: 'email_id',
      title: 'Email',
      filter: true,
      sort: true,
      validator: [{ name: 'required' },
      { name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL }]
    },
    // {
    //   colName: 'mobile_no',
    //   title: 'Mobile',
    //   filter: true,
    //   sort: true,
    //   validator: [{ name: 'required' },
    //   { name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE }]
    // },
    // {
    //   colName: 'whatsapp_number',
    //   title: 'WhatsApp Number',
    //   visible: false,
    //   filter: true,
    //   sort: true,
    //   validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE }]
    // },

    // {
    //   colName: 'contact_name',
    //   filter: true,
    //   sort: true,
    //   title: 'Contact Name',
    //   validator: [{ name: 'required', error: 'Contact should not be blank' },
    //   { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT }]
    // },
    // {
    //   colName: 'street',
    //   filter: true,
    //   sort: true,
    //   visible: false,
    //   title: 'Street',
    //   validator: [{ name: 'required' },
    //   { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT }]
    // },
    // {
    //   colName: 'sub_district_name',
    //   filter: true,
    //   sort: true,
    //   visible: false,
    //   title: 'Sub District Name',
    //   validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT }]
    // },
    // {
    //   colName: 'district_name',
    //   filter: true,
    //   sort: true,
    //   visible: false,
    //   title: 'District Name',
    //   validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT }]
    // },
    // {
    //   colName: 'city_name',
    //   filter: true,
    //   sort: true,
    //   visible: false,
    //   title: 'City Name',
    //   validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT }]
    // },
    // {
    //   colName: 'state_name',
    //   filter: true,
    //   sort: true,
    //   title: 'State',
    //   validator: [{ name: 'required' },
    //   { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT }]
    // },
    // {
    //   colName: 'country_name',
    //   filter: true,
    //   sort: true,
    //   title: 'Country',
    //   validator: [{ name: 'required' },
    //   { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT }]
    // },
    {
      colName: 'pincode',
      filter: true,
      sort: true,
      visible: false,
      title: 'Pincode',
      validator: [
        { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
      colName: 'name',
      filter: true,
      sort: true,
      visible: true,
      hidden: true,
      title: 'In charge',
    },
    {
      colName: 'mobile_no',
      filter: true,
      sort: true,
      visible: true,
      hidden: true,
      title: 'In charge Mobile',
    },
    // {
    //   colName: 'report_to_promotional_id',
    //   filter: true,
    //   sort: true,
    //   visible: true,
    //   hidden: true,
    //   title: 'Report To',
    // }
  ];

  // PROMOTIONAL_OFFICE_COL = [...this.PROMOTIONAL_COL, ...this.MODIFY_COL]
  PROMOTIONAL_OFFICE_COL = [...this.PROMOTIONAL_COL]


  CHURCH_DESIGNATION_COL: any = [{
    colName: 'church_designationName',
    title: 'Designation Name',
    filter: true,
    sort: true,
    validator: [{ name: 'required' }]
  },
  ];
  STAYED_CATEGORY_COL: any = [{
    colName: 'stayed_categoryName',
    title: 'Category Name',
    filter: true,
    sort: true,
    validator: [{ name: 'required' }]
  }]


  DAILY_WORDS_COL: any = [{
    colName: 'tamil_words',
    title: 'Tamil Words',
    filter: true,
    sort: true,
    validator: [{ name: 'required' }]
  },
  {
    colName: 'hindi_words',
    title: 'Hindi Words',
    filter: true,
    sort: true,
    validator: [{ name: 'required' }]
  },
  {
    colName: 'english_words',
    title: 'English Words',
    filter: true,
    sort: true,
    validator: [{ name: 'required' }]
  },
  {
    colName: 'tamil_chapter',
    title: 'Tamil Chapter',
    filter: true,
    sort: true,
    validator: [{ name: 'required' }]
  },
  {
    colName: 'hindi_chapter',
    title: 'Hindi Chapter',
    filter: true,
    sort: true,
    validator: [{ name: 'required' }]
  },
  {
    colName: 'english_chapter',
    title: 'English Chapter',
    filter: true,
    sort: true,
    validator: [{ name: 'required' }]
  }

  ];
  SPONSORSHIP_PROGRAM_COL: formBuilderData[] = [
    {
      colName: 'sponsorship_programName',
      title: 'Program Name'
    },
    {
      colName: 'description',
      title: 'Description'
    },
    {
      colName: 'min_amount',
      title: 'Minimum Amount'
    }
  ];
  currentSegment: any
  urlService = UrlServices.PAGE_URL
  @ViewChild('masterPage') masterPage: MasterComponent | undefined
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.allKeys.forEach((a: any) => {
      //@ts-ignore
      this.COL[a] = this[a + '_COL']
    })
  }
  addNew(st: any) {
    if (this.currentSegment == this.segment.PROMOTIONAL_OFFICE) {
      this.router.navigate([this.urlService.MASTER.PROMOTIONAL_OFFICE.URL])
    } else {
      this.masterPage?.edit()
    }
  }

  tblAction(ev: any) {
    console.log('on tbl action called', ev);
    if (ev.action_type == 'EDIT') {
      this.router.navigate([this.urlService.MASTER.PROMOTIONAL_OFFICE.URL], { queryParams: { id: ev.id } })

    }
  

}
}