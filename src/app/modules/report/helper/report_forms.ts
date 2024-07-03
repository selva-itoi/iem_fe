import { cloneData } from "src/app/helper/class/utilityHelper";
import { formBuilder, formBuilderData } from "src/app/helper/interface/response";
import { CHILD_BASIC_FORM, CHILD_OTHERS_FORM, CHILD_PHY_FORM } from "../../child/helper/child-form";
import { churchBasicForm, churchBuildingForm, churchDemoGraphic, CHURCH_OTHERS_FORM, churchMemberForm } from "../../church/helper/church-form";
import { EDU_STATUS } from "../../staff/helper/staff_form";
export const CHECKBOX_FROM = {
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
}

export const STAFF_REPORT_ADDRESS_COL: Array<any> = [
    {
        colName: 'countryName',
        title: 'Country',
    },
    {
        colName: 'stateName',
        title: 'State',
    },
    {
        colName: 'districtName',
        title: 'District',
    },
    {
        colName: 'subDistrictName',
        title: 'Sub District',
    },
    {
        colName: 'pName',
        title: 'Panchayat',
    },
    {
        colName: 'vName',
        title: 'Village',
    },
    {
        colName: 'cityName',
        title: 'cityName',
    },
    {
        colName: 'wardName',
        title: 'Ward Name',
    },
    {
        colName: 'pincode',
        title: 'pincode',
    },
]

export const STAFF_REPORT_COL: Array<any> = [
    {
        colName: 'staff_emp_id',
        title: 'Employee Id',
    },
    {
        colName: 'staff_cross_id',
        title: 'Cross Ref Id',
    },
    {
        colName: 'fullName',
        title: 'Name',
    },
    {
        colName: 'name_cert',
        title: 'Name In Certificate',
    },
    {
        colName: 'father_name',
        title: 'Father Name',
    },
    {
        colName: 'spouseName',
        title: 'Spouse Name'
    },
    {
        colName: 'genderName',
        title: 'Gender',
    },
    {
        colName: 'spouceInGems',
        title: 'Is your spouse already staff in GEMS?'
    },
    {
        colName: 'email_id',
        title: 'Email Id',
    },
    {
        colName: 'mobile_no',
        title: 'Mobile No',
    },
    {
        colName: 'alt_mobile_no',
        title: 'Alternative Mobile No',
    },
    {
        colName: 'marital_statusName',
        title: 'Marital Status'
    },
    {
        colName: 'dob',
        title: 'Date of Birth',
    },
    {
        colName: 'do_marraige',
        title: 'Date of Marriage',
    },
    {
        colName: 'do_salvation',
        title: 'Date of Salvation',
    },
    {
        colName: 'do_bap',
        title: 'Date of Baptism',
    },
    {
        colName: 'do_join',
        title: 'Date of Joining',
    },
    {
        colName: 'regionName',
        title: 'Region Name',
    },
    {
        colName: 'zoneName',
        title: 'Zone/State Name',
    },
    {
        colName: 'branchName',
        title: 'Branch',
    },
    {
        colName: 'fieldName',
        title: 'fieldName',
    },
    // {
    //     colName: 'adName',
    //     title: 'MS office',
    // },
    {
        colName: 'church_name',
        title: 'Church Name',
    },
    {
        colName: 'homeName',
        title: 'Home Name',
    },
    {
        colName: 'trustName',
        title: 'Establishment Name',
    },
    {
        colName: 'deName',
        title: 'Designation',
    },
    {
        colName: 'dName',
        title: 'Department Name',
    },
    {
        colName: 'epf_num',
        title: 'EPF(UAN) Number',
    },
    {
        colName: 'esi_num',
        title: 'ESI',
    },
    {
        colName: 'blood_groupName',
        title: 'Blood Group',
    },
    {
        colName: 'chronic_status',
        title: 'Chronic illness',
    },
    {
        colName: 'bank_name',
        title: 'Bank Name',
    },
    {
        colName: 'account_name',
        title: 'Account Name',
    },
    {
        colName: 'account_number',
        title: 'Account Number',
    },
    {
        colName: 'ifc_code',
        title: 'Ifc Code',
    },
    {
        colName: 'upi',
        title: 'UPI',
    },
    {
        colName: 'aadhar',
        title: 'Aadhar',
    },
    {
        colName: 'pan',
        title: 'PAN',
    },
    {
        colName: 'chronical',
        title: 'Chronic Description',
    },
    {
        colName: 'dedication_statusName',
        title: 'Dedication Status'
    },
    {
        colName: 'dedication_date',
        title: 'Dedication Date',
    },
    {
        colName: 'dedication_remarks',
        title: 'Dedication Remarks',
    },
    {
        colName: 'coments1',
        title: 'Comments',
    },
    {
        colName: 'coments2',
        title: 'Comments2',
    },
    {
        colName: 'coments3',
        title: 'Comments3',
    },
    {
        colName: 'testimony',
        title: 'Testimony',
    },
    {
        colName: 'created_at',
        title: 'Created At',
    },
    {
        colName: 'reason_relive',
        title: 'Reason Relieve',
    },
    {
        colName: 'asa',
        title: 'Will Staff Allowed For Sponsor Allotment?'
    },
    {
        colName: 'created_byName',
        title: 'Created By'
    },
    {
        colName: 'mut',
        title: 'MUT ID'
    },
    {
        colName: 'gsha',
        title: 'GESHA ID'
    },
    {
        colName: 'stateName',
        title: 'Origin State'
    },
    {
        colName: 'distance_from_km',
        title: 'Native Distance'
    }
]

