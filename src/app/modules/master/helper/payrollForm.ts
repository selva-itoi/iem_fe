import { VALIDATOR_PATTERNS } from "src/app/helper/class/app-constant";
import { cloneData } from "src/app/helper/class/utilityHelper";
import { formBuilderData } from "src/app/helper/interface/response";
import { STAFF_PAYROLL_FORM } from "../../staff/helper/staff_form";

export const PAYROLL_HEAD_FORM: formBuilderData[] = [{
  colName: 'payroll_headName',
  title: 'Head Name',
  validator: [{ name: 'required' }],
  filter:true
},
{
  colName: 'variable_name',
  info: 'should be unique and act as variable on cal',
  title: 'Variable Name',
  validator: [{ name: 'required' }]
},
{
  colName: 'short_code',
  title: 'Short Code',
},

{
  colName: 'round_off_id',
  title: 'Round Off',
  type: 'select',
  data: [{ name: 'Round Up', id: '1' }, { name: 'Round Down', id: '2' }],
  selectKeyName: 'name', selectPrimaryKey: 'id',
  visible: false,
  validator: [{ name: 'required' }],
},
{
  colName: 'status',
  title: 'Status',
  type: 'select',
  selectKeyName: 'statusName',
  defaultValue: '1',
  data: [{ statusName: 'Active', id: '1' }, { statusName: 'In Active', id: '0' }],
  validator: [{ name: 'required' }],
  visible: false
},
{
  groupTitle: ' ',
  colName: 'head_type',
  title: 'Type',
  type: 'select',
  defaultValue: 1,
  selectKeyName: 'head_typeName', selectPrimaryKey: 'id',
  event: { isCallback: true, name: 'change' },
  data: [{ head_typeName: 'Earning', id: 1 }, { head_typeName: 'Deduction', id: 2 }, { head_typeName: 'Statutory', id: 3 }],
  colType: 'DROPDOWN',
  filterCol: { type: 'DROPDOWN', data: [{ label: 'Earning', key: 1, color: 'primary' }, { label: 'Deduction', key: 2, color: 'info' }, { label: 'Statutory', key: 3, color: 'secondary' }] },
  filter: true,
  validator: [{ name: 'required' }]
},
{
  colName: 'is_attendence_based',
  title: 'Is Attendance Based',
  type: 'checkbox',
  defaultValue: false,
  selectKeyName: 'name', selectPrimaryKey: 'id',
  event: { isCallback: true, name: 'change' },
  data: [{ name: 'Yes', id: 1 }],
  visible: false
},
{
  colName: 'is_editable',
  title: 'Is editable ?',
  type: 'checkbox',
  defaultValue: false,
  selectKeyName: 'name', selectPrimaryKey: 'id',
  event: { isCallback: true, name: 'change' },
  data: [{ name: 'Yes', id: 1 }],
  colType: 'DROPDOWN',
  filterCol: { type: 'DROPDOWN', data: [{ label: 'Yes', key: 1, color: 'info' }, { label: 'No', key: 0, color: 'danger' }] },
  filter: true
},
{
  colName: 'is_fixed_label',
  title: 'Is Static Head ?',
  type: 'checkbox',
  defaultValue: false,
  selectKeyName: 'name', selectPrimaryKey: 'id',
  event: { isCallback: true, name: 'change' },
  data: [{ name: 'Yes', id: 1 }],
  colType: 'DROPDOWN',
  filterCol: { type: 'DROPDOWN', data: [{ label: 'Yes', key: 1, color: 'info' }, { label: 'No', key: 0, color: 'danger' }] },
  filter: true
},
{
  colName: 'is_allow_bulk_entry',
  title: 'Is Allow Bulk Entry ?',
  type: 'checkbox',
  defaultValue: false,
  selectKeyName: 'name', selectPrimaryKey: 'id',
  event: { isCallback: true, name: 'change' },
  data: [{ name: 'Yes', id: 1 }],
  visible: false,
},
{
  colName: 'is_on_staff_profile',
  title: 'Show On Staff Profile ?',
  type: 'checkbox',
  defaultValue: false,
  visible: false,
  selectKeyName: 'name', selectPrimaryKey: 'id',
  event: { isCallback: true, name: 'change' },
  data: [{ name: 'Yes', id: 1 }],
},
{
  colName: 'staff_profile_default_value',
  title: 'Default Value',
  visible: false
},
];
export const PAYROLL_CREATE_FORM: formBuilderData[] = [...[{ colName: 'report_date', title: 'Month and Year', dateViewMode: 'month', dateFormat: 'mm/yy', type: 'DATE', validator: [{ name: 'required' }],defaultValue: new Date() }],...cloneData(STAFF_PAYROLL_FORM).filter(a => ['trust_fk_id','payroll_group_fk_id'].includes(a.colName)).map(b=>{if(b.colName=='trust_fk_id'){
  b.hidden=false;b.apiTblName='trust',b.selectKeyName='trustName',
  b.type = 'select',b.validator = [{name : 'required'}]
} return b})]
export const PAYROLL_HEAD_DYN_FORM: formBuilderData[] = [
  {
    colName: 'condition_formula',
    info: 'Math Formula accepted like > ,IF,(,)..etc',
    title: 'Condition',
    validator: [],
  },
  {
    // groupTitle: ' ',
    colName: 'is_fixed',
    title: 'Is Fixed',
    type: 'checkbox',
    event: { name: 'change', isCallback: true },
    data: [{ dataName: 'Yes', id: 1 }],
    selectKeyName: 'dataName',
    selectPrimaryKey: 'id',
    visible: false
  },
  {
    colName: 'fixed_value',
    title: 'Fixed Amount',
    validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }],
    // visible: false
  },
  {
    colName: 'calculation_formula',
    title: 'Amount Calculation',
    info: 'Math expression with reserved keywords(calculation Key) allowed..',
    validator: [],
    // visible: false,
  },
  {
    colName: 'id',
    title: '',
    isPrimary: true,
    hidden: true,
    visible: false
  }
]