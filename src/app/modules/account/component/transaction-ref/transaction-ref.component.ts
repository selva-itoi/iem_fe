import { Component, Input, OnInit } from '@angular/core';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { TRANSACTION_LIST_COL } from '../../helper/account-form';
import { AccountApiService } from '../../service/account-api.service';
import { ModalService } from 'src/app/shared/service/modal.service';

@Component({
  selector: 'app-transaction-ref',
  templateUrl: './transaction-ref.component.html',
  styleUrls: ['./transaction-ref.component.scss']
})
export class TransactionRefComponent implements OnInit {

  @Input() type: 'TRANSFER' | 'SETTLEMENT' = 'TRANSFER';
  @Input() globalWhere = []
  LIST_COL: tableColum[] = cloneData(TRANSACTION_LIST_COL)
  action: tableButton[] = [{ name: '', type: 'VIEW', class: 'btn-info', icon: 'icon-eye' }]
  tableConfig: tableBuilder = {
    name: 'Payroll List',
    column: this.LIST_COL,
    action: this.action,
    showFilter: true,
    isLazy: true
  }
  constructor(private accountApi: AccountApiService, private modalService: ModalService) { }

  ngOnInit(): void {
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = e.whereField ? [...this.globalWhere, ...e.whereField] : this.globalWhere;

  
    const api = this.type == 'SETTLEMENT' ? 'getListSettlement' : 'getListTransaction';
    return this.accountApi.gettransaction(e).then((res: any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        res?.result.data?.map((a: any) => {
          const s = a?.general_account_name ? `<span><strong>${a?.general_account_name || ''}</strong></span><br>` : ``;
          a.accont_text = `${s}<span><strong class="text-info" >${a?.general_account_code || ''}</strong></span>`
          let c:any;
          let d=a?.to_accountName
          if(a?.from_accountName){
            c=a?.from_accountName+" "+" "+" "+"->"
            // c=a?.from_accountName+" "+" "+ `<span>&nbsp;&nbsp;<img style="width: 30px;" src="assets/images/arrow_iem.png"></span>`

          }else{
            c=''
          }
          a.from_account = 
          `<table>
          <tr>
            <td style="color:red;"><strong>${c || ''}</strong></td>
            <td style="color:green;"><strong>${d || ''}</strong></td>
          </tr>
          <tr>
            <td style="color:red;"><strong>${a?.from_account_code || ''}</strong></td>
            <td style="color:green;"><strong>${a?.to_account_code || ''}</strong></td>
          </tr>
        </table>`
          // a.to_account = `<span><strong>${a?.to_accountName || ''}</strong></span><br><span><strong class="text-info" >${a?.to_account_code || ''}</strong></span>`
          return a
        })
      }
      return res
    })
  }

  tblAction = (id: string | number, type: tableAction, data: any): Promise<any> => {
    switch (type) {
      case 'APPROVE':
        // this.router.navigate([this.urlService.ACCOUNT.ADD.URL], { queryParams: { id: id } })
      case 'VIEW':
        this.modalService.openInfoModal({ sourceData: data, formData: this.LIST_COL }, 'modal-lg')
        break;

    }
    return Promise.resolve(true);
  }
}