export const SPONSOR_REPORT_COL: Array<any> = [{
    colName: 'sponsor_id',
    title: 'Donor Id',
},
{
    colName: 'fullName',
    title: 'Name',
},
{
    colName: 'is_whats_app',
    title: 'WhatsApp',
    type: 'BOOLEAN'
},
{
    colName: 'promotionalName',
    title: 'Church Ministry Area',
},
{
    colName: 'langName',
    title: 'language',
},
{
    colName: 'email_id',
    title: 'Email ID',
},
{
    colName: 'mobile_no',
    title: 'Mobile No',
},
{
    colName: 'dob',
    title: 'Date of Birth',
},
{
    colName: 'do_marraige',
    title: 'Date of Marriage',
},
{
    colName: 'place',
    title: 'Place',
},
{
    colName: 'created_at',
    title: 'Created At',
}];

export const SPONSOR_ALLOTMENT_COL: Array<any> = [{
    colName: 'ref_id',
    title: 'Ref ID',
},
{
    colName: 'name',
    title: 'Name',
},
{
    colName: 'zoneName',
    title: 'Zone/State',
},
{
    colName: 'statusName',
    title: 'Status',
},
{
    colName: 'deleted_at',
    title: 'Completed On',
}]

export const CHILD_EXPORT_REPORT: formBuilder[] = [{
    colName: 'home',
    title: 'Home Name',
    defaultValue: false,
    type: 'MULTISELECT',
    apiTblName: 'home',
    selectKeyName: 'homeName',
    selectPrimaryKey: 'id',
    col_size: '4'
},
{
    colName: 'basic',
    title: 'Basic Details',
    defaultValue: false,
    type: 'MULTISELECT',
    selectKeyName: 'title', selectPrimaryKey: 'colName',
    event: { isCallback: true, name: 'change' },
    data: [...cloneData(CHILD_BASIC_FORM).splice(0, 14).map((a: any) => { if (a.colName == 'status') { a.colName = 'child_statusName' } else if (a.selectKeyName) { a.colName = a.selectKeyName } return a; }),
    ...cloneData(CHILD_PHY_FORM),
    ...cloneData(CHILD_OTHERS_FORM).splice(0, 3), ...[{ colName: 'created_at', title: 'Created At', }, { colName: 'created_byName', title: 'Created By' }]],
    col_size: '4'
},
{
    groupTitle: 'Others Details',
    colName: 'is_parent',
    title: 'Parent Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '12'
},
{
    colName: 'is_education',
    title: 'Education Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '12'
},
{
    colName: 'is_sibling',
    title: 'Sibling Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '12'
},
{
    colName: 'is_sponsorship',
    title: 'Sponsorship Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '12'
}
];


export const SPONSOR_EXPORT_REPORT: formBuilder[] = [{
    colName: 'promotional_office',
    title: 'Church Ministry Area',
    defaultValue: false,
    type: 'MULTISELECT',
    apiTblName: 'promotional_office',
    selectKeyName: 'promotionalName',
    selectPrimaryKey: 'promoId',
    col_size: '4'
},
{
    colName: 'basic',
    title: 'Basic Details',
    defaultValue: false,
    type: 'MULTISELECT',
    selectKeyName: 'title', selectPrimaryKey: 'colName',
    event: { isCallback: true, name: 'change' },
    data: [...SPONSOR_REPORT_COL, ...STAFF_REPORT_ADDRESS_COL],
    col_size: '4'
},
{
    colName: 'sponsorship_module',
    title: 'Sponsorship Module',
    defaultValue: false,
    type: 'MULTISELECT',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    apiTblName: 'sponsorship_module',
    event: { isCallback: true, name: 'change' },
    // data: [...SPONSOR_REPORT_COL, ...STAFF_REPORT_ADDRESS_COL],
    col_size: '4'
},
{
    groupTitle: 'Sponsorship Details',
    colName: 'is_active_allotment',
    title: 'Active Allotment only',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '12'
},
{
    colName: 'is_sponsorship',
    title: 'Sponsorship Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '12'
},
{
    colName: 'is_allotment',
    title: 'Allotment Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '12'
}
];

