import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ImageUploadComponent } from 'src/app/core/component/image-upload/image-upload.component';
import { constDropdownData, fileInfo } from 'src/app/core/helper/core.data.interface';
import { ALIVE_STATUS, AppConstant, RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { cloneData, isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { formBuilderData, formDynamicValidator, ResponseData, tableButton } from 'src/app/helper/interface/response';
import { StaffBasicComponent } from 'src/app/shared/feature-modal/staff-basic/staff-basic.component';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { ChildApiService } from '../../service/child-api.service';
import { CHILD_PARENT_FORM, CHILD_PARENT_TYPE } from '../../helper/child-form';

@Component({
  selector: 'app-parents',
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.scss']
})
export class ParentsComponent implements OnInit {
  shortOrg = AppConstant.ORG_NAME;
  mode: 'EDIT' | 'VIEW' | 'MODIFICATION' = 'EDIT'
  @Input() public set config(s: parentsConfig) {
    if (!isEmptyObj(s) && s) {
      this.data = s;
      if (s.isView && !s.isRequest) {
        this.mode = 'VIEW';
      } else if (s.isRequest) {
        this.mode = 'MODIFICATION';
      }
      this.initForm();
    }
  }
  submitted: boolean = false;
  data: parentsConfig = {
    //type: 'ACADAEMIC'
  };
  dataForm: UntypedFormGroup = new UntypedFormGroup({});
  TYPE: constDropdownData[] = CHILD_PARENT_TYPE
  currentData: any = {};
  eduData: Array<any> = [];
  dateRange = AppConstant.DEFAULT_DATE_RANGE;
  dateFormat = AppConstant.DATE_FORMAT;
  toDateRange = AppConstant.DEFAULT_FUTURE_DATE_RANGE;
  dynamicValidator: formDynamicValidator[] = [];
  @Output() uploadedEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('imageUploader') imageUploader: ImageUploadComponent | undefined;
  formColData: formBuilderData[] = CHILD_PARENT_FORM;
  tblAction: tableButton[] = [{ name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Edit', type: 'EDIT', condition: [{ key: 'id', operation: '!=', value: '', join: '&&' }, { key: 'action', operation: '!=', value: 3, join: '&&' }, { key: 'staff_emp_id', operation: '==', value: '' }] },
  { icon: 'icon-eye text-primary', title: 'View Info', type: 'VIEW' },
  { icon: 'icon-trash text-danger', title: 'Delete', type: 'DELETE', condition: [{ key: 'action', operation: '!=', value: 3 }] },
  { name: 'deleted', category: 'TEXT', type: 'DELETE', condition: [{ key: 'action', operation: '==', value: 3 }] },]
  @ViewChild('dyTbl') dyTbl: DynamicTableFormComponent | undefined;
  constructor(private modalService: ModalService, private childApi: ChildApiService) { }
  setInput(data: any) { this.data = data; }

  ngOnInit(): void {
    this.dynamicValidator = [
      {
        controlName: 'alive_status',
        validatorControl: ['died_on', 'reason_death'],
        hideControl: ['died_on', 'reason_death'],
        value: '2',
      }]
      this.initForm();
  }

  onChangeEvent(e: any) {
    this.dyTbl?.setValue('parent_type', this.dataForm.value.parent_type);
  }
  setData(data: Array<any> = [],modify=[]) {
    if (data.length || modify.length) {
      this.eduData = data;
      if (this.dyTbl) {
        this.dyTbl?.setInputData(this.eduData,modify);
      } else {
        this.setData(data,modify);
      }
    }
  }

  reset() {
    this.initForm();
    this.currentData = {};
    this.imageUploader?.resetFileInput();
  }

  initForm() {
    const group: any = {};
    group.parent_type = new UntypedFormControl('1');
    group.isGemsStaff = new UntypedFormControl(this.data.type == 'MK' ? true : false),
      this.dataForm = new UntypedFormGroup(group);
    this.onChangeIsGems({});
  }

  mapStaffData(staff: any) {
    console.log('map staff', staff)
    const d: any = { staff_emp_id: staff.staff_emp_id, staff_fk_id: staff.staff_fk_id || staff.id, name: staff.name, occupation: !staff.occupation && staff.staff_fk_id ? 'missinory' : (staff.occupation || ''), };
    d.email_id = staff.email_id;
    d.mobile_no = staff.mobile_no;
    d.id = staff.id || '';
    d.parent_fk_id = staff.parent_fk_id || '';
    d.occupation = staff.occupation || '';
    d.parent_type = staff.parent_type || (+staff.gender == 1 ? 1 : +staff.gender == 2 ? 2 : '')
    d.parent_typeName = staff.parent_typeName || this.TYPE.find(a => a.id == +d.parent_type)?.parent_typeName;
    d.genderName = staff.genderName
    console.log('after out', d)
    return d;
  }

  async checkDuplicate(data: any = {}) {
    const allData = this.dyTbl?.getAllData();
    return await allData?.filter((a: any) => {
      if (data.staff_fk_id && a.staff_fk_id == data.staff_fk_id) {
        return true;
      }
      if (data.parent_fk_id && a.parent_fk_id == data.parent_fk_id) {
        return true;
      }
      return false;
    })?.length;
  }

  mapParent(ev: any) {
    const parents = ev.parents || ev || [],
      type = ev.parents ? 'LOCAL' : 'PARENT';
    if (isArray(parents)) {
      parents.forEach((e: any) => {
        if (type == 'LOCAL') {
          e.parent_type = this.dataForm.value.parent_type !=3 ?'' :3;
        }
        const d = this.mapStaffData(e);
        d.action = 1
        if (d.id && !d.staff_fk_id) {
          d.action = 2
        }
        this.dyTbl?.mergeData(d);
      });
    }
  }
  onChangeIsGems(e: any) {
    this.mode = this.dataForm.value.isGemsStaff || this.data.isView ? 'VIEW' : 'EDIT'
  }
  apiPayload() {
    return this.dyTbl?.apiPayload();
  }

  applyFormValue(data: any = {}) {
    if (isEmptyObj(data)) {
      this.initForm();
      this.currentData = {};
      return false;
    }
    this.currentData = data;
    // this.fileConfig.filePath = '';
    this.imageUploader?.resetFileInput();
    //const fileInfo = this.fileConfig;
    //fileInfo.filePath = data.document_path;
    //this.imageUploader?.setInput(fileInfo);
    data.from_date = data.from_date ? new Date(data.from_date) : '';
    data.to_date = data.to_date ? new Date(data.to_date) : '';
    this.dataForm.patchValue(data);
    return;
  }

  didUpload(fileInfo: fileInfo) {
    //this.fileConfig.filePath = fileInfo.filePath;
    this.dataForm.patchValue({ document: fileInfo.fileName });
  }

  async checkAnyChanges(data: any) {
    if (isEmptyObj(data) || !data.id) {
      return false;
    }
    const eduData: any = this.eduData.find(a => a.id == data.id);
    let changes = false;
    await Object.keys(this.dataForm.controls).forEach(a => {
      if (data[a] != eduData[a]) {
        changes = true;
      }
    })
    return changes;
  }

  isValid() {
    return this.dyTbl?.resultData?.length
  }
  saveData() {
    const data: any = this.dataForm.value;
    //data.document_path = this.fileConfig.filePath ? this.fileConfig.filePath : data.document_path;
    this.submitted = true;
    if (this.dataForm.valid) {
      if (data.id) {
        this.updateTableData(data);
      } else {
        data.action = 1;
        // check already exists
        let exists: boolean = false;
        this.eduData.forEach((a: any) => {
          if (a.staff_fk_id == data.staff_fk_id || (+a.id && a.id == data.id)) {
            exists = true;
          }
        })
        if (!exists) {
          this.eduData.push(data);
        }
      }
      this.currentData = {};
      this.initForm();
      this.submitted = false;
      //this.fileConfig.filePath = '';
      //this.imageUploader?.setInput(this.fileConfig);
      //this.imageUploader?.resetFileInput();
    }
  }

  deleteTableData(index: number) {
    this.modalService.openConfirmDialog({}).then(res => {
      if (res) {
        const data = this.eduData[index];
        if (data.id) {
          data.action = 3;
          this.eduData[index] = data;
        } else {
          this.eduData.splice(index, 1);
        }
      }
    })
  }
  //  viewData: any = {};
  //viewDataLoading: boolean = false;
  showParentInfo(d: any) {
    const data = d.data;
    if (isEmptyObj(d) || d.action != "VIEW") {
      return;
    }
    if (data.staff_emp_id) {
      this.modalService.openModal(StaffBasicComponent, data, 'modal-xl', 2)
    } else {
      //this.viewDataLoading = true;
      //this.modalService.openModalTemplate(temp, 'modal-lg');
      this.modalService.openInfoModal({ title: 'Info', formData: this.dyTbl?.formData, sourceData: cloneData(data) }, 'modal-lg').then(a => { });
      // this.childApi.findParentsDetails(data.id).then((res: ResponseData | any) => {
      //   if (res.statusCode == RESPONSE_CODE.SUCCESS) {
      //     this.viewData = res.result
      //   }
      // }).finally(() => {
      //   this.viewDataLoading = false;
      // })
    }
  }

  closeModal() {
    this.modalService.close();
  }

  async updateTableData(data: any) {
    if (data.id) {
      const status = await this.checkAnyChanges(data);
      if (status) {
        const itemIndex = this.eduData.findIndex(item => item.id == data.id);
        if (itemIndex !== -1)
          data.action = 2;
        if (this.eduData[itemIndex].document != data.document) {
          data.document = data.document + AppConstant.DEFAULT_OLD_IMAGE_APPEND + this.eduData[itemIndex].document;
        }
        this.eduData[itemIndex] = data;
      }
    }
  }
}
export interface parentsConfig {
  title?: string,
  isView?: boolean,
  isRequest?: boolean,
  type?: 'MK' | 'HOME'
}