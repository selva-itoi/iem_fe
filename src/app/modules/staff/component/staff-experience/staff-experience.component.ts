import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppConstant } from 'src/app/helper/class/app-constant';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { formBuilderData } from 'src/app/helper/interface/response';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { EDU_CATEGORY, EDU_STATUS } from '../../helper/staff_form';
@Component({
  selector: 'app-staff-experience',
  templateUrl: './staff-experience.component.html',
  styleUrls: ['./staff-experience.component.scss']
})
export class StaffExperienceComponent implements OnInit {
  @Input() public set config(s: any) {
    if (!isEmptyObj(s) && s) {
      this.data = s;
      console.log(s,'s');
      
      if (s.isView && !s.isRequest) {
        this.mode = 'VIEW';
      } else if (s.isView && s.isRequest) {
        this.mode = 'MODIFICATION';
      }
    }
  }
  mode: any = "EDIT"
  submitted: boolean = false;
  data: eduDataConfig = {
    type: 'SECULAR'
  };
  CATEGORY: Array<any> = EDU_CATEGORY;
  EDU_STATUS: any = EDU_STATUS;
  eduData: Array<any> = [];
  @Input() public set type(res: eduType) {
    if (res) {
      this.data.type = res;
    }
  }
  formColData: formBuilderData[] = [];
  @ViewChild('dyTbl') dyTbl: DynamicTableFormComponent | undefined;
  constructor(private masterApi: MasterApiService, private modalService: ModalService) { }

  setInput(data: any) {
    this.data = data;
  }

  ngOnInit(): void {
    this.formColData = [
      {
        colName: 'id',
        visible: false,
        hidden: true,
        title: '',
        isPrimary: true
      },
      {
        colName: 'type',
        visible: false,
        hidden: true,
        title: '',
        defaultValue: this.data.type == 'SECULAR' ? 1 : 2
      },
      {
        colName: 'institution_name',
        title: 'Institution Name',
        validator: [{ name: 'required' }]
      },
      {
        colName: 'designation',
        title: 'Designation',
        validator: [{ name: 'required' }]
      },
      {
        colName: 'from_date',
        title: 'From Date',
        type: 'DATE',
        colType:'DATE',
        dateFormat: 'mm/yy',
        dateViewMode: 'month',
        dateRange: AppConstant.DEFAULT_FUTURE_DATE_RANGE,
        monthNavigator: true,
        yearNavigator: true,
        validator: [{ name: 'required' }],
      },
      {
        colName: 'to_date',
        title: 'To Date',
        dateFormat: 'mm/yy',
        type: 'DATE',
        colType:'DATE',
        dateViewMode: 'month',
        dateRange: AppConstant.DEFAULT_FUTURE_DATE_RANGE,
        monthNavigator: true,
        yearNavigator: true
      },
      {
        colName: 'place',
        title: 'Place',
        visible: false
      },
      {
        colName: 'remarks',
        title: 'Remarks',
        visible: false
      },
      {
        colName: 'document',
        title: 'Document',
        type: 'FILE',
        visible: false
      }
    ];
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

  apiPayload(): Array<any> {
    if (this.dyTbl) {
      return this.dyTbl?.apiPayload();
    }
    return [];
  }
}

declare type eduType = 'SECULAR' | 'MINISTRIAL';
export interface eduDataConfig {
  type: eduType,
  title?: string,
  isView?: boolean,
  isRequest?: boolean
}
