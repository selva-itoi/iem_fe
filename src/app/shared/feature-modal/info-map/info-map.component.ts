import { Component, Input, OnInit } from '@angular/core';
import { isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { formBuilder, formBuilderData, formDynamicValidator } from 'src/app/helper/interface/response';
import { FormControlActionPipe } from '../../form/pipe/form-control-action.pipe';
import { DateFormatPipe } from '../../pipe/date-format.pipe';
import { ModalService } from '../../service/modal.service';
import { StaffBasicComponent } from '../staff-basic/staff-basic.component';

@Component({
  selector: 'info-view',
  templateUrl: './info-map.component.html',
  styleUrls: ['./info-map.component.scss'],
  providers: [FormControlActionPipe, DateFormatPipe]
})
export class InfoMapComponent implements OnInit {
  @Input() public set sourceData(d: any) {
    if (!isEmptyObj(d)) {
      this.result = d;
      this.mapLocal();
    }
  }
  result: any = {};
  parentFormData: formBuilder[] = [];
  @Input() mapData: mapInfoView[] = [];
  @Input() direction?: 'HORIZONTAL' | 'VERTICAL' = 'HORIZONTAL';
  @Input() mode: 'VIEW' | 'MODIFICATION' | any = 'VIEW';
  @Input() modifyData: any = {};
  @Input() dynamicValidator: formDynamicValidator[] = [];
  @Input() public set formData(data: any) {
    if (data.length) {
      this.parentFormData = data;
      this.makeFormView(data);
    }
  }
  constructor(private fcPipe: FormControlActionPipe, private modalService: ModalService, private dateFormat: DateFormatPipe) { }

  ngOnInit(): void { }

  mapLocal() {
    this.mapColData(this.parentFormData);
    setTimeout(() => {
      this.changeValidator()
    }, 800);
  }

  mapColData(formValue: any = this.parentFormData) {
    if (formValue) {
      formValue.forEach((a: formBuilder) => {
        if (a.data && (a.type == 'select' || a.type == 'radio')) {
          const na = a.selectKeyName || a.colName || '';
          this.result[na] = a.data.find(c => c.id == this.result[a.colName])?.[a.selectKeyName || 'name'];
        } else if (a.type == 'INFO') {
          if (a.controlAction?.info_text) {
            this.result[a.colName] = this.fcPipe.transform(this.result, a.controlAction)
          }
        } else if (a.type == 'DATE' || a.type == 'DATETIME') {
          // this.result[a.colName] = new Date(this.result[a.colName]);
        }
        if (a.icon_append) {
          if (a.icon_append?.text) {
            this.result[a.colName] = `${this.result[a.colName]}   ${a.icon_append.text}`;
          }
        }
      })
      return this.formData;
    }
  }
  makeFormView(data: formBuilder[]) {
    data.forEach((a: formBuilderData) => {
      const b: mapInfoView = {} as mapInfoView,
        selectCol: any = ['select', 'radio', 'AUTOCOMPLETE', 'MULTISELECT'];
      //@ts-ignore
      b.name = a.colName || a.name,
        b.title = a.title;
      //@ts-ignore
      b.isClickable = a.isClickable || false;
      //@ts-ignore
      b.viewType = a.viewType || '';
      if (a.type == 'DATE') {
        b.type = 'DATE';
      } else if (selectCol.includes(a.type)) {
        if (a.data?.length) {
          b.name = a.selectKeyName || a.colName + 'Name';
        } else {
          b.name = a.selectKeyName || b.name;
        }
      }
      if (a.type == 'checkbox') {
        b.type = 'BOOLEAN';
      }
      if (a.type == 'FILE') {
        b.type = 'FILE';
      }
      if (a.col_size && a.col_size == 12) {
        b.col = '12'
      }
      if (!a.hidden || a.visible) {
        this.mapData.push(b);
      }
    })
    this.mapLocal();
  }

  openInfo(type: any, ref: any) {
    let com: any = {},
      cond = {}
    switch (type) {
      case 'CROSS_REF_ID':
        com = StaffBasicComponent;
        cond = { staff_cross_id: ref, mode: 'FAMILY' }
        //cond = {staff_cor}
        break;
    }
    if (com) {
      this.modalService.openModal(com, cond, 'modal-lg', 2).then((res: any) => {
      });
    }
  }

  addNewInfo(data: any) {
    this.mapData.push(data);
  }

  checkChanges(val: any, compare: any, type: 'DATE' | 'DATETIME' | 'TEXT' | 'FILE' = 'TEXT'): boolean {
    let result = false;
    switch (type) {
      case 'DATE':
        result = this.dateFormat.transform(val) == this.dateFormat.transform(compare);
        break;
      case 'FILE':
        result = val == compare;
        break;

      default:
        result = val == compare
        break;
    }
    return result
  }

  checkModify(colName: any, ColType: any = 'TEXT') {
    let result = this.result?.[colName] || '',
      modify = ColType == 'FILE' ? this.modifyData?.[colName + '_path'] : this.modifyData?.[colName] || '';
    if (this.mode == 'MODIFICATION') {
      // const type = ColType == 'DATE' ? 'DATE' : 'TEXT';
      if (!this.checkChanges(result, modify, ColType)) {
        return { newValue: modify, oldValue: result };
      }
    }
    return { oldValue: result }
  }

  changeValidator() {
    this.dynamicValidator.forEach((a: formDynamicValidator) => {
      let showCtrl: boolean = false;
      a.hideControl?.forEach((e: any) => {
        const cD = this.mode != 'MODIFICATION' ? this.result : this.modifyData,
          cO = this.checkOperation(cD[a.controlName], a.value, a.operation || '==')
        showCtrl = cO;
        this.toggleControl(e, showCtrl);
      })
    })
  }
  toggleControl(ctrlName: string, show: boolean = true) {
    if (isArray(this.parentFormData)) {
      this.mapData.map((a: mapInfoView) => {
        if (a.name == ctrlName)
          a.invisible = !show
      });
    }
  }
  checkOperation(val: any, compare: any, operation = '==') {
    switch (operation) {
      case '!=':
        return val != compare;
        break;
      case '>=':
        return val >= compare;
        break;
      case '>':
        return val > compare;
        break;
      case '<':
        return val < compare;
        break;
      default:
        if (Array.isArray(val)) {
          return val.includes(compare);
        }
        return val == compare;
        break;
    }
  }
}