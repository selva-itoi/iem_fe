import { Component, OnInit } from '@angular/core';
import { AccountApiService } from '../../service/account-api.service';
import { tableBuilder, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { ActivatedRoute } from '@angular/router';
import { SETTLEMENT_TBL, SETTLEMENT_VIEW_TBL } from '../../helper/account-form';
import { cloneData } from 'src/app/helper/class/utilityHelper';

@Component({
  selector: 'app-balance-sheet-info',
  templateUrl: './balance-sheet-info.component.html',
  styleUrls: ['./balance-sheet-info.component.scss']
})
export class BalanceSheetInfoComponent implements OnInit {

  constructor(private accountApi: AccountApiService, private activateRoute: ActivatedRoute) { }
  id: any
  INCOMEAMOUNT_COL: tableColum[] = cloneData(SETTLEMENT_TBL)

  IncomeAmount: tableBuilder = {
    name: 'Amount Settlement List',
    column: this.INCOMEAMOUNT_COL,
    action: [],
    showFilter: true,
    isLazy: false,
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.queryParams['id']
  }
  getAccountData = async (e: tblFilterQuery): Promise<any> => {

    return this.accountApi.gettransationdetails(this.id).then(async (res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        await res.result?.map((a: any) => {
        })
      }
      return res.result
    })
  }
}
