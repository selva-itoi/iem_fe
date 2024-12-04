import { VALIDATOR_PATTERNS } from "src/app/helper/class/app-constant";
import { formBuilderData, tableColum } from "src/app/helper/interface/response";

export const ACCOUNT_FORM: formBuilderData[] = [
    { colName: 'accountName', hidden: true, title: 'Account Name' },
    { colName: 'account_code', hidden: true, title: 'Ac/No' },
    { colName: 'ref_code', hidden: true, title: 'Ref' },
    // { colName: 'current_balance', hidden: true, title: 'Current Balance' },

    {
        colName: 'category',
        title: 'Account Type',
        type: 'select',
        apiTblName: 'account_category',
        selectKeyName: 'account_categoryName',
        event: { name: 'change', isCallback: true }

        // event: { name: 'change', apiTblName: 'account_scheme', valueAssign: 'account_scheme_fk_id' }
    },
    // { colName: 'current_balance', hidden: true, title: 'Balance', colType: 'CURRENCY' },


    // {
    //     colName: 'account_scheme_fk_id',
    //     title: 'Scheme',
    //     type: 'select',
    //     selectKeyName: 'account_schemeName',
    //     event: { name: 'change', isCallback: true }
    // },
    // {
    //     colName: 'scheme_amount',
    //     title: 'Scheme Amount',
    //     validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
    // },
    // {
    //     colName: 'emi_amount',
    //     title: 'EMI Amount',
    //     validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }],
    //     event: { name: 'change', isCallback: true }
    // },
    // {
    //     colName: 'no_of_month',
    //     title: 'No of Month',
    //     validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }],
    //     event: { name: 'change', isCallback: true },
    //     visible: false
    // },
    // {
    //     colName: 'scheduled_from_date',
    //     title: 'Start date',
    //     dateFormat: 'mm/yy',
    //     dateViewMode: 'month',
    //     type: 'DATE',
    //     event: { name: 'change', isCallback: true },
    //     visible: false
    // },
    // {
    //     colName: 'scheduled_to_date',
    //     title: 'End date',
    //     dateFormat: 'mm/yy',
    //     type: 'DATE',
    //     readonly: true,
    //     visible: false
    // },
    // {
    //     colName: 'account_remarks',
    //     title: 'Remarks',
    //     visible: false
    // },
    // {
    //     colName: 'status',
    //     title: 'Status',
    //     hidden: true,
    //     colType: 'DROPDOWN',
    //     type: 'select',
    //     selectKeyName: 'statusName',
    //     filterCol: {
    //         type: 'DROPDOWN',
    //         selectKeyName: 'statusName',
    //         data: [
    //             { statusName: 'Active', key: 1, color: 'success' },
    //             { statusName: 'Closed', key: 3, color: 'danger' },
    //             { statusName: 'Hold', key: 2, color: 'warning' },
    //         ]
    //     }
    // }
]
export const ACCOUNT_FORM_table: formBuilderData[] = [
    { colName: 'accountName', title: 'Account Name' },
    { colName: 'account_code', title: 'Ac/No' },
    { colName: 'ref_code', title: 'Ref' },
    { colName: 'current_balance', title: 'Current Balance' },
    { colName: 'type', title: 'type' },
    { colName: 'status', title: 'Status' },


]

export const ACCOUNT_SETTLEMENT_LIST: formBuilderData[] = [
    {
        colName: 'req_id',
        title: 'Req Id',
        sort: true,
        filter: true
    },
    {
        colName: 'accountName',
        title: 'Account Name',
        sort: true,
        filter: true
    },
    // {
    //     colName: 'to_account',
    //     title: 'To',
    //     sort: true,
    //     filter: true
    // },
    {
        colName: 'total_amount',
        title: 'Amount',
        colType: 'CURRENCY',
        sort: true,
        filter: true
    },
    {
        colName: 'typeName',
        title: 'Settlement',
        sort: true,
        filter: true
    },
    {
        colName: 'status',
        title: 'Status',
        sort: true,
        filter: true,
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: [{ color: 'success', key: 1, label: 'Approve' }, { color: 'warning', key: 2, label: 'Pending' }, { color: 'danger', key: 3, label: 'Rejected' }]
        }
    },
    {
        colName: 'created_byName',
        title: 'Created By',
        sort: true,
        filter: true
    },
    {
        colName: 'created_at',
        title: 'Created On',
        colType: 'DATE',
        sort: true,
        filter: true
    },
    {
        colName: 'updated_at',
        title: 'Last Updated On',
        colType: 'DATE',
        sort: true,
        filter: true
    }
]

