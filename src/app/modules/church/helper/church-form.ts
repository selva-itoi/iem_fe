import { AppConstant, VALIDATOR_PATTERNS } from "src/app/helper/class/app-constant";
import { formBuilder, formBuilderData, formDynamicValidator, tableColum } from "src/app/helper/interface/response";
export const CHURCH_SEGMENT = {
    BASIC: 'Basic',
    BUILDING: 'Building',
    SPONSORSHIP: 'Sponsorship',
    DEMOGRAPHIC: 'Demographic',
    COUNCIL: 'Council',
    SUMMARY: 'Summary',
    OTHERS: 'Others',
}
export const CHURCH_LOCATION_TYPE: any[] = [{ name: 'Rural', id: 1 }, { name: 'Semi-urban', id: 2 }, { name: 'Urban', id: 3 }];
export const churchMem_STATUS: any[] = [
    { key: 1, label: 'Active', color: 'Success' },
    { key: 2, label: 'Relived', color: 'info' },
    { key: 0, label: 'Died', color: 'danger' }
]

export const CHURCH_LIST_TBL: tableColum[] = [
    {
        colName: 'church_name',
        title: 'Name',
        sort: true,
        filter: true,
    },
    {
        colName: 'church_id',
        title: 'Church ID',
        sort: false,
        isPrimary: true,
        filter: true,
        colType: 'VIEW_INFO'
    },
    {
        colName: 'zone',
        title: 'Zone/State',
        selectKeyName: 'zoneName',
        filterCol: { apiName: 'zone', type: 'DROPDOWN', selectKeyName: 'zoneName', selectPrimaryKey: 'id' },
        sort: true,
        filter: true,
    },
    {
        colName: 'field',
        title: 'Field',
        colType: 'DROPDOWN',
        filterCol: { apiName: 'field', type: 'DROPDOWN', selectKeyName: 'fieldName', selectPrimaryKey: 'id' },
        sort: true,
        filter: true,
    },
    {
        colName: 'church_typeName',
        title: 'Type',
        sort: true,
        filter: true,
    },
    {
        colName: 'staff_emp_id',
        title: 'Staff ID',
        sort: false,
        filter: true,
        colType: 'STAFF_EMP_ID'
    },
    {
        colName: 'is_donation_allow',
        title: 'DAD',
        sort: true,
        filter: true,
        filterCol: {
            type: 'DROPDOWN',
            data: [{ name: 'Yes', id: '1' }, { name: 'No', id: '0' }],
            selectKeyName: 'name',
            selectPrimaryKey: 'id',
        },
    },
    {
        colName: 'church_progressName',
        title: 'Progress',
        sort: true,
        filter: true,
    },
    {
        colName: 'status',
        title: 'status',
        sort: true,
        filter: true,
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: [
                { label: 'Active', key: 1, color: 'success' },
                { label: 'Pending', key: 2, color: 'warning' },
            ]
        }
    },

    {
        colName: 'updated_at',
        title: 'Last Update',

        sort: false,
        filter: true,
        colType: 'DATE'
    },
];
export const churchDynamicValidator: formDynamicValidator[] = [{
    controlName: 'meeting_place',
    validatorControl: ['meeting_place_remarks'],
    hideControl: ['meeting_place_remarks'],
    value: 2
},
{
    controlName: 'is_water',
    validatorControl: ['water_remarks'],
    hideControl: ['water_remarks'],
    value: 1,
    validator: []
},
{
    controlName: 'is_toilet',
    validatorControl: ['toilet_remarks'],
    hideControl: ['toilet_remarks'],
    value: 1,
    validator: []
},
{
    controlName: 'is_fencing',
    validatorControl: ['fencing_remarks'],
    hideControl: ['fencing_remarks'],
    value: 1,
    validator: []
},
{
    controlName: 'is_eb',
    validatorControl: ['eb_remarks'],
    hideControl: ['eb_remarks'],
    value: 1,
    validator: []
},
{
    controlName: 'is_parsonage',
    validatorControl: ['parsonage_build_area'],
    hideControl: ['parsonage_build_area'],
    value: 1
},
{
    controlName: 'is_donation_allow',
    validatorControl: ['goal_amount'],
    hideControl: ['goal_amount'],
    value: 1
}
];

