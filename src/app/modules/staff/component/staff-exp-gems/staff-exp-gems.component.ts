import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppConstant, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { cloneData, isEmptyObj, uniqueArray } from 'src/app/helper/class/utilityHelper';
import { ResponseData, formBuilderData, formDynamicValidator } from 'src/app/helper/interface/response';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { GEMS_EXP_FORM, STAFF_EXP_DYNAMIC_VALIDATOR, STAFF_OFFICE_FORM } from '../../helper/staff_form';
import { StaffApiService } from '../../service/staff-api.service';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';
export interface masterData {
  [key: string]: Array<any>
};
@Component({
  selector: 'app-staff-exp-gems',
  templateUrl: './staff-exp-gems.component.html',
  styleUrls: ['./staff-exp-gems.component.scss']
})
export class StaffExpGemsComponent implements OnInit {
  @Input() mode: 'ACTIVE' | 'ALL' = 'ALL';
  @Input() type: 'TRANSFER' | 'ALL' | 'APPOINTMENT' = 'ALL';
  @Input() viewMode: 'VIEW' | 'MODIFICATION' | 'EDIT' = 'EDIT';
  @Input() public set staffId(id: any) {
    if (id) {
      this.staff_emp_id = id;
      this.getData();
    }
  }
  staff_emp_id = '';
  @Input() public set config(s: any) {
    if (!isEmptyObj(s) && s) {
      this.data = s;
      if (this.type == 'TRANSFER') {
        this.dataFormData = GEMS_EXP_FORM;
        // this.data.updateOnly = s.updateOnly || true;
      } else if (s.formData) {
        this.dataFormData = s.formData;
      }
      if (s.cols) {
        this.cols = [...this.cols, ...s.cols];
        this.cols = uniqueArray(this.cols)
      }
      this.data = s;
      if (s.isView && !s.isRequest) {
        this.viewMode = 'VIEW';
      } else if (s.isView && s.isRequest) {
        this.viewMode = 'MODIFICATION';
      }
    }
  }
  cols = [{ colName: 'zoneName', title: 'Zone/State' }, { colName: 'deName', title: 'Designation' }, { colName: 'fieldName', title: 'Field' },
  { colName: 'dName', title: 'Department' }, { colName: 'branchName', title: 'Branch' }, { colName: 'exp_year', title: 'Exp Year' }, { colName: 'document_path', title: 'Doc' }
  ]
  data: any = { title: 'Experience In ' + AppConstant.ORG_NAME };
  dataFormData: formBuilderData[] = [...cloneData(STAFF_OFFICE_FORM), ...cloneData(GEMS_EXP_FORM)];
  dynamicValidatorBasic: formDynamicValidator[] = STAFF_EXP_DYNAMIC_VALIDATOR;
  @ViewChild('dataForm') dataForm: FormGeneratorComponent | undefined;
  @ViewChild('dynTbl') dynTbl: DynamicTableFormComponent | undefined;
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();
  currentData: any = {};
  eduData: Array<any> = [];
  dataLoading: boolean = false;
  constructor(private modalService: ModalService, private staffApi: StaffApiService, private changeRef: ChangeDetectorRef) { }
  initialData: any = {}
  ngOnInit(): void {
    this.dataFormData.map((a: any) => {
      if (!['zone', 'region', 'designation', 'department','from_date','to_date'].includes(a.colName)) {
        a.visible = false;
      }
      return a;
    })
  }
  setInput(data: any) {
    this.data = data;
    this.staff_emp_id = data.staff_emp_id || ''
    this.mode = data.mode || ''
    this.getData();
  }

  showView(i: any) {
    const formData = this.type == 'TRANSFER' ? [...STAFF_OFFICE_FORM, ...GEMS_EXP_FORM] : this.dataFormData;
    let mData: any = {}
    if (this.viewMode == 'MODIFICATION') {
      if (+i.action == 1) {
        mData = i;
        i = Object.keys(i).map(e => e = '');
      } else if (+i.action == 2) {
        mData = i,
          i = this.initialData.find((a: any) => a.id == mData?.id);
      } else if (+i.action == 3) {
        mData = Object.keys(i).map(e => e = '');
      }
    }
    this.modalService.openInfoModal({ modifyData: mData, mode: this.viewMode == 'MODIFICATION' ? 'MODIFICATION' : 'VIEW', formData: formData, title: 'Staff Experience Info', sourceData: i, btn: 'Close' }, 'modal-lg');
  }

  setData(data: Array<any> = [], modify = []) {
    if (data.length || modify.length) {
      this.eduData = data;
      if (this.dynTbl) {
        this.dynTbl?.setInputData(this.eduData, modify);
      } else if (this.type != 'TRANSFER') {
        this.setData(data, modify);
      }
    }
    this.changeRef.detectChanges();
  }

  onChange(e: any) {
    const a = this.dataForm?.FORM_SUPPORT_DATA[e.controlName] || []
    this.onChangeEvent.emit({ event: e, support: a.filter((a: any) => a.id == e.value) })
  }

  reset() {
    this.dataForm?.reset();
    this.currentData = {};
  }

  //get staff experience data
  getData() {
    if (this.staff_emp_id) {
      this.dataLoading = true
      let api: any;
      if (this.mode == 'ALL') {
        api = this.staffApi.getAllExp(this.staff_emp_id);
      } else {
        api = this.staffApi.getActiveExp(this.staff_emp_id)
      }
      api.then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.eduData = res.result || [];
          this.setData(this.eduData)
        }
      }).finally(() => this.dataLoading = false)
    }
  }

  apiPayload() {
    if (this.type == 'TRANSFER') {
      return this.eduData.filter(a => a.action) || [];
    }
    return this.dynTbl?.apiPayload() || [];
  }

  applyFormValue(data: any = {}) {
    if (isEmptyObj(data)) {
      this.reset();
      return;
    }
    this.currentData = data;
    console.log('data', data);
    setTimeout(() => {
      this.dataForm?.setData(data)
    }, 500);

  }

  async checkAnyChanges(data: any) {
    if (isEmptyObj(data) || !data.id) {
      return false;
    }
    const eduData: any = this.eduData.find(a => a.id == data.id);
    let changes = false;
    await Object.keys(this.dataForm?.dataForm.controls).forEach(a => {
      if (data[a] != eduData[a]) {
        changes = true;
      }
    })
    return changes;
  }

  async saveData() {
    let data: any = this.dataForm?.getFormValue();
    data.id = this.currentData?.id
    if (this.dataForm?.isValid()) {
      if (data.id) {
        this.updateTableData(data);
      } else if (this.type == 'TRANSFER') {
        data.action = 1;
        this.eduData.push(data);
      }
      this.reset();
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
    });
  }

  async updateTableData(data: any) {
    if (data.id) {
      const status = await this.checkAnyChanges(data);
      console.log('status', status)
      if (status) {
        const itemIndex = this.eduData.findIndex(item => item.id == data.id);
        if (itemIndex !== -1)
          data.action = 2;
        if (this.type == 'TRANSFER') {
          const d = this.eduData[itemIndex];
          this.eduData[itemIndex] = { ...d, ...data }
        } else
          this.eduData[itemIndex] = data;
      }
    }
  }
}