export const CHURCH_EXPORT_REPORT: formBuilder[] = [
    {
        colName: 'region_id',
        title: 'Region',
        type: 'MULTISELECT',
        apiTblName: 'region',
        selectKeyName: 'regionName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        event: {
            name: 'change',
            apiTblName: 'zone',
            valueAssign: 'zone'
        }
    },
    {
        colName: 'zone',
        selectKeyName: 'zoneName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        type: 'MULTISELECT',
        title: 'Zone/State Name',
        event: {
            name: 'change',
            apiTblName: 'field',
            valueAssign: 'field',
            apiFunName: 'getFieldByZone'
        }
    },
    {
        colName: 'field',
        selectKeyName: 'fieldName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        // apiFunName: 'getFieldByZone',
        type: 'MULTISELECT',
        title: 'Field Name',
        event: {
            name: 'change',
            valueAssign: 'church',
            apiTblName: 'church',
            apiFunName: 'getChurchByField'
        },
        validator: [{ name: 'required', error: 'Field Name should not be blank' }]
    },
    {
        colName: 'church',
        selectKeyName: 'church_name',
        type: 'MULTISELECT',
        selectPrimaryKey: 'id',
        title: 'Church Name',
        event: { isCallback: true, name: 'change' },
    },
    {
        colName: 'basic',
        title: 'Basic Details',
        defaultValue: false,
        type: 'MULTISELECT',
        selectKeyName: 'title', selectPrimaryKey: 'colName',
        event: { isCallback: true, name: 'change' },
        data: [...cloneData(churchBasicForm).map((a: any) => { if (a.selectKeyName) { a.colName = a.selectKeyName } return a; }),
        ...[{ colName: 'staffName', title: 'Pastor Name' }],
        ...cloneData(churchBuildingForm),
        ...cloneData(CHILD_OTHERS_FORM).splice(0, 3)],
        col_size: '4'
    },
    {
        colName: 'address_col',
        title: 'Address Details',
        defaultValue: false,
        type: 'MULTISELECT',
        selectKeyName: 'title', selectPrimaryKey: 'colName',
        event: { isCallback: true, name: 'change' },
        data: [...cloneData(STAFF_REPORT_ADDRESS_COL).splice(0, 7)],
        col_size: '4'
    },
    {
        colName: 'others_col',
        title: 'Others Details',
        defaultValue: false,
        type: 'MULTISELECT',
        selectKeyName: 'title', selectPrimaryKey: 'colName',
        event: { isCallback: true, name: 'change' },
        data: [...cloneData(churchDemoGraphic), ...CHURCH_OTHERS_FORM],
        col_size: '4'
    },
    {
        colName: 'is_committee',
        title: 'Council Member',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],
        col_size: '4'
    },
    {
        colName: 'is_member',
        title: 'Member Details',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1, textInvalid: 'No' }],
        col_size: '4'
    },
    {
        colName: 'is_allotment',
        title: 'Sponsor Details',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],
        col_size: '4'
    },
    {
        colName: 'is_summary',
        title: 'Summary Details',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],
        col_size: '4'
    },
];
export const MEMBER_EXPORT_REPORT: formBuilder[] = [
    {
        colName: 'region_id',
        title: 'Region',
        type: 'MULTISELECT',
        apiTblName: 'region',
        selectKeyName: 'regionName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        event: {
            name: 'change',
            apiTblName: 'zone',
            valueAssign: 'zone'
        }
    },
    {
        colName: 'zone',
        selectKeyName: 'zoneName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        type: 'MULTISELECT',
        title: 'Zone Name',
        event: {
            name: 'change',
            apiTblName: 'church',
            valueAssign: 'church',
            // apiFunName: 'getFieldByZone'
        }
    },
    {
        colName: 'church',
        selectKeyName: 'church_name',
        type: 'MULTISELECT',
        selectPrimaryKey: 'id',
        title: 'Church Name',
        event: { isCallback: true, name: 'change' },
    },
    {
        colName: 'basic',
        title: 'Basic Details',
        defaultValue: false,
        type: 'MULTISELECT',
        selectKeyName: 'title', selectPrimaryKey: 'colName',
        event: { isCallback: true, name: 'change' },
        data: cloneData(churchMemberForm).map((b: any) => {
            if (b.colName == 'church_fk_id') {
                b.colName = 'staffName';
                b.title = 'Pastor Name';
            }else
                b.colName = b?.selectKeyName || b.colName;
            return b
        }),
        col_size: '4'
    },
];

