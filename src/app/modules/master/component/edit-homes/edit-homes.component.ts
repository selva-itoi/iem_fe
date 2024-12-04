import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { AddressComponent } from 'src/app/core/component/address/address.component';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilder, ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { UserApiService } from 'src/app/modules/user/services/user-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { HOME_FORM, HOME_OFFICE_FORM } from '../../config/config';
import { MasterApiService } from '../../service/master-api.service';

@Component({
  selector: 'app-edit-homes',
  templateUrl: './edit-homes.component.html',
  styleUrls: ['./edit-homes.component.scss']
})
export class EditHomesComponent implements OnInit {

  urlService: any = UrlServices.PAGE_URL;
  dataForm: any;
  dataLoading: boolean = false;
  homeData: any;
  loading: boolean = false;
  submitted: boolean = false;
  initialFormValue: any;
  inChargeData: any = {};
  homeId: string | number = '';
  public onClose: Subject<boolean> = new Subject();

  masterLoading: any = {};
  pageInfo: pageInfo = {} as pageInfo;
  basicFormData: formBuilder[] = HOME_FORM;
  officeFormData: formBuilder[] = HOME_OFFICE_FORM;
  @ViewChild('address') address: AddressComponent | undefined;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('officeForm') officeForm: FormGeneratorComponent | undefined;
  constructor(public userApi: UserApiService,
    private auth: AuthService, private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private modalService: ModalService,
    private navigation: NavigationService, private masterApi: MasterApiService) { }

  ngOnInit(): void {
    const showBtnList = this.auth.checkPermission('MASTER', 'MANAGE_HOMES');
    this.homeId = this.activatedRoute.snapshot.queryParams.id || '';
    this.pageInfo = {
      title: (this.homeId ? 'Update' : 'New') + ' Home / Project',
      buttonShowBtn: showBtnList,
      button: {
        title: 'All Home',
        url: this.urlService.MASTER.HOMES.URL,
      }
    }
    this.getHomesDetails();
    this.initForm();
  }
  onChange(e: any) {
    if(!isEmptyObj(e) && e.controlName == 'field'){
      this.address?.updateAddressByField(e.value);
    }
   }

  initForm() {
    this.dataForm = new UntypedFormGroup({
      no_of_girls: new UntypedFormControl('', [Validators.pattern(VALIDATOR_PATTERNS.NUMBER)]),
      no_of_boys: new UntypedFormControl('', [Validators.pattern(VALIDATOR_PATTERNS.NUMBER)]),
      staff_incharge_fk_id: new UntypedFormControl('',this.homeId ? [] :[Validators.required]),
    });
  }

  openStaffModal() {
    this.modalService.openSearchModal({ type: 'STAFF' }).then(async (res: any) => {
      if (res) {
        this.inChargeData = res;
        this.dataForm.patchValue({ staff_incharge_fk_id: res.id })
      }
    });
  }

  checkAllvalid(): boolean {
    const a = this.address?.isValidForm() && this.officeForm?.isValid() && this.basicForm?.isValid();
    return this.dataForm.valid && a ? true : false;
  }

  isFormChange() {
    const src = JSON.stringify(this.initialFormValue);
    const to = JSON.stringify(this.apiPayload());
    return src === to;
  }

  applyFormValue(data: any) {
    if (data) {
      const mapData: any = {};
      Object.keys(this.dataForm.controls).forEach((e: any) => {
        mapData[e] = data[e] ? data[e] : '';
      });
      this.dataForm.patchValue(mapData);
      this.basicForm?.setData(data);
      this.officeForm?.setData(data);
      this.ref.detectChanges();
      this.initialFormValue = this.apiPayload();
    }
  }

  getHomesDetails() {
    if (this.homeId) {
      this.dataLoading = true;
      this.masterApi.getById('home', this.homeId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (res.result) {
            this.homeData = res.result;
            this.address?.applyFormValue(this.homeData);
            this.applyFormValue(res.result);
          }
        }
      }).finally(() => {
        this.dataLoading = false;
      });
    }
  }


  apiPayload() {
    const payload = { ...this.dataForm.value, ...this.basicForm?.apiPayload(), ...this.officeForm?.apiPayload() };
    const data = this.address?.apiPayload();
    const skipData = ['level', 'isPermanent', 'isPresent', 'locationSearch', 'levelSearch', 'wardName', 'cityName', 'stateName', 'countryName', 'districtName', 'vName', 'pName']
    Object.keys(data).forEach(a => {
      if (!skipData.includes(a)) {
        payload[a] = data[a]
      }
    })
    payload.last_modify_by = this.auth.currentUserValue.user_id;
    if (this.homeId) {
      payload.id = this.homeId;
    }
    return payload;
  }


  onSubmit() {
    this.submitted = true;
    if (!this.checkAllvalid()) {
      this.alertService.showToast('Please Ensure all the field valid', 'info')
      return;
    }
    if (this.isFormChange() && !this.address?.isFormChange()) {
      this.alertService.showToast('There is a no changes you made', 'info')
      return;
    }
    this.save();
  }

  save() {
    this.loading = true;
    this.masterApi.saveData('home', this.apiPayload()).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('SuccessFully Saved', 'success');
        this.close();
      }
    }).catch((err: any) => {
      this.alertService.showToast('Failed to save', 'error');
    }).finally(() => {
      this.loading = false;
    })
  }

  close() {
    this.navigation.back();
  }
}
