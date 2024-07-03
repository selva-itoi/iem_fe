import { AppConstant, VALIDATOR_PATTERNS } from "src/app/helper/class/app-constant";
import { formBuilder, formBuilderData, formDynamicValidator, tableColum } from "src/app/helper/interface/response";

export const MARITAL_STATUS = [
    { maritalName: "Unmarried", id: 1 },
    { maritalName: "Married", id: 2 },
    { maritalName: "Married but living separate", id: 3 },
    { maritalName: "Divorced", id: 4 },
    { maritalName: "Widow", id: 5 },
    { maritalName: "Widower", id: 6 }
]
export const EDU_STATUS: any = [{ id: 1, eduStatusName: 'Studying' },
{ id: 2, eduStatusName: 'Completed' },
{ id: 3, eduStatusName: 'Disc' }]

export const EDU_CATEGORY = [
    { id: 1, edu_categoryName: 'School' },
    { id: 2, edu_categoryName: 'Diploma' },
    { id: 3, edu_categoryName: 'UG' },
    { id: 4, edu_categoryName: 'PG' },
    { id: 5, edu_categoryName: 'Research' },
];

export const SELECT_STAFF_LIST_TBL: tableColum[] = [
    // {
    //     colName: 'profile_img_path',
    //     title: 'Profile',
    //     sort: false,
    //     filter: false,
    //     colType: 'IMAGE'
    // },
    {
        colName: 'name',
        title: 'Name',
        sort: true,
        filter: true,
    },
    {
        colName: 'staff_emp_id',
        title: 'Emp ID',
        sort: false,
        isPrimary: true,
        filter: true,
        colType: 'STAFF_EMP_ID'
    },
    // {
    //     colName: 'staff_cross_id',
    //     title: 'Cross ID',
    //     sort: true,
    //     filter: true,
    // },
    {
        colName: 'department',
        title: 'Department',
        selectKeyName: 'dName',
        filterCol: {
            type: 'DROPDOWN',
            apiName: 'department',
            selectPrimaryKey: 'id',
            selectKeyName: 'dName'
        },
        sort: true,
        filter: true,
    },
    {
        colName: 'alloted_amount',
        title: 'Amount',
        sort: true,
        filter: true,
        isEditable: true
    },
]

