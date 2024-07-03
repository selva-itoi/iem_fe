
export class AppConstant {
    public static DATE_FORMAT = 'dd-mm-yy';
    public static TITLE = 'IEM';
    public static ORG_NAME = 'IEM';
    public static DEFAULT_LOGIN: 'OTP' | 'PASSWORD' | 'BOTH' = 'PASSWORD';
    static LOGO_SRC = 'assets/images/logo_iem.png';
    static DEFAULT_PROFILE_URL = 'assets/images/avatar.png';
    static DEFAULT_GROUP_IMAGE_URL = 'assets/images/grp-avatar.png';
    static MAX_IMAGE_UPLOAD_SIZE = 1000000; //1mb
    static MAX_FILE_UPLOAD_SIZE = 2000000; // 2mb
    static MAX_VIDEO_UPLOAD_SIZE = 5000000; //5mb
    static DEFAULT_PROFILE_IMAGE = 'assets/images/blank-profile-picture.png';
    static DEFAULT_GROUP_IMAGE = 'assets/images/blank-profile-picture.png';
    static DEFAULT_OLD_IMAGE_APPEND = '[~@!OLDIMAGE!@~]';
    static DEFAULT_DATE_RANGE = '1940:' + new Date().getFullYear().toString();
    static DEFAULT_FUTURE_DATE_RANGE = '1960:' + (new Date().getFullYear() + 5).toString();
    public static GENDER = [
        { id: 1, genderName: 'Male' },
        { id: 2, genderName: 'Female' },
    ];
    public static TABLE_PAGE_ROWS = 10;
}
export const VALIDATOR_PATTERNS = {
    EMAIL: /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/,
    MOBILE: /^[6-9]{1}[0-9]{9}$/,
    NUMBER: /^[0-9]+$/,
    POSITIVE_INTEGER: /\d+/,
    WHOLE_NUMBER: /^[1-9]\d*$/,
    NUMBER_FLOAT: /^[+-]?([0-9]*[.])?[0-9]+$/,
    TEXT: /^([a-zA-Z0-9+_+-]+\s)*[a-zA-Z0-9+_+-]+$/,
    TEXT_NOT_SPACE_IN_BETWEEN: /^(?=.{1,50}$)[a-zA-Z]+(?:['_.\\s][a-zA-Z]+)*$/,
    TEXT_ONLY: /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
    IFC_CODE: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    PINCODE: /^[1-9][0-9]{5}$/,
    AADHAR_VALIDATOR: /^[2-9]{1}[0-9]{3}[0-9]{8}$/,
    MUST_BE: function (s: number) { return new RegExp(`^.{${s}}$`) }
}
export const MODULE_NAME = {
    STAFF: 1,
    MASTER: 2,
    USER: 3,
    STAFF_TRANSFER: 4,
    SPONSOR: 5,
    SPONSORSHIP: 6,
    CHILD: 7,
    DEDICATION: 8,
    REPORTS: 9,
    MONTHLY_REPORT_STAFF: 10,
    MONTHLY_REPORT_CHILD: 11,
    SIX_MONTH_CHURCH_REPORT: 12,
    CHURCH: 13,
    SPONSOR_GIFT: 14,
    PAYMENT: 15,
    REPORT: 16,
    CHURCH_MEMBER: 17,
    CHILD_EDUCATION: 18,
    ASSET: 19,
    DONATION: 20,
    ACTIVITY: 29,
    CHURCH_PROGRESS: 22,
    DONATION_ALLOTMENT: 23,
    CAMPAIGN: 24,
    CAMPAIGN_PAYMENT: 25,
    ATTENDANCE: 26,
    HOLIDAY: 27,
    PAYROLL: 28,
    ACCOUNT: 21,
    LEAVE: 30,
    
}
export const SPONSORSHIP_MODULE = {
    STAFF: 1,
    CHILD: 2,
    CHURCH: 3,
}

export const PERMISSION = {
    ADD: 1,
    UPDATE: 2,
    DELETE: 3,
    READ: 4,
    VERIFY: 5,
    MANAGE_LOCATION: 6,
    MANAGE_OFFICE: 7,
    VIEW_ALL: 8,
    RELIVE: 9,
    MANAGE_ROLE: 10,
    ALLOTMENT: 11,
    PROCESS: 12,
    MANAGE_EMAIL_TEMPLATES: 13,
    MANAGE_HOMES: 14,
    VIEW_SPONSORSHIP: 15,
    FLAT_REPORT: 16,
    MANAGE_MK_CHILD: 17,
    MANAGE_HOME_CHILD: 18,
    MANAGE_COLLECTION: 19,
    APPROVE: 20,
    MANAGE_PAYROLL: 21
}
export const MODIFICATION_PERMISSION = {
    ADD: 1,
    UPDATE: 2,
    DELETE: 3,
    RELIVE: 4,
    MAKE_ACTIVE: 5,
    ALLOTMENT: 6,
}

export const RESPONSE_CODE = {
    SUCCESS: 200,
    VALIDATION_ERROR: 400,
    ERROR: 500,
    METHOD_ERROR: 405,
}
export const ALIVE_STATUS = [
    { id: 1, alive_statusName: 'Active', color: 'success' },
    { id: 2, alive_statusName: 'Died', color: 'danger' },
]
export const STATUS_CHILD = [
    { id: 1, childStatusName: 'Studying' },
    { id: 2, childStatusName: 'Not Studying' },
    { id: 3, childStatusName: 'Working' },
    { id: 4, childStatusName: 'Married' },
    { id: 5, childStatusName: 'Died' }
]
export const STATUS_TBL = {
    1: "Active",
    0: "In Active"
}