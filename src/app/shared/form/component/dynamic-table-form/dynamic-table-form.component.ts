import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { cloneData, isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { formBuilderData, formDynamicValidator, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { User } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { FormGeneratorComponent } from '../form-generator/form-generator.component';
import { TableListComponent } from '../table-list/table-list.component';

@Component({
  selector: 'dynamic-table-form',
  templateUrl: './dynamic-table-form.component.html',
  styleUrls: ['./dynamic-table-form.component.scss']
})
export class DynamicTableFormComponent implements OnInit {
  @Input() formData: formBuilderData[] = [];
  @Input() dynamicValidator: formDynamicValidator[] = [];
  @Input() tblColum: tableColum[] = [];
  @Input() tblActionBtn: tableButton[] = [];
  @Input() showViewAction: boolean = true;
  @Input() mode: 'VIEW' | 'EDIT' | 'MODIFICATION' = 'EDIT';
  @Input() formMode: 'INLINE' | 'MODAL' = 'INLINE';
  modifyData: any = [];
  @Output() onAction: EventEmitter<{ action: tableAction, data: any }> = new EventEmitter();
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();
  @Input() silentMode: boolean = false
  pageConfig: any = { addAllow: true, updateAllow: true, deleteBtn: true }
  @Input() public set config(d: any) {
    if (!isEmptyObj(d)) {
      Object.keys(d).forEach(a => {
        this.pageConfig[a] = d[a];
      })
    }
  }
  @Input() parentGetList: ((args?: any) => Promise<any>) | any;
  @Input() defaultBtn: tableButton[] = [];
  tblBuild: tableBuilder = { isLazy: false, showFilter: false, name: '', column: [], action: [], addBtn: false };
  resultData: Array<any> = [];
  currentData: any = {};
  initialData: Array<any> = [];
  showForm: boolean = false;
  @ViewChild('dataForm') dataForm: FormGeneratorComponent | undefined;
  @ViewChild('tbl') tbl: TableListComponent | undefined;
  userData: User = this.auth.currentUserValue;
  constructor(private modalService: ModalService, private auth: AuthService, private alertService: AlertService) { }
  ngOnInit(): void {
    const modBtn: any = [{ name: 'To Add', type: 'ADD', category: 'TEXT', class: 'btn-info', icon: 'icon-pencil', condition: [{ key: 'action', operation: '==', value: 1 }] },
    { name: 'To Update', category: 'TEXT', type: 'EDIT', class: 'btn-info', icon: 'icon-pencil', condition: [{ key: 'action', operation: '==', value: 2 }] },
    { icon: 'icon-eye text-primary', title: 'View Info', type: 'VIEW' },
    { name: 'To Delete', category: 'TEXT', type: 'DELETE', class: 'btn-info', icon: 'icon-pencil', condition: [{ key: 'action', operation: '==', value: 3 }] }];

    const dfBtn: any = [{ name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Edit', type: 'EDIT', condition: [{ key: 'id', operation: '!=', value: '', join: '&&' }, { key: 'action', operation: '!=', value: 3 }] },
    { icon: 'icon-eye text-primary', title: 'View Info', type: 'VIEW' },
    { icon: 'icon-trash text-danger', title: 'Delete', type: 'DELETE', condition: [{ key: 'action', operation: '!=', value: 3 }] },
    { name: 'deleted', category: 'TEXT', type: 'DELETE', condition: [{ key: 'action', operation: '==', value: 3 }] },]
    this.defaultBtn = this.mode == 'MODIFICATION' ? modBtn : this.mode == 'VIEW' ? [{ icon: 'icon-eye text-primary', title: 'View Info', type: 'VIEW' },] : this.defaultBtn.length ? this.defaultBtn : dfBtn;
    this.tblBuild.action = [...this.defaultBtn, ...this.tblActionBtn];
    const col = this.tblColum?.length ? this.tblColum : this.formData;
    console.log('dynamic tbl', this.tblBuild)
    //col.map((a: any) => {a.colName = a.filterCol.data ?a.colName : a.selectKeyName || a.colName; return a  });
    this.tblBuild.column = col;
  }


  onChange(e: any) {
    this.onChangeEvent.emit(e);
  }

  apiPayload(): Array<any> {
    return this.resultData.filter(a => a.action) || [];
  }
  getAllData() {
    return this.resultData || [];
  }


  setInputData(data: any = [], modify = []) {
    if (Array.isArray(data) || Array.isArray(modify)) {
      this.initialData = data;
      this.resultData = data;
      if (modify.length) {
        this.modifyData = modify
        this.resultData = [...modify, ...data];
        this.resultData.map((a: any) => { a.classList = +a.action == 1 ? 'bg-green text-white' : +a.action == 3 ? 'bg-red text-white' : +a.action == 2 ? 'bg-orange text-white' : ''; return a })
      }
      this.applyTblData();
    }
  }

  applyTblData() {
    this.tbl?.setTableData(this.resultData);
    this.tbl?.markChanged();
  }

  mapFormDataValue() {
    this.formData.forEach((a: any) => {
      if (a.type == 'select' && a.data) {
        this.resultData.map(b => b[a.selectKeyName] = a.data.find((c: any) => c[a.selectPrimaryKey || 'id'] == b[a.colName])?.[a.selectKeyName])
        console.log(a.data, 'key map', this.resultData)
      }
    })
  }

  applyFormValue(data: any = {}) {
    if (isEmptyObj(data)) {
      this.reset();
      return;
    }
    this.currentData = data;
    this.dataForm?.setData(data)
  }

  mergeData(d: any) {

    this.resultData = [...this.resultData || [], ...[d]];
    this.applyTblData();
    console.log('merge data', this.resultData)
  }
  setValue(name: string, v: any) {
    this.dataForm?.setValue(name, v);
  }

  patchValue(data: any) {
    this.dataForm?.patchValue(data);
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    return this.resultData || [];
  }

  tblAction = (id: string | number, type: tableAction, srcData: any): Promise<any> => {
    switch (type) {
      case 'EDIT':
        if (this.formMode == 'INLINE') {
          this.showForm = true;
          this.applyFormValue(srcData);
        }
        break;
      case 'VIEW':
        if (this.showViewAction) {
          let mData: any = {}
          if (this.mode == 'MODIFICATION') {
            if (+srcData.action == 1) {
              mData = srcData;
              srcData = Object.keys(srcData).map(e => e = '');
            } else if (+srcData.action == 2) {
              mData = srcData,
                srcData = this.initialData.find(a => a.id == mData?.id);
            } else if (+srcData.action == 3) {
              mData = Object.keys(srcData).map(e => e = '');
            }
          }
          this.showView(srcData, mData);
        }
        break;
      case 'DELETE':
        const i = this.resultData.findIndex(a => {
          if (id) {
            return a.id == id;
          } else {
            return a == srcData;
          }
        });
        this.deleteTableData(i);
        return Promise.resolve(true);
        break;
    }
    this.onAction.emit({ action: type, data: srcData });
    return Promise.resolve(true);
  }

  hideBtn() {
    this.showForm = false;
    this.currentData = {};
    this.dataForm?.reset();
  }
  showView(data: any, mData = {}) {
    this.modalService.openInfoModal({ mode: this.mode == 'MODIFICATION' ? 'MODIFICATION' : 'VIEW', title: 'Info', formData: this.formData, sourceData: cloneData(data), modifyData: mData || {} }, 'modal-lg').then(a => { });
  }

  reset() {
    this.dataForm?.reset();
    this.dataForm?.setValue('id', '');
    //@ts-ignore
    this.onAction.emit({ action: 'RESET', data: {} })
    this.currentData = {};
  }

  async checkAnyChanges(data: any) {
    if (isEmptyObj(data) || !data.id) {
      return false;
    }
    const resultData: any = this.resultData.find(a => a.id == data.id);
    let changes = false;
    await Object.keys(this.dataForm?.dataForm.controls).forEach(a => {
      if (data[a] != resultData[a]) {
        changes = true;
      }
    })
    return changes;
  }

  async saveData(ev: "BTN" | null = null) {
    const data: any = this.dataForm?.getFormValue();
    console.log(data)
    this.dataForm?.setSubmitted(true);
    if (this.dataForm?.isValid()) {
      if (data.id) {
        console.log('data.id')
        data.last_modify_by = this.userData.user_id;
        this.updateTableData(data);
        this.alertService.showToast('Data Updated', 'success');
      } else {
        console.log('else')
        data.action = 1;
        data.created_by = this.userData.user_id;
        this.resultData.push(data);
      }
      this.applyTblData();
      this.reset();
      this.dataForm?.setSubmitted(false);
      if (ev == 'BTN') {
        this.showForm = false
      }
    }
    this.onAction.emit({ action: data.id ? 'EDIT' : 'ADD', data: this.resultData });
  }

  deleteTableData(index: number) {
    this.modalService.openConfirmDialog({ type: 'CONFIRM', title: 'Delete Confirm', message: 'Are you sure to delete this one ?' }).then(res => {
      if (res) {
        const data = this.resultData[index];
        if (data.id) {
          data.action = 3;
          this.resultData[index] = data;
          this.tbl?.markChanged();
        } else {
          this.resultData.splice(index, 1);
        }
        this.onAction.emit({ action: 'DELETE', data: data });
      }
    });
  }

  async updateTableData(data: any) {
    if (data.id) {
      const status = await this.checkAnyChanges(data);
      if (status) {
        const itemIndex = this.resultData.findIndex(item => item.id == data.id);
        if (itemIndex !== -1)
          data.action = 2;
        this.resultData[itemIndex] = data;
      }
    }
  }
}