export const STAFF_LIST_TBL: tableColum[] = [
    {
        colName: 'profile_img_path',
        title: 'Profile',
        sort: false,
        filter: false,
        colType: 'IMAGE'
    },
    {
        colName: 'name',
        title: 'Name',
        sort: true,
        filter: true,
    },
    {
        colName: 'staff_emp_id',
        title: 'Emp ID',
        sort: false,
        isPrimary: true,
        filter: true,
        colType: 'STAFF_EMP_ID'
    },
    // {
    //     colName: 'staff_cross_id',
    //     title: 'Cross ID',
    //     sort: true,
    //     filter: true,
    // },
    {
        colName: 'department',
        title: 'Department',
        selectKeyName: 'dName',
        filterCol: {
            type: 'DROPDOWN',
            apiName: 'department',
            selectPrimaryKey: 'id',
            selectKeyName: 'dName'
        },
        sort: true,
        filter: true,
    },
    {
        colName: 'fieldName',
        title: 'Field',
        sort: true,
        filter: true,
    },
    {
        colName: 'deName',
        title: 'Designation',
        sort: true,
        filter: true,
    },
    // {
    //     colName: 'total_active_alloted',
    //     title: 'Alloted',
    //     sort: true,
    //     filter: true,
    //     visible: false,
        
    // },
    {
        colName: 'allow_sponsor_allotment',
        title: 'ASA',
        sort: true,
        filter: true,
        filterCol: {
            type: 'DROPDOWN',
            data: [{ asaName: 'Yes', id: '1' }, { asaName: 'No', id: '0' }],
            selectKeyName: 'asaName',
            selectPrimaryKey: 'id',
        },
    },
   
    {
        colName: 'updated_at',
        title: 'Last Update',
        sort: false,
        filter: true,
        colType: 'DATE',
        filterCol: { type: 'DATE', selectKeyName: 'updated_at', yearNavigator: true, monthNavigator: true }
    },
];
export const STAFF_BASIC_FORM: formBuilder[] = [
    // {
    //     colName: 'staff_emp_id',
    //     title: '',
    //     hidden: true,
    // },
    {
        colName: 'title',
        title: 'Title',
        type: 'select',
        apiTblName: 'title',
        apiFilter: { keyName: 'id', operation: '!=', value:10},
        selectKeyName: 'titleName',
        selectPrimaryKey: 'id',
        defaultValue: '1',
        col_size: '2',
        event: { name: 'change', isCallback: true }
        //validator: [{ name: 'required', error: 'Title should not be blank' }]
    },
    {
        colName: 'name',
        title: 'Name',
        col_size: '4',
        validator: [{ name: 'required', error: 'Name should not be blank' },
        { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Staff Name not Valid (Not allowed special character and space at end)' }],
        event: { name: 'change', isCallback: true }

    },
    {
        colName: 'name_cert',
        title: 'Name in Aadhar *',
        validator: [{ name: 'required', error: 'Name in Aadhar should not be blank' }],
        readonly:false
    },
    {
        colName: 'father_name',
        title: "Father's Name",
        // validator: [{ name: 'required', error: 'Father Name should not be blank' },
        // { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Father Name should not be Valid' }]
    },
    {
        colName: 'mother_name',
        title: "Mother Name",
        // validator: [{ name: 'required', error: 'Mother Name should not be blank' },
        // { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Mother Name should not be Valid' }]
    },
    {
        colName: 'mother_tongue',
        title: "Mother Tongue * ",
        validator: [{ name: 'required', error: 'Mother Tongue should not be blank' },
        { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Mother Tongue should not be Valid' }]
    },
    // {
    //     colName: 'home_state',
    //     type:'select',
    //     apiTblName:'state',
    //     title: "Home State * ",
    //     validator: [{ name: 'required', error: 'Home State should not be blank' },
    //     { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Home State should not be Valid' }]
    // },
    {
        colName: 'gender',
        title: 'Gender',
        type: 'select',
        data: AppConstant.GENDER,
        selectKeyName: 'genderName', selectPrimaryKey: 'id',
        event: { name: 'change', isCallback: true },
        validator: [{ name: 'required', error: 'Gender is required' }]
    }
]

export const GEMS_EXP_FORM: formBuilderData[] = [
    {
        colName: 'from_date',
        title: 'From Date ',
        type: 'DATE',
        yearNavigator: true,
        monthNavigator: true,
        placeholder: 'Worked From',
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
        colJoinName: 'to_date',
        colJoinSeperator: 'to',
        validator: [{ name: 'required', error: 'From Date is Required' }]
    },
    {
        colName: 'to_date',
        title: 'To Date ',
        type: 'DATE',
        yearNavigator: true,
        monthNavigator: true,
        colJoinName: 'from_date',
        colJoinSeperator: 'to',
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
    },
    {
        colName: 'document',
        title: 'Document',
        type: 'FILE',
    },
    {
        colName: 'remarks',
        title: 'Remarks',
    },
    {
        colName: 'id',
        hidden: true,
        title: '',
        visible: false
    },
];

export const STAFF_BANK_FORM: formBuilder[] = [
    {
        groupTitle: "Bank Details",
        colName: 'bank_name',
        title: 'Bank Name ',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Bank Name should be valid' }]
    },
    {
        title: "Branch Name",
        colName: 'branch_name',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Branch Name should be valid' }]
    },
    {
        title: "Account Number",
        colName: 'account_number',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Account Number should be valid' }]
    },
    {
        title: "Account Name",
        colName: 'account_name',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Account Name should be valid' }]
    },
    {
        title: "IFSC Code",
        title_case: 'NONE',
        colName: 'ifc_code',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.IFC_CODE, error: 'IFSC Code should be valid' }]
    },
    {
        title: "UPI",
        colName: 'upi',
        title_case: 'NONE',
        //validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.IFC_CODE, error: 'IFSC Code should be valid' }]
    },
]
export const staffDynamicValidator: formDynamicValidator[] = [{
    controlName: 'chronic_status',
    validatorControl: ['chronical'],
    hideControl: ['chronical'],
    value: 1,
    validator: [{ name: 'required', error: 'Specification is required' }]
},
{
    controlName: 'dedication_status',
    validatorControl: ['dedication_remarks'],
    hideControl: ['dedication_remarks'],
    value: 1,
    validator: [{ name: 'required', error: 'Dedication is required' }]
},
{
    controlName: 'dedication_status',
    validatorControl: ['dedication_date'],
    hideControl: ['dedication_date'],
    value: 1,
    validator: []
}];

export const STAFF_EXP_DYNAMIC_VALIDATOR: formDynamicValidator[] = [{
    controlName: 'home',
    validatorControl: ['allow_home_assign'],
    hideControl: ['allow_home_assign'],
    validator: [{ name: 'required' }],
    value: '',
    operation: '!='
},
{
    controlName: 'church',
    validatorControl: ['allow_church_assign'],
    hideControl: ['allow_church_assign'],
    validator: [{ name: 'required' }],
    value: '',
    operation: '!='
}];


export const STAFF_OTHERS_FORM: formBuilder[] = [
    {
        colName: 'blood_group_id',
        title: 'Blood Group ',
        selectKeyName: 'blood_groupName',
        type: 'select',
        apiTblName: 'blood_group'
    },
    {
        colName: 'chronic_status',
        title: 'Do you have any Chronic illness ? ',
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],
    },
    {
        colName: 'chronical',
        title: 'Specify '
    },
    {
        colName: 'dedication_status',
        title: 'Dedication Status ?  ',
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],
    },
    {
        colName: 'dedication_remarks',
        title: 'Description '
    },
    {
        colName: 'dedication_date',
        title: 'Dedication Date ',
        type: 'DATE',
        yearNavigator: true,
        monthNavigator: true,
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
    },
    {
        colName: 'testimony',
        title: 'Testimony ',
        col_size: 12,
        type: 'TEXTAREA',
        hidden:true
    },
    {
        colName: 'gsha',
        title: 'GESHA ID',
        title_case: 'NONE',
        hidden:true
    },
    {
        groupTitle: 'Medical Details',
        colName: 'mut',
        title: 'MUT ID',
        title_case: 'NONE',

    },
    {
        colName: 'coments1',
        title: 'Comments-1 ',
        hidden:true

    },
    {
        colName: 'coments2',
        title: 'Comments-2 ',
        hidden:true

    },
    {
        colName: 'coments3',
        title: 'Comments-3 ',
        groupEnd: true,
        hidden:true

    },
    {
        groupTitle: 'Identity Details',
        colName: 'aadhar',
        title: 'Aadhaar Number ',
        validator: [{ name: 'minLength', funValue: '12', error: 'Aadhaar Should be 12 digit' }, { name: 'maxLength', funValue: 12, error: 'Aadhaar Should be 12 digit' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Aadhaar should be valid' }]
    },
    {
        colName: 'pan',
        title: 'PAN Number ',
        validator: [{ name: 'minLength', funValue: 10, error: 'PAN Should be 10 digit' }, { name: 'maxLength', funValue: 10, error: 'PAN Should be 10 digit' }]
    },
    {
        colName: 'staff_fk_id',
        hidden: true,
        title: ''
    },
    {
        groupTitle: 'Support Document',
        colName: 'aadhar_document',
        title: 'Aadhar Document',
        type: 'FILE',
    },
    {
        colName: 'pan_document',
        title: 'PAN Document',
        type: 'FILE',
    },
    {
        colName: 'bank_document',
        title: 'Bank Document',
        type: 'FILE',
    },
    {
        colName: 'others_document',
        title: 'Others Document',
        type: 'FILE',
    }
];


export const STAFF_OFFICE_FORM: formBuilder[] = [
    // {
    //     colName: 'trust',
    //     selectKeyName: 'trustName',
    //     selectPrimaryKey: 'id',
    //     defaultValue: '',
    //     apiTblName: 'trust',
    //     type: 'select',
    //     title: 'Establishment Name',
    //     event: { isCallback: true, name: 'change' },
    //     validator: [{ name: 'required', error: 'Establishment Name should not be blank' }]
    // },
    {
        groupTitle: 'Office Details',
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
        colName: 'department',
        selectKeyName: 'dName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        apiTblName: 'department',
        type: 'select',
        title: 'Department Name',
        event: { isCallback: true, name: 'change' },
        validator: [{ name: 'required', error: 'Department Name should not be blank' }]
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
            apiTblName: 'field',
            valueAssign: 'field',
            apiFunName: 'getFieldByZone'
        },
    },
    {
        colName: 'field',
        selectKeyName: 'fieldName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        type: 'select',
        title: 'Field / Place',
        event: {
            name: 'change',
            valueAssign: 'church',
            apiTblName: 'church',
            apiFunName: 'getChurchByField'
        },
        // validator: [{ name: 'required', error: 'Field Name should not be blank' }]
    },

    // {
    //     colName: 'state_office',
    //     selectKeyName: 'state_officeName',
    //     selectPrimaryKey: 'id',
    //     defaultValue: '',
    //     type: 'select',
    //     apiTblName: 'state_office',
    //     title: 'State Name',
    //     title_case: 'NONE',
    //     // event: {
    //     //     name: 'change',
    //     //     apiTblName: 'department',
    //     //     valueAssign: 'department'
    //     // },
    //     validator: [{ name: 'required' }]
    // },

    {
        colName: 'branch',
        selectKeyName: 'branchName',
        apiTblName: 'branch',
        selectPrimaryKey: 'id',
        type: 'select',
        title: 'Nature Of Ministry',
        event: { isCallback: true, name: 'change' },
    },
    {
        colName: 'state_office',
        selectKeyName: 'state_officeName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        type: 'select',
        apiTblName: 'state_office',
        title: 'State Name',
        title_case: 'NONE',
        // event: {
        //     name: 'change',
        //     apiTblName: 'department',
        //     valueAssign: 'department'
        // },
        validator: [{ name: 'required' }]
    },


    // {
    //     colName: 'branch',
    //     selectKeyName: 'branchName',
    //     selectPrimaryKey: 'id',
    //     defaultValue: '',
    //     apiTblName: 'branch',
    //     type: 'select',
    //     title: 'Branch Name',
    //     event: {
    //         name: 'change',
    //         valueAssign: 'designation',
    //         apiTblName: 'designation',
    //     },
    //     validator: [{ name: 'required', error: 'Branch Name should not be blank' }]
    // },
    {
        colName: 'designation',
        selectKeyName: 'deName',
        selectPrimaryKey: 'id',
        apiTblName: 'designation',
        defaultValue: '',
        type: 'select',
        title: 'Designation Name',
        event: { isCallback: true, name: 'change' },
        // validator: [{ name: 'required', error: 'Designation Name should not be blank' }]
    },
    // {
    //     colName: 'trust',
    //     selectKeyName: 'trustName',
    //     selectPrimaryKey: 'id',
    //     defaultValue: '',
    //     apiTblName: 'trust',
    //     type: 'select',
    //     title: 'Trust Name',
    //     event: { isCallback: true, name: 'change' },
    //     validator: [{ name: 'required', error: 'Trust Name should not be blank' }]
    // },
    {
        colName: 'home',
        selectKeyName: 'homeName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        apiTblName: 'home',
        type: 'select',
        title: 'Home/Projects',
        event: { isCallback: true, name: 'change' },
        validator: []
    },
    // {
    //     groupTitle: 'Payroll Setting',
    //     colName: 'payroll_category',
    //     title: 'Salary Category',
    //     type: 'select',
    //     validator: [{ name: 'required' }]
    // },
    // {
    //     colName: 'HRA',
    //     title: 'HRA',
    //     type: 'select',
    //     selectKeyName: 'hraName',
    //     data: [{ hraName: '25%', id: '25' }, { hraName: '15%', id: '15' }]
    // },
    // {
    //     colName: 'Leave Policy',
    //     title: 'Leave Policy',
    //     type: 'select',
    //     selectKeyName: 'hraName',
    //     data: [{ hraName: 'Worker%', id: 'Worker' }, { hraName: '15%', id: 'Missionary' }]
    // }
];

export const staffOfficePartForm: formBuilder[] = [
    {
        colName: 'allow_sponsor_allotment',
        title: 'Will staff allowed for sponsor allotment ? ',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],
        validator: [],
        col_size: 12
    },
    {
        colName: 'epf_num',
        defaultValue: '',
        title: 'EPF(UAN) Number',
        validator: [
            { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'EPF Number not valid', },
            { name: 'pattern', funValue: VALIDATOR_PATTERNS.MUST_BE(12), error: 'EPF Number Should be 12 digit' },
        ],
        groupTitle: 'Pension Details'
    },
    {
        colName: 'esi_num',
        defaultValue: '',
        title: 'ESI Number',
        // validator: [
        // { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: ' ESI Number Should be valid', },
        // { name: 'pattern', funValue: VALIDATOR_PATTERNS.MUST_BE(17), error: 'ESI Number Should be 17 digit' },
        // ]
    },
    {
        colName: 'profile_img',
        defaultValue: '',
        type: 'FILE',
        fileConfig: { fileType: 'IMAGE', filePath: '' },
        title: 'User Profile',
        validator: [{ name: 'required', error: 'Profile Image is required' }]
    },
    {
        colName: 'family_img',
        defaultValue: '',
        type: 'FILE',
        fileConfig: { fileType: 'IMAGE', filePath: '' },
        title: 'Family Profile',
        //validator: [{ name: 'required', error: 'Family Image is required' }]
    }
];

