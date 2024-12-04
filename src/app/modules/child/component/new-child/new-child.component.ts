// import { ChildSbilingComponent } from '../child-sbiling/child-sbiling.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddressComponent } from 'src/app/core/component/address/address.component';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { AppConstant, MODULE_NAME, PERMISSION, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { formBuilder, formBuilderData, ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { StaffEducationComponent } from 'src/app/modules/staff/component/staff-education/staff-education.component';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { CHILD_BASIC_FORM, CHILD_DYNAMIC_VALIDATOR, CHILD_OTHERS_FORM } from '../../helper/child-form';
import { ChildApiService } from '../../service/child-api.service';
import { ChildPhysicalComponent } from '../child-physical/child-physical.component';
import { ParentsComponent } from '../parents/parents.component';
import { ChildSbilingRefComponent } from 'src/app/shared/feature-modal/child-sbiling-ref/child-sbiling.component';
@Component({
  selector: 'app-new-child',
  templateUrl: './new-child.component.html',
  styleUrls: ['./new-child.component.scss']
})
export class NewChildComponent implements OnInit {
  childId: string = '';
  urlService = UrlServices.PAGE_URL;
  staffEmpId: any = '';
  disabled_save: boolean = false;
  isModifyRequestPending: boolean = false;
  segement = {
    BASIC: 'Basic',
    PARENT: 'Parents',
    ADDRESS: 'Address',
    SIBILING: 'Sibling',
    EDUCATION: 'Education',
    PHYSICAL: 'Physical',
    OTHERS: 'Others',
  }
  segementError: any = {
    BASIC: false,
    PARENT: false,
    SIBILING: false,
    EDUCATION: false,
    PHYSICAL: false,
    OTHERS: false,
  }
  dateFormat = AppConstant.DATE_FORMAT;
  submitted: boolean = false;
  currentSegment: string = this.segement.BASIC;
  pSegment: string | undefined = '';
  nSegment: string | undefined = this.segement.PARENT;
  nSegmentDisabled: boolean = false;
  dataForm: FormGroup = {} as FormGroup;
  dataLoading: boolean = false;
  loading: boolean = false;
  childData: any = {};
  otherFormData: formBuilder[] = CHILD_OTHERS_FORM;
  basicFormData: formBuilder[] = [];
  pageInfo: pageInfo = { title: 'Child ' };
  type: 'MK' | 'HOME' | undefined;
  childDynamicFormData = CHILD_DYNAMIC_VALIDATOR
  registeredUser: FormControl = new FormControl(false);
  @ViewChild('address') address: AddressComponent | undefined;
  @ViewChild('childEdu') childEdu: StaffEducationComponent | undefined;
  @ViewChild('childPhysical') childPhysical: ChildPhysicalComponent | undefined;
  @ViewChild('othersForm') othersForm: FormGeneratorComponent | undefined;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('parentsDiv') parentsDiv: ParentsComponent | undefined;
  @ViewChild('childSibiling') childSibiling: ChildSbilingRefComponent | undefined;
  constructor(private navigation: NavigationService,
    private alertService: AlertService,
    private modifyrequest: ModifyService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private childApi: ChildApiService, private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.childId = this.activatedRoute.snapshot.queryParams.id || '';
    const showBtnList = this.auth.checkPermission('CHILD', 'VIEW_ALL');
    this.pageInfo = {
      title: (!this.childId ? 'New' : 'Update') + ' Child ',
      buttonShowBtn: showBtnList,
      button: {
        title: 'View All Child',
        url: this.urlService.CHILD.LIST.URL,
      },
      info_text: this.childId || ''
    }
    if (!this.childId) {
      const mk = this.auth.checkPermission('CHILD', 'MANAGE_MK_CHILD'),
        homeK = this.auth.checkPermission('CHILD', 'MANAGE_HOME_CHILD');
      if (homeK == true && mk == true) {
        this.modalService.openConfirmDialog({ disableClose: true, title: 'Choose Profile', message: 'Which Child profile do you want to Create ?', btnCancel: ' Home Child', btnOK: 'MK Child' }).then(res => {
          if (res) {
            this.type = 'MK'
          } else {
            this.type = 'HOME'
          }
          this.fomBuilder();
        })
      } else {
        this.type = mk ? 'MK' : 'HOME';
        this.fomBuilder();
      }
    } else {
      this.getData();
    }
  }

  async fomBuilder() {
    let skipKey = ['religion', 'community', 'child_no'];
    let validator_required = ['stayed_category_id'],
    validator_remove = ['home'];
    if (this.type == 'HOME') {
      skipKey = ['stayed_category_id'];
      validator_required = ['religion', 'community', 'child_no'],
      validator_remove = []
      setTimeout(() => {
        this.basicForm?.setValue('stayed_category_id', 1);
      }, 1000);
    }
    const res = this.checkPermission();
    if (!res) {
      this.alertService.showToast('Access Denied', 'warn');
      this.navigation.back();
    }
    const apiFilter = { keyName: 'allow_mk', value: '1', operation: '==' }
    this.basicFormData = [];
    const s = this.getChildBasic();
    await s.map((a: formBuilderData) => {
      if (skipKey.includes(a.colName)) { a.visible = false, a.hidden = true, a.validator = []; }
      else if (validator_required.includes(a.colName)) {
        a.validator = [{ name: 'required' }]
        a.hidden = false
      }
      if (validator_remove.includes(a.colName)) {
        a.validator = []
      }
      //@ts-ignore
      if (this.type == 'MK' && a.colName == 'home') { a.apiFilter = apiFilter; }
      else{
        delete a.apiFilter;
      }
       return a;
    })
    this.basicFormData = s
    if (this.type == 'MK') {
      this.address?.setReadOnly(true);
    }
  }