export const churchBasicForm: formBuilderData[] = [
    {
        colName: 'region_id',
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
        title: 'Zone/State Name',
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
        event: { isCallback: true, name: 'change' },
        validator: [{ name: 'required', error: 'Field Name should not be blank' }]
    },
    {
        colName: 'church_name',
        title: 'Church Name',
        validator: [{ name: 'required', error: 'Church Name not be blank' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Church Name should be valid' }]
    },
    {
        colName: 'church_id',
        title: 'Church ID',
        hidden: true,
        visible: true

    },
    {
        colName: 'church_type',
        title: 'Church Type',
        defaultValue: '',
        type: 'select',
        apiTblName: 'church_type',
        selectKeyName: 'church_typeName', selectPrimaryKey: 'id',
        validator: [{ name: 'required', error: 'Church Type not be blank' }]
    },
    {
        colName: 'location_type',
        title: 'Location Type',
        defaultValue: '',
        type: 'select',
        data: CHURCH_LOCATION_TYPE,
        selectKeyName: 'name', selectPrimaryKey: 'id',
        validator: [{ name: 'required', error: 'Location Type not be blank' }]
    },
    {
        colName: 'near_gems_church',
        title: `Near ${AppConstant.ORG_NAME} Field`,

    },
    {
        colName: 'near_church',
        title: 'Near Others Church',
        defaultValue: '',
        info: 'Nearest other denomination church (Evangelical)'
    },
    {
        colName: 'near_christian_project',
        title: 'Near Others Christian Project',
        defaultValue: '',
        info: 'Any Christian Projects (hospital, school, college or any other) near to this field',

    },
    {
        colName: 'established',
        title: 'Esd Date',
        type: 'DATE',
        yearNavigator: true,
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
        monthNavigator: true,

    },
    {
        colName: 'dedication_date',
        title: 'Dedication Date',
        type: 'DATE',
        yearNavigator: true,
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
        monthNavigator: true,
    },
    {
        colName: 'is_base_church',
        title: 'Base Church',
        defaultValue: '',
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }]
    },
    {
        colName: 'is_donation_allow',
        title: 'Does allow Donation ?',
        defaultValue: '',
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }]
    },
    {
        colName: 'goal_amount',
        title: 'Goal Amount',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
    }
];