export const NEW_ACCOUNT_SETTLEMENT: formBuilderData[] = [
    {
        colName: 'from_account_fk_id',
        title: 'From Account',
        event: { name: 'click', isCallback: true },
        readonly: true,
        info: 'Click to Select From Account'

    },
    {
        colName: 'to_account_fk_id',
        title: 'To Account',
        event: { name: 'click', isCallback: true },
        readonly: true,
        info: 'Click to Select To Account'
    },
    {
        colName: 'amount',
        title: 'Amount',
        colType: 'CURRENCY',
        validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
    },
    {
        colName: 'payment_mode_fk_id',
        title: 'Payment Mode',
        selectKeyName: 'payment_modeName',
        apiTblName: 'payment_mode',
        type: 'select',
        validator: [{ name: 'required' }],
        defaultValue: 1
    },
    {
        colName: 'narration',
        title: 'Pay To'
    },
    {
        colName: 'transaction_ref',
        title: 'Transaction Ref',
    },
    {
        colName: 'transaction_on',
        title: 'Transaction Date',
        type: 'DATE',
        colType: 'DATE'
    },
    {
        colName: 'remarks',
        title: 'Remarks',
    },
    // {
    //     colName: 'document',
    //     type: 'FILE',
    //     title: 'Document',
    // }
]

export const BULK_SETTLEMENT_FORM: formBuilderData[] = [
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
        col_size: 4
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
            apiTblName: 'department',
            valueAssign: 'department',
        },
        col_size: 4
    },
    {
        colName: 'department',
        title: 'Department Name',
        selectKeyName: 'dName',
        selectPrimaryKey: 'id',
        // apiTblName: 'department',
        defaultValue: '',
        type: 'select',
        col_size: 4
    },
    // {
    //     colName: 'salary_category_id',
    //     title: 'Salary Category',
    //     apiTblName: 'salary_category',
    //     selectKeyName: 'salary_categoryName',
    //     selectPrimaryKey: 'id',
    //     type: 'select',
    //     col_size: 4
    // },
    {
        colName: 'account_category_id',
        title: 'Account Type',
        type: 'select',
        apiTblName: 'account_category',
        selectKeyName: 'account_categoryName',
        event: { name: 'change', apiTblName: 'account_scheme', valueAssign: 'account_scheme_fk_id' },
        col_size: 4
    },
    {
        colName: 'account_scheme_fk_id',
        title: 'Scheme',
        type: 'select',
        selectKeyName: 'account_schemeName',
        event: { name: 'change', isCallback: true },
        col_size: 4
    },
    {
        colName: 'amount',
        title: 'Amount',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }, { name: 'required' }],
        col_size: 4,
    },
    {
        colName: 'narration',
        title: 'Description',
        col_size: 4,
        validator: [{ name: 'required' }]
    },
]

