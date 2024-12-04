import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilder, formDynamicValidator } from 'src/app/helper/interface/response';
import { User } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { churchMemberForm } from '../../helper/church-form';
import { ChurchApiService } from '../../service/church-api.service';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.scss']
})
export class NewMemberComponent implements OnInit {
  churchId: string | number = '';
  memberId: string | number = '';
  urlService = UrlServices.PAGE_URL;
  isModal: boolean = false;
  basicFormData: formBuilder[] = [];
  submitted: boolean = false;
  dataLoading: boolean = false;
  loading: boolean = false;
  disabled_save: boolean = false;
  churchData: any = {};
  pageInfo: pageInfo = {} as pageInfo;
  churchShowData: any = [];
  churchDynamicValidator: formDynamicValidator[] = [{
    controlName: 'marital_status_id',
    validatorControl: ['spouse_name', 'do_marriage'],
    hideControl: ['spouse_name', 'do_marriage'],
    value: '2',
  },
  {
    controlName: 'edu_status',
    validatorControl: ['course_name'],
    hideControl: ['course_name'],
    value: '1',
  },
  {
    controlName: 'job_status',
    validatorControl: ['job'],
    hideControl: ['job'],
    value: '1',
  },
  {
    controlName: 'job_status',
    validatorControl: ['job'],
    hideControl: ['job'],
    value: '1',
  },
  {
    controlName: 'category',
    validatorControl: ['register_number','do_bap'],
    hideControl: ['register_number','do_bap'],
    value: '1',
    // validator: [{ name: 'required' }]
  },
  {
    controlName: 'is_alive',
    validatorControl: ['died_on'],
    hideControl: ['died_on'],
    value: 0,
    validator: []
  },]
  memberData: any = {};
  user: User = this.auth.currentUserValue
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  constructor(private modalService: ModalService, private navServ: NavigationService,
    private alertService: AlertService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private churchApi: ChurchApiService) { }

  ngOnInit(): void {
    // const filterZone = this.auth.getPermittedData(['CHURCH_MEMBER'], ['ADD'], ['region','zone', 'church']);
    const filterZone = this.auth.getPermittedData(['CHURCH_MEMBER'], ['ADD']);

    const form = cloneData(churchMemberForm);
    form.map((e: formBuilder) => {
      if (e.colName == 'zone' || e.colName == 'church_fk_id' || e.colName == 'region') {
        const index = e.colName == 'zone' ? 1 : e.colName == 'region' ? 0 : 2;
        const value = filterZone[index]?.value[0]?.split(',') || [];
        if (value.length) {
          e.apiFilter = { keyName: 'id', operation: '==', value: value };
        }
      }
      return e;
    });
    this.basicFormData = form;
    this.memberId = this.activatedRoute.snapshot.queryParams.id || '';
    this.churchId = this.activatedRoute.snapshot.queryParams.church_id || '';
    this.churchShowData = [{ title: 'Church Name', name: 'church_name' }, { title: 'Church ID', name: 'church_id' }, { title: 'Zone/State', name: 'zoneName' }]
    this.pageInfo = {
      title: (this.memberId ? 'Update ' : 'New ') + ' Church Member',
      buttonShowBtn: this.auth.checkPermission('CHURCH_MEMBER', 'VIEW_ALL'),
      button: {
        title: 'Member List',
        url: this.urlService.CHURCH.MEMBER_LIST.URL,
        queryParams: {}
      }
    }
    if (this.churchId) {
      this.getChurchData();
    } else if (this.memberId) {
      this.getMemberData();
    }
  }

  get isValid() {
    return this.basicForm?.isValid();
  }

  onChange(ev: any) {

  }

  openSearchModal() {
    this.modalService.openSearchModal({ type: 'CHURCH', activeOnly: true }).then((res: any) => {
      if (res) {
        this.churchData = res;
        if (res.church_id) {
          this.basicForm?.setValue('church_id', res.church_id);
          this.basicForm?.setValue('church_fk_id', res.id);
        }
      }
    })
  }

  getChurchData() {
    if (this.churchId) {
      this.dataLoading = true;
      this.churchApi.getBasic(this.churchId).then((res: any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.churchData = res.result;
          //this.alertService.showToast('Successfully Saved', 'success');
        }
      }).catch((err: any) => {
        this.alertService.showToast('Unable to fetch church data', 'error');
      }).finally(() => this.dataLoading = false)
    }
  }

  getMemberData() {
    if (this.memberId) {
      this.dataLoading = true;
      this.churchApi.getMember(this.memberId).then((res: any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.memberData = res.result;
          this.memberData.gifting = this.memberData.gifting.toLowerCase();
          this.memberData.giftingName = this.memberData.gifting.toLowerCase() || ''
          this.pageInfo.info_text = this.memberData.member_id || '';
          this.applyFormValue(this.memberData);
        }
      }).catch((err: any) => {
        this.alertService.showToast('Unable to fetch member data', 'error');
      }).finally(() => this.dataLoading = false)
    }
  }

  async applyFormValue(data: any) {
    if (data && this.basicForm) {
      await this.basicForm?.setData(data);
    }
    this.basicForm?.changeValidator();
  }

  checkAllValid() {
    return !this.basicForm?.isValid();
  }

  apiPayload() {
    const payload = this.basicForm?.getFormValue();
    if (this.memberId) {
      payload.id = this.memberId;
      payload.member_id = this.memberData?.member_id || '';
      payload.last_modify_by = this.user.user_id
    } else {
      payload.created_by = this.user.user_id
    }
    return payload;
  }



  onSubmit() {
    this.submitted = true;
    if (!this.isValid) {
      return;
    }

    if (!this.basicForm?.isFormChange()) {
      this.alertService.showToast('You are made No changes', 'info')
      return;
    }
    this.save();
  }
  reset() {
    this.basicForm?.initForm();
    this.disabled_save = false
  }
  save() {
    this.loading = true;
    this.churchApi.saveMember(this.apiPayload()).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Successfully Saved', 'success');
      }
      if (!this.memberId) {
        this.modalService.openConfirmDialog({ btnOK: 'Add New', btnCancel: 'go Back', title: 'choose', message: 'Are you wish to proceed' }).then(res => {
          if (res) {
            this.reset();
          } else {
            this.close();
          }
        })
      } else {
        this.close();
      }
    }).catch((err: any) => {
      this.loading = false;
      this.alertService.showToast('Unable to save the Member', 'error');
    }).finally(() => { this.loading = false; this.disabled_save = true; })
  }

  close() {
    if (this.isModal) {
      this.modalService.close();
    } else {
      this.navServ.back();
    }
  }
}
