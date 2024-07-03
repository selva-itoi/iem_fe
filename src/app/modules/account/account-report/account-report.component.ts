import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filter } from 'rxjs';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilderData, tableBuilder, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { AccountApiService } from '../service/account-api.service';
import { mysqlDataTime, getMonthLastDate } from 'src/app/helper/class/utilityHelper';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';

@Component({
  selector: 'app-account-report',
  templateUrl: './account-report.component.html',
  styleUrls: ['./account-report.component.scss']
})
export class AccountReportComponent {

  pageInfo: pageInfo = {} as pageInfo;
  dataLoading: boolean = false;
  reportdata:any;
  exportFormData: formBuilderData[] = [
    {
      colName: 'type',
      title: 'Account Type',
      type: 'select',
      data: [{ countName: 'Master', id: '1' }, { countName: 'Promotional Office', id: '4' },{ countName: 'Area Secretary', id: '7' }],
      selectKeyName: 'countName', selectPrimaryKey: 'id', validator: [{ name: 'required' }],
      event: { name: 'change', isCallback: true },
    },
    //   {
    //     colName: 'from_account_fk_id',
    //     title: 'From Account',
    //     event: { name: 'click', isCallback: true },
    //     readonly: true,
    //     validator: [{ name: 'required' }],
    //     info: 'Click to Select From Account'
    // },
    {
      colName: 'todate',
      title: 'Date',
      type: 'DATE',
      selectionMode: 'range',
      dateViewMode: 'month',
      // dateFormat: "mm/yy",
      validator: [{ name: 'required' }]
    },
  ]
  tblCol: tableColum[] = [
    { colName: 'account_code', title: 'Account', filter: true },
    { colName: 'account_categoryName', title: 'Category', filter: true },
    { colName: 'total_credit', title: 'Total Credit', colType: 'CURRENCY', filter: true },
    { colName: 'total_debit', title: 'Total Debit', colType: 'CURRENCY', filter: true },
    { colName: 'total_net_amount', title: 'Total', colType: 'CURRENCY', filter: true },
  ]
  tableConfig: tableBuilder = {
    name: 'Sponsorship list',
    addBtn: false,
    column: this.tblCol,
    action: [],
    isLazy: true,
    showFilter: false,

  }
  // accountlist=[{ countName: 'Master', id: 'Master' },{ countName: 'Promotional Office', id: 'Office' }, { countName: 'Area secratory', id: 3 }]

  staff_Form: any
  @ViewChild('exportForm') exportForm: FormGeneratorComponent | undefined;
  @ViewChild('tableList') tableList: TableListComponent | undefined;

  constructor(private modalService: ModalService, private alertService: AlertService, private accountapi: AccountApiService) { }
  ngOnInit(): void {
    this.pageInfo = {
      title: 'Account Report'
    }

  }

  // onChange(ev: any) {
  //   if(ev.controlName == 'accounttype'){
  //   this.exportForm?.patchValue({ from_account_fk_id: '' })
  //   }

  //   if(ev.controlName == 'from_account_fk_id'){
  //     if (!this.exportForm?.apiPayload().accounttype) {
  //       this.alertService.showToast('Select Account Type First', 'info');
  //     }else{

  //     this.setAccountData(ev)
  //   }
  //   }

  // }
  // getFullData(tblName: any, cond = [], colName: any = '', apiFun: string = '') {

  accounttypedata: any
  // setAccountData(ev: any) {
  //   if(this.exportForm?.apiPayload().accounttype == 0){
  //     this.accounttypedata = 1
  //   }
  //   if(this.exportForm?.apiPayload().accounttype == 1){
  //     this.accounttypedata = 4
  //   }
  //   if(this.exportForm?.apiPayload().accounttype == 2){
  //     this.accounttypedata = 7
  //   }
  //   this.modalService.openSearchModal({ type: 'ACCOUNT',whereField:[{colName:'type',value:this.accounttypedata}] }).then((res: any) => {
  //     if (res) {
  //       this.exportForm?.patchValue({ [ev.controlName]: res.account_code })
  //     }
  //   })
  // }


  gettblData = async (e: tblFilterQuery): Promise<any> => {

  }
  apipayload() {
    const data = this.exportForm?.apiPayload()
    const splitD = data?.todate;
    data.from_date = mysqlDataTime(splitD?.[0], 'DATE') || null;
    data.end_date = splitD?.[1] ? mysqlDataTime(getMonthLastDate(splitD[1]), 'DATE') : mysqlDataTime(getMonthLastDate(splitD[0]));
    console.log(data, 'ssaaa');
    delete data['todate']
    return data

  }
  submit() {
    this.dataLoading = true
    this.accountapi.getAccountTransationList(this.apipayload()).then((a:any)=>{
      this.reportdata= a?.result
      this.tableList?.setTableData(a.result.data);
    }).finally(() => this.dataLoading = false)

  }
}
