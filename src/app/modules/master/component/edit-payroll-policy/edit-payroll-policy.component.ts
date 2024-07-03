import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { ResponseData, formBuilderData, tableBuilder, tblFilterQuery } from 'src/app/helper/interface/response';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { MasterApiService } from '../../service/master-api.service';
import { AlertService } from 'src/app/helper/service/alert.service';
import { isArray } from 'src/app/helper/class/utilityHelper';

@Component({
  selector: 'app-edit-payroll-policy',
  templateUrl: './edit-payroll-policy.component.html',
  styleUrls: ['./edit-payroll-policy.component.scss']
})

export class EditPayrollPolicyComponent implements OnInit {

  NEW_POLICY_COL: any[] = [
    { colName: 'leave_typeName', title: 'Leave type Name', info: 'Annual Leave, Casual,Emergency..', validator: [{ name: 'required' }], isEditable: false },
    { colName: 'monthly_limit', title: 'Monthly Limit', validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }], isEditable: true },
    { colName: 'yearly_limit', title: 'Yearly Limit', validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }], isEditable: true },
    { colName: 'frequency_month', title: 'Frequency', validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }], isEditable: true },
    { colName: 'max_no_of_times', title: 'Max No of Times', validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }], isEditable: true },
  ]
  LIST_COL: formBuilderData[] = [{ colName: 'leave_policyName', title: 'Policy Name' }, { colName: 'status', title: 'Status', hidden: true, visible: false }]
  tableConfig: tableBuilder = {
    name: 'Leave Policy',
    action: [],
    column: this.NEW_POLICY_COL,
    isLazy: true
  }
  tablePolicyConfig: tableBuilder = {
    name: '',
    action: [],
    column: this.LIST_COL,
    isLazy: true
  }
  cols: Array<any> = this.NEW_POLICY_COL
  leaveTypeData = [{ name: 'Emergency', id: 1 }, { name: 'Casual', id: 2 }, { name: 'Medical', id: 3 }]
  policyForm: UntypedFormGroup = {} as UntypedFormGroup
  tableData: Array<any> = []
  policyData: any
  maxSelection: number = 1
  isSelect: boolean = false
  loading: boolean = false
  @ViewChild('d1') tblDiv: Table = {} as Table;
  @ViewChild('policyTbl') policyTbl: TableListComponent | undefined
  constructor(private masterApi: MasterApiService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.policyForm = new UntypedFormGroup({
      leave_policyName: new UntypedFormControl('', Validators.required),
    })
  }
  onDataSelect(ev: any) {
    if (isArray(ev)) {
      this.isSelect = true;
      const id = ev[0]?.id;
      this.getPolicy(id)
    } else {
      this.reset(false);
    }
  }
  reset(silent = true) {
    this.isSelect = false;
    this.policyForm.reset()
    this.policyData = {};
    this.tableData = [];
    if (silent) {
      this.policyTbl?.clearAllSelection();
    }
  }
  getPolicy(id: any) {
    this.masterApi.getLeavePolicy(id).then((res: ResponseData | any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.policyData = res?.result
        this.policyForm.controls['leave_policyName'].setValue(res?.result['leave_policyName'] || '')
        this.tableData = res?.result['policy_item']
      }
    })
  }

  apiPayload() {
    const payload = this.policyForm.value || {};
    if (this.policyData.id) {
      payload.id = this.policyData.id
      payload.policy_item = this.tableData
    }
    return payload
  }

  savePolicy() {
    if (this.policyForm.invalid) {
      return
    }
    this.loading = true
    this.masterApi.saveLeavePolicy(this.apiPayload()).then((res: ResponseData | any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Policy Save Successfully', 'success')
        this.policyTbl?.reload()
        this.reset();
      }
    }).catch(() => { this.alertService.showToast('Unable to save data', 'error') }
    ).finally(() => this.loading = false)
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    return this.masterApi.getFullData('leave_policy', [], true, e)
  }
}