export const churchBuildingForm: formBuilder[] = [
    {
        colName: 'meeting_place',
        title: 'Meeting Place',
        defaultValue: '',
        validator: [{ name: 'required', error: 'Meeting Place should not be empty' }],
        type: 'select',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Rented', id: 1 }, { name: 'Owned', id: 2 }, { name: `${AppConstant.ORG_NAME} Project`, id: 3 }, { name: `${AppConstant.ORG_NAME} School`, id: 4 }, { name: 'Home', id: 5 }, { name: 'Believers House', id: 6 }, { name: 'Leased', id: 7 }, { name: 'Others', id: 8 }],
    },
    {
        colName: 'meeting_place_remarks',
        title: 'Remarks',
        defaultValue: '',
    },
    {
        colName: 'building_type',
        title: 'Building Type',
        defaultValue: '',
        validator: [{ name: 'required', error: 'Building Type should not be empty' }],
        type: 'select',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Concrete', id: 1 }, { name: 'Tin Sheet', id: 2 }, { name: 'Asbestos', id: 3 }, { name: 'Other', id: 4 }],
    },
    {
        colName: 'build_area_width',
        title: 'Build Width',
        defaultValue: 0,
        col_size: 3,
        icon_append: { text: 'Ft', category: 'APPEND' }
    },
    {
        colName: 'build_area_length',
        title: 'Build Length',
        defaultValue: 0,
        col_size: 3,
        icon_append: { text: 'Ft', category: 'APPEND' }
    },
    {
        colName: 'build_area',
        title: 'Build Total Area',
        defaultValue: 0,
        type: 'INFO',
        col_size: 6,
        controlAction: { controls: ['build_area_width', 'build_area_length'], operation: 'MULTIPLE', info_text: 'Sq.ft' },
        icon_append: { text: 'Sq.Ft', category: 'APPEND' }
    },
    {
        colName: 'land_area_width',
        title: 'Land Width',
        defaultValue: 0,
        col_size: 3,
        icon_append: { text: 'Ft', category: 'APPEND' }
    },
    {
        colName: 'land_area_length',
        title: 'Land Length',
        defaultValue: 0,
        col_size: 3,
        icon_append: { text: 'Ft', category: 'APPEND' }
    },
    {
        colName: 'land_area',
        title: 'Land Total Area',
        defaultValue: 0,
        type: 'INFO',
        col_size: 6,
        controlAction: { controls: ['land_area_width', 'land_area_length'], operation: 'MULTIPLE', info_text: 'Sq.ft' },
        icon_append: { text: 'Sq.Ft', category: 'APPEND' }
    },
    {
        colName: 'land_doc_detail_type',
        title: 'Land Doc Detail',
        defaultValue: '',
        type: 'select',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Registered', id: 1 }, { name: 'Lease', id: 2 }, { name: 'Rent', id: 3 }, { name: 'Agreement', id: 4 }],

    },
    {
        colName: 'is_parsonage',
        title: 'Parsonage Built',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],

    },
    {
        colName: 'parsonage_build_area',
        title: 'Total Parsonage Built Area',
        icon_append: { text: 'Sq.Ft', category: 'APPEND' }
    },
    {
        colName: 'is_eb',
        title: 'EB Connection',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],
    },
    {
        colName: 'eb_remarks',
        title: 'Remarks',
        defaultValue: '',
    },
    {
        colName: 'is_fencing',
        title: 'Fencing',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],
    },
    {
        colName: 'fencing_remarks',
        title: 'Fencing Remarks',
        defaultValue: '',
    },
    {
        colName: 'is_toilet',
        title: 'Toilet',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],
    },
    {
        colName: 'toilet_remarks',
        title: 'Toilet Remarks',
        defaultValue: '',
    },
    {
        colName: 'is_water',
        title: 'Water Connection',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ name: 'Yes', id: 1 }],
    },
    {
        colName: 'water_remarks',
        title: 'Water Connection Remarks',
        defaultValue: '',
    },
    {
        colName: 'last_white_wash',
        title: 'Last White Wash',
        type: 'DATE',
        yearNavigator: true,
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
        monthNavigator: true,
    },
]
export const churchDemoGraphic: formBuilder[] = [
    {
        colName: 'population',
        title: 'Population',
        defaultValue: '',

    },
    {
        colName: 'no_of_house_hold',
        title: 'No Of Households',
        defaultValue: '',

    },
    {
        colName: 'language_spoken',
        title: 'Language Spoken',
        defaultValue: '',

    },
    {
        colName: 'general_occupation',
        title: 'General Occupation',
        defaultValue: '',

    },

    {
        colName: 'economic_condition',
        title: 'General Economic Condition',
        defaultValue: '',

    },
    {
        colName: 'literacy_rate',
        title: 'Literacy Rate',
        defaultValue: '',
        icon_append: { category: 'APPEND', text: '%' }

    },
    {
        colName: 'major_people_group',
        title: 'Major people group ',
        defaultValue: '',

    },
    {
        colName: 'major_religion',
        title: 'Major Religions',
        defaultValue: '',

    },
    {
        colName: 'common_sickness',
        title: 'Commonly Occurring sickness',
        defaultValue: '',
        groupTitle: 'Heath Info'
    },
    {
        colName: 'chronic_illness',
        title: 'Chronic Illness',
        defaultValue: '',

    },
    {
        colName: 'physical_disabilities',
        title: 'Physical Disabilities/Deformities',
        title_case: 'NONE',
        defaultValue: '',

    },
    {
        colName: 'responsive_people_group',
        title: 'People Groups',
        defaultValue: '',
        groupTitle: 'Responsive Groups'
    },
    {
        colName: 'responsive_literacy_rate',
        title: 'Literates/ Illiterates',
        defaultValue: '',

    },
    {
        colName: 'responsive_economic_condition',
        title: 'Economic Condition',
        defaultValue: '',

    },
    {
        colName: 'responsive_economic_class',
        title: 'Economic Classes',
        type: 'select', selectKeyName: 'name', selectPrimaryKey: 'id',
        data: [{ name: 'Upper', id: 1 }, { name: 'Middle', id: 2 }, { name: 'Lower', id: 3 }]
    },

]

