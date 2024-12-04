import { FormBuilder } from "@angular/forms";
import { constDropdownData } from "src/app/core/helper/core.data.interface";
import { AppConstant, STATUS_CHILD, VALIDATOR_PATTERNS } from "src/app/helper/class/app-constant";
import { formBuilder, formBuilderData, formDynamicValidator, tableColum } from "src/app/helper/interface/response";

export const CHILD_LIST_TBL: tableColum[] = [
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
        colName: 'child_id',
        title: 'Child ID',
        sort: false,
        isPrimary: true,
        filter: true,
        colType: 'VIEW_INFO'
    },
    {
        colName: 'child_no',
        title: 'Reg No',
        sort: true,
        filter: true,
    },
    {
        colName: 'parent',
        title: 'Parent',
        sort: true,
        filter: true,
    },
    {
        colName: 'child_type',
        title: 'Type',
        sort: true,
        colType: 'DROPDOWN',
        filterCol: {
            data: [{ child_typeName: 'MK', id: 1 }, { child_typeName: 'Home', id: 2 }],
            selectPrimaryKey: 'id',
            selectKeyName: 'child_typeName',
            type: 'DROPDOWN',
        },
        filter: true,
        visible: false
    },
    {
        colName: 'homeName',
        title: 'Home/Project',
        sort: true,
        filter: true,
    },
    {
        colName: 'gender',
        title: 'Gender',
        sort: true,
        filter: true,
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: AppConstant.GENDER,
            selectKeyName: 'genderName',
            selectPrimaryKey: 'id'
        }
    },
    {
        colName: 'total_active_alloted',
        title: 'Alloted',
        sort: true,
        filter: true,
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

export const CHILD_OTHERS_FORM: formBuilder[] = [
    {
        colName: 'blood_group_id',
        title: 'Blood Group ',
        selectKeyName: 'blood_groupName',
        type: 'select',
        apiTblName: 'blood_group'
    },
    {
        colName: 'brief_history',
        title: 'Brief History',
        type: 'TEXTAREA',
        col_size: 12
    },
    {
        colName: 'hobbies',
        title: 'Hobbies',
        col_size: 4
    },
    {
        colName: 'skill_set',
        title: 'Skill Set',
        col_size: 4
    },
    {
        colName: 'comments',
        title: 'Comment',
        col_size: 4
    },
    {
        colName: 'id',
        title: 'Id',
        col_size: 3,
        hidden: true
    },
    {
        groupTitle: 'Support Document',
        colName: 'aadhar_document',
        title: 'Aadhar Doc',
        type: 'FILE',
        col_size: 3
    },
    {
        colName: 'birth_document',
        title: 'Birth Certificate',
        type: 'FILE',
        col_size: 3
    },
    {
        colName: 'family_img',
        title: 'Family Image',
        type: 'FILE',
        col_size: 3
    },
    {
        colName: 'others_document',
        title: 'Others Doc',
        type: 'FILE',
        col_size: 3
    },
];

export const CHILD_PHY_FORM: formBuilder[] = [
    {
        colName: 'record_date',
        title: 'Record On',
        type: 'DATE',
        defaultValue: new Date()
    },
    {
        colName: 'height',
        title: 'Height',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: '' }, { name: 'required' }],
        icon_append: { text: 'CM', category: 'APPEND' },
        info: 'Height measurement in CM'
    },
    {
        colName: 'weight',
        title: 'Weight',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT, error: '' }, { name: 'required' }],
        icon_append: { text: 'KG', category: 'APPEND' },
        info: 'Weight measurement in KG',
    },
    {
        colName: 'sickness',
        title: 'Sickness',
    },
    {
        colName: 'health_cond',
        title: 'Health Condition',
        // info: 'Weak / Healthy / Malnourished'
        type: 'select',
        selectPrimaryKey: 'id',
        selectKeyName: 'name',
        data: [{ name: 'Weak', id: 1 }, { name: 'Healthy', id: 2 }, { name: 'Malnourished', id: 3 }]
    },
];

