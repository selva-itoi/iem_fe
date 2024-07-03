import { Component, OnInit, ViewChild } from '@angular/core';
import { VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilderData, tableBuilder, tableColum } from 'src/app/helper/interface/response';
import { ModalService } from 'src/app/shared/service/modal.service';
import { PAYROLL_HEAD_FORM } from '../../helper/payrollForm';
import { MasterComponent } from '../master/master.component';
import { NewPayrollHeadComponent } from '../new-payroll-head/new-payroll-head.component';

@Component({
  selector: 'app-payrole-master',
  templateUrl: './payrole-master.component.html',
  styleUrls: ['./payrole-master.component.scss']
})
export class PayroleMasterComponent implements OnInit {

  pageInfo: pageInfo = {
    title: ' Payroll',
    buttonShowBtn: true,
    button: {
      title: 'Add New',
      url: '',
      icon: 'pi pi-plus'
    }
  }
  segement: any = {
    PAYROLL_HEAD: 'Payroll Head ',
    PAYROLL_TYPE: 'Payroll Type',
    SALARY_CATEGORY: 'Category',
    LEAVE_TYPE: 'Leave Type',
    LEAVE_POLICY: 'Leave Policy',
    EXPERIENCE_SLOT: 'Experience Slot',
    ACCOUNT_CATEGORY: 'Account Category',
    ACCOUNT_SCHEME: 'Account Scheme',
    HRA_PERCENTAGE: 'HRA Percentage',
    BIBLE_WORDS: 'Bible Words',
    PAYROLL_GROUP: 'Payroll Group',
  }
  segmentVisited: any = {}
  payrollData: any
  currentSegment: string = '';
  SALARY_CATEGORY_COL: formBuilderData[] = [
    { colName: 'salary_categoryName', title: 'Category Name', validator: [{ name: 'required' }] },
    { colName: 'payroll_type_fk_id', title: 'Payroll Type', visible: false, type: 'select', apiTblName: 'payroll_type', selectPrimaryKey: 'id', selectKeyName: 'payroll_typeName', validator: [{ name: 'required' }] },
    { colName: 'basic_amount', title: 'Basic Amount', validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }] },
    { colName: 'increment_amount', title: 'Increment Amount', validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }] }
  ]
  genderData = [{ label: 'Male Only', key: 1, color: 'success' }, { label: 'Female Only', key: 2, color: 'info' }, { label: 'Both', key: 3, color: 'warning' }]
  LEAVE_TYPE_COL: formBuilderData[] = [
    { colName: 'leave_typeName', title: 'Leave Type' },
    { colName: 'allowable_gender', type: 'select', data: [{ allowable_genderName: 'Male Only', id: 1 }, { allowable_genderName: 'Female Only', id: 2 }, { allowable_genderName: 'Both', id: 3, }], title: 'Gender', selectKeyName: 'allowable_genderName', selectPrimaryKey: 'id', validator: [{ name: 'required' }], colType: 'DROPDOWN', filterCol: { type: 'DROPDOWN', data: this.genderData }, filter: true },
    { colName: 'leave_code', title: 'Leave Code' },
    { colName: 'is_paid_leave', title: 'Paid Leave ? ', type: 'checkbox', data: [{ is_paid_leave_status: 'Yes', id: 1 }], selectKeyName: 'is_paid_leave_status', defaultValue: 1 },
    { colName: 'color_code', title: 'Color Code', type: 'COLORPICKER', inline: true }
  ]
  HRA_PERCENTAGE_COL: formBuilderData[] = [
    { colName: 'hra_percentageName', title: 'HRA Percentage' },
    { colName: 'hra_percentage_value', title: 'Value' },
  ]
  PAYROLL_HEAD_COL: tableColum[] = cloneData(PAYROLL_HEAD_FORM)
  PAYROLL_TYPE_COL: formBuilderData[] = [{ colName: 'payroll_typeName', title: 'Payroll type', validator: [{ name: 'required' }] }]
  LEAVE_POLICY_COL: formBuilderData[] = [{ colName: 'policy_typeName', title: 'Policy Name' }, { colName: 'status', title: 'Status' }]
  CATEGORY_COL: any
  PAYROLE_DEDUCTION_COL: any
  ACCOUNT_CATEGORY_COL: formBuilderData[] = [
    {
      colName: 'account_categoryName',
      title: 'Account Category',
      validator: [{ name: 'required' }]
    }
  ]
  ACCOUNT_SCHEME_COL: formBuilderData[] = [
    {
      colName: 'account_category_id',
      title: 'Account Category',
      apiTblName: 'account_category',
      type: 'select',
      selectKeyName: 'account_categoryName',
      selectPrimaryKey: 'id',
      validator: [{ name: 'required' }]
    },
    {
      colName: 'account_schemeName',
      title: 'Account Scheme Name',
      validator: [{ name: 'required' }]
    },
    {
      colName: 'duration_in_month',
      title: 'Duration In Month',
      validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
      colName: 'max_amount',
      title: 'Maximum Amount',
      validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
    }
  ]
  EXPERIENCE_SLOT_COL: formBuilderData[] = [
    {
      colName: 'experience_slotName',
      title: 'Experience'
    },
    {
      colName: 'slot',
      title: 'Slot'
    },
  ];
  BIBLE_WORDS_COL: formBuilderData[] = [
    {
      colName: 'bible_wordsName',
      title: 'Bible Word',
      validator: [{ name: 'required' }]
    },
    {
      colName: 'versus',
      title: 'Versus',
      validator: [{ name: 'required' }]
    }
  ]
  PAYROLL_GROUP_COL: formBuilderData[] = [
    {
      colName: 'trust_fk_id',
      title: 'Establishment Name',
      selectKeyName: 'trustName',
      selectPrimaryKey: 'id',
      apiTblName: 'trust',
      type: 'select',
      validator: [{ name: 'required' }]
    },
    {
      colName: 'payroll_groupName',
      title: 'Group',
      validator: [{ name: 'required' }]
    }
  ]
  tableConfig: tableBuilder = {
    name: 'Payroll Head',
    column: this.PAYROLL_HEAD_COL,
    action: []
  }

  allKeys: Array<any> = Object.keys(this.segement);
  COL: any = {};
  @ViewChild('masterPage') masterPage: MasterComponent | undefined
  constructor(private modalServ: ModalService) { }

  ngOnInit(): void {
    this.allKeys.forEach((a: any) => {
      //@ts-ignore
      this.COL[a] = this[a + '_COL']
    })
  }

  tblAction(event: any) {
    if (this.segement.PAYROLL_HEAD == this.currentSegment && event?.data == 'EDIT') {
      this.masterPage?.edit(event.id, NewPayrollHeadComponent)
    }
  }


  addNew(st: any) {
    if (this.segement.PAYROLL_HEAD == this.currentSegment) {
      this.modalServ.openModal(NewPayrollHeadComponent, { id: '' }, 'modal-lg')
    } else {
      this.masterPage?.edit()
    }
  }
}