export const churchCommitteeMember: formBuilderData[] = [
    {
        colName: 'name',
        title: 'Name',
        visible: true,
        hidden: true
    },
    {
        colName: 'designation_id',
        title: 'Designation',
        type: 'select',
        defaultValue: '',
        selectKeyName: 'church_designationName', selectPrimaryKey: 'id',
        apiTblName: 'church_designation',
        validator: [{ name: 'required', error: 'Designation is required' }]
    },
    {
        colName: 'member_fk_id',
        title: 'member',
        event: { isCallback: true, name: 'change' },
        visible: false,
        hidden: true
    },
    {
        colName: 'staff_fk_id',
        title: 'staff em',
        event: { isCallback: true, name: 'change' },
        visible: false,
        hidden: true
    },
    {
        colName: 'id',
        title: '',
        hidden: true,
        visible: false
    },
    {
        colName: 'staff_emp_id',
        title: 'Staff Emp Id',
        hidden: true,
    },
    {
        colName: 'member_id',
        title: 'Member ID',
        hidden: true
    },
    {
        colName: 'from_date',
        type: 'DATE',
        title: 'From Date',
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
        monthNavigator: true,
        yearNavigator: true,
    },
    {
        colName: 'to_date',
        type: 'DATE',
        title: 'To Date',
        monthNavigator: true,
        yearNavigator: true,
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
    },
    {
        colName: 'remarks',
        title: 'Remarks',
    }
];

export const churchCongregationForm: formBuilder[] = [
    {
        colName: 'id',
        title: '',
        hidden: true
    },
    {
        colName: 'new_baptism',
        title: 'No of New Baptism',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'new_seekers',
        title: 'No of New  Seekers',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'new_believers',
        title: 'No of New  Believers',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'total_offering_sunday',
        title: 'Total Offering Sunday',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT, error: 'Number Only Allowed' }]
    },
    {
        colName: 'total_tithe',
        title: 'Total Tithe',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT, error: 'Number Only Allowed' }]
    },

    {
        colName: 'total_gift',
        title: 'Total Gifts',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT, error: 'Number Only Allowed' }],
        info: 'Total value of Gifts in Rupees'
    },
    {
        colName: 'believers_left_faith',
        title: 'No of Believers left Faith',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'believers_transferred',
        title: 'No of Believers Transfer / Migrate',
        info: 'No of Believers Transfer / Migrate to other church',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'total_other_offering',
        title: 'Total Others Offering',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT, error: 'Number Only Allowed' }]
    },

    {
        colName: 'new_full_time_worker',
        title: 'No. of new Full time Workers Produced',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }],
        groupTitle: 'Workers Details'
    },

    {
        colName: 'new_village_volunteer',
        title: 'No. of new Village Volunteer Pastor',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }],
        info: 'Total value of Gifts in Rupees'
    },
    {
        colName: 'new_bible_men',
        title: 'No. of new Bible Men',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'new_bible_women',
        title: 'No. of new Bible Women',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
]

export const churchProgramForm: formBuilder[] = [
    {
        colName: 'id',
        title: '',
        hidden: true
    },
    {
        colName: 'med_awareness',
        title: 'No. of Awareness Programs',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }],
        groupTitle: 'Health'
    },
    {
        colName: 'med_camp',
        title: 'Total Medical Camp',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'med_others',
        title: 'No. of other programs',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'med_others_remarks',
        title: 'No. of other Remarks',

    },
    {
        colName: 'youth_storm',
        title: 'No. of STORM Programs',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }],
        groupTitle: 'Youth'
    },
    {
        colName: 'youth_gym',
        title: 'No. of GYM Programs',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'youth_others_remarks',
        title: 'Remarks',

    },
    {
        colName: 'child_vbs',
        title: 'No. of VBS Programs',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }],
        groupTitle: 'Children'
    },
    {
        colName: 'child_jet',
        title: 'No. of JET (Children Club)  Programs',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'child_others',
        title: 'No. of other Children Programs',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'child_others_remarks',
        title: 'Remarks',

    },

    {
        colName: 'out_village_gospel',
        title: 'No. of Village Gospel Programs',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }],
        groupTitle: 'Out Reach'
    },
    {
        colName: 'out_mini_gospel',
        title: 'No. of Mini Crusades ( Gospel Programs)',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'out_major_gospel',
        title: 'No. of Major Crusades ( Gospel Programs)',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'out_film_show',
        title: 'No. of Film Shows',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'out_others',
        title: 'No. of other Outreach Programs',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'out_others_remarks',
        title: 'Remarks',

    },

    {
        colName: 'dis_reap',
        title: 'No. of REAP programs ',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }],
        groupTitle: 'Believers'
    },
    {
        colName: 'dis_wet',
        title: "No. of Women's Program (WET etc.)",
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'dis_family',
        title: 'No. of Family Program ',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'dis_convention',
        title: 'No. of Convention',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'dis_fasting',
        title: 'No. of Fasting Prayer/Rally',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'dis_tina',
        title: 'No. of Leadership Program ',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }],
        info: '(For Elders, VVP, and BM)'
    },
    {
        colName: 'dis_others',
        title: 'No. of other Programs for Believers ',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'dis_others_remarks',
        title: 'Remarks',

    },
]

