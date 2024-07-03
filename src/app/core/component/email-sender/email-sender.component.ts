import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { cloneData, isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { formBuilderData, ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { EmailApiService } from 'src/app/modules/email/service/email-api.service';
import { EMAIL_TEMP_FORM } from 'src/app/modules/master/config/config';
import { FormDocComponent } from 'src/app/shared/form/component/form-doc/form-doc.component';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { environment } from 'src/environments/environment';

export interface emailConfigData {
  config?: config
  body: any
  subject?: any
  cc?: any,
  bcc?: any,
  replaceKey?: any;
  pdf_content?: any;
  mode?: 'EMAIL' | 'PDF';
  type?: 'PREVIEW' | 'SEND' | 'VIEW';
  id?: string | number,
  payload?: any,
  to?: string,
  attachment?: Array<any>
}
interface config {
  is_preview?: boolean
  is_pdf?: boolean,
  is_sent?: boolean
}
@Component({
  selector: 'app-email-sender',
  templateUrl: './email-sender.component.html',
  styleUrls: ['./email-sender.component.scss']
})
export class EmailSenderComponent implements OnInit {
  mode: 'EMAIL' | 'PDF' = 'EMAIL';
  type: 'PREVIEW' | 'SEND' | 'VIEW' = 'VIEW';
  formData: emailConfigData = {} as emailConfigData;
  config: config = {};
  isModal: boolean = false;
  dataLoading: boolean = false;
  iframeLoad: boolean = false;
  pdf_url: any = `${environment.emailApiUrl}printpdf/`;
  emailData: any;
  loading: boolean = false;
  public onClose: Subject<any> = new Subject();
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('docForm') docForm: FormDocComponent | undefined;
  title: string = '';
  BASIC_FORM_BUILDER: formBuilderData[] = cloneData(EMAIL_TEMP_FORM)?.slice(3).filter((a: any) => a.colName != 'allow_email');
  constructor(private sanitizer: DomSanitizer,
    private emailApi: EmailApiService,
    private _bsModalRef: BsModalRef,
    private modalService: ModalService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void { }

  setInput(data: emailConfigData) {
    if (!isEmptyObj(data)) {
      this.isModal = true;
      if (data.type) {
        this.type = data.type
      }
    }
    this.mode = data.config?.is_pdf ? 'PDF' : 'EMAIL';
    if (data.config?.is_pdf && data.pdf_content) {
      this.type = data.config.is_preview ? 'PREVIEW' : 'VIEW';
      this.getPreviewPdf(data.pdf_content);
    } else if (data.payload && data.id) {
      this.type = data.config?.is_sent ? 'SEND' : 'PREVIEW';
      this.title = this.type == 'SEND' ? 'Send Email' : 'Preview';
      this.genEmail(data.id, data.payload); //post data on data body
    } else if (data.id && !data.body) {
      this.type = data?.config?.is_preview ? 'PREVIEW' : 'VIEW';
      this.title = this.type == 'PREVIEW' ? 'Email Preview' : 'Email Info'
      this.getEmail(data.id);
      return;
    }
    this.title = this.title ? this.title : this.mode.toLowerCase() + ' ' + this.type.toLocaleLowerCase();
    this.formData = data;
    if (data.type == 'SEND' && data.to) {
      setTimeout(() => {
        if (data.to) {
          let to: any = data.to;
          if (typeof data.to == 'string') {
            to = data.to?.split(',')
          }
          this.basicForm?.setValue('to', to);
        }
        if (isArray(data?.attachment)) {
          this.docForm?.setData(data.attachment);
        }
      }, 800);
    }
    if (this.formData.body) {
      this.mapKeyValue();
    }
  }

  getEmail(id: string | number) {
    this.dataLoading = true;
    this.emailApi.getEmailById(id).then((res: ResponseData | any | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.emailData = res.result;
      } else {
        this.alertService.showToast('Unable to get the Email', 'error')
      }
    }).catch((err: any) => {
      this.alertService.showToast('Unable to complete', 'error')
    }).finally(() => this.dataLoading = false)
  }

  onChange(e: any) { }
  getSafeUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }


  genEmail(id: string | number, payload: any): any {
    if (this.type == 'PREVIEW') {
      if (this.mode == 'PDF') {
        return this.getPreviewPdf(payload, id)
      }
    }
    this.dataLoading = true;
    this.emailApi.generateEmail(id, payload).then((res: ResponseData | any) => {
      if (res.result) {
        if (this.type == 'PREVIEW') {
          if (this.mode == 'PDF') {

          } else {
            this.emailData = res.result;
          }
          return;
        } else if (this.formData.to) {
          res.result.to = res.result.to ? res.result.to + ',' + this.formData.to : this.formData.to;
        }
        this.basicForm?.setData(res.result);
        this.formData.body = res.result.body;
      }
    }).finally(() => this.dataLoading = false);
  }
  async getPreviewPdf(data: any, id: string | number = '') {
    this.iframeLoad = true;
    data = await this.sanitizer.bypassSecurityTrustHtml(data);
    if (data.hasOwnProperty("changingThisBreaksApplicationSecurity")) {
      data = data["changingThisBreaksApplicationSecurity"];
    }
    let payload: any = {};
    if (!id) {
      payload.pdf_content = data;
    } else {
      payload = data;
    }
    this.emailApi.showPdf(payload, id).then((res: any) => {
      const blob = new Blob([res], { type: 'application/pdf' })
      this.pdf_url = this.getSafeUrl(URL.createObjectURL(blob));
    }).finally(() => this.iframeLoad = false);
  }

  showPdfPreview() {
    this.modalService.openModal(EmailSenderComponent, { pdf_content: this.emailData.pdf_content, config: { is_preview: true, is_pdf: true } }, 'modal-lg', 2)
  }

  mapKeyValue() {
    if (this.formData.replaceKey) {
      Object.keys(this.formData.replaceKey).forEach((a: any) => {
        this.formData.body.replace(`{${a}}`, this.formData.replaceKey[a]);
        this.formData?.subject.replace(`{${a}}`, this.formData.replaceKey[a]);
      });
    }
  }

  send() {
    if (!this.basicForm?.isValid()) {
      return;
    }
    let payload = this.basicForm?.apiPayload();
    payload.cc = typeof payload.cc == 'string' ? payload.cc : payload.cc.join(',');
    payload.bcc = typeof payload.bcc == 'string' ? payload.bcc : payload.bcc.join(',');
    payload.to = typeof payload.to == 'string' ? payload.to : payload.to.join(',');
    payload.body = this.formData.body;
    payload.attachment = this.docForm?.apiPayload() || [];
    this.loading = true;
    this.emailApi.sendEmail(payload).then(res => {
      this.alertService.showToast('Email Has been sent', 'success');
      this.close({ emailSend: true })
    }).finally(() => this.loading = false).catch(re => { this.alertService.showToast('Email failed to sent', 'error'); });
  }

  onChangeContent(ev: any) {
    const dat = ev.target.innerHTML || '';
    if (this.formData.config?.is_pdf) {
      this.formData.pdf_content = dat;
    } else {
      this.formData.body = dat;//this.getSafeHtml(dat);
    }
  }
  close(data: any = false) {
    this._bsModalRef.hide();
    this.onClose.next(data || this.formData);
  }
}
