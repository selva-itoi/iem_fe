import { Component, OnInit, ViewChild } from '@angular/core';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilder, formBuilderData, tableBuilder, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { SETTLEMENT_VIEW_TBL } from '../../helper/account-form';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountApiService } from '../../service/account-api.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { AlertService } from 'src/app/helper/service/alert.service';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { UrlServices } from 'src/app/helper/class/url-services';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { SETTLEMENT_LIST_TABLE, TOP_LIST_TABLE } from 'src/app/modules/sponsor/helper/sponsor-form';
import { downloadHelper } from 'src/app/helper/class/downloadHelper';
import { ProfileWidgetComponent } from 'src/app/shared/feature-modal/profile-widget/profile-widget.component';
import { DonationInfoComponent } from 'src/app/modules/sponsor/component/donation-info/donation-info.component';
import { SponsorApiService } from 'src/app/modules/sponsor/service/sponsor-api.service';


@Component({
  selector: 'app-account-settlement-info',
  templateUrl: './account-settlement-info.component.html',
  styleUrls: ['./account-settlement-info.component.scss']
})
export class AccountSettlementInfoComponent implements OnInit {

  pageInfo: pageInfo = {} as pageInfo;
  urlService = UrlServices.PAGE_URL
  settlementDatabyid: any
  isModal: boolean = false
  dataLoading: boolean = false
  officeKeys: any = [{ colName: 'req_id', title: 'Req Id' }, { colName: 'total_amount', title: 'Total Amount' }, { colName: 'narration', title: 'Description' }
    , { colName: 'remarks', title: 'Remarks ' }, { colName: 'statusName', title: 'Status ' }
    , { colName: 'created_at', title: 'Created on', type: 'DATE' }, { colName: 'verified_on', title: 'Verified on', type: 'DATE' },
    , { colName: 'created_byName', title: 'created by ' }, { colName: 'verify_byName', title: 'Verified by ' }];

  fromaccountkeys: any = [{ colName: 'accountName', title: 'Acount Name' },]
  toaccountkeys: any = [{ colName: 'to_account_name', title: 'Acount Name' }]
  // toaccountkeys:any=[{ colName: 'to_account_name', title: 'Acount Name' },{ colName: 'bank_name', title: 'Bank Name' },{ colName: 'bank_ifc_code', title: 'Bank Ifsc Code' }]
  customers: any;
  settlementData: any;
  type: 'VIEW' | 'APPROVE' | 'PREVIEW' = 'VIEW';
  // LIST_COL: tableColum[] = cloneData(SETTLEMENT_VIEW_TBL)
  LIST_COL: tableColum[] = cloneData(SETTLEMENT_LIST_TABLE)
  basicFormData: formBuilderData[] = cloneData(SETTLEMENT_VIEW_TBL)
  tableConfig: tableBuilder = {
    name: '',
    action: [],
    column: this.LIST_COL,
    isLazy: true
  }
  preview: any
  settlementId: any;
  loading: boolean = false;
  @ViewChild('tableList') tableList: TableListComponent | undefined;
  @ViewChild('profileWidget') profileWidget: ProfileWidgetComponent | undefined;

  constructor(private activatedRouted: ActivatedRoute, private downloadHelper: downloadHelper, private accountApi: AccountApiService, private router: Router,
    private alertService: AlertService, private sponsorApi: SponsorApiService, private modalService: ModalService, private navigation: NavigationService) { }