export const churchMemberForm: formBuilderData[] = [
    {
        colName: 'fieldName',
        title: 'Field Name',
        hidden: true,
        visible: true
    },
    {
        colName: 'region',
        title: 'Region Name',
        type: 'select',
        apiTblName: 'region',
        selectKeyName: 'regionName',
        selectPrimaryKey: 'id',
        event: {
            name: 'change',
            apiTblName: 'zone',
            valueAssign: 'zone'
        },
        validator: [{ name: 'required' }]
    },
    {
        colName: 'zone',
        title: 'Zone/State',
        type: 'select',
        selectPrimaryKey: 'id',
        selectKeyName: 'zoneName',
        apiTblName: 'zone',
        event: {
            name: 'change',
            apiTblName: 'church',
            valueAssign: 'church_fk_id'
        },
        validator: [{ name: 'required' }]
    },
    {
        colName: 'church_id',
        title: 'Church ID',
        hidden: true,
        visible: true,
    },
    {
        colName: 'church_name',
        title: 'Church Name',
        hidden: true
    },
    {
        colName: 'member_id',
        title: 'Member ID',
        hidden: true
    },
    {
        colName: 'church_fk_id',
        title: 'Church',
        type: 'select',
        selectPrimaryKey: 'id',
        selectKeyName: 'church_name',
        apiTblName: 'church',
        validator: [{ name: 'required' }]
    },
    {
        colName: 'position_in_family',
        type: 'select',
        title: 'Type',
        data: [{ id: 1, position_in_familyName: 'Father' }, { id: 2, position_in_familyName: 'Mother' }, { id: 3, position_in_familyName: 'Child' }, { id: 4, position_in_familyName: 'Individual' }],
        selectKeyName: 'position_in_familyName'
    },
    {
        colName: 'name',
        title: 'Name',
        validator: [{ name: 'required' }]
    },
    {
        colName: 'fatherName',
        title: "Father's/Husband's Name",
        validator: [{ name: 'required' }]
    },
    {
        colName: 'gender',
        title: 'Gender',
        type: 'select',
        data: AppConstant.GENDER,
        selectKeyName: 'genderName', selectPrimaryKey: 'id',
        validator: [{ name: 'required', error: 'Gender is required' }]
    },
    {
        colName: 'dob',
        title: 'Date of Birth ',
        type: 'DATE',
        yearNavigator: true,
        monthNavigator: true,
        dateRange: AppConstant.DEFAULT_DATE_RANGE,

    },
    {
        colName: 'mobile_no',
        title: 'Mobile No ',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.MOBILE, error: 'Mobile NUmber should be valid' },
        { name: 'required', error: 'Mobile Number is required' }]
    },
    {
        colName: 'marital_status_id',
        title: 'Marital Status',
        selectKeyName: 'marital_statusName',
        apiTblName: 'marital_status',
        type: 'select',
        selectPrimaryKey: 'id',
        validator: [{ name: 'required' }],
        event: { name: 'change', isCallback: true }
    },
    {
        colName: 'spouse_name',
        title: 'Spouse Name',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT }]
    },
    {
        colName: 'do_marriage',
        title: 'Date of Marriage ',
        type: 'DATE',
        yearNavigator: true,
        monthNavigator: true,
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
    },
    {
        colName: 'address',
        title: 'Address',
        type: 'TEXTAREA',
    },
    {
        groupStart: true,
        groupTitle: '',
        colName: 'edu_status',
        title: 'Education Status ?',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'edu_statusName', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ edu_statusName: 'Yes', id: 1 }],
        validator: [],
    },
    {
        colName: 'course_name',
        title: 'Qualification',
    },
    {
        groupStart: true,
        groupTitle: '',
        colName: 'job_status',
        title: 'Profession Status ?',
        defaultValue: false,
        type: 'checkbox',
        selectKeyName: 'job_statusName', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
        data: [{ job_statusName: 'Yes', id: 1 }],
        validator: [],
    },
    {
        colName: 'job',
        title: 'Profession',
    },
    {
        groupStart: true,
        colName: 'do_join',
        title: 'Joining Date',
        type: 'DATE',
        yearNavigator: true,
        monthNavigator: true,
        // dateViewMode: 'month',
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
    },
    {
        colName: 'gifting',
        title: 'Gifting',
        selectKeyName: 'giftingName',
        selectPrimaryKey: 'id',
        type: 'MULTISELECT',
        data: [{ id: 'counselling', giftingName: 'Counselling' }, { id: 'evangelism', giftingName: 'Evangelism' }, { id: 'prayer warriors', giftingName: 'Prayer Warriors' }, { id: 'musician', giftingName: 'Musician' }],
    },
    {
        colName: 'aadhar_no',
        title: 'ID Proof (Voter ID)',
        hidden: true
    },
    {
        colName: 'category',
        title: 'Category',
        type: 'select',
        apiTblName: 'church_member_category',
        event: { name: 'change', isCallback: true },
        selectKeyName: 'church_member_categoryName', selectPrimaryKey: 'id',
        validator: [{ name: 'required', error: 'Category is required' }]
    },
    {
        colName: 'do_bap',
        title: 'Date of Baptism ',
        type: 'DATE',
        yearNavigator: true,
        monthNavigator: true,
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
    },
    {
        colName: 'register_number',
        title: 'Old Register Number'
    },
    {
        groupStart: true,
        colName: 'position_category_id',
        title: 'Position In Church',
        selectKeyName: 'position_categoryName',
        selectPrimaryKey: 'id',
        type: 'select',
        data: [{ id: '1', position_categoryName: 'Believer' }, { id: '2', position_categoryName: 'Council Member' }, { id: '3', position_categoryName: 'Elder' }, { id: '4', position_categoryName: 'Treasurer' }, { id: '5', position_categoryName: 'Secretary' }],
    },
    {
        colName: 'memebr_supscription_id',
        title: 'Subscription',
        type: 'select',
        apiTblName: 'memebr_supscription',
        selectKeyName: 'memebr_supscriptionName', selectPrimaryKey: 'id',
        validator: [{ name: 'required' }]
    },
    {
        colName: 'remarks',
        title: 'Remarks',
        defaultValue: '',
    },
    {
        colName: 'comment',
        title: 'Comment',
        defaultValue: '',
    },
    {
        colName: 'status',
        title: 'Status',
        type: 'select',
        validator: [{ name: 'required' }],
        selectKeyName: 'statusName',
        data: [{ id: '1', statusName: 'Active' }, { id: '2', statusName: 'Death' }, { id: '3', statusName: 'Left' }, { id: '4', statusName: 'Shifted' }]
    }
]

