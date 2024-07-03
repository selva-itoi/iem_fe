import { MODULE_NAME, PERMISSION } from "../class/app-constant";
import { menuData } from "./menu-interface";

export interface User {
    user_name: string;
    fname: string;
    lname: string;
    token: string;
    last_login_date: any;
    imageUrl?: String;
    mobile_no?: number;
    staff_id?: string | number;
    staff_fk_id?: string | number;
    user_id: string;
    sponsor_fk_id?: string;
    role?: role[]
    permission?: roleMap,
    staff?: any;
    settings? : settings
}

export interface settings {
    companyName: string;
    logo_src: string;
    logo_src_path?: string;
}
export interface role {
    department_id?: any;
    role_id?: any;
    region_id?: any;
    zone_id?: any;
    roleName?: string;
}
export type roleKey = keyof rolePermission; //'zone_id' | 'department_id' | 'region_id' | 'institution_id' | 'promotional_office';

export type modulInterface = typeof MODULE_NAME;
export type actionInterface = typeof PERMISSION;

export type Concrete<Type> = {
    //[Property in keyof Type]: Type[Property];
    [Property in keyof Type]: string;
};
export interface userPermission extends rolePermission {
    moduleName: Concrete<keyof modulInterface>
    actionName: Concrete<keyof actionInterface>
    roleName?: string
}
export interface rolePermission {
    zone?: Array<string>,
    department?: Array<string>,
    region?: Array<string>,
    institution?: Array<string>,
    promotional_office?: Array<string>,
    trust?: Array<string>,
    ad_office?: Array<string>,
    sponsorship_module?: Array<string>,
    home?: Array<string>,
    child_type?: Array<string>
    church?: Array<string>
    payroll_group_fk_id?: Array<string>
}
export interface dynamicObjectKey {
    [key: string]: any;
}
export interface dynamicRoleKey {
    [key: string]: any;
    permission: rolePermission
}
export interface roleMap {
    [key: string]: dynamicRoleKey;
}
export interface pageUrl extends menuData {
    URL: string
}
export interface page {
    [key: string]: pageUrlMaster;
}
interface pageUrlMaster {
    [key: string]: pageUrl;
}