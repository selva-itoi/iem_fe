import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { MasterApiService } from '../../service/master-api.service';

@Component({
  selector: 'app-edit-email-template',
  templateUrl: './edit-email-template.component.html',
  styleUrls: ['./edit-email-template.component.scss']
})
export class EditEmailTemplateComponent implements OnInit {
  urlService = UrlServices.PAGE_URL
  email_id: string | number = '';
  loading: boolean = false
  emailData: any = {}
  dataLoading: boolean = false;
  dataForm: UntypedFormGroup = {} as UntypedFormGroup;
  submitted: boolean = false;
  showBtnList: boolean = false;
  contentBody: any = '';
  emailKeys: Array<any> = [];
  @ViewChild('bodyDiv') bodyDiv: any;
  @ViewChild('editor') editor: any;

  constructor(private activatedRoute: ActivatedRoute, private masterApi: MasterApiService,
    private sanitizer: DomSanitizer, private modalService: ModalService,
    private navigation: NavigationService,
    private alertService: AlertService) {

  }



  ngOnInit(): void {
    this.email_id = this.activatedRoute.snapshot.queryParams.id || '';
    this.initForm();
    this.getData();
  }

  initForm() {
    this.dataForm = new UntypedFormGroup({
      event_name: new UntypedFormControl('', [Validators.required]),
      subject: new UntypedFormControl('', [Validators.required]),
      body: new UntypedFormControl('', []),
      cc: new UntypedFormControl('', []),
      bcc: new UntypedFormControl('', []),
      allow_to_send_email: new UntypedFormControl(false)
    });
  }


  onAddChips(e: any, ctrlName: string) {
    //console.log(this.dataForm.value[ctrlName]);
    if (e.value) {
      if (!VALIDATOR_PATTERNS.EMAIL.test(e.value)) {
        this.dataForm.value[ctrlName].pop() || [];
      }
    }
  }

  mapFormValue(data: any) {
    if (!isEmptyObj(data)) {
      const dataValue: any = {};
      Object.keys(this.dataForm.controls).forEach((e: any) => {
        console.log(data[e]);
        dataValue[e] = data[e] ? data[e] : '';
        if (e == 'cc' || e == 'bcc') {
          dataValue[e] = data[e] ? data[e].split(',') : '';
        }
      });
      this.emailKeys = data.parameter ? data.parameter.split(',') : [];
      //\dataValue.report_date_month = new Date(date);
      this.dataForm.patchValue(dataValue);
      console.log(this.editor);
    }
  }

  apiPayload() {
    const payload: any = {}
    payload.body = this.bodyDiv.nativeElement.innerHTML;
    payload.cc = typeof this.dataForm.value.cc == 'string' ? this.dataForm.value.cc : this.dataForm.value.cc.join(',');
    payload.bcc = typeof this.dataForm.value.bcc == 'string' ? this.dataForm.value.bcc : this.dataForm.value.bcc.join(',');
    payload.subject = this.dataForm.value.subject,
    payload.allow_to_send_email = this.dataForm.value.allow_to_send_email ? 1 : 0;
    if (this.email_id) {
      payload.id = this.email_id;
    }
    return payload;
  }

  onDescriptionChange(ev: any) {
    this.contentBody = ev;
    this.dataForm.patchValue({ body: ev });
  }





  getData() {
    if (this.email_id) {
      this.loading = true;
      this.masterApi.getById('email_template', this.email_id).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.emailData = res.result;
          this.contentBody = this.sanitizer.bypassSecurityTrustHtml(res.result.body);
          this.mapFormValue(this.emailData);
        }
      }).finally(() => {
        this.loading = false;
      })
    }
  }

  openPreview(temp: any) {
    this.contentBody = this.sanitizer.bypassSecurityTrustHtml(this.bodyDiv.nativeElement.innerHTML);
    this.modalService.openModalTemplate(temp);
  }

  onSubmit() {
    if (this.dataForm.valid) {
      this.loading = true;
      this.masterApi.saveData('email_template', this.apiPayload()).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.alertService.showToast('Save your changes', 'success')
        }
      }).finally(() => {
        this.loading = false;
      }).catch(err => {
        this.alertService.showToast('unable to Save your changes', 'error')
      })
    }
  }


  close() {
    this.navigation.back();
  }

  closeModal() {
    this.modalService.close();
  }
}
