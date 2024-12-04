import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppConstant } from 'src/app/helper/class/app-constant';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { formBuilderData } from 'src/app/helper/interface/response';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';

@Component({
  selector: 'app-staff-training',
  templateUrl: './staff-training.component.html',
  styleUrls: ['./staff-training.component.scss']
})
export class StaffTrainingComponent implements OnInit {
  @Input() public set config(s: any) {
    if (!isEmptyObj(s) && s) {
      this.data = s;
      
      if (s.isView && !s.isRequest) {
        this.mode = 'VIEW';
      } else if (s.isView && s.isRequest) {
        this.mode = 'MODIFICATION';
      }
    }
  }
  data: any = {};
  mode:any = 'EDIT'
  eduData: Array<any> = [];
  formColData: formBuilderData[] = [];
  @ViewChild('dyTbl') dyTbl: DynamicTableFormComponent | undefined;
  constructor() { }

  setInput(data: any) {
    this.data = data;
  }

  ngOnInit(): void {
    this.formColData = [{
      colName: 'training_name',
      title: 'Training Name',
      validator: [{ name: 'required' }]
    },
    {
      colName: 'id',
      visible: false,
      hidden: true,
      title: '',
      isPrimary: true
    },
    {
      colName: 'description',
      title: 'Description',
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
      yearNavigator: true,
      validator: [{ name: 'required' }]
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