export const TRANSACTION_LIST_COL: formBuilderData[] = [
    {
        colName: 'from_account',
        title: 'Account',
        sort: true,
        filter: true
    },
    // {
    //     colName: 'to_account',
    //     title: 'To Account ',
    //     sort: true,
    //     filter: true
    // },
    {
        colName: 'amount',
        title: 'Amount',
        colType: 'CURRENCY',
        sort: true,
        filter: true
    },
    {
        colName: 'type',
        title: 'Type',
        colType: 'DROPDOWN',
        sort: true,
        filter: true,
        type: 'select',
        selectKeyName: 'transactionTypeName',
        filterCol: {
            type: 'DROPDOWN',
            selectKeyName: 'transactionTypeName',
            data: [
                { transactionTypeName: 'Transfer', key: 1, color: 'info' },
                { transactionTypeName: 'Credit', key: 2, color: 'success' },
                { transactionTypeName: 'Debit', key: 3, color: 'danger' },
            ]
        }
    },
    // {
    //     colName: 'status',
    //     title: 'Status',
    //     sort: true,
    //     filter: true,
    //     filterCol: {
    //         type: 'DROPDOWN',
    //         selectKeyName: 'statusName',
    //         data: [
    //             { statusName: 'Active', key: 1, color: 'success' },
    //             { statusName: 'Closed', key: 3, color: 'danger' },
    //             { statusName: 'Hold', key: 2, color: 'warning' },
    //         ]
    //     }
    // },
    // {
    //     colName: 'created_byName',
    //     title: 'Created By',
    //     sort: true,
    //     filter: true
    // },
    {
        colName: 'created_at',
        title: 'Created On',
        colType: 'DATE',
        sort: true,
        filter: true
    }
]
export const ACCOUNT_SETTLEMENT_LIST_TABLE: formBuilderData[] = [
    {
        colName: 'settlement_id',
        title: 'Ref Id',
        sort: true,
        filter: true
    },
    // {
    //     colName: 'narration',
    //     title: 'Description',
    //     sort: true,
    //     filter: true
    // },
    {
        colName: 'amount',
        title: 'Amount',
        colType: 'CURRENCY',
        sort: true,
        filter: true
    },
    {
        colName: 'status',
        title: 'Status',
        sort: true,
        filter: true,
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            data: [{ label: 'Approve', key: 1, color: 'success' },
            { label: 'Pending', key: 2, color: 'warning' },
            { label: 'Reject', key: 3, color: 'danger' }]
        }
    },
    {
        colName: 'created_byName',
        title: 'Created By',
        sort: true,
    },
    {
        colName: 'updated_at',
        title: 'Last Updated On',
        sort: true,

    }
]

