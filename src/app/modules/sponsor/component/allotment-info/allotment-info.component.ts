import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { EmailSenderComponent, emailConfigData } from 'src/app/core/component/email-sender/email-sender.component';
import { ObjectString } from 'src/app/core/helper/core.data.interface';
import { MODIFICATION_PERMISSION, RESPONSE_CODE, SPONSORSHIP_MODULE } from 'src/app/helper/class/app-constant';
import { isArray } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ChildBasicInfoComponent } from 'src/app/modules/child/component/child-basic-info/child-basic-info.component';
import { ChurchBasicComponent } from 'src/app/modules/church/component/church-basic/church-basic.component';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { StaffBasicComponent } from 'src/app/shared/feature-modal/staff-basic/staff-basic.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { SponsorApiService } from '../../service/sponsor-api.service';

@Component({
  selector: 'app-allotment-info',
  templateUrl: './allotment-info.component.html',
  styleUrls: ['./allotment-info.component.scss']
})
export class AllotmentInfoComponent implements OnInit {
  modifyMode: boolean = false;
  isDeleteMode: boolean = false;
  modifyData: any = {};
  dataLoading: boolean = false;
  // sendingEmail: boolean = false;
  sponsorshipId: string = '';
  // loading: boolean = false;
  isModal: boolean = false;
  _bsModalRef: BsModalRef = {} as BsModalRef;
  sponsorData: any = {};
  sponsorshipData: any = {};
  // hasPermissionApprove: boolean = false;
  CURRENT_MODE: number = 1;
  dataForm: UntypedFormGroup = {} as UntypedFormGroup;
  sponsorshipDataSponsorFkId: any;
  sponsorshipDataAmount: any;
  emailDataForm: UntypedFormGroup = {} as UntypedFormGroup;
  EMAIL_CATEGORY: Array<any> = [];
  emailTemp: any = {};
  loadingEmail: any = {};
  modifyInfoTitleText: string = '';
  segment: ObjectString = {
    BASIC: 'Basic',
  }
  showDonation: boolean = false;
  public onClose: Subject<boolean> = new Subject();
  type: 'MODIFICATION' | 'VIEW' = 'VIEW'
  mapInfo: mapInfoView[] = [{ name: 'amount', title: 'Amount', type: 'CURRENCY' }, { name: 'is_monthly', title: 'Frequently Support', type: 'BOOLEAN' }, { name: 'moduleName', title: 'Category' }, { title: 'No of Support', name: 'total_support' },
  { name: 'preference', title: 'Preference' }, { name: 'freq_paymentName', title: 'Frequency' }, { name: 'sponsorship_programName', title: 'Program Name' }];
  constructor(private injector: Injector,
    private masterApi: MasterApiService,
    private activatedRoute: ActivatedRoute,
    private sponsorApi: SponsorApiService,
    private auth: AuthService,
    private modalService: ModalService, private alertController: AlertService) { }

  ngOnInit(): void {
    this.sponsorshipId = this.activatedRoute.snapshot.queryParams.id || '';
    console.log('this.spons', this.sponsorshipId)
    this.showDonation = this.auth.checkPermission('DONATION', 'VIEW_ALL');
    if (this.showDonation) {
      this.segment['DONATION'] = 'Donation';
    }
    if (!this.sponsorshipId) {
      this.isModal = true;
      this._bsModalRef = this.injector.get<BsModalRef>(BsModalRef);
    } else {
      this.getSponsorshipData();
    }
    this.initForm();
  }

  mapViewInfo() {
    const dTo = [{ id: '2', name: 'Church Program' }, { id: '1', name: 'Building' }];
    const geneD: mapInfoView[] = [{ name: 'created_at', title: 'Created On', type: 'DATE' }, { title: 'Last Updated On', type: 'DATE', name: 'updated_at' }],
      stD: mapInfoView[] = [{ name: 'dedication_request', type: 'BOOLEAN', title: 'Dedication Req' }]
    if (this.sponsorshipData.sponsorship_module == SPONSORSHIP_MODULE.STAFF) {
      this.mapInfo = [...this.mapInfo, ...stD];
    } else if (this.sponsorshipData.sponsorship_module == SPONSORSHIP_MODULE.CHURCH) {
      if (this.sponsorshipData) {
        this.mapInfo.map(a => { if (a.name == 'is_monthly') a.title = 'Church Allotment' });
        this.sponsorshipData['church_donation_toName'] = dTo.find(a => a.id == this.sponsorshipData.church_donation_to)?.name;
        const data = [{ name: 'church_donation_toName', title: 'Donate To' }]
        this.mapInfo = [...this.mapInfo, ...data];
      }
    } else if (this.sponsorshipData.sponsorship_module == SPONSORSHIP_MODULE.CHILD) {
      this.mapInfo = [...this.mapInfo, { name: 'child_typeName', title: 'Child type' }]
    }
    this.mapInfo = [...this.mapInfo, ...geneD, { name: 'reason_withdraw', title: 'Reason Withdraw' }, { name: 'remarks', title: 'Remarks' }];
  }

