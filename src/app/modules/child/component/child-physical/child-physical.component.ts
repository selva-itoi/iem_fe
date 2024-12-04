import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { formBuilder } from 'src/app/helper/interface/response';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';
import { CHILD_PHY_FORM } from '../../helper/child-form';

@Component({
  selector: 'app-child-physical',
  templateUrl: './child-physical.component.html',
  styleUrls: ['./child-physical.component.scss']
})
export class ChildPhysicalComponent implements OnInit {
  @Input() public set config(s: any) {
    if (!isEmptyObj(s) && s) {
      this.data = s;
      if (s.isView && !s.isRequest) {
        this.mode = 'VIEW';
      } else if (s.isRequest) {
        this.mode = 'MODIFICATION';
      }
    }
  }
  mode: any = 'EDIT';
  data: any;
  phyData: any;

  basicFormData: formBuilder[] = CHILD_PHY_FORM;
  @ViewChild('dyTbl') dyTbl: DynamicTableFormComponent | undefined;
  constructor() { }

  ngOnInit(): void {}

  setData(data: Array<any> = [],modify=[]) {
    if (data.length || modify.length) {
      this.phyData = data;
      if (this.dyTbl) {
        this.dyTbl?.setInputData(this.phyData,modify);
      } else {
        this.setData(data,modify);
      }
    }
  }

  apiPayload(): Array<any> {
    if (this.dyTbl) {
      return this.dyTbl?.apiPayload();
    }
    return [];
  }
  setInput(data: any) {
    this.data = data;
  }
}
