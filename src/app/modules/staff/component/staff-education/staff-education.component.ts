import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { AppConstant } from 'src/app/helper/class/app-constant';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { formBuilderData } from 'src/app/helper/interface/response';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';
import { EDU_CATEGORY, EDU_STATUS } from '../../helper/staff_form';

@Component({
  selector: 'app-staff-education',
  templateUrl: './staff-education.component.html',
  styleUrls: ['./staff-education.component.scss']
})
export class StaffEducationComponent implements OnInit {
  @Input() public set config(s: eduDataConfig) {
    this.mapConfig(s);
  }
  @Input() modifyData:any=[]
  data: eduDataConfig = {
    type: 'ACADAEMIC'
  };
  educationForm: UntypedFormGroup = new UntypedFormGroup({});
  CATEGORY: Array<any> = EDU_CATEGORY;
  EDU_STATUS: Array<any> = EDU_STATUS
  eduData: Array<any> = [];
  mode: any = 'EDIT';
  @Input() public set type(res: eduType) {
    if (res) {
      this.data.type = res;
    }
  }

  formColData: formBuilderData[] = [];
  @ViewChild('dyTbl') dyTbl: DynamicTableFormComponent | undefined;
  constructor() { }

  setInput(data: any) {
    this.data = data;
  }
  mapConfig(s:eduDataConfig){
    if (!isEmptyObj(s) && s) {
      this.data = s;
      if (s.isView && !s.isRequest) {
        this.mode = 'VIEW';
      } else if (s.isRequest) {
        this.mode = 'MODIFICATION';
      }
    }
  }

  ngOnInit(): void {
    console.log('mode of edu', this.mode)
    this.formColData = [
      {
        colName: 'institution_name',
        title: 'School/Institution Name',
        validator: [{ name: 'required' }]
      },
      {
      colName: 'course_name',
      title: 'Class/Course',
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
      colName: 'type',
      visible: false,
      hidden: true,
      title: '',
      defaultValue: this.data.type == 'ACADAEMIC' ? 1 : 2
    },
    {
      colName: 'branch',
      title: 'Branch / Division',
      visible: false
    },
    {
      colName: 'category',
      title: 'Course Category',
      defaultValue: 1,
      apiTblName : 'edu_category',
      type: 'select',
      selectKeyName: 'edu_categoryName',
      validator: [{ name: 'required' }],
      visible: false
    },
    {
      colName: 'lang_medium_id',
      title: 'Lang/Medium',
      apiTblName:'lang_medium',
      selectKeyName:'lang_mediumName',
      selectPrimaryKey:'id',
      type:'select',
      visible: false
    },
    {
      colName: 'mark_percentage_group_id',
      title: 'Percentage',
      apiTblName:'mark_percentage_group',
      selectKeyName:'mark_percentage_groupName',
      selectPrimaryKey:'id',
      type:'select',
      visible: false
    },
    {
      colName: 'from_date',
      title:this.data.type=='CHILD' ? 'Course Year': 'From Date',
      type: 'DATE',
      colType: 'DATE',
      dateFormat: 'mm/yy',
      dateViewMode: 'month',
      dateRange: AppConstant.DEFAULT_FUTURE_DATE_RANGE,
      monthNavigator: true,
      event:{name:'change',isCallback:true},
      yearNavigator: true,
      validator: [{ name: 'required' }],
    },
    {
      colName: 'to_date',
      title: 'To Date',
      dateFormat: 'mm/yy',
      type: 'DATE',
      colType: 'DATE',
      dateViewMode: 'month',
      dateRange: AppConstant.DEFAULT_FUTURE_DATE_RANGE,
      monthNavigator: true,
      yearNavigator: true,
      hidden : this.data?.type !='CHILD' ?false :true,
    },
    {
      colName: 'course_status',
      title: 'Course Status',
      defaultValue: 1,
      data: this.EDU_STATUS,
      type: 'select',
      colType: 'DROPDOWN',
      selectKeyName: 'eduStatusName',
      filterCol: { type: 'DROPDOWN', data: this.EDU_STATUS,
      selectPrimaryKey : 'id',
      selectKeyName: 'eduStatusName' },
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

  onchange(e:any){
    if(e.controlName=="from_date" && this.data?.type=='CHILD'){
      const d = new Date(e.event) || null;
      this.dyTbl?.setValue('to_date', new Date(d.getFullYear()+1,d.getMonth(), 1))
    }
  }
  apiPayload(): Array<any> {
    if (this.dyTbl) {
      return this.dyTbl?.apiPayload();
    }
    return [];
  }
}

declare type eduType = 'ACADAEMIC' | 'THEOLOGY' | 'CHILD';
export interface eduDataConfig {
  type: eduType,
  title?: string,
  isView?: boolean,
  isRequest?: boolean
}
