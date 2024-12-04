import { Component, OnInit, ViewChild } from '@angular/core';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilderData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { NEW_MAGAZINE_FORM, MAGAZINE_ADDRESS } from '../../helper/sponsor-form';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { NewSponsorComponent } from '../new-sponsor/new-sponsor.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-magazine',
  templateUrl: './new-magazine.component.html',
  styleUrls: ['./new-magazine.component.scss']
})
export class NewMagazineComponent implements OnInit {

  sponsorData: any
  dataLoading: boolean = false
  pageInfo: pageInfo = {} as pageInfo
  basicFormData: formBuilderData[] = cloneData(NEW_MAGAZINE_FORM)
  loading: boolean = false
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('address') address: FormGeneratorComponent | undefined;
  addressFormData: formBuilderData[] = MAGAZINE_ADDRESS

  magazineId: any;
  magazineData: any;
  constructor(private modalService: ModalService, private alertService: AlertService, private navServ: NavigationService,
    private sponsorApi: SponsorApiService, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.magazineId = this.activateRoute.snapshot.queryParams['id'] || '';
    console.log('this.magazineId', this.magazineId)
    this.getmagazinedata()
    this.pageInfo = {
      title: (!this.magazineId ? 'New' : 'Update') + ' Magazine ',
      // title: 'New Magazine',
      buttonShowBtn: true,
      button: {
        title: 'View All Magazine',
        url: UrlServices.PAGE_URL.SPONSOR.MAGAZINE_LIST.URL
      }
    }
  }

  getmagazinedata() {
    if (this.magazineId) {
      this.getSponsorData(this.magazineId)
      this.sponsorApi.MagazineData(this.magazineId).then((res: any) => {
        this.magazineData = res?.result;
        console.log('this.magazineData', this.magazineData)
        // setTimeout(() => {
          this.basicForm?.setData(this.magazineData)
          this.address?.setData(this.magazineData)
        // }, 800);
      })
    }

  }
  openSponsorModal() {
    this.modalService.openSearchModal({ type: 'SPONSOR', activeOnly: true }).then((res: any) => {
      if (res.deleted_at != null) {
        this.alertService.showToast("You can't Add sponsorship for Inactive Sponsor", 'info');
        return;
      }
      // console.log('RESUKT',res)
      this.sponsorData = res

    })
  }

  apiPayload() {
    let payload = this.basicForm?.apiPayload() || {};
    payload.sponsor_fk_id = this.sponsorData?.id;
    // payload.magazine_fk_id = payload.magazine_fk_id?.id
    if (this.magazineId) {
      const address = this.address?.apiPayload() || {};
      payload = { ...payload, ...address };
      payload.id = this.magazineId
      payload.country=this.magazineData.country
      payload.state=this.magazineData.state
      payload.district=this.magazineData.district
      payload.sponsor_fk_id = this.magazineData?.sponsor_fk_id
    }
    return payload
  }

  onSubmit() {
    this.loading = true;
    const api = this.magazineId ? this.sponsorApi.updateMagazine(this.apiPayload()) : this.sponsorApi.saveMagazine(this.apiPayload()),
      msg = this.magazineId ? 'Magazine Update Successfully' : 'Magazine save Successfully';
    api.then((res: any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast(msg, 'success')
        this.goBack()
      }
    }).catch(() => { this.alertService.showToast('Unable to save', 'error') })
      .finally(() => this.loading = false)
  }

  addSponsor() {
    this.modalService.openModal(NewSponsorComponent, {}, 'modal-xl').then((res: any) => {
      if (res) {
        this.getSponsorData(res?.sponsor_id)
      }
    })
  }

  getSponsorData(id: any) {
    this.sponsorApi.getBasic(this.magazineId).then((res: ResponseData) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.sponsorData = res.result
        console.log('this.sponsorData', this.sponsorData)
        // setTimeout(() => {
          this.basicForm?.setData(this.sponsorData)
          this.address?.setData(this.sponsorData)
        // }, 800);
        
      }
    }).catch((() => this.alertService.showToast('Unable to get Data', 'error')))
  }

  goBack() {
    this.navServ.back()
  }
}
