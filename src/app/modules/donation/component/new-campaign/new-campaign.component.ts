import { Component, OnInit, ViewChild } from '@angular/core';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilderData, tableColum, tableButton, tableBuilder, ResponseData, tblFilterQuery } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ChurchApiService } from 'src/app/modules/church/service/church-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { NEW_CAMPAIGN_FORM } from '../../helper/donation_form';
import { DonationApiService } from '../../service/donation-api.service';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.scss']
})
export class NewCampaignComponent implements OnInit {

  pageInfo: pageInfo = {} as pageInfo
  urlService = UrlServices.PAGE_URL;
  loading: boolean = false;
  churchData: any
  basicFormData: formBuilderData[] = []
  actionBtn: tableButton[] = [
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Church View', type: 'VIEW', permission: { moduleName: 'CHURCH', actionName: 'READ' } },
  ]
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined
  constructor(private auth: AuthService, private modalService: ModalService,
    private donationApi: DonationApiService, private alertService: AlertService,) { }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'New Campaign',
      buttonShowBtn: true,
      button: {
        title: 'View All Campaign',
        url: this.urlService.DONATION.CAMPAIGN_LIST.URL,
        queryParams: {}
      }
    }
    this.basicFormData = cloneData(NEW_CAMPAIGN_FORM)
  }

  selectChurch(res: any) {
    this.churchData = res;
    if (this.churchData.id) {
      // this.basicForm?.setValue('church_fk_id', this.churchData.id)
      // this.basicForm?.setValue('church_id', this.churchData.church_id)
    }
  }
  openSearchModal() {
    this.modalService.openSearchModal({ type: 'CHURCH' }).then(async (res: any) => {
      if (res) {
        console.log(res)
        this.selectChurch(res);
      }
    });
  }
  onChange(ev: any) { }


  apiPayload() {
    const userData = this.auth.currentUserValue || ''
    const payload = this.basicForm?.apiPayload()
    payload.ref_id = this.churchData.id;
    payload.module_id = 3
    // if(this.progessData.id){
    //   payload.last_modify_by = userData.user_id
    //   payload.last_modify_byName = userData.fname
    // }else {
    //   payload.created_by = userData.user_id
    //   payload.created_byName = userData.fname
    // }
    return payload
  }

  onSubmit() {
    if (!this.basicForm?.isValid()) {
      return
    }
    const apiData = this.apiPayload();
    console.log('Form Data', apiData)
    this.loading = true;
    this.donationApi.saveCampaign(apiData).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Campaign Saved Sucsessfully', 'success')
      }
    }).catch(err => {
      this.alertService.showToast('Unable to save the Record', 'error');
    }).finally(() => this.loading = false)

  }


}
