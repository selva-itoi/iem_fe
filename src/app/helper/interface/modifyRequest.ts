import { Concrete, modulInterface } from "./user";

export interface modifyRequest {
    title?: string;
    label?: string;
    type?: Concrete<modulInterface>;
    ref?: string | number;
    data: modifyData[];
}
export interface modifyData {
    label?: string;
    hide?: boolean;
    type?: "TEXT" | "TABLE";
    content?: string;
    tableData?: modifyData[]
}

export interface modifyApi {
    id?: number;
    ref_id: string | number,
    created_by: string | number
    action_id: number,
    module_id: number,
    state_office?: number,
    zone?: number,
    home?: number,
    region?: number,
    trust?: number,
    ad_office?: number,
    promotional_office?: number,
    sponsor_fk_id?: any,
    sponsorship_module?: number,
    child_type?: number,
    department?: number,
    institution?: number,
    request_data: any;
    source_data: any;
    status: number;
    title?: string;
    description?: string;
    result_description?: string;
    action_date?: any;
    action_by?: string | number
}
export declare interface onModification {
    apiPayloadModify:any
    checkSegmentStatus :any
}