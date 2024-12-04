import { Component, Injector, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { emailConfigData, EmailSenderComponent } from 'src/app/core/component/email-sender/email-sender.component';
import { RESPONSE_CODE, SPONSORSHIP_MODULE } from 'src/app/helper/class/app-constant';
import { ResponseData } from 'src/app/helper/interface/response';
import { SponsorApiService } from 'src/app/modules/sponsor/service/sponsor-api.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { SponsorBasicComponent } from '../../feature-modal/sponsor-basic/sponsor-basic.component';

@Component({
  selector: 'app-sponsorship-allotment-ref-list',
  templateUrl: './sponsorship-allotment-ref-list.component.html',
  styleUrls: ['./sponsorship-allotment-ref-list.component.scss']
})
export class SponsorshipAllotmentRefListComponent implements OnInit {
  @Input() ref_id: string | number = '';
  @Input() module_id: string | number = SPONSORSHIP_MODULE.STAFF;
  @Input() show: 'ACTIVE' | 'ALL' = 'ALL';
  loading: boolean = false;
  _bsModalRef: BsModalRef = {} as BsModalRef;
  allotmentList: Array<any> = [];
  isModal: boolean = false;
  constructor(private sponsorApi: SponsorApiService,
    private injector: Injector,
    private modalService: ModalService) { }

  ngOnInit(): void {
    if (!this.ref_id) {
      this.isModal = true;
      this._bsModalRef = this.injector.get<BsModalRef>(BsModalRef);
    } else {
      this.getAllotmentList();
    }
  }

  setInput(data: any) {
    this.show = data.show;
    this.ref_id = data.ref_id;
  }
  //sponsorAllotment
  getAllotmentList() {
    if (this.ref_id) {
      this.loading = true;
      let api: any;
      if (this.show == 'ACTIVE') {
        api = this.sponsorApi.getActiveAllotment(this.ref_id,this.module_id);
      } else {
        api = this.sponsorApi.getSponsorshipAllotment(this.ref_id,this.module_id);
      }
      api.then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.allotmentList = res.result;
        }
      }).catch((err: any) => { }).finally(() => this.loading = false);
    }
  }


  showPreviewEmail(sId: any) {
    const apiLoad = { sponsor_id: sId},
      emailConfig: emailConfigData = { body: '', config: { is_pdf: false, is_preview: true, is_sent: true }, payload: apiLoad, id: 7 }
    this.modalService.openModal(EmailSenderComponent, emailConfig, 'modal-lg', 1, false).then(async (res: any) => {
    });
  }

  viewSponsor(id: any) {
    this.modalService.openSponsorInfo({ sponsor_id: id },2)
  }
}