export const CHURCH_TRAINING_FORM: formBuilder[] = [
    {
        colName: 'id',
        title: '',
        hidden: true
    },
    {
        colName: 'tbs',
        title: 'No. of Students Sent to TBC',
        title_case: 'NONE',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }],
        info: 'Timothy Bible School'
    },
    {
        colName: 'gtc',
        title: 'No. of Students Sent to GTC ',
        title_case: 'NONE',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }],
        info: '(For Elders, VVP, and BM)'
    },
    {
        colName: 'dtc',
        title: 'No. of Students Sent to DTC ',
        title_case: 'NONE',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'tailoring',
        title: 'No. of Students Sent to Tailoring',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'volunteer',
        title: 'No. of Students Sent to Village Volunteer',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'bible_study',
        title: 'No. of Students Sent to Bible Study',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
    {
        colName: 'elder',
        title: 'No. of Students sent to Other Program',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER, error: 'Number Only Allowed' }]
    },
];
export const CHURCH_REPORT_BASIC_FORM: formBuilder[] = [
    {
        colName: 'from_date',
        title: 'From Month ',
        type: 'DATE',
        yearNavigator: true,
        monthNavigator: true,
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
        dateFormat: 'mm/yy',
        event: {
            isCallback: true,
            name: 'change'
        },
        dateViewMode: 'month',
        validator: [{ name: 'required', error: 'From month is required' }],
    },
    {
        colName: 'to_date',
        title: 'To Month ',
        type: 'DATE',
        yearNavigator: true,
        monthNavigator: true,
        dateFormat: 'mm/yy', dateViewMode: 'month',
        dateRange: AppConstant.DEFAULT_DATE_RANGE,
        defaultValue: new Date(),
        validator: [{ name: 'required', error: 'To month is required' }],
        event: { name: 'change', isCallback: true }
    },
    {
        colName: 'church_id',
        title: 'Church Id',
        readonly: true,
        validator: [{ name: 'required', error: 'Church ID is required' }],
    },
    {
        colName: 'church_fk_id',
        title: 'Church Id',
        hidden: true,
        event: { name: 'change', isCallback: true }
    },
]
export const CHURCH_HISTORY_FORM: formBuilder[] = [
    {
        groupTitle: 'BRIEF MINISTERIAL ACTIVITIES',
        colName: 'challenges',
        title: 'Strongholds and Challenges Faced where the Church is Based ( Situated)',
        type: 'TEXTAREA',
        col_size: 12,
    },
    {
        colName: 'goal_set',
        title: 'Goal for next 3 – 5 years ',
        type: 'TEXTAREA',
        col_size: 12,
    },
    {
        colName: 'needs',
        title: ' Ministerial Needs if any ',
        type: 'TEXTAREA',
        col_size: 12,
    },
    {
        colName: 'key_points',
        title: ' Highlight Key Points',
        validator: [{ name: 'required', error: 'Key Points Required' }],
        type: 'TEXTAREA',
        col_size: 12,
    }]

