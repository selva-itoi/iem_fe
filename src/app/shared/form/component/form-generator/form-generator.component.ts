import { AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ImageUploadComponent } from 'src/app/core/component/image-upload/image-upload.component';
import { arrayofData, fileCompData, fileInfo } from 'src/app/core/helper/core.data.interface';
import { AppConstant, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { cleanForm, cloneData, convertDate, isArray, isEmptyObj, isExistsKey, mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { ResponseData, formBuilder, formBuilderData, formDynamicValidator, formEvent, formValidator } from 'src/app/helper/interface/response';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { ModalLocationPickerComponent } from 'src/app/shared/map/component/modal-location-picker/modal-location-picker.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { AsyncApiService } from '../../service/async-api.service';

interface fileConfigController {
  [key: string]: fileCompData;
}

interface formConfig {
  //  type: eduType,
  title?: string,
  isView?: boolean,
  isRequest?: boolean,

}

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss']
})
export class FormGeneratorComponent implements OnInit, AfterContentInit {
  @Input() public set formData(dat: any) {
    if (dat) {
      this.data = cloneData(dat)
    }
  }
  configData!: formConfig;
  @Input() public set config(s: formConfig) {
    if (!isEmptyObj(s) && s) {
      this.configData = s;
    }
  }
  @Input() dynamicValidator: formDynamicValidator[] = [];
  data: any = [];
  dataForm: UntypedFormGroup | any = {};
  @Input() submitted: boolean = true;
  loading: boolean = false;
  EDITOR_DATA: arrayofData = {};
  apiData: any = {};
  initialFormValue: any = {};
  dateFormat = AppConstant.DATE_FORMAT;
  FORM_SUPPORT_DATA: arrayofData | any = {};
  fileConfig: fileConfigController = {} as fileConfigController;
  DATA_LOADING: any = {};
  loadForm: boolean = false;
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();
  @ViewChildren('imageUploader') imageUploader: QueryList<ImageUploadComponent> | undefined;
  @ViewChild('calender') calender: any;
  constructor(
    private masterApi: MasterApiService,
    private modalService: ModalService,
    private ref: ChangeDetectorRef,
    private asyncApi: AsyncApiService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  setFormData(data: formBuilderData) {
    this.data = data;
    this.initForm();
  }

  ngAfterContentInit() {
    this.ref.detectChanges();
  }

  initForm() {
    this.loadForm = false;
    if (!this.data) {
      return;
    }
    this.FORM_SUPPORT_DATA = {};
    this.DATA_LOADING = {};
    const group: any = {};
    this.data.map((a: formBuilder | any, i) => {
      a.master_validator = a.validator || []
      if (a.type == 'chips') {
        a.validator = a.validator?.filter((c: formValidator) => c.name != 'pattern');
      }
      const { v, asyn } = this.transformValidator(a.validator, a.title, i);
      group[a.colName] = new UntypedFormControl(a.defaultValue || '', v, asyn);
      if (a.type == 'FILE') {
        this.fileConfig[a.colName] = {
          filePath: a?.fileConfig?.filePath || '',
          label: a.title,
          fileType: a?.fileConfig?.fileType || 'IMAGE',
        }
      } else if (a.type == 'select' || a.type == 'checkbox' || a.type == 'radio' || a.type == 'MULTISELECT') {
        a.selectPrimaryKey = a.selectPrimaryKey || 'id',
          a.selectKeyName = a.selectKeyName || a?.selectKeyName || '';
        if (a.data?.length || a.apiTblName) {
          const d = a?.data?.map((b: any) => {
            return { ...b, [a.selectPrimaryKey]: b[a?.selectPrimaryKey]?.toString() }
          })
          this.FORM_SUPPORT_DATA[a.colName] = d;
        }
      }
      return a;
    });
    this.dataForm = new UntypedFormGroup(group);
    this.loadForm = true;
    this.apiCallInit();
    this.changeValidator();
  }



  reset() {
    const defaultValue: any = {};
    this.data.forEach((a: any) => {
      if (a.defaultValue != undefined) {
        defaultValue[a.colName] = a.defaultValue
      }
    })
    this.dataForm.reset(defaultValue);
    this.imageUploader?.toArray().forEach((e) => {
      e.resetFileInput();
    });
    Object.keys(this.fileConfig).forEach((a: string) => {
      this.fileConfig[a].filePath = '';
    })
  }

  transformValidator(validator: formValidator[] = [], title = '', index: number = 0) {
    const v: any = [], at: any = [], asyn: any = [];
    if (isArray(validator)) {
      validator.forEach(async (b: formValidator) => {
        const sv = cloneData(b);
        const arrayFunVal = ['pattern', 'minLength', 'maxLength', 'min', 'max'];
        const s = (arrayFunVal.includes(b.name)) ? Validators[b.name](b.funValue) : Validators[b.name];
        sv.error = b.error || (b.name == 'pattern' ? title + ' is not valid ' : b.name == 'required' ? title + ' is required' : ' error occurred');
        if (!b.is_async) {
          v.push(s);
        } else {
          if (b.funName) {
            asyn.push(this.asyncApi[b?.funName](b));
          }
        }
        at.push(sv);
      });
      this.data[index].validator = at
    }
    return { v, asyn };
  }

  skipAsync() {

  }
  checkOperation(val: any, compare: any, operation = '==') {
    val = [null, undefined, ''].includes(val) ? '' : val; // on staff transfer church issues
    let result = false;
    switch (operation) {
      case '!=':
        result = val != compare;
        break;
      case '>=':
        result = val >= compare;
        break;
      case '>':
        result = val > compare;
        break;
      case '<':
        result = val < compare;
        break;
      default:
        if (Array.isArray(compare)) {
          return result = compare.includes(val);
        }
        result = val == compare;
        break;
    }
    return result
  }

  changeValidator() {
    this.dynamicValidator.forEach((a: formDynamicValidator) => {
      if (this.dataForm.controls[a.controlName]) {
        // let showCtrl: boolean = false;
        if (this.checkOperation(this.dataForm.value[a.controlName], a.value, a.operation || '==')) {
          this.toggleValidation(a, true);
        } else {
          this.toggleValidation(a);
        }
      }
    })
  }

  private toggleValidation(a: any, status: boolean = false) {
    const validatorCtr = cloneData(a);
    validatorCtr.validatorControl.forEach((b: any) => {
      const i = this.data.findIndex((a: formBuilder) => a.colName == b),
        da = this.data[i];
      if (typeof da != 'undefined') {
        da.validator = status ? [...da?.master_validator || [], ...validatorCtr.validator || []] : da.master_validator || []
        const { v, asyn } = this.transformValidator(validatorCtr.validator, da.title, i);
        if (isArray(this.data[i].validator)) {
          this.dataForm.controls[b]?.setValidators(v);
        } else {
          this.dataForm.controls[b].clearValidators();
        }
        if (!status) {
          if (b != a.controlName) {
            this.dataForm.patchValue({ [b]: da?.defaultValue || '' })
          }
        }
        this.dataForm.controls[b]?.updateValueAndValidity()
      }
    })
    a.hideControl?.forEach((e: any) => {
      this.toggleControl(e, status);
    })
    this.toogleDisableByCtrl(a?.disableControl, status);
  }

  toggleControl(ctrlName: string, show: boolean = true) {
    if (isArray(this.data)) {
      this.data.map((a: formBuilder) => {
        if (a.colName == ctrlName)
          a.invisible = !show
      });
    }
  }


  getFormValue(dropdownText = false) {
    cleanForm(this.dataForm);
    const formData: any = cloneData(this.dataForm.value);
    this.data.forEach((a: formBuilder) => {
      const skipId = ['select', 'MULTISELECT', 'radio'];
      if (a.type && skipId.includes(a.type) && a.selectKeyName != 'name') {
        formData[a?.selectKeyName || ''] = this.FORM_SUPPORT_DATA[a?.colName]?.find((b: any) => b[a?.selectPrimaryKey || ''] == formData[a?.colName])?.[a?.selectKeyName || ''];
        if (Array.isArray(formData[a?.colName])) {
          formData[a?.selectKeyName || ''] = this.FORM_SUPPORT_DATA[a?.colName]?.filter((b: any) => formData[a?.colName].includes(b[a?.selectPrimaryKey || '']))?.map((d: any) => d[a?.selectKeyName || ''])?.toString();
        }
      }
      if (a.type == 'DATE') {
        if (isArray(formData[a?.colName])) {
          formData[a?.colName][0] = convertDate(formData[a?.colName][0]) || null;
          if (formData[a?.colName][1])
            formData[a?.colName][1] = convertDate(formData[a?.colName][1]) || null;
        } else
          formData[a?.colName] = formData[a?.colName] ? convertDate(formData[a?.colName]) : null;
      }
      if (a.type == 'DATETIME') {
        formData[a?.colName] = formData[a?.colName] ? mysqlDataTime(formData[a?.colName]) : null;
      }
      if (a.type == 'AUTOCOMPLETE') {
        if (!isEmptyObj(formData[a.colName])) {
          const va: any = formData[a.colName];
          a.autoSearch?.selectFieldKeys?.forEach(c => { formData[c] = va[c] })
        }

        if (formData[a.colName] && !isEmptyObj(formData[a.colName])) {
          const d = formData[a?.colName]?.[a.selectPrimaryKey || 'id'] || '';
          formData[a?.colName] = d
        }
      }
      if (Array.isArray(formData[a?.colName])) {
        formData[a?.colName] = formData[a?.colName].toString();
      }
    });
    Object.keys(this.fileConfig).forEach((a: string) => {
      formData[a + '_path'] = this.fileConfig[a].filePath;
    })
    return formData;
  }

  onSelectAutocomplete(ev: any, f: formBuilderData) {
    this.onChangeEvent.emit({ controlName: f.colName, value: ev?.target?.value || '', event: ev });
  }
  filterItems(ev: any, f: formBuilderData) {
    if (!ev.query) {
      return;
    }
    const tblName: string = f.apiFunName || ''
    let Api;
    if (f.apiTblName) {
      //@ts-ignore
      Api = this.masterApi[tblName](f.apiTblName, ev.query);
    } else {
      //@ts-ignore
      Api = this.masterApi[tblName](ev.query, f.autoSearch?.whereFiled || []);
    }
    this.apiCall(Api, f.colName, true);
  }

  apiCallInit() {
    const skipLevel: any = [];
    this.data.map((a: formBuilderData) => {
      if ((a.apiTblName || a.event) && !a.data?.length && !skipLevel.includes(a.colName)) {
        if (a.apiTblName || a.apiFunName) {
          this.getFullData(a.apiTblName || '', [], a.colName, false, '', a.apiFunName || '');
        }
        if (a.event?.apiTblName || a?.event?.apiFunName) {
          skipLevel.push(a.event.valueAssign);
        }
      }
    });
  }

  onChange(ctrlName: string, e: any) {
    console.log(ctrlName, e)
    this.onChangeEvent.emit({ controlName: ctrlName, value: e?.target?.value || e?.value || '', event: e });
    if (this.data.find((a: any) => a.colName == ctrlName)?.event?.funName) {
      this.pickLocation();
    }
    this.onSelectCalender(ctrlName)
    this.changeValidator();
  }

  onInput(ctrlName: string, e: formEvent) {
    if (e.isSelfAssign) {
      if (e.apiFunName)
        this.dataForm.controls[ctrlName].setValue(this.dataForm.controls[ctrlName].value[e.apiFunName]())
    }
  }

  setData(data: any) {
    if (!isEmptyObj(data)) {
      this.apiData = data;
      if (!this.configData?.isView) {
        this.applyFormValue();
      }
    }
  }
  setDefaultData(data: any) {
    if (!isEmptyObj(data)) {
      this.data.map((a: formBuilderData) => {
        if (data[a.colName]) {
          a.defaultValue = data[a.colName];
        }
        return a;
      });
    }
  }

  setValue(ctrlName: string, value: any, triggerEvent: boolean = false) {
    this.dataForm?.patchValue({ [ctrlName]: value })
    this.changeValidator();
    if (triggerEvent) {
      const f = this.data.find((a) => a.colName == ctrlName);
      if (f?.event?.name == 'change') {
        this.getFullData(f?.event?.apiTblName, [], f?.event?.valueAssign, true, f?.colName, f?.event?.apiFunName)
      } else {
        this.onChange(ctrlName, { targrt: { value: value } });
      }
    }
  }

  patchValue(d: any) {
    if (!isEmptyObj(d)) {
      this.dataForm?.patchValue(d)
      this.changeValidator();
    }
  }

  get formValue() {
    return this.dataForm.value;
  }

  apiPayload() {
    let payload: any = this.formValue;
    Object.keys(this.fileConfig).forEach((a: string) => {
      payload[a + '_path'] = this.fileConfig[a].filePath;
    })
    return payload;
  }

  onAddChips(e: any, ctrlName: string) {
    if (e.value) {
      let pattern: any = '';
      const d = this.data?.master_validator?.filter((c: any) => c.name == 'pattern')
      if (d && d[0]) {
        pattern = d[0]['funValue'];
      }
      if (pattern && !pattern?.test(e.value)) {
        this.dataForm.value[ctrlName].pop() || [];
      }
    }
  }
  pickLocation() {
    const f = this.dataForm.value, latLong = [f.lat, f.lng];
    this.modalService.openModal(ModalLocationPickerComponent, { latLng: latLong }, 'modal-lg', 3).then((res: any) => {
      if (isArray(res)) {
        this.dataForm.patchValue({ lat: res[0], lng: res[1] })
      }
    })
  }

  didUpload(fileInfo: fileInfo, ctrlName: string) {
    this.fileConfig[ctrlName].filePath = fileInfo.filePath;
    const fileName = this.apiData[ctrlName] ? `${fileInfo.fileName}${AppConstant.DEFAULT_OLD_IMAGE_APPEND}${this.apiData[ctrlName]}` : fileInfo.fileName;
    this.dataForm.patchValue({ [ctrlName]: fileName });
    this.onChange(ctrlName, { target: { value: fileName } });
  }

  getFullData(tblName: any, cond = [], pValue: string, isEvent = false, colName: any = '', apiFun: string = '') {
    if (isEvent) {
      //@ts-ignore
      cond.push(this.dataForm.value[colName]);
    }
    if (tblName || apiFun) {
      this.DATA_LOADING[pValue] = true;
      let api: any;
      if (apiFun) {
        const d: formBuilder = this.data.find((a: formBuilder) => a.colName == colName);
        const params_logic = d.event?.addParams || [],
          params: any = [];
        if (isArray(params_logic)) {
          params_logic?.forEach((c: any) => {
            if (c.colName) {
              params.push(this.dataForm?.value[c.colName])
            } else if (c.constantValue) {
              params.push(c.constantValue)
            }
          })
        }
        if (isArray(params)) {
          api = this.masterApi[apiFun].apply(this.masterApi, [...cond, ...params]);
        } else {
          api = this.masterApi[apiFun](cond);
        }
      } else {
        api = this.masterApi.getFullData(tblName, cond, false);
      }
      if (isEvent) {
        this.onChange(colName, { target: { value: this.dataForm.value[colName] } })
      }
      this.apiCall(api, pValue, isEvent);
    }
  }

  apiCall(api: any, pValue: string, isEvent: boolean = false) {
    api.then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        let colData: formBuilder = this.data.find((a: formBuilder) => a.colName == pValue);
        let data = colData.appendData || [];
        if (!isArray(res.result)) { data = [] };
        const aF: any = colData.apiFilter || {};
        if (aF?.keyName) {
          //@ts-ignore
          res.result = res.result.filter((b: any) => this.checkOperation(aF?.value, b[aF?.keyName], aF?.operation || '=='))
        }
        this.FORM_SUPPORT_DATA[pValue] = [...data, ...res.result];
        this.FORM_SUPPORT_DATA[pValue].map((a: any) => { a[colData?.selectPrimaryKey || 'id'].toString(); return a })
        this.mapFormValue(this.dataForm.value)

      } else {
        this.FORM_SUPPORT_DATA[pValue] = [];
      }
    }).finally(() => this.DATA_LOADING[pValue] = false)
  }

  applyFormValue() {
    const aValue: any = {};
    this.data.map((a: formBuilderData) => {
      let val = this.apiData[a.colName];
      if (a.type == 'DATE') {
        const dt = val instanceof Date ? [val] : isArray(val) ? val : val ? val.split(',') : [null],
          dtN: any = [];
        dt.map(e => {
          e = e != '0000-00-00' ? new Date(e) : '';
          dtN.push(e);
        });
        val = dtN;
        if (!dtN[1]) {
          val = dtN[0];
        }
      } else if (a.type == 'FILE') {
        const col: string = a.colName + '_path';
        if (this.fileConfig[a.colName]) {
          this.fileConfig[a.colName] = { filePath: this.apiData[col], fileType: 'IMAGE' };
        }
      } else if (a.type == 'chips') {
        val = val ? val.split(',') : '';
      } else if (a.type == 'checkbox') {
        val = +val;
      } else if (a.type == 'editor') {
        this.EDITOR_DATA[a.colName] = val;
      }
      aValue[a.colName] = val;
    });
    this.toremoveWhiteSpace()
    this.mapFormValue(aValue);
    this.apiCallDependent();
    this.initialFormValue = this.dataForm.value;
  }
  onDescriptionChange(e: any, controlName: string) {
    this.dataForm.patchValue({ [controlName]: e })
  }

  mapFormValue(g: any) {
    const data: any = {};
    Object.keys(this.dataForm.controls).forEach((a: any) => {
      if (isExistsKey(g, [a])) {
        data[a] = g[a] || '';
      }
    })
    this.dataForm.patchValue(data);
    this.changeValidator();
  }

  apiCallDependent() {
    this.data.map((a: formBuilderData) => {
      if (a.event && this.apiData) {
        if ((a.apiTblName || a.event) && (a.event.valueAssign)) {
          const cond: any = [this.apiData[a.colName]];
          if (a.event.apiFunName) {
            this.getFullData(a.event.apiTblName || '', cond, a.event.valueAssign, false, a.colName, a.event?.apiFunName);
          } else {
            this.getFullData(a.event.apiTblName, cond, a.event.valueAssign);
          }
        }
      }
    });
  }

  isValid() {
    return this.dataForm.valid;
  }

  setSubmitted(s: boolean) {
    this.submitted = s;
  }

  toogleDisableByCtrl(ctrlName: string | string[], toogle: boolean = false) {
    const s = Array.isArray(ctrlName) ? ctrlName : [ctrlName];
    s.forEach((a) => {
      let fun = toogle ? 'disable' : 'enable';
      this.dataForm.controls[a]?.[fun]();
    })
  }


  toremoveWhiteSpace() {
    cleanForm(this.dataForm);
  }


  onSelectCalender(ctrlName: any) {
    const i = this.data.findIndex((a: formBuilder) => a.colName == ctrlName);
    if (this.data[i].selectionMode == 'range' && this.data[i].type == 'DATE') {
      const val = this.dataForm.value[ctrlName];
      if (Array.isArray(val) && val[1]) {
        this.calender.overlayVisible = false;
      }
    }
  }

  isFormChange() {
    const src = JSON.stringify(this.initialFormValue);
    const to = JSON.stringify(this.dataForm.value);
    return !(src === to);
  }
}