export const STAFF_TRANSFER_FORM: formBuilderData[] = [
    {
        colName: 'transfer_type',
        title: 'Transfer Type',
        defaultValue: '',
        type: 'select',
        apiTblName: 'transfer_type',
        selectKeyName: 'transfer_typeName', selectPrimaryKey: 'id',
        validator: [{ name: 'required', error: 'Transfer Type is Required' }],
        col_size: 6,
        visible: false
    },
    {
        colName: 'allow_church_assign',
        title: 'Will staff Assign to Church position?',
        defaultValue: false,
        type: 'radio',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }, { name: 'No', id: 0 }],
        col_size: 12,
        visible: false
    },
    {
        colName: 'allow_home_assign',
        title: 'Will staff Assign to Home In charge Position ?',
        defaultValue: false,
        type: 'radio',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }, { name: 'No', id: 0 }],
        col_size: 12,
        visible: false
    },
    {
        colName: 'is_primary',
        title: 'Is this primary Designation of staff ? ',
        defaultValue: false,
        type: 'radio',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }, { name: 'No', id: 0 }],
        validator: [{ name: 'required' }],
        col_size: 12,
        visible: false
    },
    {
        colName: 'remarks',
        title: 'Remarks ',
        visible: false
    },
    {
        colName: 'staff_fk_id',
        title: 'ID',
        hidden: true,
        visible: false
    },
]

