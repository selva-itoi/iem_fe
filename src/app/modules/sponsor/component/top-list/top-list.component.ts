import { Component, ViewChild } from '@angular/core';
import { formBuilder, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { TOP_LIST_FORM, TOP_LIST_TABLE } from '../../helper/sponsor-form';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { downloadHelper } from 'src/app/helper/class/downloadHelper';
import { AlertService } from 'src/app/helper/service/alert.service';
import { ModalService } from 'src/app/shared/service/modal.service';

@Component({
  selector: 'app-top-list',
  templateUrl: './top-list.component.html',
  styleUrls: ['./top-list.component.scss']
})
export class TopListComponent {
  constructor(private sponsorapi: SponsorApiService, private modalService: ModalService
    , private downloadHelper: downloadHelper, private alertService: AlertService,
  ) { }
  pageInfo: any;
  @ViewChild('tableList') tableList: TableListComponent | undefined;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;


  basicFormData: formBuilder[] = TOP_LIST_FORM;
  TOP_LIST: tableColum[] = cloneData(TOP_LIST_TABLE)
  tblAction = (id: string | number, type: tableAction, data: any): Promise<any> => {
    switch (type) {
      case 'EXPORT':
        console.log(type)
        break;
    }
    return Promise.resolve(true);
  }

  viewInfoHandler(id: any, data: any) {

    // data.donaton_id = data.donaton_id;
    this.modalService.openSponsorInfo(data)
  }



  toplisttable: tableBuilder = {
    name: 'Amount Settlement List',
    column: this.TOP_LIST,
    action: [],
    showFilter: false,
    isLazy: true,
    exportBtn: true
  }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'Donation Top List',
    }
  }
  data: any
  datevale: any
  reportdate: any;
  reportyear: any;
  toplistType: any;
  loading: boolean = false
  getdetails() {
    if (!this.basicForm?.isValid()) {
      return
    }
    this.data = this.basicForm?.apiPayload()
    if (!(this.data.volunteer)) {
      if (!(this.data.promotional_office)) {
        console.log(this.data.volunteer, 'this.data.volunteer', this.data.promotional_office);

        this.alertService.showToast('Please select Church Ministry Area / Area Secretory', 'info')
        return
      }
    }

    this.datevale = this.basicForm?.apiPayload().date
    this.reportdate = this.datevale?.getMonth() + 1,
      this.reportyear = this.datevale?.getFullYear(),
      console.log(this.data)
    this.tableList?.reload()
  }
  totalamount: any;
  getAccountData = async (e: tblFilterQuery): Promise<any> => {

    if (this.data?.volunteer) {
      this.toplistType = 'VOL'

      e.whereField = [{ colName: 'volunteer_fk_id', value: this.data.volunteer }, { colName: 'month', value: this.reportdate }, { colName: 'year', value: this.reportyear }]
    }

    else if (this.data?.promotional_office) {
      this.toplistType = 'PROMO'
      e.whereField = [{ colName: 'promotional_fk_id', value: this.data.promotional_office }, { colName: 'month', value: this.reportdate }, { colName: 'year', value: this.reportyear }]
    }
    if (!(this.toplistType)) {
      return
    }
    this.loading = true


    return await this.sponsorapi.getTopList(e, this.toplistType).then((a: any) => {

      this.totalamount = a.result?.total_amount
      return a
    }).finally(() => { this.loading = false })
  }
  export(e: tblFilterQuery = {} as tblFilterQuery) {
    if (!this.basicForm?.isValid()) {
      return
    }
    this.data = this.basicForm?.apiPayload()
    this.datevale = this.basicForm?.apiPayload().date
    this.reportdate = this.datevale?.getMonth() + 1,
      this.reportyear = this.datevale?.getFullYear()
    if (this.data?.volunteer) {
      this.toplistType = 'VOL'
      e.whereField = [{ colName: 'volunteer_fk_id', value: this.data.volunteer }, { colName: 'month', value: this.reportdate }, { colName: 'year', value: this.reportyear }]
    }
    else if (this.data?.promotional_office) {
      this.toplistType = 'PROMO'
      e.whereField = [{ colName: 'promotional_fk_id', value: this.data.promotional_office }, { colName: 'month', value: this.reportdate }, { colName: 'year', value: this.reportyear }]
    }
    if (!(this.toplistType)) {
      return
    }
    this.loading = true
    // e.whereField = [{colName:'volunteer_fk_id',value:this.data.volunteer},{colName:'month',value:this.reportdate},{colName:'year',value:this.reportyear}]
    this.sponsorapi.topListExport(e, this.toplistType).then((a: any) => {
      this.downloadHelper.downloadFile(a);

    }).finally(() => { this.loading = false })
    // .catch(err => this.alertService.showToast('Unable to download Report', 'info'))
    // .finally(() => { this.loading = false })

  }

}
