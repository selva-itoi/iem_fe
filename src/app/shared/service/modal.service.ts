import { Injectable, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { emailConfigData, EmailSenderComponent } from 'src/app/core/component/email-sender/email-sender.component';
import { SearchModalComponent } from 'src/app/core/component/search-modal/search-modal.component';
import { infoModalData } from 'src/app/core/helper/core.data.interface';
import { InfoModalComponent } from '../feature-modal/info-modal/info-modal.component';
import { SponsorBasicComponent } from '../feature-modal/sponsor-basic/sponsor-basic.component';
import { ConfirmModalComponent } from '../form/component/confirm-modal/confirm-modal.component';
import { confirmModalData, searchModal } from '../interface/modal-interface';
import { Subject } from 'rxjs';
import { DonationInfoComponent } from 'src/app/modules/sponsor/component/donation-info/donation-info.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalRef: BsModalRef = {} as BsModalRef;
  currentUrl: any = { url: '' };
  constructor(private modalService: BsModalService, private activateRoute: ActivatedRoute, private route: Router) { }

  openConfirmDialog(data: confirmModalData): Promise<boolean> {
    const initialState: any = {
      animated: true,
      backdrop: "static",
      keyboard: false,
      id : 'CONFIRM_BOX'
    };
    const modalRef:any = this.modalService.show(ConfirmModalComponent, initialState);
    modalRef.content.setInput(data);
    return new Promise<boolean>((resolve, reject) => modalRef.content.onClose.subscribe((result: any) => resolve(result)));
  }

  openSearchModal(data: searchModal) {
    const initialState = {
      animated: true,
      class: 'm-0 search_div open'
    };
    this.modalRef = this.modalService.show(SearchModalComponent, initialState);
    this.modalRef.content.setInput(data);
    return new Promise<boolean>((resolve, reject) => this.modalRef.content.onClose.subscribe((result: any) => resolve(result)));
  }

  async openInfoModal(data: infoModalData, cssClass: string = 'modal-sm') {
    const initialState = {
      animated: true,
      id: 3,
      class: cssClass,
    };
    this.modalRef = await this.modalService.show(InfoModalComponent, initialState,);
    this.modalRef.content.setInput(data);
    return new Promise<boolean>((resolve, reject) =>
      this.modalRef.content.onClose.pipe(take(1)).subscribe((result: any) => resolve(result))
    );
  }

  async openModal(componentData: any, data: any, cssClass: string = 'modal-sm', id = 1, backdrop = true) {
    const initialState: any = {
      animated: true,
      id: id,
      class: cssClass,
      keyboard: backdrop
    };
    if (backdrop == false) {
      initialState.backdrop = 'static';
    }
    this.modalRef = await this.modalService.show(componentData, initialState);
    this.setCurrentUrl();
    this.modalRef.content.setInput(data);
    this.modalRef.content.onClose = new Subject();
    this.modalRef.onHide?.pipe(take(1)).subscribe((result: any) => { this.updateUrl() })
    return new Promise<boolean>((resolve, reject) =>
      this.modalRef.content?.onClose?.pipe(take(1)).subscribe((result: any) => { console.log('on closed called', result); resolve(result) })
    );
  }
  setCurrentUrl() {
    this.currentUrl = { url: this.route.url, fragment: this.activateRoute.snapshot.fragment, queryParam: this.activateRoute.snapshot.queryParams };
  }
  updateUrl() {
    let url = this.currentUrl.url.split('#')[0] || '';
    url = url.split('?')[0] || '';
    if (url) {
      this.route.navigate([url.split('?')[0] || ''], { fragment: this.currentUrl.fragment, queryParams: this.currentUrl.queryParam })
    }
    this.currentUrl = { url: '' };
  }
  async showPreviewModal(data: emailConfigData, cssClass: string = 'modal-md', id = 1, backdrop = true) {
    return this.openModal(EmailSenderComponent, data, cssClass, id);
  }



  openModalTemplate(template: TemplateRef<any>, cssClass: string = 'modal-lg') {
    const initialState = {
      animated: true,
      id: 2,
      class: cssClass,
    };
    return this.modalRef = this.modalService.show(template, initialState);
  }
  close() {
    this.updateUrl();
    this.modalRef.hide()
  }

  openSponsorInfo(data: any, id: any = 1) {
    this.openModal(SponsorBasicComponent, data, 'modal-xl', id);
  }
  openDonorInfo(data: any, id: any = 1) {
    this.openModal(DonationInfoComponent, data, 'modal-xl', id);
  }

  isModalOpen() {
    const m = document.getElementsByClassName('modal-open');
    return m.length;
  }
}


