import { menu } from "../interface/menu-interface";
import { userPermission } from "../interface/user";
import { UrlServices } from "./url-services";

export const MENU_ITEMS: menu[] = [
    {
        title: 'Home',
        icon: 'icon-speedometer',
        link: UrlServices.DASHBOARD_ROUTE,
        data: { permission: {} as userPermission },
    },
    {
        title: 'User',
        icon: 'icon-speedometer',
        data: { permission: {} as userPermission },
        children: [
            {
                title: 'User',
                link: UrlServices.PAGE_URL.USER.LIST.URL,
                data: { permission: UrlServices.PAGE_URL.USER.LIST.permission },
            },
            {
                title: 'Role',
                link: UrlServices.PAGE_URL.USER.ROLE.URL,
                data: { permission: UrlServices.PAGE_URL.USER.ROLE.permission },
            },
            {
                title: 'Area Secretary',
                link: UrlServices.PAGE_URL.USER.VOLUNTER_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.USER.VOLUNTER_LIST.permission },
            },
            {
                title: 'Area Secretary Stats',
                link: UrlServices.PAGE_URL.USER.VOLUNTER_STATS.URL,
                data: { permission: UrlServices.PAGE_URL.USER.VOLUNTER_STATS.permission },
            },
            {
                title: 'Receipt Book',
                link: UrlServices.PAGE_URL.USER.RECEIPT_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.USER.RECEIPT_LIST.permission },
            },
        ]
    },
    {
        title: 'Master',
        icon: 'icon-speedometer',
        data: { permission: {} as userPermission },
        children: [
            {
                title: 'Location',
                link: UrlServices.PAGE_URL.MASTER.ADDRESS.URL,
                data: { permission: UrlServices.PAGE_URL.MASTER.ADDRESS.permission },
            },
            {
                title: 'Office',
                link: UrlServices.PAGE_URL.MASTER.OFFICE.URL,
                data: { permission: UrlServices.PAGE_URL.MASTER.OFFICE.permission },
            },
            {
                title: 'General',
                link: UrlServices.PAGE_URL.MASTER.GENERAL.URL,
                data: { permission: UrlServices.PAGE_URL.MASTER.OFFICE.permission },
            },
            {
                title: 'Email Templates',
                link: UrlServices.PAGE_URL.MASTER.EMAIL.URL,
                data: { permission: UrlServices.PAGE_URL.MASTER.OFFICE.permission },
            },
            {
                title: 'Homes',
                link: UrlServices.PAGE_URL.MASTER.HOMES.URL,
                data: { permission: UrlServices.PAGE_URL.MASTER.HOMES.permission },
            },
            {
                title: 'Application Form',
                link: UrlServices.PAGE_URL.MASTER.FORMS.URL,
                data: { permission: UrlServices.PAGE_URL.MASTER.FORMS.permission },
            },
            {
                title: 'Mobile App',
                link: UrlServices.PAGE_URL.MASTER.MOBILE.URL,
                data: { permission: UrlServices.PAGE_URL.MASTER.MOBILE.permission },
            },
            {
                title: 'Payroll',
                link: UrlServices.PAGE_URL.MASTER.PAYROLE.URL,
                data: { permission: UrlServices.PAGE_URL.MASTER.PAYROLE.permission },
            },
            {
                title: 'Magazine',
                link: UrlServices.PAGE_URL.MASTER.MAGAZINE.URL,
                data: { permission: UrlServices.PAGE_URL.MASTER.MAGAZINE.permission },
            },
        ]
    },
    {
        title: 'Child',
        icon: 'icon-speedometer',
        data: { permission: {} as userPermission },
        children: [
            {
                title: 'Child',
                link: UrlServices.PAGE_URL.CHILD.LIST.URL,
                data: { permission: UrlServices.PAGE_URL.CHILD.LIST.permission },
            },
            {
                title: 'Add Child',
                link: UrlServices.PAGE_URL.CHILD.ADD.URL,
                data: { permission: UrlServices.PAGE_URL.CHILD.ADD.permission },
            },
            {
                title: 'Report',
                link: UrlServices.PAGE_URL.CHILD.REPORT_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.CHILD.REPORT_LIST.permission },
            },
            {
                title: 'Add Report',
                link: UrlServices.PAGE_URL.CHILD.REPORT_ADD.URL,
                data: { permission: UrlServices.PAGE_URL.CHILD.REPORT_ADD.permission },
            },
            {
                title: 'Gift',
                link: UrlServices.PAGE_URL.SPONSOR.SPONSOR_GIFT.URL,
                data: { permission: UrlServices.PAGE_URL.SPONSOR.SPONSOR_GIFT.permission },
            },
            {
                title: 'New Gift',
                link: UrlServices.PAGE_URL.SPONSOR.SPONSOR_GIFT_ADD.URL,
                data: { permission: UrlServices.PAGE_URL.SPONSOR.SPONSOR_GIFT_ADD.permission },
            },
            {
                title: 'Yearly Edu Update',
                link: UrlServices.PAGE_URL.CHILD.EDU_YEARLY_UPDATE_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.CHILD.EDU_YEARLY_UPDATE_LIST.permission }
            }
        ]
    },
    {
        title: 'Staff',
        icon: 'icon-speedometer',
        data: { permission: {} as userPermission },
        children: [
            {
                title: 'Staff',
                link: UrlServices.PAGE_URL.STAFF.LIST.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.LIST.permission },
            },
            {
                title: 'New Staff',
                link: UrlServices.PAGE_URL.STAFF.ADD.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.ADD.permission },
            },
            {
                title: 'Staff Transfer',
                link: UrlServices.PAGE_URL.STAFF.TRANSFER_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.TRANSFER_LIST.permission },
            },
            {
                title: 'Sponser Letter',
                link: UrlServices.PAGE_URL.STAFF.REPORT_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.REPORT_LIST.permission },
            },
            {
                title: 'Add Sponser Letter',
                link: UrlServices.PAGE_URL.STAFF.REPORT_ADD.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.REPORT_ADD.permission },
            },
            {
                title: 'Reports Stats',
                link: UrlServices.PAGE_URL.STAFF.REPORT_STATS.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.REPORT_STATS.permission },
            },
            {
                title: 'Add Monthly Report',
                link: UrlServices.PAGE_URL.STAFF.NEW_PROGRESS_REPORT.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.NEW_PROGRESS_REPORT.permission },
            },
            {
                title: 'Monthly Report',
                link: UrlServices.PAGE_URL.STAFF.PROGRESS_REPORT_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.PROGRESS_REPORT_LIST.permission },
            },
            {
                title: 'yearly Report',
                link: UrlServices.PAGE_URL.STAFF.GOALS_REPORT_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.GOALS_REPORT_LIST.permission },
            },
            {
                title: 'Add yearly Report',
                link: UrlServices.PAGE_URL.STAFF.NEW_GOALS_REPORT.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.NEW_GOALS_REPORT.permission },
            },
            {
                title: 'Statistics Report',
                link: UrlServices.PAGE_URL.STAFF.STATISTICS_REPORT.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.NEW_GOALS_REPORT.permission },
            },
            // {
            //     title: 'Field-Goal',
            //     link: UrlServices.PAGE_URL.STAFF.FIELD_GOAL.URL,
            //     data: { permission: UrlServices.PAGE_URL.STAFF.FIELD_GOAL.permission },
            // },
            // {
            //     title: 'Field-Goal-list',
            //     link: UrlServices.PAGE_URL.STAFF.FIELD_GOAL_LIST.URL,
            //     data: { permission: UrlServices.PAGE_URL.STAFF.FIELD_GOAL_LIST.permission },
            // },
        ]
    },
    {
        title: 'Donor',
        icon: 'icon-speedometer',
        data: { permission: {} as userPermission },
        children: [
            {
                title: 'Donor',
                link: UrlServices.PAGE_URL.SPONSOR.LIST.URL,
                data: { permission: UrlServices.PAGE_URL.SPONSOR.LIST.permission },
            },
            {
                title: 'New Sponsorship',
                link: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP_ADD.URL,
                data: { permission: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP_ADD.permission },
            },

            {
                title: 'Sponsorship',
                link: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP.URL,
                data: { permission: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP.permission },
            },
            {
                title: 'Allotment',
                link: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP_ALLOTMENT.URL,
                data: { permission: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP_ALLOTMENT.permission },
            },
            {
                title: 'Add Dedication',
                link: UrlServices.PAGE_URL.STAFF.DEDICATION_ADD.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.DEDICATION_ADD.permission },
            },
            {
                title: 'Dedication List',
                link: UrlServices.PAGE_URL.STAFF.DEDICATION_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.STAFF.DEDICATION_LIST.permission },
            },
            // {
            //     title: 'Donation',
            //     link: UrlServices.PAGE_URL.SPONSOR.SPONSORSHIP_ADD.URL,
            //     // data: { permission: UrlServices.PAGE_URL.SPONSOR.DONATION_LIST.permission },
            // },
            {
                title: 'Donation',
                link: UrlServices.PAGE_URL.SPONSOR.DONATION_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.SPONSOR.DONATION_LIST.permission },
            },
            {
                title: 'Magazine',
                link: UrlServices.PAGE_URL.SPONSOR.MAGAZINE_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.SPONSOR.MAGAZINE_LIST.permission },
            },
            {
                title: 'Top List',
                link: UrlServices.PAGE_URL.DONATION.TOP_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.SPONSOR.DONATION_LIST.permission },
            },
        ]
    },
    {
        title: 'Church',
        icon: 'icon-speedometer',
        data: { permission: {} as userPermission },
        children: [
            {
                title: 'View Church',
                link: UrlServices.PAGE_URL.CHURCH.LIST.URL,
                data: { permission: UrlServices.PAGE_URL.CHURCH.LIST.permission },
            },
            {
                title: 'New Church',
                link: UrlServices.PAGE_URL.CHURCH.ADD.URL,
                data: { permission: UrlServices.PAGE_URL.CHURCH.ADD.permission },
            },
            {
                title: 'New Member',
                link: UrlServices.PAGE_URL.CHURCH.MEMBER_ADD.URL,
                data: { permission: UrlServices.PAGE_URL.CHURCH.MEMBER_ADD.permission },
            },
            {
                title: 'View Member',
                link: UrlServices.PAGE_URL.CHURCH.MEMBER_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.CHURCH.MEMBER_LIST.permission },
            },
            {
                title: 'View Report',
                link: UrlServices.PAGE_URL.CHURCH.REPORT_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.CHURCH.REPORT_LIST.permission },
            },
            {
                title: 'New Report',
                link: UrlServices.PAGE_URL.CHURCH.REPORT_ADD.URL,
                data: { permission: UrlServices.PAGE_URL.CHURCH.REPORT_ADD.permission },
            },
        ]
    },
    {
        title: 'Report',
        icon: 'icon-speedometer',
        data: { permission: {} as userPermission },
        children: [
            {
                title: 'Staff Report',
                link: UrlServices.PAGE_URL.REPORT.STAFF_FLAT_REPORT.URL,
                data: { permission: UrlServices.PAGE_URL.REPORT.STAFF_FLAT_REPORT.permission },
                queryParams: { id: 'staff' }
            },
            {
                title: 'Sponsor Report',
                link: UrlServices.PAGE_URL.REPORT.SPONSOR_FLAT_REPORT.URL,
                data: { permission: UrlServices.PAGE_URL.REPORT.SPONSOR_FLAT_REPORT.permission },
                queryParams: { id: 'sponsor' }
            },
            {
                title: 'Child Report',
                link: UrlServices.PAGE_URL.REPORT.CHILD_FLAT_REPORT.URL,
                data: { permission: UrlServices.PAGE_URL.REPORT.CHILD_FLAT_REPORT.permission },
                queryParams: { id: 'child' }
            },
            {
                title: 'Church Report',
                link: UrlServices.PAGE_URL.REPORT.CHURCH_FLAT_REPORT.URL,
                data: { permission: UrlServices.PAGE_URL.REPORT.CHURCH_FLAT_REPORT.permission },
                queryParams: { id: 'church' }
            },
            {
                title: 'Member Report',
                link: UrlServices.PAGE_URL.REPORT.MEMEBER_FLAT_REPORT.URL,
                data: { permission: UrlServices.PAGE_URL.REPORT.MEMEBER_FLAT_REPORT.permission },
                queryParams: { id: 'church_member' }
            },
        ],
    },
    // {
    //     title: 'Account',
    //     icon: 'icon-speedometer',
    //     data: { permission: { moduleName: 'ACCOUNT', actionName: 'VIEW_ALL' } as userPermission },
    //     children: [
    //         {
    //             title: 'Account',
    //             link: UrlServices.PAGE_URL.ACCOUNT.ACCOUNT_LIST.URL,
    //             data: { permission: UrlServices.PAGE_URL.ACCOUNT.ACCOUNT_LIST.permission },
    //         },
    //         {
    //             title: 'Settlement',
    //             link: UrlServices.PAGE_URL.ACCOUNT.LIST.URL,
    //         },
    //         {
    //             title: 'Transaction',
    //             link: UrlServices.PAGE_URL.ACCOUNT.TRANSACTION_LIST.URL,
    //         },
    //     ]
    // },
    {
        title: 'Account',
        icon: 'icon-speedometer',
        data: { permission: {} as userPermission },
        children: [
            {
                title: 'Account',
                link: UrlServices.PAGE_URL.ACCOUNT.ACCOUNT_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.ACCOUNT.ACCOUNT_LIST.permission },

            },
            {
                title: 'Settlement',
                link: UrlServices.PAGE_URL.ACCOUNT.LIST.URL,
                data: { permission: UrlServices.PAGE_URL.ACCOUNT.LIST.permission },

            },
            {
                title: 'Transaction',
                link: UrlServices.PAGE_URL.ACCOUNT.TRANSACTION_LIST.URL,
                data: { permission: UrlServices.PAGE_URL.ACCOUNT.TRANSACTION_LIST.permission },

            },
            {
                title: 'Balance Sheet',
                link: UrlServices.PAGE_URL.ACCOUNT.BALANCE_VIEW.URL,
                data: { permission: UrlServices.PAGE_URL.ACCOUNT.BALANCE_VIEW.permission },
            },
            {
                title: 'Report',
                link: UrlServices.PAGE_URL.ACCOUNT.REPORT.URL,
                data: { permission: UrlServices.PAGE_URL.ACCOUNT.REPORT.permission },
            },

        ]
    }

    // {
    //     title: 'Application',
    //     icon: 'icon-speedometer',
    //     data: { permission: {} as userPermission },
    //     children: [
    //         {
    //             title: 'View Application',
    //             link: UrlServices.PAGE_URL.APPLICATION.LIST.URL,
    //         },
    //         {
    //             title: 'New Application',
    //             link: UrlServices.PAGE_URL.APPLICATION.ADD.URL,
    //         },
    //     ]
    // }
    // {
    //     title: 'My Report',
    //     icon: 'icon-speedometer',
    //     data: { permission: {} as userPermission },
    //     link: UrlServices.PAGE_URL.STAFF.REPORT_LIST.URL,
    //     queryParams: { id: 'my_report' }
    // },
];