  initForm() {
    this.dataForm = new UntypedFormGroup({
      email: new UntypedFormArray([
      ])
    })
  }
  generateForm() {
    if (isArray(this.modifyData.request_data.allotmentData)) {
      let i = 0;
      this.modifyData.request_data.allotmentData.reverse().forEach((e: any) => {
        const group: any = {};
        group.staff_emp_id = new UntypedFormControl('');
        group.from_staff_emp_id = new UntypedFormControl('');
        group.email_id = new UntypedFormControl('');
        group.module_id = new UntypedFormControl('');
        group.email_action = new UntypedFormControl(0);
        group.body = new UntypedFormControl('');
        group.cc = new UntypedFormControl('');
        group.bcc = new UntypedFormControl('');
        group.to = new UntypedFormControl('');
        group.subject = new UntypedFormControl('');
        group.pdf_content = new UntypedFormControl('');
        group.ref_id = new UntypedFormControl(e.ref_id);
        group.staff_emp_id_old = new UntypedFormControl();
        this.emailDataForm = new UntypedFormGroup(group);
        this.emailFromArray.push(this.emailDataForm);
        i++;
      });
    }
    console.log(this.dataForm);
  }

  get emailFromArray() {
    return this.dataForm.controls["email"] as UntypedFormArray;
  }

  setInput(data: any) {
    this.sponsorshipId = data.ref_id || '';
    this.modifyData = data || {};
    if (data?.request_data) {
      this.type = 'MODIFICATION'
    }
    if (data.action_id) {
      this.modifyInfoTitleText = +data.action_id == MODIFICATION_PERMISSION.ADD ? 'Request looking to Create New sponsorship' : 'Request looking to Update sponsorship';
      this.CURRENT_MODE = +data.action_id;
      if (+data.action_id == MODIFICATION_PERMISSION.RELIVE) {
        this.modifyInfoTitleText = 'Request looking to Relive sponsorship Allotment';
        this.isDeleteMode = true;
      }
      if (+data.action_id == MODIFICATION_PERMISSION.MAKE_ACTIVE) {
        this.modifyInfoTitleText = 'Request to Re Active the Sponsorship'
        this.isDeleteMode = true;
      }
      this.modifyMode = true;
    }
    if (data.request_data) {
      this.segment?.DONATION && delete this.segment?.DONATION;
      this.sponsorshipId = data.request_data.id;
      this.modifyData.request_data.child_typeName = this.mapChildName(data.request_data)
      if (!this.sponsorshipId) {
        this.mapViewInfo();
        this.getSponsorData(data.request_data?.sponsor_fk_id);
      } else {
        this.getSponsorshipData();
      }
    } else {
      this.getSponsorshipData();
    }
  }

  reAllotDropDownShow: Array<any> = [];
  onChangeEmail(ev: any, a: any, index: number) {
    console.log(this.modifyData.request_data.allotmentData[index], this.emailFromArray.controls[index]);
    const action = +(ev.target.value) || 0;
    const reAllotId = [2]
    if (reAllotId.includes(action)) {
      this.reAllotDropDownShow[index] = true;
      return;
    } else {
      this.reAllotDropDownShow[index] = false;
    }
    this.emailFromArray.controls[index].patchValue({ email_action: action });
    if (action) {
      const payload = this.apiPayloadEmail(a);
      this.getEmailGen(action, payload, index);
    }
    console.log(this.emailFromArray, ev.target.value, a);
  }


  onChangeReAllot(ev: any, a: any, index: number) {
    const action = +(ev.target.value) || 0;
    this.emailFromArray.controls[index].patchValue({ staff_emp_id_old: action, email_action: 2 });
    if (!action) { return; }
    a.staff_emp_id_old = action;
    const payload = this.apiPayloadEmail(a);
    this.getEmailGen(2, payload, index);
  }

  showPreview(index: number, isPdf: boolean = false) {
    let data: emailConfigData = {} as emailConfigData,
      formData = this.emailFromArray.controls[index].value;
    if (!+formData.email_action) {
      this.alertController.showToast('You have selected No Email doest have a Preview', 'info');
      return;
    }
    data = formData;
    if (isPdf) {
      data.config = { is_pdf: true, is_preview: true };
    }
    this.modalService.openModal(EmailSenderComponent, data, isPdf ? 'modal-full' : 'modal-xl', 2).then((res: any) => {
      this.updateFormByIndex(index, res);
    })
  }

  updateFormByIndex(index: number, data: any) {
    const group: any = {};
    const key = ['body', 'cc', 'bcc', 'subject', 'pdf_content', 'to'];
    key.forEach((e: any) => {
      group[e] = data[e];
    })
    this.emailFromArray.controls[index].patchValue(group);
  }

