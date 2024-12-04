import { AppConstant, VALIDATOR_PATTERNS } from "src/app/helper/class/app-constant";
import { formBuilderData } from "src/app/helper/interface/response";

export class Config {
    //   STATUS
}
export const HOME_FORM: formBuilderData[] = [{
    colName: 'home_no',
    title: 'Home No',
    validator: [{ name: 'required', error: 'Home Number should not be blank' }]
},
{
    colName: 'homeName',
    title: 'Home / Project Name',
    validator: [{ name: 'required', error: 'Home Name should not be blank' }]
},
{
    colName: 'type',
    title: 'Category',
    type: 'select',
    apiTblName: 'home_type',
    selectKeyName: 'home_typeName',
    selectPrimaryKey: 'id',
    defaultValue: '',
    validator: [{ name: 'required', error: 'Home Category should not be blank' }]
},
{
    colName: 'building_agreement',
    title: 'Building Agreement Type',
    type: 'select',
    apiTblName: 'building_agreement',
    selectKeyName: 'building_agreementName',
    selectPrimaryKey: 'id',
    defaultValue: '',
    validator: [{ name: 'required', error: 'Agreement should not be blank' }]
},
{
    colName: 'mobile_no',
    title: 'Mobile No',
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Mobile NUmber should be valid' },
    { name: 'required', error: 'Mobile Number is required' }]
},
{
    colName: 'mobile_no_alternative',
    title: 'Mobile No Alternative',
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Mobile NUmber should be valid' }]
},
{
    colName: 'email_id',
    title: 'Email Id ',
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL, error: 'Email should be valid' }]
},

{
    colName: 'sponsor_type',
    title: 'Sponsor Type',
    type: 'select',
    data: [{ id: 1, name: 'Individual' }, { id: 2, name: 'Group' }],
    selectKeyName: 'name',
    selectPrimaryKey: 'id',
    defaultValue: 1,
    validator: [{ name: 'required', error: 'Type should not be blank' }]
},
{
    colName: 'home_start_year',
    title: 'From Start On ',
    type: 'DATE',
    yearNavigator: true,
    monthNavigator: true,
    placeholder: 'Since from',
    dateRange: AppConstant.DEFAULT_DATE_RANGE,
    validator: [{ name: 'required', error: 'Date is Required' }]
},
{
    colName: 'distance_school',
    title: 'Distance Of primary school from Home',
    validator: []
},
{
    colName: 'distance_high_school',
    title: 'Distance of High/ Secondary School from Home',
    validator: []
},
{
    colName: 'distance_anganwadi',
    title: 'Distance of Anganwadi from Home',
    validator: []
},
{
    colName: 'annual_budget',
    title: 'Annual Budget',
    validator: []
},
    // {
    //     colName: 'no_of_girls',
    //     title: 'No of Girls',
    //     defaultValue: 0,
    //     col_size: 3,
    //     validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'No of Girls should be valid' }]
    // },
    // {
    //     colName: 'no_of_boys',
    //     title: 'No of Boys',
    //     defaultValue: 0,
    //     col_size: 3,
    //     validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'No of Boys should be valid' }]
    // },
    // {
    //     colName: '',
    //     title: 'Total Number of Students',
    //     defaultValue: 0,
    //     type: 'INFO',
    //     col_size: 6,
    //     controlAction: { controls: ['no_of_boys', 'no_of_girls'], operation: 'ADD' },
    // }
];

