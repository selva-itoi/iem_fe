import { AppConstant, VALIDATOR_PATTERNS } from "src/app/helper/class/app-constant";
import { formBuilder, formBuilderData } from "src/app/helper/interface/response";

export const USER_ROLE_FORM: formBuilder[] = [
    {
        colName: 'role_id', title: 'User Role', apiTblName: 'role', type: 'select', selectKeyName: 'roleName',
        validator: [{ name: 'required', error: '' }]
    },
    {
        colName: 'region', title: 'Region', apiTblName: 'region', type: 'select', selectKeyName: 'regionName', appendData: [{ id: 0, regionName: 'All' }],
        event: {
            name: 'change',
            apiTblName: 'zone',
            valueAssign: 'zone'
        },
    },
    {
        colName: 'zone', title: 'Zone/State', apiTblName: 'zone', type: 'select', selectKeyName: 'zoneName', appendData: [{ id: 0, zoneName: 'All' }], event: {
            name: 'change',
            apiTblName: 'church',
            valueAssign: 'church'
        }
    },
    {
        groupTitle: '',
        colName: 'church', title: 'church', apiTblName: 'church', type: 'select', selectKeyName: 'church_name', appendData: [{ id: 0, church_name: 'All' }]
    },
    {
        colName: 'state_office',
        selectKeyName: 'state_officeName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        type: 'select',
        apiTblName: 'state_office',
        title: 'State Office',
        appendData: [{ id: 0, state_officeName: 'All' }],
        title_case: 'NONE',
        // validator: [{ name: 'required' }]
    },
    {
        colName: 'department',
        selectKeyName: 'dName',
        apiTblName: 'department',
        type: 'select',
        title: 'Department Name',
        appendData: [{ id: 0, dName: 'All' }],
        // validator: [{ name: 'required' }]

    },
    {
        groupTitle: 'Sponsor Module Dependency',
        colName: 'promotional_office',
        selectKeyName: 'promotionalName',
        apiTblName: 'promotional_office',
        type: 'select',
        title: 'Church Ministry Area',
        appendData: [{ id: 0, promotionalName: 'All' }],
    },
    {
        colName: 'sponsorship_module',
        selectKeyName: 'name',
        apiTblName: 'sponsorship_module',
        type: 'select',
        title: 'Sponsorship Module',
        appendData: [{ id: 0, name: 'All' }],
    },
    {
        groupTitle: 'child Dependency',
        colName: 'home',
        selectKeyName: 'homeName',
        apiTblName: 'home',
        type: 'select',
        title: 'Home / Project',
        appendData: [{ id: 0, homeName: 'All' }],
    },
]