  getChildBasic() {
    return cloneData(CHILD_BASIC_FORM);
  }

  get validSegemnet() {
    let result: any = false;
    if (this.currentSegment) {
      switch (this.currentSegment) {
        case 'Basic':
          result = !this.basicForm?.isValid();
          break;
        case 'Parent Detail':
          result = !this.parentsDiv?.isValid();
          break;
        case 'Physical':
          //result = !this.childPhysical?.isValid();
          break;
        case 'Others':
          result = !this.othersForm?.isValid();
          break;
      }
    }
    return result;
  }

  checkAllValid() {
    this.segementError.BASIC = !this.basicForm?.isValid();
    this.segementError.PARENT = !this.parentsDiv?.isValid();
    this.segementError.OTHERS = !this.othersForm?.isValid();
    return Object.values(this.segementError).some((a: any) => a == true);
  }

  apiPayload() {
    const payload = this.basicForm?.apiPayload(),
      Uid = this.auth.currentUserValue.user_id;
    if (this.childId) {
      payload.id = this.childData?.id || '';
      payload.last_modify_by = Uid
    } else {
      payload.status = +payload.status ? payload.status : 1
      payload.created_by = Uid
    }
    payload.child_type = this.type == 'MK' ? 1 : 2;
    payload.address = this.address?.apiPayload();
    payload.parents = this.parentsDiv?.apiPayload();
    payload.sibiling = this.childSibiling?.apiPayload();
    payload.education = this.childEdu?.apiPayload();
    payload.physical = this.childPhysical?.apiPayload();
    payload.others = this.othersForm?.apiPayload();
    return payload;
  }

  apiPayloadModify() {
    const payload: modifyApi = {} as modifyApi;
    const dataApi = this.basicForm?.apiPayload();
    payload.created_by = this.auth.currentUserValue.user_id,
      payload.action_id = PERMISSION.ADD;
    payload.description = dataApi?.name + ' child requested to Add Record';
    if (this.childId) {
      payload.action_id = PERMISSION.UPDATE;
      payload.description = dataApi?.name + ' child requested to update the details';
    }
    payload.ref_id = this.childData?.child_id || '';
    payload.home = dataApi?.home;
    payload.module_id = MODULE_NAME.CHILD;
    payload.child_type = this.type == 'MK' ? 1 : 2;
    return payload;
  }
  checkPermission() {
    return this.auth.checkPermission('CHILD', this.type == 'HOME' ? 'MANAGE_HOME_CHILD' : 'MANAGE_MK_CHILD');
  }
  searched: boolean = false;
  mapParent(ev: any) {
    if (!isEmptyObj(ev)) {
      this.searched = true;
      this.parentsDiv?.mapParent(ev.parents || []);
      if (ev.address) {
        const d = ev.address;
        delete d.id;
        if (this.type == 'MK') {
          this.address?.setReadOnly(true);
        }
        this.address?.applyFormValue(d);
      }
      if (ev.sibling) {
        this.childSibiling?.setData(ev.sibling || []);
      }
    }
  }

  mapFormValue() {
    if (this.childData) {
      this.isModifyRequestPending = +this.childData?.modify_request ? true : false;
      setTimeout(() => {
        this.basicForm?.setData(this.childData);
      }, 1000);
      this.othersForm?.setData(this.childData.others || {});
      this.address?.applyFormValue(this.childData.address || {});
      this.childPhysical?.setData(this.childData.physical);
      this.childEdu?.setData(this.childData.education);
      this.childSibiling?.setData(this.childData.sibiling);
      this.parentsDiv?.setData(this.childData.parents);
    }
  }

  getData() {
    if (this.childId) {
      this.dataLoading = true;
      this.childApi.getDetail(this.childId).then((res: ResponseData) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.childData = res.result;
          this.type = +this.childData?.child_type == 1 ? 'MK' : 'HOME';
          this.fomBuilder();
          this.mapFormValue();
        }
      }).finally(() => this.dataLoading = false)
    }
  }


  onSubmit() {
    this.submitted = true;
    if (this.checkAllValid()) {
      return;
    }
    this.sendModify();
    //this.saveChildData();
  }
  sendModify() {
    const data = this.apiPayload();
    const modifyApi = this.apiPayloadModify();
    console.log(modifyApi, 'modify api');
    this.loading = true;
    this.modifyrequest.saveModification(modifyApi, data).then((res: any) => {
      if (res) {
        this.disabled_save = true;
        this.close();
      }
    }).catch(err => {
      this.alertService.showToast('Unable to save the Record', 'error');
    }).finally(() => this.loading = false);
  }

  saveChildData() {
    const apiData = this.apiPayload();
    this.loading = true;
    this.childApi.saveDetails(apiData).then((res: ResponseData) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.disabled_save = true;
        this.close();
      }
    }).catch(err => {
      this.alertService.showToast('Unable to save the Record', 'error');
    }).finally(() => this.loading = false)

  }

  returnZero() {
    return 0;
  }
  changeSegment(s: string) {
    //@ts-ignore
    const key: any = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.currentSegment = s;
    this.pSegment = Object.values(this.segement)[Object.keys(this.segement).indexOf(key) - 1];
    this.nSegment = Object.values(this.segement)[Object.keys(this.segement).indexOf(key) + 1];
  }

  close() {
    this.navigation.back();
  }
}


