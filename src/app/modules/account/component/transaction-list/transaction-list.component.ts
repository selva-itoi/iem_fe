import { Component, OnInit } from '@angular/core';
import { UrlServices } from 'src/app/helper/class/url-services';
import { pageInfo } from 'src/app/helper/interface/menu-interface';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {

  pageInfo: pageInfo = {} as pageInfo
  constructor() { }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'Manage Transaction', buttonShowBtn: true,
      button: {
        title: 'New Transaction', icon: 'pi pi-plus',
        url: UrlServices.PAGE_URL.ACCOUNT.NEW_TRANSACTION.URL
      }
    }
  }

}
