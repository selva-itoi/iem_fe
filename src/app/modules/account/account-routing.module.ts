import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { AccountSettlementListComponent } from './component/account-settlement-list/account-settlement-list.component';
import { PermissionGuard } from 'src/app/helper/guard/permission.guard';
import { NewAccountSettlementComponent } from './component/new-account-settlement/new-account-settlement.component';
import { NewAccountComponent } from './component/new-account/new-account.component';
import { AccountListComponent } from './component/account-list/account-list.component';
import { AccountInfoComponent } from './component/account-info/account-info.component';
import { TransactionListComponent } from './component/transaction-list/transaction-list.component';
import { NewTransactionComponent } from './component/new-transaction/new-transaction.component';
import { AccountSettlementInfoComponent } from './component/account-settlement-info/account-settlement-info.component';
import { BalanceSheetListComponent } from './component/balance-sheet-list/balance-sheet-list.component';
import { BalanceSheetInfoComponent } from './component/balance-sheet-info/balance-sheet-info.component';
import { AccountReportComponent } from './account-report/account-report.component';

const routes: Routes = [
  {
    path: UrlServices.PAGE_URL.ACCOUNT.LIST.URL.split(/[/]+/).pop(),
    component: AccountSettlementListComponent,
    data: {
      title: 'Settlement List',
      permission: UrlServices.PAGE_URL.ACCOUNT.LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.ACCOUNT.ADD.URL.split(/[/]+/).pop(),
    component: NewAccountSettlementComponent,
    data: {
      title: 'New Settlement',
      permission: UrlServices.PAGE_URL.ACCOUNT.ADD.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.ACCOUNT.NEW_ACCOUNT.URL.split(/[/]+/).pop(),
    component: NewAccountComponent,
    data: {
      title: 'New Account',
      permission: UrlServices.PAGE_URL.ACCOUNT.NEW_ACCOUNT.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.ACCOUNT.ACCOUNT_LIST.URL.split(/[/]+/).pop(),
    component: AccountListComponent,
    data: {
      title: 'Payroll Account List',
      permission: UrlServices.PAGE_URL.ACCOUNT.ACCOUNT_LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.ACCOUNT.ACCOUNT_VIEW.URL.split(/[/]+/).pop(),
    component: AccountInfoComponent,
    data: {
      title: 'Account Info',
      permission: UrlServices.PAGE_URL.ACCOUNT.ACCOUNT_VIEW.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.ACCOUNT.TRANSACTION_LIST.URL.split(/[/]+/).pop(),
    component: TransactionListComponent,
    data: {
      title: 'Transaction List',
      permission: UrlServices.PAGE_URL.ACCOUNT.TRANSACTION_LIST.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.ACCOUNT.NEW_TRANSACTION.URL.split(/[/]+/).pop(),
    component: NewTransactionComponent,
    data: {
      title: 'New Transaction',
      permission: UrlServices.PAGE_URL.ACCOUNT.NEW_TRANSACTION.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.ACCOUNT.SETTLEMENT_VIEW.URL.split(/[/]+/).pop(),
    component: AccountSettlementInfoComponent,
    data: {
      title: 'Settlement Info',
      permission: UrlServices.PAGE_URL.ACCOUNT.SETTLEMENT_VIEW.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.ACCOUNT.BALANCE_VIEW.URL.split(/[/]+/).pop(),
    component: BalanceSheetListComponent,
    data: {
      title: 'Settlement Info',
      permission: UrlServices.PAGE_URL.ACCOUNT.BALANCE_VIEW.permission
    },
    canActivate: [PermissionGuard],
  }, 
  {
    path: UrlServices.PAGE_URL.ACCOUNT.BALANCE_SHEET_VIEW.URL.split(/[/]+/).pop(),
    component: BalanceSheetInfoComponent,
    data: {
      title: 'Settlement Info',
      permission: UrlServices.PAGE_URL.ACCOUNT.BALANCE_SHEET_VIEW.permission
    },
    canActivate: [PermissionGuard],
  },
  {
    path: UrlServices.PAGE_URL.ACCOUNT.REPORT.URL.split(/[/]+/).pop(),
    component: AccountReportComponent,
    data: {
      title: 'Report',
      permission: UrlServices.PAGE_URL.ACCOUNT.REPORT.permission
    },
    canActivate: [PermissionGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
