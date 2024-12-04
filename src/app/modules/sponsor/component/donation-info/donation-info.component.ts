import { Component, OnInit, ViewChild } from '@angular/core';
import { ObjectString } from 'src/app/core/helper/core.data.interface';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { ResponseData, formBuilderData, tableBuilder, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { PURPOSE_SPONSORSHIP_TABLE, SPONSORSHIP_TABLE, SPONSOR_DONATION_LIST } from '../../helper/sponsor-form';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { AlertService } from 'src/app/helper/service/alert.service';
import { downloadHelper } from 'src/app/helper/class/downloadHelper';

@Component({
  selector: 'app-donation-info',
  templateUrl: './donation-info.component.html',
  styleUrls: ['./donation-info.component.scss']
})
export class DonationInfoComponent implements OnInit {

  donationData: any
  data: any;
  auth: any;
  @ViewChild('remarks') remarks: FormGeneratorComponent | undefined
  loadingData: boolean = false;
  basicFormData: formBuilderData[] = [{ colName: 'remarks', title: 'Remarks', }]
  segement: ObjectString = {
    BASIC: 'Basic',
    // SPONSORSHIP: 'Sponsorship',
    BANK: 'Bank'
  }
  segmentVisited: any = {
    SPONSORSHIP: false
  }
  LIST_COL: tableColum[] = [...cloneData(SPONSORSHIP_TABLE)?.splice(2, 1), ...[{ colName: 'amount', title: 'Donate Amount' }, { colName: 'sponsorship_amount', title: 'Sponsorship Amount' }], ...cloneData(SPONSORSHIP_TABLE)?.splice(8, 1)]
  PURPOSE_LIST_COL: tableColum[] = cloneData(PURPOSE_SPONSORSHIP_TABLE)
  tableConfig: tableBuilder = {
    name: '',
    addBtn: false,
    column: this.LIST_COL,
    action: [],
    isLazy: true,
  }
  purposetableConfig: tableBuilder = {
    name: '',
    addBtn: false,
    column: this.PURPOSE_LIST_COL,
    action: [],
    isLazy: false
  }
  currentSegment: string = this.segement.BASIC;
  amountData: any = [
    {
      colName: 'amount',
      title: 'Donate Amount'
    },
    {
      colName: 'amount_in_words',
      title: 'Amount in Words'
    },
  ]
  showData: any = [
    {
      colName: 'donation_id',
      title: 'Donation ID'
    }, {
      colName: 'sponsorName',
      title: 'Sponsor Name'
    }, {
      colName: 'sponsor_id',
      title: 'Donor ID',
    }, {
      colName: 'promotionalName',
      title: 'Church Ministry Area'
    },
    // {
    //   colName: 'amount',
    //   title: 'Amount'
    // }, 

    //  {
    //   colName: 'receipt_id',
    //   title: 'Receipt'
    // },
    {
      colName: 'creted_byName',
      title: 'Created By '
    },
    {
      colName: 'created_at',
      title: 'Donation Date',
      type: 'DATE'
    }, {
      colName: 'remarks',
      title: 'Remarks '
    },
    {
      colName: 'payment_modeName',
      title: 'Payment Mode'
    },
    {
      colName: 'transaction_ref',
      title: 'Transcation Ref'
    },
    {
      colName: 'statusName',
      title: 'Status'
    },
    // {
    //   colName: 'donation_sub_programName',
    //   title: 'Program'
    // }
  ]

  BankData: any = [{
    colName: 'bank_account_name',
    title: 'Account Name'
  }, {
    colName: 'bank_account_no',
    title: 'Account No',
  },
  {
    colName: 'bank_name',
    title: 'Bank Name'
  }, {
    colName: 'bank_ifc_code',
    title: 'IFSC Code'
  }, {
    colName: 'bank_address',
    title: 'Branch'
  },]
  donationId: any = '';
  datatype: any
  @ViewChild('tbl') tbl: TableListComponent | undefined;
  @ViewChild('tableList') tableList: TableListComponent | undefined;

  sponsorship: any;
  constructor(private sponsorApi: SponsorApiService, private alertService: AlertService, private downloadHelper: downloadHelper,
    private navigation: NavigationService, private modalService: ModalService) { }

  ngOnInit(): void {

  }
  setInput(data: any) {
    this.donationId = data.ref_id || '';
    this.datatype = data.type
    this.getData(data.ref_id);
  }
  getData(id: string | number) {
    if (id) {
      this.loadingData = true;
      this.tbl?.reload()
      this.sponsorApi.getDonationById(id).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.donationData = res?.result;
          this.sponsorship = res.result.sponsorship;
          console.log(this.tableList, ' show table')

          this.tableList?.reload()
          console.log(this.donationData?.donation_sponsorship, 'this.donationData?.donation_sponsorship');
        }
      }).finally(() => {
        this.loadingData = false;
      })
    }
  }
  getListData = async (e: tblFilterQuery): Promise<any> => {
    this.tableList?.setTableData(this.donationData?.donation_sponsorship || []);

    console.log('called get list data ', this.donationData?.donation_sponsorship)
    return this.donationData?.donation_sponsorship || [];
  }
  getListDonation = async (e: tblFilterQuery): Promise<any> => {
    return await this.donationData.sponsorship || []
  }

  payload() {
    const data = this.remarks?.apiPayload();
    const payload = this.donationData
    payload.remarks = data.remarks
    payload.status = 1
    console.log(payload)
    return payload
  }
  approve() {
    if (!this.remarks?.isValid()) {
      return;
    }
    this.loadingData = true;

    this.sponsorApi.updateDonationdata(this.donationId, this.payload()).then((a: any) => {

      this.close()
    }).finally(() => {
      this.loadingData = false;
    })


  }
  rejectpayload() {
    const data = this.remarks?.apiPayload();
    const payload = this.donationData
    payload.remarks = data.remarks
    payload.status = 3
    console.log(payload)
    return payload
  }
  reject() {
    if (!this.remarks?.isValid()) {
      return;
    }
    this.loadingData = true;

    this.sponsorApi.updateDonationdata(this.donationId, this.rejectpayload()).then((a: any) => {
      this.close()
    }).finally(() => {
      this.loadingData = false;
    })
    // .catch(() => this.alertservice.showToast('Unable to Download', 'error'))
    // .finally(() => this.printLoader = false)
  }
  changeSegement(val: string) {
    this.currentSegment = val;
    //@ts-ignore
    const key: 'OUTBOX' | 'LIST' = Object.keys(this.segement).find((k: any) => this.segement[k] === val);
    this.segmentVisited[key] = true;
  }
  returnZero() {
    return 0;
  }
  close() {
    this.modalService.close();
  }
  download() {
    this.sponsorApi.printsponserreceipt(this.donationId).then(async (res: any) => {
      this.downloadHelper.downloadFile(res);
      this.alertService.showToast('Receipt Downloaded', 'info')
    })
      .catch(err => this.alertService.showToast('Unable to download Receipt', 'info'))
  }
  verify() {
    this.loadingData = true;
    this.sponsorApi.verifydonationbyid(this.donationId).then((a: any) => {
      if (a.statusCode == RESPONSE_CODE.SUCCESS) {
        this.sponsorApi.changeData('a');
        this.close()
      }
    }).finally(() => {
      this.loadingData = false;
    })

  }
}
