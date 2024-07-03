import { Component, OnInit, ViewChild } from '@angular/core';
import { ResponseData, formBuilderData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { ModalService } from 'src/app/shared/service/modal.service';
import { AccountApiService } from '../../service/account-api.service';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { FormControl } from '@angular/forms';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { ACCOUNT_SETTLEMENT_INCOME_LIST } from '../../helper/account-form';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { Router } from '@angular/router';
import { BalanceSheetInfoComponent } from '../balance-sheet-info/balance-sheet-info.component';

@Component({
  selector: 'app-balance-sheet-list',
  templateUrl: './balance-sheet-list.component.html',
  styleUrls: ['./balance-sheet-list.component.scss']
})
export class BalanceSheetListComponent implements OnInit {
  urlService = UrlServices.PAGE_URL
  pageInfo: any
  basicFormData: formBuilderData[] = []
  selectedAccountData: any
  accountlist:any
  @ViewChild('bulkTbl') bulkTbl: TableListComponent | undefined
  account_value = new FormControl()
  accountall: any;
  maindata: any;
  accounttype:any;
  getdetails:boolean = false;
  INCOMEAMOUNT_COL: tableColum[] = cloneData(ACCOUNT_SETTLEMENT_INCOME_LIST)

  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-eye', title: 'Volunter Active', type: 'VIEW', permission: { moduleName: 'STAFF', actionName: 'UPDATE' } },
  ]

  IncomeAmount: tableBuilder = {
    name: 'Amount Settlement List',
    column: this.INCOMEAMOUNT_COL,
    action: this.actionBtn,
    showFilter: true,
    isLazy: false,
  }

  constructor( private modalService: ModalService,private accountApi: AccountApiService, private router: Router) { }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'Balance Sheet',
    }
    this.openConfirmModal()
  }
  openConfirmModal() {
    this.basicFormData = [];
    this.selectedAccountData = {}
    const msg = 'Which Account do you want to Show ?', title = 'Choose Account type'
    this.modalService.openConfirmDialog({ btnOK: 'Main Account', btnCancel: 'Office Account', message: msg, title: title, disableClose: true }).then((res: any) => {
      if (res) {
        this.accountApi.getMainAccount(0).then((res: any) => {
          this.accountlist = res?.result
          console.log(this.accountlist.account_code,'acc')
          this.accounttype = 'mainaccount'
        })

      } else {
        this.accountApi.getMainAccount(1).then((res: any) => {
          this.accountlist = res?.result
          this.accounttype = 'officeaccount'

        })
      }
    })
  }
  getaccountdetails() {
    this.getdetails = true
    this.bulkTbl?.reload()
  }
  onChange(ev: any) {
    this.accountall = this.account_value.value
    this.maindata = this.accountlist.find((a: any) => this.accountall == a.id);
    // this.getAccountData(this.accountall);
    //  this.accountNo = this.carddata.account_code

  }
  getAccountData = async (e: tblFilterQuery): Promise<any> => {
    if(!this.getdetails){
      return
    }
    if(this.accounttype == 'mainaccount'){
      return this.accountApi.getmainList(1).then(async (res: any) => {
            if (res.statusCode == RESPONSE_CODE.SUCCESS) {
              console.log(res, 'data')
              await res.result?.map((a: any) => {
                a.account_name = `<span>${a.accountName || ''} - ${a.account_code || ''}</span>`
              })
            }
    
            return res.result
          })
      
    }
   
    
    if(this.accounttype == 'officeaccount'){
      return this.accountApi.getofficeList(this.accountall).then(async (res: any) => {
            if (res.statusCode == RESPONSE_CODE.SUCCESS) {
              console.log(res, 'data')
              await res.result?.map((a: any) => {
                a.account_name = `<span>${a.accountName || ''} - ${a.account_code || ''}</span>`
              })
            }
    
            return res.result
          })
      
    }
  
  }
  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'VIEW':
        this.router.navigate([this.urlService.ACCOUNT.BALANCE_SHEET_VIEW.URL], { queryParams: { id: id } })
        // this.modalService.openModal(BalanceSheetInfoComponent,{id:id},'modal-lg')
        break;
    }
    return Promise.resolve(true);
  }
}
