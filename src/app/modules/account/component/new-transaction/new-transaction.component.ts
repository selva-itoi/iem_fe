import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilderData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { NEW_ACCOUNT_SETTLEMENT } from '../../helper/account-form';
import { AccountApiService } from '../../service/account-api.service';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements OnInit {

  pageInfo: pageInfo = {} as pageInfo
  urlService = UrlServices.PAGE_URL
  loading: boolean = false
  accountId: any
  accountData: any
  basicFormData: formBuilderData[] = []
  radioForm: UntypedFormGroup = {} as UntypedFormGroup
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined
  radioGroup = [{ name: 'transfer', title: 'Transfer' }, { name: 'credit', title: 'Credit' }, { name: 'debit', title: 'Debit' }]
  constructor(private navigation: NavigationService, private activatedRoute: ActivatedRoute, private alertService: AlertService,
    private accountApi: AccountApiService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.accountId = this.activatedRoute.snapshot.queryParams['id'] || ''
    this.pageInfo = {
      title: 'New Transaction',
      buttonShowBtn: true,
      button: {
        title: 'Transaction List',
        url: this.urlService.ACCOUNT.TRANSACTION_LIST.URL
      }
    }
    this.formInit()
    if (this.accountId) {
      ['from_account_fk_id', 'to_account_fk_id'].forEach((a: any) => {
        setTimeout(() => {
          this.basicForm?.dataForm.controls[a].disable()
        }, 800);
      })
    }
  }

  formInit() {
    this.radioForm = new UntypedFormGroup({
      radiobtn: new UntypedFormControl('transfer'),
    })
    this.radioChange()
  }

  setData() {
    if (this.accountData) {
      setTimeout(() => {
        this.basicForm?.setData(this.accountData)
      }, 800);
    }
  }

  apiPayload() {
    const payload = this.basicForm?.apiPayload()
    payload.status = 2
    payload.type = this.setType()
    if (this.accountId) {
      payload.id = this.accountData.id
    }
    return payload
  }

  setType() {
    const val = this.radioForm.value.radiobtn; let type: any = 0
    switch (val) {
      case 'transfer':
        type = 1
        break;
      case 'credit':
        type = 2
        break;
      case 'debit':
        type = 3
        break;
    }
    return type
  }

  onSubmit() {
    if (!this.basicForm?.isValid()) {
      return
    }
    this.loading = true
    this.accountApi.saveTransaction(this.apiPayload()).then((res: ResponseData | any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Save Successfully', 'success')
        this.close()
      }
    }).finally(() => this.loading = false)

  }

  radioChange() {
    this.basicFormData = []
    let value = this.radioForm.value.radiobtn;
    let allowField: any = [];
    if (value == 'credit') {
      allowField = ['from_account_fk_id'];
    } else if (value == 'debit') {
      allowField = ['to_account_fk_id']
    }
    this.basicFormData = cloneData(NEW_ACCOUNT_SETTLEMENT).filter((a: any) => !allowField.includes(a.colName))
    this.setData()
  }

  onChange(ev: any) {
    if (['from_account_fk_id', 'to_account_fk_id'].includes(ev.controlName)) {
      this.setAccountData(ev)
    }
  }

  setAccountData(ev: any) {
    this.modalService.openSearchModal({ type: 'ACCOUNT' }).then((res: any) => {
      if (res) {
        const val = this.basicForm?.dataForm.value;
        if (this.radioForm.controls['radiobtn'].value == 'transfer') {
          if (ev.controlName == 'to_account_fk_id') {
            if (!val?.from_account_fk_id) {
              return this.alertService.showToast('Selcet From account', 'error')
            }
            if (val?.from_account_fk_id == res?.account_code) {
              return this.alertService.showToast('From account same as To Account', 'error')
            }
          }
          if (ev.controlName == 'from_account_fk_id') {
            if (val?.to_account_fk_id == res?.account_code) {
              return this.alertService.showToast('To account same as From Account', 'error')
            }
          }
        }
        this.basicForm?.patchValue({ [ev.controlName]: res.account_code })
      }
    })
  }
  onApprove() { }

  onReject() { }

  close() {
    this.navigation.back()
  }

}
