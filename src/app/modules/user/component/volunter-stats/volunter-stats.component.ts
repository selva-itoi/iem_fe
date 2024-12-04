import { Component, ViewChild } from '@angular/core';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilderData, tableBuilder, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { UserApiService } from '../../services/user-api.service';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';

@Component({
  selector: 'app-volunter-stats',
  templateUrl: './volunter-stats.component.html',
  styleUrls: ['./volunter-stats.component.scss']
})
export class VolunterStatsComponent {
  pageInfo: pageInfo = {} as pageInfo;
  dataLoading: boolean = false;
  exportFormData: formBuilderData[] = [
    {
      colName: 'region',
      title: 'Region Name',
      type: 'select',
      apiTblName: 'region',
      selectKeyName: 'regionName',
      selectPrimaryKey: 'id',
      defaultValue: '',
      event: {
        name: 'change',
        apiTblName: 'zone',
        valueAssign: 'zone'
      },
      validator: [{ name: 'required', error: 'Region should not be blank' }]
    },
    {
      colName: 'zone',
      selectKeyName: 'zoneName',
      selectPrimaryKey: 'id',
      defaultValue: '',
      type: 'select',
      title: 'Zone/State Name',
      event: {
        name: 'change',
        apiTblName: 'promotional_office',
        valueAssign: 'promotionalOffice_id',
      },
      validator: [{ name: 'required' }]
    },
    {
      colName: 'promotionalOffice_id',
      title: 'Church Ministry Area',
      type: 'select',
      selectKeyName: 'promotionalName',
      selectPrimaryKey: 'promoId',
      filter: true,
      sort: true,
      validator: [{ name: 'required' }],
      event: { name: 'change', isCallback: true }
    },
    {
      colName: 'date',
      title: 'Month & Year',
      type: 'DATE',
      dateFormat: 'mm/yy',
      dateViewMode: 'month',
      validator: [{ name: 'required' }],

    },
  ]
  tblCol: tableColum[] = [
    { colName: 'volunteerName', title: 'Area Secretery' },
    { colName: 'volunteer_id', title: 'Area Secretery ID' },
    { colName: 'total_amount', title: 'Total Amount', colType: 'CURRENCY' },
    { colName: 'rised_amount', title: 'Raised Amount', colType: 'CURRENCY' },
    { colName: 'balance_amount', title: 'Balance Amount', colType: 'CURRENCY' },
    { colName: 'settle_amount', title: 'Settled Amount', colType: 'CURRENCY' },
  ]
  tableConfig: tableBuilder = {
    name: 'Sponsorship list',
    addBtn: false,
    column: this.tblCol,
    action: [],
    isLazy: true,
    showFilter: false,

  }
  @ViewChild('exportForm') exportForm: FormGeneratorComponent | undefined;
  @ViewChild('tableList') tableList: TableListComponent | undefined;


  constructor(private modalService: ModalService, private userApi: UserApiService) { }
  ngOnInit(): void {
    this.pageInfo = {
      title: 'Area Secretary Stats'
    }

  }
  onChange(ev: any) {
    // if (['from_account_fk_id'].includes(ev.controlName)) {
    //   this.setAccountData(ev)
    // }
  }

  // setAccountData(ev: any) {
  //   this.modalService.openSearchModal({ type: 'ACCOUNT' }).then((res: any) => {
  //     if (res) {
  //       this.exportForm?.patchValue({ [ev.controlName]: res.account_code })
  //     }
  //   })
  // }
  promotionalid: any
  reportdateyear: any
  reportdate: any
  reportyear: any

  submit() {
    this.promotionalid = this.exportForm?.apiPayload().promotionalOffice_id
    this.reportdateyear = this.exportForm?.apiPayload().date
    this.reportdate = this.reportdateyear.getMonth() + 1,
    this.reportyear = this.reportdateyear.getFullYear(),
    this.tableList?.reload()
  }

  gettblData = async (e: tblFilterQuery): Promise<any> => {
    if (this.promotionalid) {
      e.whereField = [{ colName: 'month', value: this.reportdate }, { colName: 'year', value: this.reportyear }]
      return this.userApi.getareasecratarystats(this.promotionalid, e)
    } else {
      return
    }
  }

}
