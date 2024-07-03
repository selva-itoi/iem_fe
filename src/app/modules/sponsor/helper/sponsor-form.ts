import { VALIDATOR_PATTERNS } from "src/app/helper/class/app-constant";
import { formBuilderData, tableColum } from "src/app/helper/interface/response";

export const SPONSOR_LIST_TABLE: tableColum[] = [
    {
        colName: 'promotionalName',
        title: 'Church Minstry Area',
        sort: true,
        filter: true,
    },
    {
        colName: 'profile_img',
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
        colName: 'sponsor_id',
        title: 'Donor ID',
        sort: false,
        isPrimary: true,
        filter: true,
        colType: 'VIEW_INFO'
    },
    {
        colName: 'full_mobile_no',
        title: 'Mobile No',
        sort: true,
        filter: true
    },
    {
        colName: 'email_id',
        title: 'Email ID',
        sort: true,
        filter: true,
    },
    {
        title: 'Status',
        colName: 'status',
        sort: true,
        filter: true,
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: [
                { label: 'Active', key: 1, color: 'success' },
                { label: 'Pending', key: 2, color: 'warning' },
                { label: 'In Active', key: 0, color: 'danger' },
            ]
        }
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

export const PURPOSE_SPONSORSHIP_TABLE: tableColum[] = [
    {
        colName: 'sponsorship_moduleName',
        title: 'Purpose',
        sort: true,
        filter: true,
    },
    {
        colName: 'amount',
        title: 'Amount',
        colType: 'CURRENCY',
        sort: true,
        filter: true,
    },
]

export const SPONSORSHIP_TABLE: tableColum[] = [
    {
        title: 'Church Ministry Area',
        colName: 'promotionalName',
        // colType: 'DROPDOWN',
        // filterCol: { apiName: 'promotional_office', type: 'DROPDOWN', selectKeyName: 'promotionalName', selectPrimaryKey: 'id' },
        sort: true,
        filter: true,
    },
    {
        colName: 'name',
        title: 'Name',
        sort: true,
        filter: true,
        colType: 'VIEW_INFO'
    },
    {
        colName: 'id',
        title: 'Name',
        visible: false,
        isPrimary: true
    },
    {
        colName: 'sponsor_id',
        title: 'Donor ID',
        filter: true
    },
    {
        colName: 'moduleName',
        title: 'Purpose',
        filterCol: {
            type: 'DROPDOWN',
            apiName: 'sponsorship_module',
            selectKeyName: 'name',
            selectPrimaryKey: 'name'
        },
        sort: true,
        filter: true,
    },
    {
        colName: 'amount',
        title: 'Amount',
        colType: 'CURRENCY',
        sort: true,
        filter: true,
    },
    {
        colName: 'total_alloted',
        title: 'Alloted',
        sort: true,
        filter: true,
    },
    {
        title: 'Frequency',
        colName: 'freq_payment_id',
        sort: true,
        filter: true,
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: [
                { label: 'One time', key: '1', color: 'warning' },
                { label: 'Monthly', key: '2', color: 'success' },
                { label: 'Bi-Monthly', key: '3', color: 'success' },
                { label: 'Quarterly', key: '4', color: 'success' },
                { label: 'Half Yearly', key: '5', color: 'success' },
                { label: 'Yearly', key: '6', color: 'success' },


            ]
        }
    },
    {
        title: 'Payment',
        colName: 'payment_status',
        visible: false,
        sort: true,
        filter: true,
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: [
                { label: 'paid', key: '1', color: 'success' },
                { label: 'Pending', key: 2, color: 'warning' },
            ]
        }
    },
    {
        title: 'Status',
        colName: 'status',
        sort: true,
        filter: true,
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: [
                { label: 'Active', key: 2, color: 'info' },
                { label: 'Completed', key: 1, color: 'success' },
                { label: 'Withdrawal', key: -1, color: 'danger' },
                { label: 'Allotment Pending', key: 3, color: 'warning' },
            ]
        }
    },
    {
        title: 'Payment Status',
        colName: 'payment_statusName',
        sort: true,
        filter: true,
    },
    {
        colName: 'total_support',
        title: 'Supported',
        sort: true,
        filter: true,
    },
    {
        colName: 'updated_at',
        title: 'Last Update',
        sort: false,
        filter: true,
        colType: 'DATE',
        filterCol: {
            type: 'DATE'
        }
    },
];