  ngOnInit(): void {
    this.settlementId = this.activatedRouted.snapshot.queryParams['id'] || '';
    console.log(this.settlementId, ' this.settlementId')
    this.type = this.activatedRouted.snapshot.queryParams['type'] || 'VIEW';

    this.pageInfo = {
      title: 'Settlement Info', buttonShowBtn: true,
      button: {
        title: 'View all Settlement',
        url: UrlServices.PAGE_URL.ACCOUNT.LIST.URL,
      }
    }
    this.sponsorApi.currentData.subscribe(data => {

      this.getData()
    });
  }
  statusdata: any;
  statuspayment: any;
  getData() {
    if (this.settlementId) {
      this.accountApi.getAllSettlementDetails(this.settlementId).then((res: any) => {
        if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
          this.settlementData = res?.result;
          this.customers = this.settlementData?.donationList || []
          this.profileWidget?.setData(this.settlementData)


          // this.data1 = this.customers.map(item => item.statusName)
          //   .includes(['Verified', 'Paid']);
          this.statusdata = this.customers.some(item => ['Deposited', 'Pending'].includes(item.statusName));
          this.statuspayment = this.customers.some(item => ['DD', 'cheque', 'UPI'].includes(item.payment_modeName));

          // this.customers.includes({ statusName: 'Verified' })


        }
      }).catch(() => this.alertService.showToast('Unable to get Data', 'error'))
      this.accountApi.getSettlementDetailsbyId(this.settlementId).then((res: any) => {
        if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
          this.settlementDatabyid = res?.result;
        }
      }).catch(() => this.alertService.showToast('Unable to get Data', 'error'))
    }
  }

  setTableData() {
    this.settlementData?.item.map((a: any) => {
      a.name = `<span><strong>${a.general_account_name}</strong></span><br><span><strong class="text-info">${a.general_account_code}</strong></span>`;
      a.statusName = a.status == 1 ? 'Approved' : 'Pending'
      return a
    })
    this.tableList?.reload();
  }
  // getListData = async (e: tblFilterQuery): Promise<any> => {
  //   e.whereField = [{ colName: 'id', value: this.settlementId }]
  //   return this.accountApi.getsettlementItemGetList(e).then((res:any) => {
  //     if(res?.statusCode == RESPONSE_CODE.SUCCESS) {
  //       res?.result?.data.map((a:any) => {
  //         a.from_account = `<span><strong>${a?.from_accountName || ''}</strong></span><br><span><strong class="text-info" >${a?.from_account_code || ''}</strong></span>`
  //         a.to_account = `<span><strong>${a?.to_accountName || ''}</strong></span><br><span><strong class="text-info" >${a?.to_account_code || ''}</strong></span>`
  //       })
  //     }
  //     return res
  //   })

  //   // return this.settlementData?.item || [];
  // }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    this.customers = this.settlementData?.donationList || []
    return await this.settlementData?.donationList || []
  }


  makeApproveReject(type: 'APPROVE' | 'REJECT') {

    if (this.statusdata && type == 'APPROVE') {
      this.alertService.showToast('Please verify donations and make settlement', 'warn');
      return
    }
    const form: formBuilder[] = [{ colName: 'remarks', title: 'Remarks', }]
    this.modalService.openConfirmDialog({ formField: form, isFormField: true, title: type == 'APPROVE' ? 'Approve' : 'Reject' }).then((res: any) => {
      if (res && type == 'APPROVE') {
        this.update(res)
      }
      if (res && type == 'REJECT') {
        this.updatereject(res)
      }
    })
  }
  update(payload: any) {
    this.loading = true

    payload.id = this.settlementId, payload.status = 1;
    if (this.statuspayment) {
      payload.verifyAll = true
    } else {
      payload.verifyAll = false
    }

    this.accountApi.savesettlement(payload).then((res: any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Successfully Approved', 'success');
        this.router.navigate([this.urlService.ACCOUNT.LIST.URL])
      }
    }).catch(() => this.alertService.showToast('Unable to save changes', 'error')).finally(() => {
      this.loading = false;
    })
  }
  updatereject(payload: any) {
    this.loading = true
    payload.id = this.settlementId, payload.status = 3;
    this.accountApi.savesettlement(payload).then((res: any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Successfully Rejected', 'success')
        // this.close()
        this.router.navigate([this.urlService.ACCOUNT.LIST.URL])
      }
    }).catch(() => this.alertService.showToast('Unable to save changes', 'error')).finally(() => {
      this.loading = false;
    })
  }
  close() {
    if (!this.isModal) {
      this.navigation.back();
      return;
    }
  }
  viewDetails(a: any) {
    this.modalService.openModal(DonationInfoComponent, { ref_id: a.donation_fk_id }, 'modal-lg');
  }
  approve(a: any) {
    this.modalService.openModal(DonationInfoComponent, { ref_id: a.donation_fk_id, type: 'verify' }, 'modal-lg');
  }
  export() {
    this.accountApi.exportSettlementDetailsbyId(this.settlementId).then((res: any) => {
      this.downloadHelper.downloadFile(res);
    })
  }

  isPreviewOpen: boolean = false;
  previewImageUrl: string = '';

  openPreview(imageUrl: string): void {
    this.previewImageUrl = imageUrl;
    this.isPreviewOpen = true;
  }

  closePreview(): void {
    this.isPreviewOpen = false;
  }





}
