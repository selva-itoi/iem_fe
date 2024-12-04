import { VALIDATOR_PATTERNS } from "src/app/helper/class/app-constant";
import { formBuilderData, tableColum } from "src/app/helper/interface/response";

export const CAMPAIGN_LIST_FORM: tableColum[] = [
    {
        colName: 'campaign_programName',
        title: 'Program Name',
        filter: true
    },
    {
        colName: 'camapign_code',
        title: 'Campaign Code',
        filter: true
    },
    {
        colName: 'goal_amount',
        title: 'Goal Amount',
        filter: true
    },
    {
        colName: 'raised_amount',
        title: 'Raised Amount',
        filter: true
    },
    {
        colName: 'statusName',
        title: 'Status',
        filter: true
    }
]
export const NEW_CAMPAIGN_FORM: formBuilderData[] = [
    {
        colName: 'campaign_programName',
        title: 'Program Name',
        validator: [{ name: 'required' }]
    },
    {
        colName: 'goal_amount',
        title: 'Goal Amount',
        validator: [{ name: 'required' },{name:'pattern',funValue:VALIDATOR_PATTERNS.NUMBER_FLOAT}]
    },
    {
        colName: 'raised_amount',
        title: 'Raised Amount',
        validator: [{ name: 'required' },{name:'pattern',funValue:VALIDATOR_PATTERNS.NUMBER_FLOAT}]
    },
    {
        colName: 'description',
        title: 'Description',
        validator: [{ name: 'required' }]
    },
    {
        colName: 'status',
        title: ' Status',
        type: 'select',
        data: [
            { statusName: 'Active', id: 1 },
            { statusName: 'Completed', id: 2 },
            { statusName: 'Closed', id: 3 }
        ],
        selectKeyName: 'statusName',
        selectPrimaryKey: 'id',
        validator: [{ name: 'required' }]
    }
]