export const MAGAZINE_ADDRESS: formBuilderData[] = [
    {
        colName: 'address',
        filter: true,
        sort: true,
        visible: false,
        title: 'Address Line 1',
        validator: [],
        readonly: true
    },
    {
        colName: 'street',
        filter: true,
        sort: true,
        visible: false,
        title: 'Address Line 2',
        readonly: true
        // validator: [{ name: 'required' }]
    },
    {
        colName: 'city',
        filter: true,
        sort: true,
        visible: false,
        title: 'Address Line 3',
        validator: [],
        readonly: true
    },
    {
        colName: 'countryName',
        filter: true,
        sort: true,
        title: 'Country',
        // validator: [{ name: 'required' }],
        // type: 'select',
        // apiTblName: 'country',
        // selectKeyName: 'countryName',
        // event: { name: 'change', apiTblName: 'state', valueAssign: 'state' },
        // defaultValue: '1',
        readonly: true
    },
    {
        colName: 'stateName',
        filter: true,
        sort: true,
        title: 'State',
        // validator: [{ name: 'required' }],
        // type: 'select',
        // selectKeyName: 'stateName',
        // selectPrimaryKey: 'id',
        readonly: true,
        // event: { name: 'change', apiTblName: 'district', valueAssign: 'district' }
    },
    {
        colName: 'districtName',
        filter: true,
        sort: true,
        // visible: false,
        // type: 'select',
        // selectKeyName: 'districtName',
        title: 'District',
        readonly: true
        // event: { name: 'change', apiTblName: 'city', valueAssign: 'city' }
    },
    {
        colName: 'pincode',
        visible: false,
        title: 'Pincode',
        readonly: true,
        validator: [
            { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    // {
    //     colName: 'tally_code',
    //     visible: false,
    //     title: 'Tally Code',
    // }
];
export const SPONSOR_ADDRESS: formBuilderData[] = [
    {
        colName: 'address',
        filter: true,
        sort: true,
        visible: false,
        title: 'Address Line 1',
        validator: [],
    },
    {
        colName: 'street',
        filter: true,
        sort: true,
        visible: false,
        title: 'Address Line 2',
        // validator: [{ name: 'required' }]
    },
    {
        colName: 'city',
        filter: true,
        sort: true,
        visible: false,
        title: 'Address Line 3',
        validator: [],
    },
    {
        colName: 'country',
        filter: true,
        sort: true,
        title: 'Country',
        validator: [{ name: 'required' }],
        type: 'select',
        apiTblName: 'country',
        selectKeyName: 'countryName',
        // event: { name: 'change', apiTblName: 'state', valueAssign: 'state' },
        defaultValue: '1'
    },
    {
        colName: 'state',
        filter: true,
        sort: true,
        title: 'State',
        validator: [{ name: 'required' }],
        type: 'select',
        apiTblName: 'state',
        selectKeyName: 'stateName',
        selectPrimaryKey: 'id',
        event: { name: 'change', apiTblName: 'district', valueAssign: 'district' }
    },
    {
        colName: 'district',
        filter: true,
        sort: true,
        visible: false,
        type: 'select',
        selectKeyName: 'districtName',
        title: 'District Name',
        validator: [{ name: 'required' }],

        // event: { name: 'change', apiTblName: 'city', valueAssign: 'city' }
    },
    {
        colName: 'pincode',
        visible: false,
        title: 'Pincode',
        validator: [
            { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    // {
    //     colName: 'tally_code',
    //     visible: false,
    //     title: 'Tally Code',
    // }
];
export const SPONSOR_DONATION_LIST: formBuilderData[] = [
    {
        colName: 'donation_id',
        title: 'Receipt Id',
        sort: true,
        filter: true,
    },
    {
        colName: 'sponsorName',
        title: 'Sponsor Name',
        sort: true,
        filter: true,
    },
    {
        colName: 'id',
        title: '',
        hidden: true,
        visible: false,
    },
    {
        colName: 'sponsor_id',
        title: 'Donor ID',
        sort: false,
        filter: true,
        colType: 'SPONSORID'
    },
    {
        colName: 'promotionalName',
        title: 'Church Ministry Area',
        // colType: 'DROPDOWN',
        // filterCol: { apiName: 'promotional_office', type: 'DROPDOWN', selectKeyName: 'promotionalName', selectPrimaryKey: 'id' },
        sort: true,
        filter: true,
    },
    // {
    //     colName: 'sponsorship_moduleName',
    //     title: 'Program Name',
    //     filter: true
    // },
    {
        colName: 'amount',
        title: 'Amount',
        colType: 'CURRENCY',
        sort: true,
        filter: true,
    },
    {
        colName: 'payment_mode_fk_id',
        title: 'Mode',
        colType: 'DROPDOWN',
        filterCol: { apiName: 'payment_mode', selectKeyName: 'payment_modeName', selectPrimaryKey: 'id', type: 'DROPDOWN' },
        sort: true,
        filter: true,
    },
    {
        colName: 'donation_date',
        title: 'Donate On',
        sort: true,
        filter: false,
        colType: 'DATE',
    },
    {
        colName: 'creted_byName',
        title: 'Created By',
        sort: true,
        filter: false,
    },
    {
        title: 'Status',
        colName: 'status',
        sort: true,
        filter: true,
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: [
                { label: 'Paid', key: 1, color: 'success' },
                { label: 'Pending', key: 2, color: 'warning' },
                { label: 'Failed', key: 3, color: 'danger' },
                { label: 'Deposited', key: 4, color: 'info' },

            ]
        }
    },
];


export const DONATION_TBL: formBuilderData[] = [
    { colName: 'familyMemberId', title: 'Family Member ID', isPrimary: true, visible: false },
    { colName: 'familyMember', title: 'Name', visible: false },
    { colName: 'program', title: 'Program' },
    { colName: 'subProgram', title: 'Sub Program', visible: false },
    { colName: 'receiptNumber', title: 'Receipt Number' },
    { colName: 'amount', title: 'Amount', type: 'CURRENCY' },
    { colName: 'paymentType', title: 'Payment Type' },
    { colName: 'donationStatus', title: 'status' },
    { colName: 'donationDate', title: 'Donate On', colType: 'DATE' },
    { colName: 'depositDate', title: 'Deposit On', colType: 'DATE', visible: false },
    { colName: 'depositStatusUpdateDateTime', title: 'last Updated', type: 'DATE', visible: false },
]
export const DONATION_ALLOTMENT_LIST: formBuilderData[] = [
    {
        colName: 'sponsorName',
        title: 'Sponsor Name',
        sort: true,
        filter: true,
    },
    {
        colName: 'id',
        title: '',
        hidden: true,
        visible: false,
    },
    {
        colName: 'sponsor_id',
        title: 'Donor ID',
        sort: false,
        filter: true,
        colType: 'SPONSORID'
    },
    {
        colName: 'amount',
        title: 'Amount',
        colType: 'CURRENCY',
        sort: true,
        filter: true,
    },
    {
        colName: 'ref_code',
        title: 'Ref code',
        sort: true,
        filter: true,
    },
    {
        colName: 'moduleName',
        title: 'Module Name',
        visible: false
    },
    {
        colName: 'assignName',
        title: 'Assign Name',
        sort: true,
        filter: true
    },
    {
        colName: 'created_at',
        title: 'Created On',
        sort: true,
        filter: false,
        colType: 'DATE',
        type: 'DATE'
    },
    {
        colName: 'donation_amount',
        title: 'Donation Amount',
        visible: false
    },
    {
        colName: 'allotment_remarks',
        title: 'Remarks',
        visible: false
    }

];

export const SPONSORMODULE_FORM: formBuilderData[] = [
    {
        colName: 'sponsorship_module_fk_id',
        title: 'Sponsership Module',
        type: 'select',
        apiTblName: 'sponsorship_module',
        selectKeyName: 'name',
        selectPrimaryKey: 'id',
        validator: [{ name: 'required' }],
        event: { name: 'change', isCallback: true },
    },
    {
        colName: 'amount',
        title: 'Amount',
        validator: [{ name: 'required' },
        { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER },
        ],
    },
    {
        colName: 'is_recurring',
        title: 'Is Recurring',
        defaultValue: '',
        type: 'checkbox',
        data: [{ name: 'Yes', id: 1 }],
        selectKeyName: 'name', selectPrimaryKey: 'id',
        event: { isCallback: true, name: 'change' },
    },
    {
        colName: 'total_support',
        defaultValue: '1',
        title: 'Total Support',
    },
    {
        colName: 'freq_payment_id',
        selectKeyName: 'freq_paymentName',
        selectPrimaryKey: 'id',
        defaultValue: '',
        apiTblName: 'freq_payment',
        type: 'select',
        title: 'Frequency',
        // col_size:12,
        // event: { isCallback: true, name: 'change' },
    }

]

export const SELECTED_FORM: formBuilderData[] = [

    {
        colName: 'moduleName',
        title: 'category',
        type: 'select',
        apiTblName: 'sponsorship_module',
        selectKeyName: 'moduleName',
        selectPrimaryKey: 'moduleName',
        // apiFilter : { keyName: 'isRecuring', value: '1', operation: '==' },

        // event: { isCallback: true, name: 'change' },
        validator: [{ name: 'required' }]
    },
    {
        colName: 'amount',
        title: 'Amount',
        colType: 'CURRENCY',
        validator: [{ name: 'required' }],
    },
    {
        colName: 'date',
        title: 'Date',
        type: 'DATE',
        defaultValue: new Date()

    },



]
export const SELECTED_FORM_DATA: formBuilderData[] = [

    {
        colName: 'moduleName',
        title: 'category',
        type: 'select',
        apiTblName: 'sponsorship_module',
        selectKeyName: 'moduleName',
        selectPrimaryKey: 'id',
        apiFilter: { keyName: 'isRecuring', value: '1', operation: '==' },
        defaultValue: '',

        // event: { isCallback: true, name: 'change' },
        // validator:[{name:'required'}]
    },
    {
        colName: 'amount',
        title: 'Amount',
        colType: 'CURRENCY',

    },
    {
        colName: 'date',
        title: 'Date',

    },



]

export const SPONSORSHIP_ID: tableColum[] = [

    // {
    //     title: 'Church Ministry Area',
    //     colName: 'promotionalName',
    //     // colType: 'DROPDOWN',
    //     // filterCol: { apiName: 'promotional_office', type: 'DROPDOWN', selectKeyName: 'promotionalName', selectPrimaryKey: 'id' },
    //     sort: true,
    //     filter: true,
    // },
    {
        colName: 'moduleName',
        title: 'Category',
        sort: true,
        filter: true,
    },
    {
        colName: 'amount',
        title: 'Amount',
        colType: 'CURRENCY',

    },
    // {
    //     colName: 'donation_on',
    //     title: 'Date',
    //     colType:'DATE'


    // },
    {
        colName: 'total_alloted',
        title: 'Alloted',

        sort: true,
        filter: true,
    },


    {
        title: 'Status',
        colName: 'status',
        sort: true,
        filter: true,
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: [
                { label: 'Active', key: 2, color: 'info' },
                { label: 'Completed', key: 1, color: 'success' },
                { label: 'Withdrawal', key: -1, color: 'danger' },
                { label: 'Allotment Pending', key: 3, color: 'warning' },
            ]
        }
    },

];

export const BANK_TABLE: tableColum[] = [
    {
        colName: 'bank_account_name',
        title: 'Account Name',
        sort: true,
        filter: true,
    },
    {
        colName: 'bank_account_no',
        title: 'Account No',
        // colType: 'CURRENCY',
        sort: true,
        filter: true,
    },
    {
        colName: 'bank_name',
        title: 'Bank Name',
        sort: true,
        filter: true,
    },
    {
        colName: 'bank_ifc_code',
        title: 'IFSC',
        sort: true,
        filter: true,
    },
    {
        colName: 'bank_address',
        title: 'Branch',
        sort: true,
        filter: true,
    },
];
export const MAGAZINE_INFO_COL: formBuilderData[] = [
    {
        colName: 'newsletter_code',
        title: 'Magazine Code',
        filter: true,
        sort: true,

    },
    {
        colName: 'fullName',
        title: 'Name',
        sort: true,
        filter: true,
        // colType: 'VIEW_INFO'
    },
    {
        colName: 'id',
        title: 'Name',
        visible: false,
        isPrimary: true,
        hidden: true
    },
    {
        colName: 'address',
        title: 'Address',
        filter: true,
        sort: true,
    },
    {
        colName: 'street',
        title: 'Address Line 2',
        filter: true,
        sort: true,
        hidden: true
    },
    {
        colName: 'address_line',
        title: 'Address Line 3',
        filter: true,
        sort: true,
        hidden: true
    },
    {
        colName: 'districtName',
        title: 'District',
        filter: true,
        sort: true,
    },
    {
        colName: 'stateName',
        title: 'State',
        filter: true,
        sort: true,
    },
    {
        colName: 'pincode',
        title: 'Pincode',
        filter: true,
        sort: true,
    },
    {
        colName: 'frequencyMagazineName',
        title: 'Frequency',
        filter: true,
        sort: true,
    },

    // {
    //     title: 'Church Misnistry Area',
    //     colName: 'promotionalName',
    //     // colType: 'DROPDOWN',
    //     // selectKeyName:'promotionalName',
    //     // filterCol: { apiName: 'promotional_office', type: 'DROPDOWN', selectKeyName: 'promotionalName', selectPrimaryKey: 'id' },
    //     sort: true,
    //     filter: true,
    // },
    // {
    //     colName: 'magazine',
    //     title: 'Magazine Name',
    //     filter: true,
    //     sort: true,
    // },

    // {
    //     colName: 'langName',
    //     title: 'Language Name',
    //     filter: true,
    //     sort: true,
    // },
    {
        colName: 'no_of_magazine',
        title: 'No Of Copies',
        filter: true,
        sort: true,
    },
    {
        colName: 'mobile_no',
        title: 'Mobile No',
        filter: true,
        sort: true,
    },

    {
        colName: 'status',
        title: 'Status',
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: [{ statusName: 'Active', id: 1, color: 'success' }, { statusName: 'InActive', id: 0, color: 'danger' }],
            selectKeyName: 'statusName',
            selectPrimaryKey: 'id'
        },
        filter: true,
        sort: true,
    },
]
export const MAGAZINE_LIST_COL: formBuilderData[] = [
    {
        colName: 'newsletter_code',
        title: 'Magazine Code',
        filter: true,
        sort: true,

    },
    {
        colName: 'fullName',
        title: 'Name',
        sort: true,
        filter: true,
        // colType: 'VIEW_INFO'
    },
    {
        colName: 'id',
        title: 'Name',
        visible: false,
        isPrimary: true,
        hidden: true
    },
    {
        colName: 'address',
        title: 'Address',
        filter: true,
        sort: true,
    },
    // {
    //     colName: 'street',
    //     title: 'Address Line 2',
    //     filter: true,
    //     sort: true,
    // },
    // {
    //     colName: 'address_line',
    //     title: 'Address Line 3',
    //     filter: true,
    //     sort: true,
    //     hidden:true
    // },
    {
        colName: 'districtName',
        title: 'District',
        filter: true,
        sort: true,
    },
    {
        colName: 'stateName',
        title: 'State',
        filter: true,
        sort: true,
    },
    {
        colName: 'pincode',
        title: 'Pincode',
        filter: true,
        sort: true,
    },

    // {
    //     title: 'Church Misnistry Area',
    //     colName: 'promotionalName',
    //     // colType: 'DROPDOWN',
    //     // selectKeyName:'promotionalName',
    //     // filterCol: { apiName: 'promotional_office', type: 'DROPDOWN', selectKeyName: 'promotionalName', selectPrimaryKey: 'id' },
    //     sort: true,
    //     filter: true,
    // },
    // {
    //     colName: 'magazine',
    //     title: 'Magazine Name',
    //     filter: true,
    //     sort: true,
    // },

    // {
    //     colName: 'langName',
    //     title: 'Language Name',
    //     filter: true,
    //     sort: true,
    // },
    {
        colName: 'no_of_magazine',
        title: 'No Of Copies',
        filter: true,
        sort: true,
    },
    {
        colName: 'mobile_no',
        title: 'Mobile No',
        filter: true,
        sort: true,
    },

    {
        colName: 'status',
        title: 'Status',
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: [{ statusName: 'Active', id: 1, color: 'success' }, { statusName: 'InActive', id: 2, color: 'danger' }],
            selectKeyName: 'statusName',
            selectPrimaryKey: 'id'
        },
        filter: true,
        sort: true,
    },
]
export const NEW_MAGAZINE_FORM: formBuilderData[] = [
    {
        colName: 'magazine_fk_id',
        title: 'Magazine',
        type: 'select',
        selectKeyName: 'magazineName',
        selectPrimaryKey: 'id',
        // autoSearch: { titleKey: 'magazineName', selectFieldKeys: ['magazineName', 'magazine_code'] },
        // apiFunName: 'search',
        apiTblName: 'magazine'
    },
    {
        colName: 'from_date',
        title: 'From Date',
        type: 'DATE',
        defaultValue: new Date()
    },
    {
        colName: 'no_of_magazine',
        title: 'No of Magazine'
    },
    {
        colName: 'newsletter_code',
        title: 'Magazine Code'
    },
    {
        colName: 'remark',
        title: 'Remarks'
    }
]
export const SPONSOR_OFFICEDATA: formBuilderData[] = [

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
        validator: [{ name: 'required', error: 'Region should not be blank' }]
    },
    {
        colName: 'zone',
        selectKeyName: 'zoneName',
        selectPrimaryKey: 'id',
        type: 'select',
        title: 'State/Zone Name',
        event: {
            name: 'change',
            apiTblName: 'promotional_office',
            valueAssign: 'promotional_office',
        },
        validator: [{ name: 'required' }]
    },
    // {
    //     colName: 'promotional_office',
    //     title: 'Church Ministry Area',
    //     type: 'select',
    //     selectKeyName: 'promotionalName',
    //     selectPrimaryKey: 'promoId',
    //     event: {
    //         name: 'change',
    //         apiTblName: 'volunteer',
    //         valueAssign: 'volunteer',
    //         isCallback: true
    //     },
    //     validator: [{ name: 'required' }],
    // },
    // {
    //     colName: 'volunteer',
    //     title: 'Area secretory',
    //     type: 'select',
    //     selectKeyName: 'volunteerName',
    //     selectPrimaryKey: 'id',

    // },


    {
        colName: 'promotional_office',
        title: 'Church Ministry Area',
        type: 'select',
        selectKeyName: 'promotionalName',
        selectPrimaryKey: 'promoId',
        validator: [{ name: 'required' }],
        event: {
            name: 'change',
            apiTblName: 'volunteer',
            valueAssign: 'volunteer',
        },
    },
    {
        colName: 'volunteer',
        title: 'Area secretory',
        type: 'select',
        selectKeyName: 'volunteerName',
        selectPrimaryKey: 'id',
        validator: [{ name: 'required' }],

    },

    // colName: 'district',
    // filter: true,
    // sort: true,
    // visible: false,
    // type: 'select',
    // selectKeyName: 'districtName',
    // title: 'District Name',
    // validator: [{ name: 'required' }],
]

export const DONATION_PENDING: formBuilderData[] = [

    {
        colName: 'sponsor_name',
        title: 'Donor',
        filter: true,
        sort: true,
    },
    {
        colName: 'donor_id',
        title: 'Donor Id',
        filter: true,
        sort: true,
        colType: 'VIEW_INFO'

    },
    {
        colName: 'sponsor_mobile_no',
        title: 'Mobile No',
        filter: true,
        sort: true,
    },
    {
        colName: 'sponsor_email_id',
        title: 'Email Id',
        filter: true,
        sort: true,
    },
    {
        colName: 'no_of_sponsorship',
        title: 'No of sponsorships',
        filter: true,
        sort: true,
    },
    {
        colName: 'total_sponsorship_amount',
        title: 'Amount',
        filter: true,
        sort: true,
    },
    {
        colName: 'last_payment',
        title: 'Last Paid',
        filter: true,
        sort: true,
    },
    {
        colName: 'next_payment_date',
        title: 'Next Payment',
        filter: true,
        sort: true,
    },
]
export const TOP_LIST_FORM: formBuilderData[] = [
    // {
    //     colName: 'region',
    //     title: 'Region Name',
    //     type: 'select',
    //     apiTblName: 'region',
    //     selectKeyName: 'regionName',
    //     selectPrimaryKey: 'id',
    //     defaultValue: '',
    //     event: {
    //         name: 'change',
    //         apiTblName: 'zone',
    //         valueAssign: 'zone'
    //     },
    //     validator: [{ name: 'required', error: 'Region should not be blank' }]
    // },
    // {
    //     colName: 'zone',
    //     selectKeyName: 'zoneName',
    //     selectPrimaryKey: 'id',
    //     defaultValue: '',
    //     type: 'select',
    //     title: 'State/Zone Name',
    //     event: {
    //         name: 'change',
    //         apiTblName: 'promotional_office',
    //         valueAssign: 'promotional_office',
    //     },
    //     validator: [{ name: 'required' }]  
    // },
    {
        colName: 'promotional_office',
        title: 'Church Ministry Area',
        type: 'select',
        apiTblName: 'promotional_office',
        selectKeyName: 'promotionalName',
        selectPrimaryKey: 'promoId',
        filter: true,
        sort: true,
        // validator: [{ name: 'required' }],
        event: {
            name: 'change',
            // apiTblName: 'volunteer',
            // valueAssign: 'volunteer',
        },
    },
    {
        colName: 'volunteer',
        title: 'Area secretory',
        type: 'select',
        // type:'AUTOCOMPLETE',
        apiTblName: 'volunteer',
        //  autoSearch: { titleKey: 'volunteerName', selectFieldKeys: ['volunteerName', 'volunteer_id'] },
        // apiFunName: 'search',
        selectKeyName: 'volunteerName',
        selectPrimaryKey: 'id',
        // validator: [{ name: 'required' }],

    },
    {
        colName: 'date',
        title: 'Month & Year',
        dateFormat: 'mm/yy',
        dateViewMode: 'month',
        type: 'DATE',
        defaultValue: new Date(),
        event: { name: 'change', isCallback: true },
        visible: false,
        validator: [{ name: 'required' }],

    },

]
export const TOP_LIST_TABLE: formBuilderData[] = [
    {
        colName: 'donation_date',
        title: 'Date',

    },
    {
        colName: 'donation_id',
        title: 'Receipt No',

    },
    {
        colName: 'sponsorName',
        title: 'Donor Name',

    },
    {
        colName: 'sponsor_id',
        title: 'Donor ID',
        colType: 'VIEW_INFO'


    },
    {
        colName: 'sponsorship_moduleName',
        title: 'purpose',

    },
    {
        colName: 'amount',
        title: 'Amount',

    },

]
export const SETTLEMENT_LIST_TABLE: formBuilderData[] = [
    {
        colName: 'donation_date',
        title: 'Date',

    },
    {
        colName: 'donation_id',
        title: 'Receipt No',

    },
    {
        colName: 'sponsorName',
        title: 'Donor Name',

    },
    {
        colName: 'sponsorship_moduleName',
        title: 'purpose',

    },
    {
        colName: 'sponsorship_amount',
        title: 'Amount',

    },

]