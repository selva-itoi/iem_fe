import { fileCompData } from "src/app/core/helper/core.data.interface";
import { userPermission } from "./user";

export class ResponseData {
    message?: string;
    statusCode?: number;
    result?: any;
}
class ApiFilter {
    keyName?: string;
    value: any;
    operation?: '==' | '>=' | '!=' | '>'
}

export interface formBuilder {
    validator?: Array<formValidator>;
    data?: Array<any>;
    apiTblName?: string;
    apiFunName?: string,
    apiParameter?: any;
    event?: formEvent;
    hidden?: boolean;
    type?: 'text' | 'DATE' | 'AUTOCOMPLETE' | 'CURRENCY' | 'select' | 'status' | 'chips' | 'editor' | 'FILE' | 'TEXTAREA' | 'radio' | 'checkbox' | 'MULTISELECT' | 'INFO' | 'DATETIME' | 'COLORPICKER',
    fileConfig?: fileCompData,
    apiFilter?: ApiFilter,
    readonly?: boolean;
    colName: string;
    title: string;
    title_case?: 'NONE'; // default title case
    col_size?: string | number;
    className?: string,
    dateRange?: any,
    dateFormat?: string
    appendData?: Array<any>,
    monthNavigator?: boolean, yearNavigator?: boolean
    selectionMode?: "range" | "multiple"
    icon_append?: icon_append
    placeholder?: string,
    selectKeyName?: string,
    selectPrimaryKey?: string
    apiCallDefaultParam?: string | number,
    apiCallDefault?: boolean,
    defaultValue?: any,
    valueKeyName?: string // to set view data
    invisible?: boolean;
    groupStart?: boolean;
    groupEnd?: boolean;
    groupTitle?: string;
    info?: string;
    controlAction?: controlAction;
    dateViewMode?: 'month' | 'year' | 'date';
    autoSearch?: autoSearch
    showTime?: boolean;
    showSeconds?: boolean;
    timeOnly?: boolean
    inline?: boolean
    minDate?: Date;
    maxDate?: Date;
}
interface autoSearch {
    avatarPic?: boolean,
    imageUrlsKey?: string
    titleKey?: string
    descriptionKey?: string
    bottomEndKey?: string,
    whereFiled?: tblFilter[],
    selectFieldKeys?: Array<string>
    separatorText?: string // to seperator
}
interface icon_append {
    category: 'APPEND' | 'PREPEND'
    text?: string
    icon?: string
}
export interface controlAction {
    operation: 'ADD' | 'SUBTRACT' | 'MULTIPLE' | 'DIVIDE'
    controls?: Array<string>
    info_text?: string
}
export interface formBuilderData extends tableColum, formBuilder {
}
export interface tableBuilder {
    column: tableColum[];
    action: tableButton[];
    name: string;
    addBtn?: boolean;
    isLazy?: boolean;
    showFilter?: boolean;
    globalFilter?: boolean;
    exportBtn?: boolean;
    noPagination?: boolean;
    virtualScroll?: boolean;
    virtualScrollItemSize?: number;
    rows?: number;
    scrollHeightPx?: number
}
export interface tableButton {
    name?: string,
    icon?: string,
    title?: string,
    class?: string,
    category?: 'BUTTON' | 'TEXT',
    type: tableAction,
    permission?: userPermission,
    condition?: tbl_condition[],
    iconClass?: string
}
export interface tbl_condition {
    key: string
    operation: string,
    value: any,
    join?: string
}
export declare type tableAction = 'ADD' | 'EDIT' | "PRINT" | 'DELETE' | 'VIEW' | 'INACTIVE' | 'ACTIVE' | 'EXPORT' | 'RELIVE' | 'ASSIGN' | 'APPROVE' | 'DOWNLOAD' | 'EMAIL';
export declare type modifyActionType = 'MODIFICATION_APPROVE' | 'MODIFICATION_SUBMIT' | 'MODIFICATION_REVIEW' | 'SUBMIT' | 'VIEW';
export interface tableColum {
    colName: string;
    colJoinName?: string;
    colJoinSeperator?: string;
    selectKeyName?: string;
    sort?: boolean;
    filter?: boolean;
    visible?: boolean,
    title: string;
    isPrimary?: boolean;
    icon_append?: icon_append,
    colType?: 'TEXT' | 'DATE' | 'CURRENCY' | 'IMAGE' | 'DATETIME' | 'STAFF_EMP_ID' | 'SPONSORID' | 'DROPDOWN' | 'CHILD_ID_BASIC' | 'CHILD_ID' | 'VIEW_INFO' | 'VIEW_TAG_INFO' | 'DONOR_ID';
    filterCol?: tableFilter
    isEditable?: boolean;
}

export interface tableFilter {
    type: 'DROPDOWN' | 'TEXT' | 'DATE'
    data?: Array<any>;
    dataArray?: Array<any>;
    apiName?: string,
    apiFunName?: string,
    selectPrimaryKey?: string
    value?: string;
    minDate?: Date,
    maxDate?: Date,
    monthNavigator?: boolean, yearNavigator?: boolean,
    dateViewMode?: 'month' | 'year' | 'date',
    yearRange?: Date | any
    placeholder?: string;
    selectKeyName?: string;
}
export interface formField extends tableFilter {
    label: string,
    isRequired: boolean,
    validator: Array<formValidator>;
    controlName: string
}
export interface formEvent {
    name: 'click' | 'change' | 'input',
    apiTblName?: string,
    isCallback?: boolean,
    valueAssign?: string; // input is not needed
    apiFunName?: string
    isSelfAssign?: boolean;
    funName?: string;
    addParams?: [{
        colName?: string
        constantValue?: any
    }
    ]
}
export interface formDynamicValidator {
    controlName: string,
    validatorControl: Array<string>,
    hideControl?: Array<string>,
    disableControl?:Array<string>;
    value: any,
    operation?: '==' | '>=' | '!=' | '>' | '<',
    validator?: formValidator[]
}
export interface formValidator {
    name: 'email' | 'required' | "pattern" | 'minLength' | 'maxLength' | 'min' | 'max' | 'async',
    funName?: string | number;
    //asynFun?: boolean;
    funValue?: RegExp | any;
    error?: string | null,
    conditional?: tbl_condition[],
    is_async?: boolean;
    errorKey?: string;
    skipAsync?: {
        key?: string,
        value?: any
    }
}

export interface tblFilter {
    colName: string,
    matchMode?: string,
    value: string | number | Array<any> | null
    operation?: 'AND' | 'OR' | 'IN'
}
export interface whereField extends tblFilter {

}
export interface tblSort {
    colName: string,
    sortOrder: string
}
export interface tblFilterQuery {
    page: number
    queryParams: tblFilter[]
    rows: number
    first?: boolean
    sort?: tblSort[]
    whereField?: tblFilter[]
}