export const STAFF_PAYROLL_FORM: formBuilderData[] = [
    {
        colName: 'trust_fk_id',
        title: 'Establishment',
        hidden: true,
        event: { name: 'change', apiTblName: 'payroll_group', valueAssign: 'payroll_group_fk_id' }
    },
    {
        groupTitle: 'Payroll Setting',
        colName: 'is_payroll',
        title: 'Do you have a Payroll', type: 'checkbox', data: [{ dataName: 'Yes', id: '' }],
        selectKeyName: 'dataName', selectPrimaryKey: 'id', event: { name: 'change', isCallback: true }
    },
    {
        groupTitle: ' ',
        colName: 'payroll_group_fk_id',
        title: 'Payroll Group',
        type: 'select',
        selectKeyName: 'payroll_groupName',
        selectPrimaryKey: 'id'
    },
    {
        // groupTitle: ' ',
        colName: 'payroll_type',
        title: 'Payroll Type',
        type: 'select',
        selectKeyName: 'payroll_typeName',
        selectPrimaryKey: 'id',
        apiTblName: 'payroll_type',
        // data: [{ payroll_typeName: 'Consolidate', id: 1 }, { payroll_typeName: 'Payroll', id: 2 }],
    },
    {
        // groupTitle: ' ',
        colName: 'salary_category_id',
        title: 'Salary Category',
        type: 'select',
        apiTblName: 'salary_category',
        selectKeyName: 'salary_categoryName',
    },
    {
        colName: 'hra_id',
        title: 'HRA %',
        type: 'select',
        apiTblName: 'hra_percentage',
        selectKeyName: 'hra_percentageName',
    },
    {
        colName: 'leave_policy_id',
        title: 'Leave Policy',
        type: 'select',
        apiTblName: 'leave_policy',
        selectKeyName: 'leave_policyName'
    },
    {
        colName: 'is_epf',
        title: 'Allow Epf',
        type: 'checkbox',
        defaultValue: 1,
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { name: 'change', isCallback: true },
        data: [{ name: 'Yes', id: 1 }]
    },
    {
        colName: 'is_esi',
        title: 'Allow Esi',
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        data: [{ name: 'Yes', id: 1 }]
    },
    {
        colName: 'is_welfare',
        title: 'Is Welfare',
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        data: [{ name: 'Yes', id: 1 }]
    },
    {
        colName: 'is_abry',
        title: 'ABRY',
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { name: 'change', isCallback: true },
        data: [{ name: 'Yes', id: 1 }]
    },
]