export const STAFF_EXPORT_REPORT: formBuilder[] = [{
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
    col_size: '4'
},
{
    colName: 'zone',
    selectKeyName: 'zoneName',
    selectPrimaryKey: 'id',
    defaultValue: '',
    type: 'select',
    title: 'Zone/State Name',
    col_size: '4'
},
{
    colName: 'department',
    selectKeyName: 'dName',
    selectPrimaryKey: 'id',
    apiTblName: 'department',
    defaultValue: '',
    type: 'select',
    title: 'Department Name',
    col_size: '4'
},
{
    colName: 'basic',
    title: 'Basic Details',
    defaultValue: false,
    type: 'MULTISELECT',
    selectKeyName: 'title', selectPrimaryKey: 'colName',
    event: { isCallback: true, name: 'change' },
    data: [...cloneData(STAFF_REPORT_COL), ...[{ colName: 'last_rejoin_date', title: 'Last Rejoin Date' },{ colName: 'deleted_at', title: 'Relive Date'}]],
    col_size: '4'
},
{
    colName: 'is_address',
    title: 'Address Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '4'
},
{
    colName: 'is_education',
    title: 'Education Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '4'
},
{
    colName: 'is_training',
    title: 'Training Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '4'
},
{
    colName: 'is_exp_gems',
    title: 'Experience in GEMS Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '4'
},
{
    colName: 'is_sponsor',
    title: 'Sponsor Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '4'
},
{
    colName: 'is_experience',
    title: 'Experience Details',
    defaultValue: false,
    type: 'checkbox',
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    col_size: '4'
},
];

export const STAFF_REPORT_EXP_COL: Array<any> = [
    {
        colName: 'institution_name',
        title: 'Institution Name',
    },
    {
        colName: 'designation',
        title: 'Designation',
    },
    {
        colName: 'type',
        title: 'Type',
        data: [{ id: 1, name: 'Secular' }, { id: 2, name: 'Misionalogy' }]
    },
    {
        colName: 'from_date',
        title: 'From Date',
    },
    {
        colName: 'to_date',
        title: 'To Date',
    },
    {
        colName: 'place',
        title: 'Place',
    },
    {
        colName: 'remarks',
        title: 'Remarks',
    }
]

export const STAFF_REPORT_EDU_COL: Array<any> = [
    {
        colName: 'institution_name',
        title: 'Institution Name',
    },
    {
        colName: 'course_name',
        title: 'Course Name',
    },
    {
        colName: 'type',
        title: 'Education Type',
        data: [{ id: 1, name: 'Academic' }, { id: 2, name: 'Theology' }]
    },
    {
        colName: 'categoryName',
        title: 'Remarks',
    },
    {
        colName: 'from_date',
        title: 'From Date',
    },

    {
        colName: 'to_date',
        title: 'To Date',
    },
    {
        colName: 'medium',
        title: 'Lang Medium'
    },
    {
        title: 'Branch Division',
        colName: 'branch'
    },
    {
        colName: 'course_status',
        title: 'Course Status',
        selectKeyName: 'eduStatusName',
        data: EDU_STATUS
    },
    {
        colName: 'remarks',
        title: 'Remarks',
    }
];

export const STAFF_REPORT_TRAINING_COL: Array<any> = [
    {
        colName: 'training_name',
        title: 'Name',
    },
    {
        colName: 'description',
        title: 'Description',
    },
    {
        colName: 'from_date',
        title: 'From Date',
    },
    {
        colName: 'to_date',
        title: 'To Date',
    },
    {
        colName: 'remarks',
        title: 'Remarks',
    }
]
export const STAFF_REPORT_GEMS_EXP_COL: Array<any> = [
    {
        colName: 'regionName',
        title: 'Region Name',
    },
    {
        colName: 'zoneName',
        title: 'Zone/State Name',
    },
    {
        colName: 'branchName',
        title: 'Branch',
    },
    {
        colName: 'fieldName',
        title: 'fieldName',
    },
    // {
    //     colName: 'adName',
    //     title: 'MS office',
    // },
    {
        colName: 'church_name',
        title: 'Church Name',
    },
    {
        colName: 'homeName',
        title: 'Home Name',
    },
    {
        colName: 'trustName',
        title: 'trustName',
    },
    {
        colName: 'deName',
        title: 'Designation',
    },
    {
        colName: 'dName',
        title: 'Department Name',
    },
    {
        colName: 'from_date',
        title: 'From Date',
    },
    {
        colName: 'to_date',
        title: 'To Date',
    },
    {
        colName: 'remarks',
        title: 'Remarks',
    }
]

const applcation_from: formBuilderData[] = [{
    colName: 'form_id',
    hidden: true,
    title: 'Form Id',
},
{
    colName: 'purpose_id',
    title: 'Purpose',
    apiTblName: 'form_purpose',
    selectKeyName: 'form_purposeName',
},
{
    colName: 'description',
    title: 'Describe Your needs',
    col_size: 12,
    validator: [{ name: 'required' }]
}
]
