import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilderData } from 'src/app/helper/interface/response';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { NEW_ACCOUNT_SETTLEMENT } from '../../helper/account-form';

@Component({
  selector: 'app-new-account-settlement',
  templateUrl: './new-account-settlement.component.html',
  styleUrls: ['./new-account-settlement.component.scss']
})
export class NewAccountSettlementComponent implements OnInit {

  pageInfo: pageInfo = {} as pageInfo
  urlService = UrlServices.PAGE_URL
  loading: boolean = false
  accountId: any
  accountData: any
  basicFormData: formBuilderData[] = []
  radioForm: UntypedFormGroup = {} as UntypedFormGroup
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined
  radioGroup = [{ name: 'transfer', title: 'Transfer' }, { name: 'credit', title: 'Credit' }, { name: 'debit', title: 'Debit' }]
  constructor(private navigation: NavigationService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.accountId = this.activatedRoute.snapshot.queryParams['id'] || ''
    this.pageInfo = {
      title: 'New Account Settlement',
      buttonShowBtn: true,
      button: {
        title: 'Account Settlement List',
        url: this.urlService.ACCOUNT.LIST.URL
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
    if (this.accountId) {
      payload.id = this.accountData.id
    }
    return payload
  }
  onSubmit() {
    if (!this.basicForm?.isValid()) {
      return
    }


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


  onApprove() { }

  onReject() { }

  close() {
    this.navigation.back()
  }
}