export const PAYROLL_EXPERIENCE_FORM: formBuilderData[] =
    [
        {
            colName: 'total_exp',
            title: 'Experience Year'
        },
        {
            colName: 'type',
            title: 'Type',
            type: 'select',
            data: [
                { typeName: 'Add', id: 1 },
                { typeName: 'Subtract', id: 2 }
            ],
            selectKeyName: 'typeName',
            selectPrimaryKey: 'id'
        },
        {
            colName: 'remarks',
            title: 'Remarks'
        },
        {
            colName: 'id',
            title: '',
            hidden: true,
            visible: false
        }
        
    ]
    export const PROGRESS_LIST: tableColum[] = [
        {
            colName: 'staff_name',
            title: 'Staff Name'
        },
        {
            colName: 'zone',
            title: 'Zone/State'
        },
        {
            colName: 'region',
            title: 'Region'
        },
        {
            colName: 'from_date',
            title: 'Financial Year'
        },
        {
            colName: 'report_date',
            title: 'Reporting Month',
            // colType: 'DATE'
        },
        {
            colName: 'created_at',
            title: 'Created At',
            colType: 'DATE',
        }
    ]
    export const NEW_PROGRESS_FORM: formBuilderData[] = [
        {
            colName: 'field_no_1',
            title: 'No of prayer cells',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_2',
            title: 'No of IEM/Mission Sunday',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_3',
            title: 'No of People to share aabout IEM',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_4',
            title: 'No. of New Area Secretary',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_5',
            title: 'No. of New MC/AC',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_6',
            title: 'No. of New Kingdom Builder/Team',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_7',
            title: 'No. of Bible Study Groups',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_8',
            title: 'No. of Happy Evening Youth Members',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_9',
            title: 'No. of New Total Supporters',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_10',
            title: 'No. of New General Mission Supports',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_11',
            title: 'No. of New Missionary Supports',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_12',
            title: 'No. of Hostel/MK Supports',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        }
        , {
            colName: 'field_no_13',
            title: 'No. of New Church Supports',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_14',
            title: 'No. of Others Supports (eg Projects)',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_15',
            title: 'No. of Missionary Candidates',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_16',
            title: 'No. of New Magazine',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_17',
            title: 'No. of Programs Conducted',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
                colName: 'para_txt_1',
                title: 'Description on Programs Conducted',
                type:'TEXTAREA',
                validator: [{ name: 'required' }]
        },
        {
            colName: 'decription_img',
            defaultValue: '',
            type: 'FILE',
            fileConfig: { fileType: 'IMAGE', filePath: '' },
            title: 'Description Image',
            validator: [{ name: 'required', error: 'Image is required' }]
        },
        {
            colName: 'para_txt_2',
            title: 'Real Life Story',
            type:'TEXTAREA',
            validator: [{ name: 'required' }]
        },
        {
            colName: 'story_img',
            defaultValue: '',
            type: 'FILE',
            fileConfig: { fileType: 'IMAGE', filePath: '' },
            title: 'Story Image',
            validator: [{ name: 'required', error: 'Image is required' }]
        },
        {
        colName: 'para_txt_3',
        title: 'Any Other Ministry Done',
        type:'TEXTAREA',
        validator: [{ name: 'required' }]
        },
        {
            colName: 'field_no_18',
            title: 'Praise Points',
            validator: [{ name: 'required', }]
        },
        {
            colName: 'field_no_19',
            title: 'Prayer Points',
            validator: [{ name: 'required', }]
        },
        // {
        //     colName: 'field_no_1',
        //     title: 'No of prayer cells',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_2',
        //     title: 'No. of IEM/Mission Sunday',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_3',
        //     title: 'No. of New houses visited',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_4',
        //     title: 'No. of New churches Supports',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_5',
        //     title: 'No. of New General/Mission Fund Supporters',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_6',
        //     title: 'No. of New Missionary Supporters ',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_7',
        //     title: 'No. of New Hostel/MK Supporters',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_8',
        //     title: 'No. of New Area Secretaries appointed',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_9',
        //     title: 'No. of MC/AC Appoinments',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_10',
        //     title: 'No. of Missionary Candidates raised',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_11',
        //     title: 'No. of Kingdom Builders Team raised',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_12',
        //     title: 'No. of VBT formed',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // }
        // , {
        //     colName: 'field_no_13',
        //     title: 'No. of New Magazine enrolled',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_14',
        //     title: 'No. of New Bible Study group formed',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_15',
        //     title: 'No. of Mission Awareness Programs',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_16',
        //     title: 'No. of Professional Meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_17',
        //     title: 'No. of Area Secretaries meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_18',
        //     title: 'No. of Supporters meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_19',
        //     title: 'No. of Youth meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_20',
        //     title: 'No. of Children meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_21',
        //     title: 'No. of Women meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_22',
        //     title: 'No. of Pastors meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_23',
        //     title: 'No. of Fasting prayers',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_24',
        //     title: 'No. of MOLIP',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_25',
        //     title: 'No. of Field visit',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER}]
        // },
        // {
        //     colName: 'field_no_26',
        //     title: 'No. of Prayer conference',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_27',
        //     title: 'No. of Any other programs conducted',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'para_txt_1',
        //     title: 'Program descriptions',
        //     type:'TEXTAREA',
        //     validator: [{ name: 'required' }]
        // },
        // {
        //     colName: 'field_no_28',
        //     title: 'Top List -  Personal',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
        // },
        // {
        //     colName: 'field_no_29',
        //     title: 'Top List - Area Secretaries',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
        // },
        // {
        //     colName: 'para_txt_2',
        //     title: 'Praise Points',
        //     type:'TEXTAREA',
        //     validator: [{ name: 'required' }]
        // },
        // {
        //     colName: 'para_txt_3',
        //     title: 'Prayer points',
        //     type:'TEXTAREA',
        //     validator: [{ name: 'required' }]
        // },
        // {
        //     colName: 'para_txt_4',
        //     title: 'Short report on any other ministry',
        //     type:'TEXTAREA',
        //     validator: [{ name: 'required' }]
        // }
    ]


    export const NEW_GOAL_FORM: formBuilderData[] = [
        {
            colName: 'field_no_1',
            title: 'No of prayer cells',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_2',
            title: 'No of IEM/Mission Sunday',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_3',
            title: 'No of People to share aabout IEM',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_4',
            title: 'No. of New Area Secretary',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_5',
            title: 'No. of New MC/AC',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_6',
            title: 'No. of New Kingdom Builder/Team',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_7',
            title: 'No. of Bible Study Groups',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_8',
            title: 'No. of Happy Evening Youth Members',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_9',
            title: 'No. of New Total Supporters',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_10',
            title: 'No. of New General Mission Supports',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_11',
            title: 'No. of New Missionary Supports',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_12',
            title: 'No. of Hostel/MK Supports',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        }
        , {
            colName: 'field_no_13',
            title: 'No. of New Church Supports',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_14',
            title: 'No. of Others Supports (eg Projects)',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_15',
            title: 'No. of Missionary Candidates',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_16',
            title: 'No. of New Magazine',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_17',
            title: 'Faith Target',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
        },
        // {
        //     colName: 'field_no_1',
        //     title: 'No of prayer cells to be formed',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_2',
        //     title: 'No. of IEM/Mission Sunday/Pulpit',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_3',
        //     title: 'No. of New houses visited',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_4',
        //     title: 'No. of New churches Supports',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_5',
        //     title: 'No. of New General/Mission Fund Supporters',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_6',
        //     title: 'No. of New Missionary Supporters ',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_7',
        //     title: 'No. of New Hostel/MK Supporters',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_8',
        //     title: 'No. of New Area Secretaries',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_9',
        //     title: 'No. of MC/AC Appoinments',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_10',
        //     title: 'No. of Missionary Candidates',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_11',
        //     title: 'No. of Kingdom Builders Team',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_12',
        //     title: 'No. of Vision Building Team',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // }
        // , {
        //     colName: 'field_no_13',
        //     title: 'No. of New Magazines',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_14',
        //     title: 'No. of New Bible Study group',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_15',
        //     title: 'No. of Mission Awareness Programs',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_16',
        //     title: 'No. of Professional Meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_17',
        //     title: 'No. of Area Secretaries meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_18',
        //     title: 'No. of Supporters meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_19',
        //     title: 'No. of Youth meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_20',
        //     title: 'No. of Children meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_21',
        //     title: 'No. of Women meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_22',
        //     title: 'No. of Pastors meet',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_23',
        //     title: 'No. of Fasting prayers',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_24',
        //     title: 'No. of MOLIP',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_25',
        //     title: 'No. of Field visit',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER}]
        // },
        // {
        //     colName: 'field_no_26',
        //     title: 'No. of Prayer conference',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_27',
        //     title: 'No. of Any other programs',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        // },
        // {
        //     colName: 'field_no_28',
        //     title: 'Faith Target - Personal',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
        // },
        // {
        //     colName: 'field_no_29',
        //     title: 'Faith Target - Area Secretaries',
        //     validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
        // },
     
    ]
    export const STATISTICS_CHURCH_REPORT:formBuilder[]=[
       
        {
            colName: 'dName',
            title: 'Department',
        },
         {
            colName: 'name',
            title: 'Name of Staff',
        },
        {
            colName: 'staff_emp_id',
            title: 'Staff EMP ID',
        },
        {
            colName: 'field_no_1',
            title: 'No of prayer cells to be formed',
        },
        {
            colName: 'field_no_2',
            title: 'No. of IEM/Mission Sunday/Pulpit',
        },
        {
            colName: 'field_no_3',
            title: 'No. of New houses visited',
        },
        {
            colName: 'field_no_4',
            title: 'No. of New churches Supports',
        },
        {
            colName: 'field_no_5',
            title: 'No. of New General/Mission Fund Supporters',
        },
        {
            colName: 'field_no_6',
            title: 'No. of New Missionary Supporters ',
        },
        {
            colName: 'field_no_7',
            title: 'No. of New Hostel/MK Supporters',
        },
        {
            colName: 'field_no_8',
            title: 'No. of New Area Secretaries',
        },
        {
            colName: 'field_no_9',
            title: 'No. of MC/AC Appoinments',
        },
        {
            colName: 'field_no_10',
            title: 'No. of Missionary Candidates',
        },
        {
            colName: 'field_no_11',
            title: 'No. of Kingdom Builders Team',
        },
        {
            colName: 'field_no_12',
            title: 'No. of Vision Building Team',
        }
        , {
            colName: 'field_no_13',
            title: 'No. of New Magazines',
        },
        {
            colName: 'field_no_14',
            title: 'No. of New Bible Study group',
        },
        {
            colName: 'field_no_15',
            title: 'No. of Mission Awareness Programs',
        },
        {
            colName: 'field_no_16',
            title: 'No. of Professional Meet',
        },
        {
            colName: 'field_no_17',
            title: 'No. of Area Secretaries meet',
        },
        {
            colName: 'field_no_18',
            title: 'No. of Supporters meet',
        },
        {
            colName: 'field_no_19',
            title: 'No. of Youth meet',
        },
        {
            colName: 'field_no_20',
            title: 'No. of Children meet',
        },
        {
            colName: 'field_no_21',
            title: 'No. of Women meet',
        },
        {
            colName: 'field_no_22',
            title: 'No. of Pastors meet',
        },
        {
            colName: 'field_no_23',
            title: 'No. of Fasting prayers',
        },
        {
            colName: 'field_no_24',
            title: 'No. of MOLIP',
        },
        {
            colName: 'field_no_25',
            title: 'No. of Field visit',
        },
        {
            colName: 'field_no_26',
            title: 'No. of Prayer conference',
        },
        {
            colName: 'field_no_27',
            title: 'No. of Any other programs',
        },
        {
            colName: 'field_no_28',
            title: 'Faith Target - Personal',
        },
        {
            colName: 'field_no_29',
            title: 'Faith Target - Area Secretaries',
        },
    ]

    export const STATISTICS_FIELD_REPORT:formBuilder[]=[
       
        {
            colName: 'dName',
            title: 'Department',
        },
         {
            colName: 'name',
            title: 'Name of Staff',
        },
        {
            colName: 'staff_emp_id',
            title: 'Staff EMP ID',
        },
        {
            colName: 'field_no_1',
            title: 'No. of New Villages',
        },
        {
            colName: 'field_no_2',
            title: 'No. of people with whom Gospel to be shared',
        },
        {
            colName: 'field_no_3',
            title: 'No. of New Contacts',
        },
        {
            colName: 'field_no_4',
            title: 'No. of New Seekers',
        },
        {
            colName: 'field_no_5',
            title: 'No. of New Believers',
        },
        {
            colName: 'field_no_6',
            title: 'No. of Public Confessions',
        },
        {
            colName: 'field_no_7',
            title: 'No. of Emerging WGs',
        },
        {
            colName: 'field_no_8',
            title: 'No. of Worship Groups',
        },
        {
            colName: 'field_no_9',
            title: 'No. of Volunteers',
        },
        {
            colName: 'field_no_10',
            title: 'No. of Good News Workers',
        },
        {
            colName: 'field_no_11',
            title: 'No. of Evangelists',
        },
        {
            colName: 'field_no_12',
            title: 'No. of Pastors',
        }
        , {
            colName: 'field_no_13',
            title: 'No. of People Groups',
        },
        {
            colName: 'field_no_14',
            title: 'No. of Church Constructions',
        },
        {
            colName: 'field_no_15',
            title: 'No. of Leaders / Elders',
        },
        {
            colName: 'field_no_16',
            title: 'No. of Women Leaders',
        },
        {
            colName: 'field_no_17',
            title: 'No. of Bible distribution',
        },
        {
            colName: 'field_no_18',
            title: 'No. of Gospel Portions/Tracts distribution',
        },
        {
            colName: 'field_no_19',
            title: 'No. of Audio Bible distribution',
        },
        {
            colName: 'field_no_20',
            title: 'No. of New Literates',
        },
        {
            colName: 'field_no_21',
            title: 'No. of New Hostels',
        },
        {
            colName: 'field_no_22',
            title: 'No. of New Day Care Centers',
        },
        {
            colName: 'field_no_23',
            title: 'No. of Progrmas / Training Programs',
        }

    ]

    export const NEW_FIELD_GOAL_FORM: formBuilderData[] = [
        {
            colName: 'field_no_1',
            title: 'No. of New Villages',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_2',
            title: 'No. of people with whom Gospel to be shared',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_3',
            title: 'No. of New Contacts',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_4',
            title: 'No. of New Seekers',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_5',
            title: 'No. of New Believers',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_6',
            title: 'No. of Public Confessions',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_7',
            title: 'No. of Emerging WGs',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_8',
            title: 'No. of Worship Groups',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_9',
            title: 'No. of Volunteers',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_10',
            title: 'No. of Good News Workers',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_11',
            title: 'No. of Evangelists',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_12',
            title: 'No. of Pastors',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        }
        , {
            colName: 'field_no_13',
            title: 'No. of People Groups',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_14',
            title: 'No. of Church Constructions',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_15',
            title: 'No. of Leaders / Elders',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_16',
            title: 'No. of Women Leaders',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_17',
            title: 'No. of Bible distribution',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_18',
            title: 'No. of Gospel Portions/Tracts distribution',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_19',
            title: 'No. of Audio Bible distribution',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_20',
            title: 'No. of New Literates',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_21',
            title: 'No. of New Hostels',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_22',
            title: 'No. of New Day Care Centers',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_23',
            title: 'No. of Progrmas / Training Programs',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
        },
        {
            colName: 'field_no_24',
            title: 'Faith Target - Field offering (in Rs)',
            validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
        },
        {
            colName: 'para_txt_1',
            title: 'Any other',
            type:'TEXTAREA',
            validator: [{ name: 'required' }]
        },

    ]


    export const NEW_FIELD_PROGRESS_FORM: formBuilderData[] = [
    {   
        // groupTitle: 'Feild Ministry',
        colName: 'field_no_1',
        title: 'No of New Villages',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_2',
        title: 'No of people with whom Gospel to be shared',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_3',
        title: 'No of New Contacts',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_4',
        title: 'No of New Seekers',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_5',
        title: 'No of New Believers',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_6',
        title: 'No of Public Confessions',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_7',
        title: 'No of Emerging WGs',
        placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_8',
        title: 'No of Worship Groups',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_9',
        title: 'No of Volunteers',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_10',
        title: 'No of Good News Workers',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_11',
        title: 'No of Evangelists',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_12',
        title: 'No of Pastors',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    }
    , {
        colName: 'field_no_13',
        title: 'No of People Groups',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_14',
        title: 'No of Church Constructions',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_15',
        title: 'No of Leaders / Elders',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_16',
        title: 'No of Women Leaders',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_17',
        title: 'No of Bible distribution',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_18',
        title: 'No of Gospel Portions/Tracts distribution',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_19',
        title: 'No of Audio Bible distribution',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_20',
        title: 'No of New Literates',
        placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_21',
        title: 'No of New Hostels',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_22',
        title: 'No of New Day Care Centers',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_23',
        title: 'No of Progrmas / Training Programs',
        // placeholder: '0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'para_txt_1',
        title: 'Description of Community Development',
        type:'TEXTAREA',
        validator: [{ name: 'required', }]
    },
    {
        colName: 'para_txt_2',
        title: 'Description of each Program/Training',
        type:'TEXTAREA',
        validator: [{ name: 'required' }]
    },
    {
        colName: 'field_no_24',
        title: 'Field/Mission Station offering (in Rs)',
        // placeholder:'₹0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_25',
        title: 'Spent (in Rs)',
        // placeholder:'₹0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'field_no_26',
        title: 'Balance (in Rs)',
        // placeholder:'₹0',
        validator: [{ name: 'required', },{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
        colName: 'para_txt_3',
        title: 'Praise Points',
        type: 'TEXTAREA',
        validator: [{ name: 'required' }]
    },
    {
        colName: 'para_txt_4',
        title: 'Prayer points',
        type: 'TEXTAREA',
        validator: [{ name: 'required' }]
    },
]
    