export const HOME_OFFICE_FORM: formBuilderData[] = [
    {
        groupTitle: 'Office Details',
        colName: 'no_of_wardern',
        title: 'No Of Warden',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Only Number should Allowed' }]
    },
    {
        colName: 'no_of_cook',
        title: 'No Of cook',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Only Number should Allowed' }]
    },
    {
        colName: 'no_of_social_worker',
        title: 'No Of Social Worker',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Only Number should Allowed' }]
    },
    {
        colName: 'no_of_helper',
        title: 'No Of Helper',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Only Number should Allowed' }]
    },
    {
        colName: 'region',
        title: 'Region',
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
        title: 'Zone Name',
        event: {
            name: 'change',
            apiTblName: 'field',
            valueAssign: 'field',
            apiFunName: 'getFieldByZone'
        },
        validator: [{ name: 'required', error: 'Zone Name should not be blank' }]
    },
    {
        colName: 'field',
        selectKeyName: 'fieldName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        type: 'select',
        title: 'Field Name',
        event : {name:'change',isCallback:true},
        validator: [{ name: 'required', error: 'Field Name should not be blank' }]
    },
    {
        colName: 'allow_mk',
        title: 'Allow Mk Child On home ? ',
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],
        col_size :12
    },
    {
        colName: 'remarks',
        title: 'Remarks',
    },
    {
        colName: 'comment',
        title: 'Comment',
        type: 'TEXTAREA'
    },
];
export const FORMS_TEMP_FORM: formBuilderData[] = [{
    colName: 'id',
    hidden: true,
    title: '',
    visible: false
}, {
    colName: 'form_purposeName',
    title: 'Purpose Name',
    validator: [{ name: 'required' }]
},
{
    colName: 'form_schema',
    title: 'Schema',
    type: 'TEXTAREA',
    col_size: '12',
    visible: false,
    validator: [{ name: 'required' }]
}];

export const EMAIL_TEMP_FORM: formBuilderData[] = [{
    colName: 'event_name',
    title: 'Event Name',

    readonly: true,
    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Event Name should not be blank' }]
},
{
    colName: 'id',
    title: 'Event Name',
    visible: false,
    readonly: true,
    filter: true,
    sort: true,
    isPrimary: true,
    validator: []
},
{
    colName: 'body',
    title: 'Body',
    visible: false,
    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Body should not be blank' }],
    type: 'editor'
},
{
    colName: 'subject',
    title: 'Subject',
    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'Subject is required' }]
},
{
    colName: 'to',
    title: 'To',
    visible: false,
    filter: true,
    sort: true,
    validator: [{ name: 'required', error: 'To email is required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL, error: 'To should be valid' }],
    type: 'chips'
},
{
    colName: 'cc',
    title: 'CC',
    visible: false,
    filter: true,
    sort: true,
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL, error: 'Cc should be valid' }],
    type: 'chips'
},
{
    colName: 'bcc',
    title: 'Bcc',
    visible: false,
    filter: true,
    sort: true,
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL, error: 'Bcc should be valid' }],
    type: 'chips'
},
{
    colName: 'allow_email',
    title: 'Allow Send Email',
    type : 'checkbox'
},
];

export const MOBILE_FORM: formBuilderData[] = [{
    colName: 'mobile_appName',
    title: 'Mobile App Name',
    // readonly: true,
    filter: true,
    sort: true,
    validator: [{ name: 'required' }]
},
{
    colName: 'version_number',
    title: 'Version',
    // readonly: true,
    filter: true,
    sort: true,
    validator: [{ name: 'required' }]
},
{
    colName: 'id',
    title: 'Event Name',
    visible: false,
    // readonly: true,
    filter: true,
    sort: true,
    isPrimary: true,
},
{
    colName: 'type',
    title: 'App Type',
    filter: true,
    sort: true,
    type: 'select',
    selectKeyName: 'typeName',
    data: [{ id: '1', typeName: 'android' }, { id: '2', typeName: 'ios' }],
    validator: [{ name: 'required' }]
},
{
    colName: 'category_id',
    title: 'Category',
    filter: true,
    sort: true,
    type: 'select',
    selectKeyName: 'categoryName',
    data: [{ id: '1', categoryName: 'Staff App' }, { id: '2', categoryName: 'Sponsor App' }],
    validator: [{ name: 'required' }]
},
{
    colName: 'major_version',
    title: 'Major Version',
    visible: false,
    filter: true,
    sort: true,
    validator: [{ name: 'required' }],
},
{
    colName: 'minor_version',
    title: 'Minor Version',
    visible: false,
    filter: true,
    sort: true,
    validator: [{ name: 'required' }],
},
{
    colName: 'patch_version',
    title: 'Patch Version',
    visible: false,
    filter: true,
    sort: true,
    validator: [{ name: 'required' }],
},
{
    colName: 'app_file',
    title: 'APP Build',
    filter: true,
    sort: true,
    type: 'FILE',
    validator: [{ name: 'required' }]
},
// {
//     colName: 'allow_email',
//     title: 'Allow Send Email',
// },
];