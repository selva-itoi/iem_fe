import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountSettlementListComponent } from './component/account-settlement-list/account-settlement-list.component';
import { NewAccountSettlementComponent } from './component/new-account-settlement/new-account-settlement.component';
import { FormHelperModule } from 'src/app/shared/form/form-hepler.module';
import { FeatureModalModule } from 'src/app/shared/feature-modal/feature-modal.module';
import { NewAccountComponent } from './component/new-account/new-account.component';
import { AccountListComponent } from './component/account-list/account-list.component';
import { AccountInfoComponent } from './component/account-info/account-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionRefComponent } from './component/transaction-ref/transaction-ref.component';
import { TransactionListComponent } from './component/transaction-list/transaction-list.component';
import { NewTransactionComponent } from './component/new-transaction/new-transaction.component';
import { AccountSettlementInfoComponent } from './component/account-settlement-info/account-settlement-info.component';
import { BalanceSheetInfoComponent } from './component/balance-sheet-info/balance-sheet-info.component';
import { BalanceSheetListComponent } from './component/balance-sheet-list/balance-sheet-list.component';
import { AccountReportComponent } from './account-report/account-report.component';
import { TableModule } from 'primeng/table';
import { SponsorModule } from '../sponsor/sponsor.module';


@NgModule({
  declarations: [
    AccountSettlementListComponent,
    NewAccountSettlementComponent,
    NewAccountComponent,
    AccountListComponent,
    AccountInfoComponent,
    TransactionRefComponent,
    TransactionListComponent,
    NewTransactionComponent,
    AccountSettlementInfoComponent,
    BalanceSheetListComponent,
    BalanceSheetInfoComponent,
    AccountReportComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormHelperModule,
    FeatureModalModule,
    ReactiveFormsModule,
    TableModule,
    SponsorModule
  ]
})
export class AccountModule { }