export const SETTLEMENT_VIEW_TBL: formBuilderData[] = [
    {
        colName: 'accountName',
        title: 'Account',

    },
    {
        colName: 'account_code',
        title: 'Account Code',

    },

    {
        colName: 'total_amount',
        title: 'Amount',
        colType: 'CURRENCY',

    },
    {
        colName: 'payment_modeName',
        title: 'Payment Mode',
    },
    {
        colName: 'remarks',
        title: 'Remarks',

    },
    {
        colName: 'statusName',
        title: 'Status',

    },
    {
        colName: 'accountName',
        title: 'From Account Name',

    },
    {
        colName: 'account_code',
        title: 'From Account Code',

    },
    {
        colName: 'to_account_name',
        title: 'To Account Name',

    },
    {
        colName: 'to_account_code',
        title: 'To Account Code',

    },
    {
        colName: 'updated_at',
        title: 'Created on',
        type: 'DATE',

    },
    {
        colName: 'verified_on',
        title: 'Verified on',
        type: 'DATE',

    },
]
export const SETTLEMENT_TBL: tableColum[] = [
    {
        colName: 'from_accountName',
        title: 'From Account',
        sort: true,
        filter: true
    },
    {
        colName: 'to_accountName',
        title: 'To Account',
        sort: true,
        filter: true
    },
    {
        colName: 'created_at',
        title: 'Created At',
        colType: 'DATE',
        sort: true,
        filter: true
    },
    {
        colName: 'amount',
        title: 'Amount',
        colType: 'CURRENCY',
        sort: true,
        filter: true
    },
    // {
    //     colName: 'statusName',
    //     title: 'Status',
    // },
    {
        colName: 'remarks',
        title: 'Remarks',
        sort: true,
        filter: true
    },
    {
        colName: 'status',
        title: 'Status',
        sort: true,
        filter: true
    },
]
export const ACCOUNT_SETTLEMENT_INCOME_LIST: formBuilderData[] = [

    {
        colName: 'account_name',
        title: 'Account Name',
        sort: true,
        filter: true,
    },
    {
        colName: 'current_balance',
        title: 'Available Amount',
        colType: 'CURRENCY',
        sort: true,
        filter: true
    },
    {
        colName: 'updated_at',
        title: 'Last Updated on',
        colType: 'DATE',
        sort: true,
        filter: true
    },

]
export const ACCOUNT_DATA_FORM: formBuilderData[] = [
    {
        colName: 'category',
        title: 'Account Type',
        type: 'select',
        apiTblName: 'account_category',
        selectKeyName: 'account_categoryName',
        selectPrimaryKey: 'id',
        event: { name: 'change', isCallback: true }

        // event: { name: 'change', apiTblName: 'account_scheme', valueAssign: 'account_scheme_fk_id' }
    },

    {
        colName: 'category_promotionaloffice',
        title: 'category',
        type: 'select',
        defaultValue: 4,
        selectKeyName: 'transactionTypeName', selectPrimaryKey: 'value',
        data: [
            { transactionTypeName: 'Church Ministry Area', value: '4', },
        ],
        event: { name: 'change', isCallback: true }

    },
    {
        colName: 'category_staff',
        title: 'category',
        type: 'select',
        selectKeyName: 'transactionName', selectPrimaryKey: 'value',
        data: [
            { transactionName: 'Staff', value: '6', },
            { transactionName: 'Volunteer', value: '7', },

        ],
        event: { name: 'change', isCallback: true }

    },

]
export const ACCOUNT_EMI_FORM: formBuilderData[] = [
    {
        colName: 'category_promotionaloffice',
        title: 'category',
        type: 'select',
        defaultValue: 4,
        hidden: true,
        selectKeyName: 'transactionTypeName', selectPrimaryKey: 'value',
        data: [
            { transactionTypeName: 'Church Ministry Area', value: '4', },
        ],
        event: { name: 'change', isCallback: true }
    },
    {
        colName: 'category_staff',
        title: 'category',
        type: 'select',
        hidden: true,
        selectKeyName: 'transactionName', selectPrimaryKey: 'value',
        data: [
            { transactionName: 'Staff', value: '6', },
            { transactionName: 'Volunteer', value: '7', },

        ],
        event: { name: 'change', isCallback: true }

    },
    {
        colName: 'account_scheme_fk_id',
        title: 'Scheme',
        // selectKeyName: 'account_schemeName',
        // type: 'select',
        // event: { name: 'change', isCallback: true }
    },
    {
        colName: 'scheme_amount',
        title: 'Scheme Amount',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
    },
    {
        colName: 'emi_amount',
        title: 'EMI Amount',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
    },
    {
        colName: 'monthlyAmount',
        title: 'Monthly Amount',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
    },
    {
        colName: 'no_of_month',
        title: 'No of Month',
        validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }],
        event: { name: 'change', isCallback: true },
        visible: false
    },
    {
        colName: 'scheduled_from_date',
        title: 'Start date',
        dateFormat: 'mm/yy',
        dateViewMode: 'month',
        type: 'DATE',
        event: { name: 'change', isCallback: true },
        visible: false
    },
    {
        colName: 'scheduled_to_date',
        title: 'End date',
        dateFormat: 'mm/yy',
        type: 'DATE',
        readonly: true,
        visible: false
    },
    {
        colName: 'account_remarks',
        title: 'Remarks',
        visible: false
    },
    {
        colName: 'status',
        title: 'Status',
        hidden: true,
        colType: 'DROPDOWN',
        filterCol: {
            type: 'DROPDOWN',
            selectKeyName: 'statusName',
            data: [
                { statusName: 'Active', key: 1, color: 'success' },
                { statusName: 'Closed', key: 3, color: 'danger' },
                { statusName: 'Hold', key: 2, color: 'warning' },
            ]
        }
    }
]


export const BANK_FORM: formBuilderData[] = [
    {
        colName: 'scheme_amount',
        title: 'Account Name',
        validator: [{ name: 'required' }],

        // validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
    },
    {
        colName: 'emi_amount',
        title: 'Account Number',
        validator: [{ name: 'required' }],

        // validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
    },
    {
        colName: 'monthlyAmount',
        title: 'Branch',
        validator: [{ name: 'required' }],

        // validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
    },
    {
        colName: 'ifsc_code',
        title: 'IFSC Code',
        // validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }],
        validator: [{ name: 'required' }],
        event: { name: 'change', isCallback: true },
        visible: false
    },
    {
        colName: 'account_remarks',
        title: 'UPI Number',
        visible: false
    },

]