  apiPayloadEmail(data: any) {
    const payload: any = {};
    if (this.sponsorshipData.sponsorship_module == SPONSORSHIP_MODULE.STAFF) {
      payload.staff_emp_id = data.ref_id || data.staff_emp_id;
      if (data.staff_emp_id_old) {
        payload.staff_emp_id_old = data.staff_emp_id_old;
      }
    }
    payload.sponsor_id = this.sponsorData.sponsor_id;
    return payload;
  }

  getEmailGen(id: string | number, payload: any, index: number) {
    const Id: string = String(index);
    this.loadingEmail[index] = true;
    this.masterApi.generateEmail(id, payload).then((res: ResponseData | any) => {
      if (res.result) {
        this.updateFormByIndex(index, res.result);
        console.log(this.emailFromArray);
      }
    }).finally(() => this.loadingEmail[index] = false);
  }

  getEmailList() {
    this.EMAIL_CATEGORY.push({ id: 0, name: 'No Email' })
    const skipId = ['4']
    this.masterApi.getFullData('email_template', [this.sponsorshipData.sponsorship_module]).then((res: ResponseData | any) => {
      if (res.result) {
        res.result.forEach((e: any) => {
          // check skip id and email allow to send
          if (!skipId.includes(e.id) && +e.allow_to_send_email) {
            const dat = { id: e.id, name: e.event_name.split('_')[1] }
            this.EMAIL_CATEGORY.push(dat)
          }
        });
      }
    });
  }

  getSponsorData(sponsorId: any) {
    if (sponsorId) {
      this.sponsorApi.getBasic(sponsorId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.sponsorData = res.result
        }
      })
    }
  }

  showBasicInfo(ref: any, module_id: any) {
    if (ref) {
      let temp: any,
        data: any = {};
      switch (+module_id) {
        case SPONSORSHIP_MODULE.STAFF:
          temp = StaffBasicComponent;
          data['staff_emp_id'] = ref;
          break;
        case SPONSORSHIP_MODULE.CHILD:
          temp = ChildBasicInfoComponent;
          data['child_id'] = ref;
          break;

        default:
          temp = ChurchBasicComponent;
          data['church_id'] = ref;
          break;
      }
      this.modalService.openModal(temp, data, 'modal-lg', 3);
    }
  }

  private mapChildName(d: any) {
    return d.child_type == 2 ? 'Home Child' : d?.child_type == 1 ? 'MK Child' : '';
  }
  getSponsorshipData() {
    if (this.sponsorshipId) {
      this.dataLoading = true;
      this.sponsorApi.getSponsorshipDetails(this.sponsorshipId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.sponsorshipData = res.result;
          this.sponsorshipDataSponsorFkId = this.sponsorshipData.sponsor_fk_id
          this.sponsorshipDataAmount = this.sponsorshipData.amount
          console.log('this.spa', this.sponsorshipData.sponsor_fk_id)
          console.log('this.spa', res.result)
          this.sponsorData = res.result.sponsor || {};
          this.sponsorshipData.child_typeName = this.mapChildName(this.sponsorshipData);
          if (this.isDeleteMode) {
            this.modifyData.request_data.allotmentData = this.sponsorshipData.allotment.filter((a: any) => !a.deleted_at).map((a: any) => { a.action = 3; return a }) || [];
          }
          if (this.type == 'MODIFICATION' && (this.CURRENT_MODE == 6 || this.isDeleteMode)) {
            this.getEmailList();
            this.generateForm();
          }
          this.mapViewInfo();
        }
      }).finally(() => { this.dataLoading = false })
    }
  }


  // sendEmailPdf(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     const api: Array<any> = [];
  //     if (this.emailFromArray.length) {
  //       const value = this.emailFromArray.value;
  //       Object.values(value).forEach((a: any) => {
  //         if (+a.email_action) {
  //           a.user_id = this.auth.currentUserValue.user_id;
  //           api.push(this.masterApi.sendEmail(a));
  //         }
  //       });
  //     }
  //     if (api.length) {
  //       forkJoin(api).toPromise().then(res => {
  //         resolve(res);
  //       }).catch(err => {
  //         reject(err);
  //       });
  //     } else {
  //       resolve(true);
  //     }
  //   });
  // }


  approveRequest = (payload: any) => {
    let API: Promise<any>;
    payload.email = [];
   
    if (this.emailFromArray.length) {
      const value = this.emailFromArray.value;
      Object.values(value).forEach((a: any) => {
        if (+a.email_action) {
          a.user_id = this.auth.currentUserValue.user_id;
          payload.email.push(a);
        }
      });
    }
    if (this.isDeleteMode) {
      API = this.sponsorApi.reliveSponsorship(this.sponsorshipData.id, payload);
    } else if (+this.modifyData.action_id == MODIFICATION_PERMISSION.ALLOTMENT) {
       payload.sponsor_fk_id = this.sponsorshipDataSponsorFkId
    payload.alloted_amount = this.sponsorshipDataAmount
      API = this.sponsorApi.saveAllotment(payload);
    } 
    else {
      API = this.sponsorApi.saveSponsorShip(payload);
    }
    return API
  }
}