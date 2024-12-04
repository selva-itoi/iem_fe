import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddressComponent } from 'src/app/core/component/address/address.component';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { MODULE_NAME, PERMISSION, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { ResponseData, formBuilder, formDynamicValidator } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { CHURCH_OTHERS_FORM, churchBasicForm, churchBuildingForm, churchCongregationForm, churchDemoGraphic, churchDynamicValidator, churchProgramForm } from '../../helper/church-form';
import { ChurchApiService } from '../../service/church-api.service';
import { ChurchDocComponent } from '../church-doc/church-doc.component';
import { CouncilMemberComponent } from '../council-member/council-member.component';

@Component({
  selector: 'app-new-church',
  templateUrl: './new-church.component.html',
  styleUrls: ['./new-church.component.scss']
})
export class NewChurchComponent implements OnInit {
  churchId: string = '';
  urlService = UrlServices.PAGE_URL;
  basicFormData: formBuilder[] = cloneData(churchBasicForm).splice(0, 4);
  basicFormPartData: formBuilder[] = cloneData(churchBasicForm).splice(4, 12);
  buildingFormData: formBuilder[] = churchBuildingForm;
  demographicFormData: formBuilder[] = churchDemoGraphic;
  programFormData: formBuilder[] = churchProgramForm;
  congregationFormData: formBuilder[] = churchCongregationForm;
  othersFormData: formBuilder[] = CHURCH_OTHERS_FORM;
  dynamicValidatorBasic: formDynamicValidator[] = churchDynamicValidator
  dataLoading: boolean = false;
  loading: boolean = false;
  churchData: any = {};
  segment = {
    BASIC: 'Basic',
    ADDRESS: 'Address',
    BUILDING: 'Building',
    DEMOGRAPHIC: 'Demographic',
    COUNCIL: 'Council',
    OTHERS: 'Others',
  }
  fieldData: any = {}
  fieldLoading: boolean = false;
  filedDisplayKey = [{ name: 'countryName', title: 'Country' }, { name: 'stateName', title: 'State' }, { name: 'districtName', title: 'District' }, { name: 'subDistrictName', title: 'Sub District' }, { name: 'cityName', title: 'City' }, { name: 'pName', title: 'Panchayat' }, { name: 'wardName', title: 'Ward' }, { name: 'vName', title: 'Village' }]
  pageInfo: pageInfo = {} as pageInfo;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('basicFormPart') basicFormPart: FormGeneratorComponent | undefined;
  @ViewChild('demographicForm') demographicForm: FormGeneratorComponent | undefined;
  @ViewChild('buildingForm') buildingForm: FormGeneratorComponent | undefined;
  @ViewChild('congregationForm') congregationForm: FormGeneratorComponent | undefined;
  @ViewChild('programForm') programForm: FormGeneratorComponent | undefined;
  @ViewChild('othersForm') othersForm: FormGeneratorComponent | undefined;
  @ViewChild('churchDoc') churchDoc: ChurchDocComponent | undefined;
  @ViewChild('councilDiv') councilDiv: CouncilMemberComponent | undefined;
  @ViewChild('address') address: AddressComponent | undefined;
  constructor(private navigationService: NavigationService,
    private alertService: AlertService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private masterApi: MasterApiService, private churchApi: ChurchApiService) { }

  ngOnInit(): void {
    this.churchId = this.activatedRoute.snapshot.queryParams.id || '';
    this.pageInfo = {
      title: (!this.churchId ? 'New ' : 'Update ') + 'Church ',
      buttonShowBtn: this.auth.checkPermission('CHURCH', 'VIEW_ALL'),
      button: {
        title: 'View All',
        url: this.urlService.CHURCH.LIST.URL
      },
      info_text: this.churchId || ''
    }
    if (this.churchId) {
      this.getDetails();
    }
  }

  onChange(e: any) {
    if (!isEmptyObj(e)) {
      if (e.controlName == 'field') {
        this.getFiledData(e.value);
      }
    }
  }
  mapFormValue(data: any) {
    data.is_base_church = +data.is_base_church
    this.basicForm?.setData(data);
    this.basicFormPart?.setData(data);
    if (data.others) {
      data.others.is_parsonage = +data.others.is_parsonage;
      data.others.is_fencing = +data.others.is_fencing;
      data.others.is_eb = +data.others.is_eb;
      data.others.is_toilet = +data.others.is_toilet; data.others.is_water = +data.others.is_water;
    }
    this.address?.applyFormValue(data);
    this.buildingForm?.setData(data?.others || {});
    this.othersForm?.setData(data?.others || {});
    this.demographicForm?.setData(data?.demographic || {});
    this.churchDoc?.setData(data?.doc || []);
  }
  getDetails() {
    if (this.churchId) {
      this.dataLoading = true;
      this.churchApi.getDetails(this.churchId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (!isEmptyObj(res.result)) {
            this.churchData = res.result;
            // this.isModifyRequestPending = +this.churchData?.modify_request ? true : false;
            this.mapFormValue(this.churchData);
          }
        }
      }).finally(() => { this.dataLoading = false; }).catch(((err: any) => { console.log(err, ' unable to get the details'); this.alertService.showToast('Unable to get Data', 'info') }));
    }
  }

  getFiledData(id: any) {
    if (!id) {
      this.fieldData = {};
    }
    this.fieldLoading = true
    this.masterApi.getFieldByid(id, true).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.fieldData = res.result;
        this.address?.applyFormValue(this.fieldData)
      }
    }).finally(() => this.fieldLoading = false)
  }
  checkSegmentStatus = (key: any) => {
    let result = true;
    switch (key) {
      case 'BASIC':
        return this.basicForm?.isValid() && this.basicFormPart?.isValid();
        break;
      case 'ADDRESS':
        return this.address?.isValidForm();
        break;
      case 'BUILDING':
        return this.buildingForm?.isValid();
        break;
      case 'DEMOGRAPHIC':
        return this.demographicForm?.isValid();
        break;
    }
    return result;
  }
  apiPayload() {
    const payload = { ...this.basicForm?.getFormValue(), ...this.basicFormPart?.getFormValue(), ...this.address?.apiPayload() };
    payload.others = { ...this.othersForm?.getFormValue(), ...this.buildingForm?.getFormValue() };
    payload.committee = this.councilDiv?.apiPayload();
    payload.doc = this.churchDoc?.apiPayload();
    payload.demographic = this.demographicForm?.getFormValue();
    if (this.churchData?.id) {
      payload.id = this.churchData?.id;
      payload.church_id = this.churchId;
    }
    return payload;
  }
  onSubmit() {
    //on success
    this.close();
  }

  apiPayloadModify = (key: any) => {
    const payload: modifyApi = {} as modifyApi,
      dataApi = this.apiPayload();
    payload.created_by = this.auth.currentUserValue.user_id,
      payload.action_id = PERMISSION.ADD;
    payload.description = dataApi.church_name + ' Church requested to Add Record';
    if (this.churchData.id) {
      payload.action_id = PERMISSION.UPDATE;
      payload.description = dataApi.church_name + ' Church requested to update the details';
    }
    payload.ref_id = dataApi.church_id || '';
    payload.zone = dataApi.zone;
    payload.region = dataApi.region;
    payload.module_id = MODULE_NAME.CHURCH;
    payload.request_data = dataApi;
    return payload;
  }
close() {
    this.navigationService.back();
  }
}