export const NEW_VOLUNTER: formBuilderData[] = [
    {
        colName: 'volunteerName',
        title: 'Area Secretary Name',
        filter: true,
        sort: true,
        validator: [{ name: 'required' }]
    },
    {
        colName: 'email_id',
        title: 'Email Id',
        filter: true,
        sort: true,
        validator: [{ name: 'required' },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL, error: 'Email No should be valid' }]

    },
    {
        colName: 'mobile_no',
        title: 'Mobile No',
        filter: true,
        sort: true,
        validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Mobile No should be valid' }]
    },
    {
        colName: 'region',
        title: 'Region Name',
        type: 'select',
        apiTblName: 'region',
        selectKeyName: 'regionName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        event: {
            name: 'change',
            apiTblName: 'zone',
            valueAssign: 'zone'
        },
        validator: [{ name: 'required' }]

        // validator: [{ name: 'required', error: 'Region should not be blank' }]
    },
    {
        colName: 'zone',
        selectKeyName: 'zoneName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        type: 'select',
        title: 'Zone/State Name',
        event: {
            name: 'change',
            apiTblName: 'promotional_office',
            valueAssign: 'promotionalOffice_id',
        },
        validator: [{ name: 'required' }]    
    },
    {
        colName: 'promotionalOffice_id',
        title: 'Church Ministry Area',
        type: 'select',
        selectKeyName:'promotionalName',
        selectPrimaryKey:'promoId', 
        filter: true,
        sort: true,
        event:{name:'change',isCallback:true},
        validator: [{ name: 'required' }],
    },
    {
        colName: 'date_of_join',
        title: 'Date of Join',
        filter: true,
        sort: true,
        colType: 'DATE',
        type:'DATE',
        validator: [{ name: 'required' }],

    },
    {
        colName: 'date_of_birth',
        title: 'Date of Birth',
        filter: true,
        sort: true,
        colType: 'DATE',
        type:'DATE'
    },
    {
        colName: 'gender_id',
        title: 'Gender',
        type: 'select',
        selectKeyName: 'genderName',
        selectPrimaryKey: 'id',
        data: AppConstant.GENDER,
        filter: true,
        sort: true,
        validator: [{ name: 'required' }]
    },
    {
        colName: 'address',
        title: 'Address Line 1',
        validator: [{ name: 'required' }],

    },
    {
        colName: 'address_line_2',
        title: 'Address  Line 2'
    },
    {
        colName: 'address_line_3',
        title: 'Address Line 3'
    },
    {
        colName: 'country_id',
        title: 'Country',
        apiTblName: 'country',
        type: 'select',
        selectKeyName: 'countryName',
        selectPrimaryKey: 'id',
        // event: {
            //     name: 'change',
            //     apiTblName: 'state',
            //     valueAssign: 'state_id',
            //     isCallback: false,
            //     // addParams: [{
                //     //     colName: 'state_id',
                //     //     constantValue: '1'
                //     // }]
                // },
         defaultValue: '1',
         validator: [{ name: 'required' }],

    },
    {
        colName: 'state_id',
        title: 'State',
        apiTblName: 'state',
        type: 'select',
        selectKeyName: 'stateName',
        selectPrimaryKey: 'id',
        event: {
            name: 'change',
            apiTblName: 'district',
            valueAssign: 'district_id'
        },
        validator: [{ name: 'required' }]
    },
    {
        colName: 'district_id',
        title: 'District',
        // apiTblName: 'district',
        type: 'select',
        selectKeyName: 'districtName',
        selectPrimaryKey: 'id',
        validator: [{ name: 'required' }]
    },
    {
        colName: 'pin_code',
        title: 'PinCode',
       
    },
    {
        colName: 'remark',
        title: 'Remarks'
    },
   
    {
        colName: 'profile_img',
        title: 'Profile Img',
        type: 'FILE'
    },
   
    // {
    //     groupTitle:' ',
    //     colName: 'report_to',
    //     title: 'Report To',
    //     apiTblName: 'country',
    //     type: 'select',
    //     selectKeyName: 'countryName',
    //     selectPrimaryKey: 'id',
    //     defaultvalve: 1,
    //     event: {
    //         name: 'change',
    //         apiTblName: 'promotionalName',
    //         valueAssign: 'promotionalOffice_id'
    //     },
    //     validator: [{ name: 'required' }]
    // },
    // {
    //     colName: 'status',
    //     title: 'Status'
    // },
]
export const VOLUNTER_LIST_COL: formBuilderData[] = [
    {
        colName: 'volunteerName',
        title: 'Name',
        sort: true,
        filter: true,
    },
    {
        colName: 'volunteer_id',
        title: 'Area Secretary Id',
        isPrimary:true,
        sort: true,
        filter: true,
    },
    {
        colName: 'email_id',
        title: 'Email ',
        sort: true,
        filter: true,
    },
    {
        colName: 'volunter',
        title: 'Ref Code ',
        sort: true,
        filter: true,
    },
    {
        colName: 'balance',
        title: 'Current Balance ',
        sort: true,
        filter: true,
    },
    {
        colName: 'gender_id',
        title: 'Gender',
        sort: true,
        filter: true,
    },
    {
        colName: 'updated_at',
        title: 'Updated At ', 
        sort: true,
        filter: true,
        colType:'DATE'
    },
    {
        colName: 'status',
        title: 'Status',   
    },
]
export const NEW_VIEW_VOLUNTER: formBuilderData[] = [
    {
        colName: 'volunteerName',
        title: 'Are Secretary Name',
        filter: true,
        sort: true,
        validator: [{ name: 'required' }]
    },
    {
        colName: 'email_id',
        title: 'Email Id',
        filter: true,
        sort: true
    },
    {
        colName: 'mobile_no',
        title: 'Mobile No',
        filter: true,
        sort: true,
        validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Mobile No should be valid' }]
    },
    {
        colName: 'region',
        title: 'Region Name',
        type: 'select',
        apiTblName: 'region',
        selectKeyName: 'regionName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        event: {
            name: 'change',
            apiTblName: 'zone',
            valueAssign: 'zone'
        },
        validator: [{ name: 'required', error: 'Region should not be blank' }]
    },
    {
        colName: 'zone',
        selectKeyName: 'zoneName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        type: 'select',
        title: 'Zone/State Name',
        event: {
            name: 'change',
            apiTblName: 'promotional_office',
            valueAssign: 'promotionalOffice_id',
        },
        validator: [{ name: 'required' }]

        
    },

    {
        colName: 'promotionalOffice_id',
        title: 'Church Ministry Area',
        apiTblName: 'promotional_office',
        type: 'select',
        selectKeyName:'promotionalName',
        selectPrimaryKey:'promoId', 
        filter: true,
        sort: true,
        validator: [{ name: 'required' }],
        event:{name:'change',isCallback:true}
    },
    {
        colName: 'date_of_join',
        title: 'Date of Join',
        filter: true,
        sort: true,
        colType: 'DATE',
        type:'DATE'
    },
    {
        colName: 'date_of_birth',
        title: 'Date of Birth',
        filter: true,
        sort: true,
        colType: 'DATE',
        type:'DATE'
    },
    {
        colName: 'gender_id',
        title: 'Gender',
        type: 'select',
        selectKeyName: 'genderName',
        selectPrimaryKey: 'id',
        data: AppConstant.GENDER,
        filter: true,
        sort: true,
        validator: [{ name: 'required' }]
    },
    {
        colName: 'address',
        title: 'Address'
    },
    {
        colName: 'country_id',
        title: 'Country',
        apiTblName: 'country',
        type: 'select',
        selectKeyName: 'countryName',
        selectPrimaryKey: 'id',
        event: {
            name: 'change',
            apiTblName: 'state',
            valueAssign: 'state_id'
        },
        validator: [{ name: 'required' }],
        defaultValue: '1'
    },
    {
        colName: 'state_id',
        title: 'State',
        // apiTblName: 'state',
        type: 'select',
        selectKeyName: 'stateName',
        selectPrimaryKey: 'id',
        event: {
            name: 'change',
            apiTblName: 'district',
            valueAssign: 'district_id'
        },
        validator: [{ name: 'required' }]
    },
    {
        colName: 'district_id',
        title: 'District',
        // apiTblName: 'district',
        type: 'select',
        selectKeyName: 'districtName',
        selectPrimaryKey: 'id',
        validator: [{ name: 'required' }]
    },
    {
        colName: 'current_balance',
        title: 'Current Balance'
    },
    {
        colName: 'account_code',
        title: 'Account Id'
    },
   
    {
        colName: 'profile_img',
        title: 'Profile Img',
        type: 'FILE'
    },
   
    // {
    //     colName: 'report_to',
    //     title: 'Report To',
    //     apiTblName: 'country',
    //     type: 'select',
    //     selectKeyName: 'countryName',
    //     selectPrimaryKey: 'id',
    //     event: {
    //         name: 'change',
    //         apiTblName: 'promotionalName',
    //         valueAssign: 'promotionalOffice_id'
    //     },
    //     validator: [{ name: 'required' }]
    // },
    // {
    //     colName: 'status',
    //     title: 'Status'
    // },
]
export const RECEIPT_DATA: formBuilderData[] = [
    {
        colName: 'volunteerName',
        title: 'volunteerName',
        filter: true,
        sort: true,
        validator: [{ name: 'required' }]
    },
    {
        colName: 'email_id',
        title: 'Email Id',
        filter: true,
        sort: true
    },
    {
        colName: 'mobile_no',
        title: 'Mobile No',
        filter: true,
        sort: true,
    },
    {
        colName: 'prefix',
        title: 'Receipt prefix',
        filter: true,
        sort: true,
    },
    {
        colName: 'start_from',
        title: 'Receipt start',
        filter: true,
        sort: true,
    },
    {
        colName: 'end_no',
        title: 'Receipt end',
        filter: true,
        sort: true,
    },  
 
]
export const NEW_RECEIPT: formBuilderData[] = [
    {
        colName: 'prefix',
        title: 'Receipt Prefix',
        validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT_NOT_SPACE_IN_BETWEEN, error: 'Number should be valid' }]

    },
    {
        colName: 'start_from',
        title: 'Receipt Start',
        validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number should be valid' }]

    },
    {
        colName: 'end_no',
        title: 'Receipt End',
        validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number should be valid' }]

    },
]
export const RECEIPT_VIEW: formBuilderData[] = [
    {
        colName: 'donation_id',
        title: 'Donation Id',
        filter: true,
        sort: true,
    },
    {
        colName: 'remark',
        title: 'Remarks',
        filter: true,
        sort: true,
    },
    {
        colName: 'status',
        title: 'Status',
        filter: true,
        sort: true,
    },  
 
]