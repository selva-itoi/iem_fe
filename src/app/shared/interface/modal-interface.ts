import { formBuilder, formDynamicValidator, whereField } from "src/app/helper/interface/response";

export declare type searchType = 'STAFF' | 'SPONSOR' | 'GENERAL' | 'CHILD' | 'CHURCH_MEMBER' | 'CHURCH' | 'ACCOUNT' | 'STAFF_PAYROLL' | 'VOLUNTEER';

export interface searchModal {
    type: searchType,
    title?: string,
    skipKey?: string
    skipData?: Array<string | number>,
    activeOnly?: boolean;
    filterShow?: boolean
    whereField?: whereField[] | []
}
export interface confirmModalData {
    message?: string,
    title?: string,
    info_message?: string,
    btnOK?: string,
    btnCancel?: string,
    formField?: formBuilder[],
    formValue?: any;
    type?: 'CONFIRM' | 'FORM';
    dynamicValidator?: formDynamicValidator[],
    isFormField?: boolean,
    disableClose?:boolean
}

export interface searchModalResult {
    avatarPic?: string,
    avatarTxt?: string,
    detail?: string | number;
    mutedText?: string | number;
    topEndText?: string;
    bottomEndText?: string;
    active: boolean;
}