export const CHURCH_OTHERS_FORM: formBuilder[] = [
    {
        colName: 'church_id',
        title: 'Id',
        hidden: true
    },
    {
        colName: 'history',
        title: 'Story of first baptized believer / Church History / Background',
        type: 'TEXTAREA',
        col_size: 12,
        groupTitle: 'BRIEF MINISTERIAL ACTIVITIES'
    },
    {
        colName: 'breakthrough',
        title: ' Details of Sacrifice/ Oppositions/ Breakthroughs/ miracles/ growth etc.',
        type: 'TEXTAREA',
        col_size: 12
    },
    {
        colName: 'about_ministry',
        title: 'Give details about the effective ministry methods used in establishing this church',
        type: 'TEXTAREA',
        col_size: 12,
        info: 'Tracts Distribution / Healing ministry / Youth Ministry / Children Ministry / Film Ministry / Medical Ministry'
    },

    {
        colName: 'account_name',
        title: 'Account Name',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Account Name should be valid' }],
        col_size: 3,
        groupTitle: 'Bank Details'
    },
    {
        colName: 'bank_name',
        title: 'Bank Name',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Name should be valid' }],
        col_size: 3
    },
    {
        colName: 'branch_name',
        title: 'Branch Name',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Branch Name should be valid' }],
        col_size: 3
    },
    {
        colName: 'account_number',
        title: 'Account Number',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.TEXT, error: 'Account Number should be valid' }],
        col_size: 3
    },
    {
        colName: 'ifc_code',
        title: 'IFSC code',
        title_case: 'NONE',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.IFC_CODE, error: 'IFSC Code should be valid' }],
        event: { name: 'input', isSelfAssign: true, apiFunName: 'toUpperCase' },
        col_size: 3
    },
    {
        colName: 'upi',
        title: 'UPI ID',
        title_case: 'NONE',
        col_size: 3
    }
]
export const CHURCH_PROGRESS_REPORT: tableColum[] = [{
    colName: 'church_name',
    title: 'Church Name',
    filter: true,
},
{
    colName: 'church_id',
    title: 'Church Id',
    filter: true,
},
{
    colName: 'description',
    title: 'Description',
    filter: true,
},
{
    colName: 'church_progressName',
    title: 'Report Status'
},
{
    colName: 'status',
    title: 'Status',
    colType: 'DROPDOWN',
    filter: true,
    filterCol: {
        type: 'DROPDOWN',
        data: [
            { label: 'Approved', key: 1, color: 'success' },
            { label: 'Pending', key: 2, color: 'warning' },
            { label: 'Reject', key: 3, color: 'danger' },
        ]
    }
},
{
    colName: 'created_at',
    title: 'Date',
    colType: 'DATE',
    filter: true,
    filterCol: { type: 'DATE' }
}
] 