export const CHILD_SIBLING_FORM: formBuilderData[] = [{
    colName: 'name',
    title: 'Name',
    col_size: 4,
    validator: [{ name: 'required' }]
},
{
    colName: 'id',
    visible: false,
    hidden: true,
    title: '',
    isPrimary: true
},
{
    colName: 'gender',
    title: 'Gender',
    apiTblName: 'gender',
    selectKeyName: 'genderName',
    type: 'select',
    col_size: 4,
},
{
    colName: 'dob',
    title: 'Date of Birth',
    type: 'DATE',
    colType: 'DATE',
    monthNavigator: true,
    yearNavigator: true,
    dateFormat: 'dd/mm/yy',
    col_size: 4,
    dateRange: AppConstant.DEFAULT_DATE_RANGE,
},
{
    colName: 'email_id',
    title: 'Email ID',
    col_size: 4,
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL }]
},
{
    colName: 'mobile_no',
    title: 'Mobile No',
    col_size: 4,
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE }]
},
{
    colName: 'whatsApp_no',
    title: 'WhatsApp No',
    col_size: 4,
    visible: false,
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE }]
},
{
    colName: 'marital_status_id',
    title: 'Marital Status',
    selectKeyName: 'marital_statusName',
    apiTblName: 'marital_status',
    type: 'select',
    visible: false,
    defaultValue: '1',
    selectPrimaryKey: 'id',
    validator: [{ name: 'required' }],
    col_size: 4,
    event: { name: 'change', isCallback: true }
},
{
    colName: 'spouse_name',
    title: 'Spouse Name',
    visible: false,
    col_size: 4,
},
{
    colName: 'position_in_family',
    title: 'Position in family',
    col_size: 4,
    validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.WHOLE_NUMBER }, { name: 'min', funValue: 1 }, { name: 'max', funValue: 12 }]
},
{
    colName: 'status',
    title: 'Current Status',
    apiTblName: 'child_status',
    type: 'select',
    selectKeyName: 'child_statusName',
    event: { name: 'change', isCallback: true },
    validator: [{ name: 'required' }],
    col_size: 4,
},
{
    colName: 'monthly_income',
    title: 'Income in monthly',
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }],
    visible: false,
    info: 'Monthly Income in Rupees',
    col_size: 4,
},
{
    colName: 'died_on',
    title: 'Died On',
    type: 'DATE',
    colType: 'DATE',
    dateFormat: 'dd/mm/yy',
    visible: false,
    dateRange: AppConstant.DEFAULT_FUTURE_DATE_RANGE,
    col_size: 4,
},
{
    colName: 'stayed_category_id',
    title: 'Stayed In',
    // info: `with Parents/Others Hostel with name/${this.shortOrg} Homes`,
    apiTblName: 'stayed_category',
    selectKeyName: 'stayed_categoryName',
    selectPrimaryKey: 'id',
    visible: false,
    col_size: 4,
    type: 'select',
    event: { name: 'change', isCallback: true }
},
{
    colName: "remarks",
    title: 'Remarks',
    visible: false,
    col_size: 4,
}
];
export const CHILD_PARENT_TYPE: constDropdownData[] = [
    { id: 1, parent_typeName: 'Father' },
    { id: 2, parent_typeName: 'Mother' },
    { id: 3, parent_typeName: 'Guardian' },
]
export const CHILD_PARENT_FORM: formBuilderData[] = [
    {
        colName: 'name',
        title: 'Name',
        validator: [{ name: 'required' }],
        event: { name: 'change', isCallback: true }
    },
    {
        colName: 'id',
        visible: false,
        hidden: true,
        title: '',
        isPrimary: true
    },
    {
        colName: 'parent_type',
        title: 'Parent Type',
        hidden: true,
        data: CHILD_PARENT_TYPE,
        selectKeyName: 'parent_typeName',
        type: 'select',
        selectPrimaryKey: 'id',
        validator: [{ name: 'required' }]
    },
    {
        colName: 'gender',
        title: 'Gender',
        apiTblName: 'gender',
        selectKeyName: 'genderName',
        type: 'select',
        validator: [{ name: 'required' }],
        defaultValue: 1,
        event: { name: 'change', isCallback: true }
    },
    {
        colName: 'occupation',
        title: 'Occupation',
        event: { name: 'change', isCallback: true }
    },
    {
        colName: 'email_id',
        title: 'Email ID',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.EMAIL }],
        event: { name: 'change', isCallback: true }
    },
    {
        colName: 'mobile_no',
        title: 'Mobile No',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE }],
        event: { name: 'change', isCallback: true }
    },
    {
        colName: 'aadhar',
        title: 'aadhar Number',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.AADHAR_VALIDATOR }, { name: 'required' }],
        event: { name: 'change', isCallback: true },
        visible: false
    },
    {
        colName: 'whatsApp_no',
        title: 'WhatsApp No',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE }],
        event: { name: 'change', isCallback: true },
        visible: false
    },
    {
        colName: 'alive_status',
        title: 'Current Status',
        // data: ALIVE_STATUS,
        type: 'select',
        apiTblName: 'alive_status',
        selectKeyName: 'alive_statusName',
        validator: [{ name: 'required' }],
        visible: false,
        event: { name: 'change', isCallback: true }
    },
    {
        colName: 'died_on',
        title: 'Died On',
        type: 'DATE',
        colType: 'DATE',
        dateFormat: 'dd/mm/yy',
        dateRange: AppConstant.DEFAULT_FUTURE_DATE_RANGE,
        event: { name: 'change', isCallback: true },
        visible: false
    },
    {
        colName: 'reason_death',
        title: 'Reason Died',
        event: { name: 'change', isCallback: true },
        visible: false
    },
    {
        colName: "remarks",
        title: 'Remarks',
        visible: false,
        event: { name: 'change', isCallback: true }
    }
]
export const CHILD_BASIC_FORM: formBuilder[] = [{
    colName: 'child_no',
    title: 'Child No / Mk No',
    validator: [{ name: 'required', error: 'Child No is Required' }],
    col_size: 6
},
{
    colName: 'child_id',
    title: 'Child ID',
    hidden: true
},
{
    colName: 'enrolled_date',
    title: 'Date of Enrollment ',
    placeholder: 'Date of Enrollment ',
    type: 'DATE',
    // validator: [{ name: 'required', error: 'Enrolled Date is Required' }],
    col_size: 6,
    dateRange: AppConstant.DEFAULT_DATE_RANGE,
    yearNavigator: true,
    monthNavigator: true
},
{
    colName: 'name',
    title: 'Name',
    validator: [{ name: 'required', error: 'Child Name is Required' },
    { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Name should be valid' }],
    col_size: 6
},
{
    colName: 'gender',
    title: 'Gender',
    type: 'select',
    data: AppConstant.GENDER,
    selectKeyName: 'genderName',
    selectPrimaryKey: 'id',
    validator: [{ name: 'required', error: 'Gender is Required' }],
    col_size: 3
},
{
    colName: 'dob',
    title: 'Date of Birth',
    placeholder: 'Date of Birth',
    type: 'DATE',
    validator: [{ name: 'required', error: 'Date of Birth is Required' }],
    col_size: 3,
    dateRange: AppConstant.DEFAULT_DATE_RANGE,
    yearNavigator: true,
    monthNavigator: true
},
{
    colName: 'stayed_category_id',
    title: 'Present Stayed',
    validator: [{ name: 'required', error: 'Stayed on is requird' }],
    apiTblName: 'stayed_category',
    selectKeyName: 'stayed_categoryName',
    selectPrimaryKey: 'id',
    col_size: 3,
    type: 'select',
    event: { name: 'change', isCallback: true }
},
{
    colName: 'home',
    title: 'Home/Projects',
    validator: [{ name: 'required', error: 'Home/ Projects is required' }],
    type: 'select',
    apiTblName: 'home',
    selectKeyName: 'homeName',
    selectPrimaryKey: 'id',
    defaultValue: '',
    col_size: 3
},
{
    colName: 'religion',
    title: 'Religion',
    validator: [{ name: 'required', error: 'Religion is required' }],
    type: 'select',
    apiTblName: 'religion',
    selectKeyName: 'religionName',
    selectPrimaryKey: 'id',
    defaultValue: '',
    col_size: 3
},
{
    colName: 'community',
    title: 'Community',
    validator: [{ name: 'required', error: 'Community is requird' }],
    type: 'select',
    apiTblName: 'community',
    selectKeyName: 'communityName',
    selectPrimaryKey: 'id',
    defaultValue: '',
    col_size: 3
},
{
    colName: 'email_id',
    title: 'Email ID',
    validator: [{ name: 'required', funValue: VALIDATOR_PATTERNS.EMAIL, error: 'Email Id should be valid' }],
    col_size: 3
},
{
    colName: 'mobile_no',
    title: 'Phone Number',
    validator: [
        { name: 'required', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Mobile No is Requied' },
        { name: 'maxLength', funValue: '10', error: 'Mobile No should be valid' },
        { name: 'minLength', funValue: '10', error: 'Mobile No should be valid' }
    ],
    col_size: 3
},
{
    colName: 'whatsApp_no',
    title: 'WhatsApp Number',
    // validator: [{ name: 'required', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Phone should be valid' }],
    col_size: 3
},
{
    colName: 'position_in_family',
    title: 'Position in family',
    col_size: 3,
    validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.WHOLE_NUMBER }, { name: 'min', funValue: 1 }, { name: 'max', funValue: 12 }]
},
{
    colName: 'marital_status_id',
    title: 'Marital Status',
    selectKeyName: 'marital_statusName',
    apiTblName: 'marital_status',
    type: 'select',
    selectPrimaryKey: 'id',
    validator: [{ name: 'required' }],
    col_size: 3,
    defaultValue: 1,
    event: { name: 'change', isCallback: true }
},
{
    colName: 'spouse_name',
    title: 'Spouse Name',
    col_size: 3
},
{
    colName: 'status',
    title: 'Present Status',
    validator: [{ name: 'required', error: 'Status on is requird' }],
    type: 'select',
    apiTblName: 'child_status',
    selectKeyName: 'child_StatusName',
    selectPrimaryKey: 'id',
    // defaultValue: '',
    col_size: 3
},
{
    colName: 'profile_img',
    title: 'Profile Image',
    type: 'FILE',
    validator: [],
    col_size: 3
},
]

export const CHILD_DYNAMIC_VALIDATOR: formDynamicValidator[] = [
    {
        controlName: 'stayed_category_id',
        validatorControl: ['home'],
        hideControl: ['home'],
        value: '1',
    },
    {
        controlName: 'marital_status_id',
        validatorControl: ['spouse_name'],
        hideControl: ['spouse_name'],
        value: '1',
        operation: '>'
    },
];

export const CHILD_GIFT_FORM: formBuilder[] = [{
    colName: 'description',
    title: 'Description',
    type: 'TEXTAREA',
    validator: [{ name: 'required', error: 'Description is Required' }],
    col_size: 6
},
{
    colName: 'qty',
    title: 'Total Items',
    validator: [{ name: 'required', error: 'Total Items is Required' },
    { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Total should be valid' }],
    col_size: 6,
    event: { name: 'change', isCallback: true }
},
{
    colName: 'received_date',
    title: 'Date of Received',
    placeholder: 'Date of Received',
    type: 'DATE',
    validator: [{ name: 'required', error: 'Date of Received is Required' }],
    col_size: 3,
    dateRange: AppConstant.DEFAULT_DATE_RANGE,
    yearNavigator: true,
    monthNavigator: true
},
{
    colName: 'delivery_date',
    title: 'Date of Distribution',
    placeholder: 'Date of Delivery',
    type: 'DATE',
    validator: [{ name: 'required', error: 'Date of Delivery is Required' }],
    col_size: 3,
    dateRange: AppConstant.DEFAULT_DATE_RANGE,
    yearNavigator: true,
    monthNavigator: true
},
{
    colName: 'distribution_detail',
    title: 'Distribution Detail',
    validator: [],
    col_size: 6
},
{
    colName: 'remarks',
    title: 'Remarks',
    validator: [],
    col_size: 6
},
{
    colName: 'image',
    title: 'Image File',
    placeholder: 'Gifts Attachement',
    type: 'FILE',
    validator: [],
    col_size: 6,
},
{
    colName: 'send_email',
    title: 'send Email',
    type: 'checkbox',
    defaultValue: 1,
    selectKeyName: 'name', selectPrimaryKey: 'id',
    event: { isCallback: true, name: 'change' },
    data: [{ name: 'Yes', id: 1 }],
    validator: [],
    col_size: 6,
},
{
    colName: 'sponsorship_module',
    title: '',
    defaultValue: 2,
    validator: [],
    hidden: true
},
{
    colName: 'sponsor_fk_id',
    title: '',
    validator: [{ name: 'required' }],
    hidden: true
},
{
    colName: 'id',
    title: '',
    validator: [],
    hidden: true
}];