import { page, userPermission } from "../interface/user";
export const ACTION = {
    LIST: 'list',
    ADD: 'new',
    VIEW: 'view'
}
export class UrlServices {
    constructor() { }
    public static DASHBOARD_ROUTE = 'dashboard';
    public static ACCESS_DENIED_ROUTE = 'access_denied';
    public static AUTH_PAGE = {
        //USER_ROUTE :
        LOGIN_URL: '/' + 'login',
        FORGOT_PASSWORD_URL: '/' + 'forgotPassword',
        RESET_PASSWORD_URL: '/' + 'reset',
        LOGOUT_URL: '/' + 'logout',
        ACTIVATE: '/' + 'activate'
    }
    public static PAGE_URL: page = {
        EMAIL: {
            LIST: {
                URL: '/email' + '/' + ACTION.LIST,
                permission: {} as userPermission,
            },
            ADD: {
                URL: '/email' + '/' + ACTION.ADD,
                permission: {} as userPermission,
            },
            VIEW: {
                URL: '/email' + '/' + ACTION.VIEW,
                permission: {} as userPermission,
            }
        },
        USER: {
            LIST: {
                URL: '/user' + '/' + ACTION.LIST,
                permission: { moduleName: 'USER', actionName: 'VIEW_ALL' },
            },
            ADD: {
                URL: '/user' + '/' + ACTION.ADD,
                permission: { moduleName: 'USER', actionName: 'ADD' }
            },
            VIEW: {
                URL: '/user' + '/' + ACTION.VIEW,
                permission: { moduleName: 'USER', actionName: 'READ' }
            },
            ROLE: {
                URL: '/user' + '/roles-list',
                permission: { moduleName: 'USER', actionName: 'MANAGE_ROLE' }
            },
            VOLUNTER_LIST: {
                URL: '/user' + '/volunter-list',
                permission: { moduleName: 'USER', actionName: 'MANAGE_ROLE' }
            },
            NEW_VOLUNTER: {
                URL: '/user' + '/volunter-new',
                permission: { moduleName: 'USER', actionName: 'ADD' }
            },
            VIEW_VOLUNTER: {
                URL: '/user' + '/volunter-view',
                permission: { moduleName: 'USER', actionName: 'VIEW_ALL' }
            },
            RECEIPT_LIST: {
                URL: '/user' + '/receipt-list',
                permission: { moduleName: 'USER', actionName: 'VIEW_ALL' }
            },
            NEW_RECEIPT: {
                URL: '/user' + '/receipt-new',
                permission: { moduleName: 'USER', actionName: 'ADD' }
            },
            RECEIPT_INFO: {
                URL: '/user' + '/receipt-info',
                permission: { moduleName: 'USER', actionName: 'VIEW_ALL' }
            },
            RECEIPT_DATA: {
                URL: '/user' + '/receipt-data',
                permission: { moduleName: 'USER', actionName: 'VIEW_ALL' }
            },
            VOLUNTER_STATS: {
                URL: '/user' + '/volunter-stats',
                permission: { moduleName: 'USER', actionName: 'VIEW_ALL' }
            },

        },
        MASTER: {
            ADDRESS: {
                URL: '/master' + '/location',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_LOCATION' }
            },
            OFFICE: {
                URL: '/master' + '/office',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_OFFICE' }
            },
            GENERAL: {
                URL: '/master' + '/general',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_OFFICE' }
            },
            HOMES: {
                URL: '/master' + '/homes',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_HOMES' }
            },
            EMAIL: {
                URL: '/master' + '/email',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_OFFICE' }
            },
            UPDATE_HOMES: {
                URL: '/master' + '/update-homes',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_EMAIL_TEMPLATES' }
            },
            VIEW_HOMES: {
                URL: '/master' + '/view-homes',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_EMAIL_TEMPLATES' }
            },
            UPDATE_EMAIL: {
                URL: '/master' + '/update-email',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_OFFICE' }
            },
            UPDATE_FORMS: {
                URL: '/master' + '/update-forms',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_EMAIL_TEMPLATES' }
            },
            FORMS: {
                URL: '/master' + '/forms',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_EMAIL_TEMPLATES' }
            },
            MOBILE: {
                URL: '/master' + '/mobile-app',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_EMAIL_TEMPLATES' }
            },
            PAYROLE: {
                URL: '/master' + '/payrole',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_PAYROLL' }
            },
            MAGAZINE: {
                URL: '/master' + '/magazine',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_EMAIL_TEMPLATES' }
            },
            PROMOTIONAL_OFFICE: {
                URL: '/master' + '/promotionaloffice',
                permission: { moduleName: 'MASTER', actionName: 'MANAGE_HOMES' }
            },
        },
        STAFF: {
            LIST: {
                URL: '/staff' + '/' + ACTION.LIST,
                permission: { moduleName: 'STAFF', actionName: 'VIEW_ALL' }
            },
            ADD: {
                URL: '/staff' + '/' + ACTION.ADD,
                permission: { moduleName: 'STAFF', actionName: 'ADD' }
            },
            VIEW: {
                URL: '/staff' + '/' + ACTION.VIEW,
                permission: { moduleName: 'STAFF', actionName: 'READ' }
            },
            TRANSFER_LIST: {
                URL: '/staff' + '/' + 'transfer-list',
                permission: { moduleName: 'STAFF_TRANSFER', actionName: 'VIEW_ALL' }
            },
            TRANSFER_ADD: {
                URL: '/staff' + '/' + 'new-transfer',
                permission: { moduleName: 'STAFF_TRANSFER', actionName: 'ADD' }
            },
            DEDICATION_LIST: {
                URL: '/staff' + '/' + 'dedication',
                permission: { moduleName: 'DEDICATION', actionName: 'VIEW_ALL' }
            },
            DEDICATION_ADD: {
                URL: '/staff' + '/' + 'new-dedication',
                permission: { moduleName: 'DEDICATION', actionName: 'ADD' }
            },
            REPORT_LIST: {
                URL: '/staff' + '/' + 'viewAll_report',
                permission: { moduleName: 'STAFF', actionName: 'VIEW_ALL' }
            },
            REPORT_ADD: {
                URL: '/staff' + '/' + 'modify_report',
                permission: { moduleName: 'STAFF', actionName: 'ADD' }
            },
            REPORT_STATS: {
                URL: '/staff' + '/' + 'modify_report_stats',
                permission: { moduleName: 'STAFF', actionName: 'PROCESS' }
            },
            PROGRESS_REPORT_LIST: {
                URL: '/staff' + '/' + 'progress' + ACTION.LIST,
                permission: { moduleName: 'STAFF', actionName: 'ADD' }
            },
            NEW_PROGRESS_REPORT: {
                URL: '/staff' + '/' + 'progress' + ACTION.ADD,
                permission: { moduleName: 'STAFF', actionName: 'ADD' }
            },
            PROGRESS_REPORT_INFO: {
                URL: '/staff' + '/' + 'progress' + ACTION.VIEW,
                permission: { moduleName: 'STAFF', actionName: 'ADD' }
            },
            NEW_GOALS_REPORT: {
                URL: '/staff' + '/' + 'goals' + ACTION.ADD,
                permission: { moduleName: 'STAFF', actionName: 'ADD' }
            },
            GOALS_REPORT_LIST: {
                URL: '/staff' + '/' + 'goals' + ACTION.LIST,
                permission: { moduleName: 'STAFF', actionName: 'ADD' }
            },
            STATISTICS_REPORT: {
                URL: '/staff' + '/' + 'statistics' + ACTION.LIST,
                permission: { moduleName: 'STAFF', actionName: 'ADD' }
            },
            FIELD_GOAL: {
                URL: '/staff' + '/' + 'fieldnewgoals' + ACTION.LIST,
                permission: { moduleName: 'STAFF', actionName: 'ADD' }
            },
            FIELD_GOAL_LIST: {
                URL: '/staff' + '/' + 'fieldgoalslist' + ACTION.LIST,
                permission: { moduleName: 'STAFF', actionName: 'ADD' }
            },
        },

        SPONSOR: {
            LIST: {
                URL: '/sponsor' + '/' + ACTION.LIST,
                permission: { moduleName: 'SPONSOR', actionName: 'VIEW_ALL' }
            },
            ADD: {
                URL: '/sponsor' + '/' + ACTION.ADD,
                permission: { moduleName: 'SPONSOR', actionName: 'ADD' }
            },
            VIEW: {
                URL: '/sponsor' + '/' + ACTION.VIEW,
                permission: { moduleName: 'SPONSOR', actionName: 'READ' }
            },
            SPONSORSHIP_ADD: {
                URL: '/sponsor' + '/update',
                permission: { moduleName: 'SPONSORSHIP', actionName: 'ADD' }
            },
            SPONSORSHIP: {
                URL: '/sponsor' + '/sponsorship',
                permission: { moduleName: 'SPONSORSHIP', actionName: 'VIEW_ALL' }
            },
            SPONSORSHIP_ALLOTMENT: {
                URL: '/sponsor' + '/sponsorship_allotment',
                permission: { moduleName: 'SPONSORSHIP', actionName: 'ALLOTMENT' }
            },
            SPONSOR_GIFT: {
                URL: '/sponsor' + '/gift_view_All',
                permission: { moduleName: 'SPONSOR_GIFT', actionName: 'VIEW_ALL' }
            },
            SPONSOR_GIFT_ADD: {
                URL: '/sponsor' + '/gift_add',
                permission: { moduleName: 'SPONSOR_GIFT', actionName: 'ADD' }
            },
            DONATION_LIST: {
                URL: '/sponsor' + '/donation-list',
                permission: { moduleName: 'DONATION', actionName: 'VIEW_ALL' }
            },
            NEW_DONATION: {
                URL: '/sponsor' + '/new-donation',
                permission: { moduleName: 'DONATION', actionName: 'ADD' }
            },
            ASSIGN_INFO: {
                URL: '/sponsor' + '/assign-info',
                permission: { moduleName: 'DONATION_ALLOTMENT', actionName: 'ADD' }
            },
            MAGAZINE_LIST: {
                URL: '/sponsor' + '/magazine' + ACTION.LIST,
                permission: { moduleName: 'SPONSOR', actionName: 'READ' }
            },
            NEW_MAGAZINE: {
                URL: '/sponsor' + '/magazine' + ACTION.ADD,
                permission: { moduleName: 'SPONSOR', actionName: 'READ' }
            },
        },
        DONATION: {
            CAMPAIGN_LIST: {
                URL: '/donation' + '/campaign-list',
                permission: {} as userPermission
            },
            NEW_CAMPAIGN: {
                URL: '/donation' + '/new-campaign',
                permission: {} as userPermission
            },
            DONATION_ALLOTMENT_LIST: {
                URL: '/donation' + '/donation-allotment',
                permission: {} as userPermission
            },
            TOP_LIST: {
                URL: '/donation' + '/top-list',
                permission: {} as userPermission
            }
        },
        CHILD: {
            LIST: {
                URL: '/child' + '/' + ACTION.LIST,
                permission: { moduleName: 'CHILD', actionName: 'VIEW_ALL' }
            },
            ADD: {
                URL: '/child' + '/' + ACTION.ADD,
                permission: { moduleName: 'CHILD', actionName: 'ADD' }
            },
            VIEW: {
                URL: '/child' + '/' + ACTION.VIEW,
                permission: { moduleName: 'CHILD', actionName: 'READ' }
            },
            REPORT_LIST: {
                URL: '/child' + '/' + 'viewAll_report',
                permission: { moduleName: 'MONTHLY_REPORT_CHILD', actionName: 'VIEW_ALL' }
            },
            REPORT_ADD: {
                URL: '/child' + '/' + 'add_report',
                permission: { moduleName: 'MONTHLY_REPORT_CHILD', actionName: 'ADD' }
            },
            EDU_YEARLY_UPDATE_LIST: {
                URL: '/child' + '/' + 'education-yearly-update',
                permission: { moduleName: 'CHILD_EDUCATION', actionName: 'VIEW_ALL' }
            },
        },
        CHURCH: {
            LIST: {
                URL: '/church' + '/' + ACTION.LIST,
                permission: { moduleName: 'CHURCH', actionName: 'VIEW_ALL' }
            },
            ADD: {
                URL: '/church' + '/' + ACTION.ADD,
                permission: { moduleName: 'CHURCH', actionName: 'ADD' }
            },
            VIEW: {
                URL: '/church' + '/' + ACTION.VIEW,
                permission: { moduleName: 'CHURCH', actionName: 'READ' }
            },
            REPORT_LIST: {
                URL: '/church' + '/' + 'viewAll_report',
                permission: { moduleName: 'SIX_MONTH_CHURCH_REPORT', actionName: 'VIEW_ALL' }
            },
            REPORT_ADD: {
                URL: '/church' + '/' + 'add_report',
                permission: { moduleName: 'SIX_MONTH_CHURCH_REPORT', actionName: 'ADD' }
            },
            MEMBER_ADD: {
                URL: '/church' + '/' + 'add_member',
                permission: { moduleName: 'CHURCH_MEMBER', actionName: 'ADD' }
            },
            MEMBER_LIST: {
                URL: '/church' + '/' + 'add_viewAll',
                permission: { moduleName: 'CHURCH_MEMBER', actionName: 'VIEW_ALL' }
            },
            CHURCH_COLLECTION: {
                URL: '/church' + '/' + 'collection',
                permission: { moduleName: 'DONATION_ALLOTMENT', actionName: 'VIEW_ALL', sponsorship_module: ['3'] }
            },
            CHURCH_COLLECTION_VIEW: {
                URL: '/church' + '/' + 'collection' + ACTION.VIEW,
                permission: { moduleName: 'DONATION_ALLOTMENT', actionName: 'VIEW_ALL', sponsorship_module: ['3'] }
            },
            PROGRESS_REPORT_LIST: {
                URL: '/church' + '/' + 'progress' + ACTION.LIST,
                permission: { moduleName: 'CHURCH_PROGRESS', actionName: 'VIEW_ALL' }
            },
            NEW_PROGRESS_REPORT: {
                URL: '/church' + '/' + 'progress' + ACTION.ADD,
                permission: { moduleName: 'CHURCH_PROGRESS', actionName: 'ADD' }
            },
            PROGRESS_REPORT_VIEW: {
                URL: '/church' + '/' + 'progress' + ACTION.VIEW,
                permission: { moduleName: 'CHURCH_PROGRESS', actionName: 'ADD' }
            },
        },

        REPORT: {
            STAFF_FLAT_REPORT: {
                URL: '/report' + '/getAll',
                permission: { moduleName: 'STAFF', actionName: 'FLAT_REPORT' }
            },
            CHILD_FLAT_REPORT: {
                URL: '/report' + '/getAll',
                permission: { moduleName: 'CHILD', actionName: 'FLAT_REPORT' }
            },
            SPONSOR_FLAT_REPORT: {
                URL: '/report' + '/getAll',
                permission: { moduleName: 'SPONSOR', actionName: 'FLAT_REPORT' }
            },
            CHURCH_FLAT_REPORT: {
                URL: '/report' + '/getAll',
                permission: { moduleName: 'CHURCH', actionName: 'FLAT_REPORT' }
            },
            MEMEBER_FLAT_REPORT: {
                URL: '/report' + '/getAll',
                permission: { moduleName: 'CHURCH_MEMBER', actionName: 'FLAT_REPORT' }
            },
        },

        ACCOUNT: {
            LIST: {
                URL: '/account' + '/settlement' + ACTION.LIST,
                permission: {moduleName: 'ACCOUNT', actionName: 'VIEW_ALL'} as userPermission
            },
            ADD: {
                URL: '/account' + '/settlement' + ACTION.ADD,
                permission: {moduleName: 'ACCOUNT', actionName: 'ADD'} as userPermission
            },
            NEW_ACCOUNT: {
                URL: '/account' + '/account' + ACTION.ADD,
                permission: {moduleName: 'ACCOUNT', actionName: 'ADD'} as userPermission
            },
            ACCOUNT_STATEMENT_GENERATOR: {
                URL: '/payrole' + '/accountstatement' + ACTION.ADD,
                permission: {moduleName: 'ACCOUNT', actionName: 'READ'} as userPermission
            },
            ACCOUNT_LIST: {
                URL: '/account' + '/account' + ACTION.LIST,
                permission: {moduleName: 'ACCOUNT', actionName: 'VIEW_ALL'} as userPermission
            },
            ACCOUNT_VIEW: {
                URL: '/account' + '/account' + ACTION.VIEW,
                permission: {moduleName: 'ACCOUNT', actionName: 'VIEW_ALL'} as userPermission
            },
            TRANSACTION_LIST: {
                URL: '/account' + '/transaction' + ACTION.LIST,
                permission: {moduleName: 'ACCOUNT', actionName: 'VIEW_ALL'} as userPermission },
            NEW_TRANSACTION: {
                URL: '/account' + '/transaction' + ACTION.ADD,
                permission: {moduleName: 'ACCOUNT', actionName: 'ADD'} as userPermission
            },
            SETTLEMENT_VIEW: {
                URL: '/account' + '/settlement' + ACTION.VIEW,
                permission: {moduleName: 'ACCOUNT', actionName: 'VIEW_ALL'} as userPermission
            },
            BALANCE_VIEW: {
                URL: '/account' + '/balance' + ACTION.VIEW,
                permission: {moduleName: 'ACCOUNT', actionName: 'VIEW_ALL'} as userPermission
            },
            BALANCE_SHEET_VIEW: {
                URL: '/account' + '/balancesheet' + ACTION.VIEW,
                permission: {moduleName: 'ACCOUNT', actionName: 'VIEW_ALL'} as userPermission
            },
            REPORT:{
                URL: '/account' + '/report' + ACTION.VIEW,
                permission: {moduleName: 'ACCOUNT', actionName: 'VIEW_ALL'} as userPermission

            }
        },

    }
}