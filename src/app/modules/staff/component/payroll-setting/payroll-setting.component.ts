import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { ResponseData, formBuilderData, formDynamicValidator } from 'src/app/helper/interface/response';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { STAFF_PAYROLL_FORM } from '../../helper/staff_form';

@Component({
  selector: 'app-payroll-setting',
  templateUrl: './payroll-setting.component.html',
  styleUrls: ['./payroll-setting.component.scss']
})
export class PayrollSettingComponent implements OnInit {

  payrollHeadData: any
  @Input() type: 'VIEW' | 'EDIT' | 'MODIFICATION' = 'EDIT'
  @Input() modifyData: any
  @Input() sourceData: any
  payRollData = {};
  formData: formBuilderData[] = []//cloneData(STAFF_PAYROLL_FORM);
  dynamicValidator: formDynamicValidator[] = [
    {
      controlName: 'is_payroll',
      validatorControl: ['payroll_group_fk_id', 'payroll_type', 'salary_category_id', 'hra_id', 'leave_policy_id', 'is_abry'],
      hideControl: ['payroll_group_fk_id', 'payroll_type', 'salary_category_id', 'hra_id', 'leave_policy_id', 'is_epf', 'is_esi', 'is_welfare', 'is_abry'],
      validator: [{ name: 'required' }],
      value: 1
    },
    {
      controlName: 'is_epf',
      validatorControl: ['is_abry'],
      hideControl: ['is_abry'],
      value: 1,
      operation: '!='
    },
  ]
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined
  constructor(private payrollApi: MasterApiService) { }

  ngOnInit(): void {
    this.getHeadData()
  }

  getHeadData() {
    this.payrollApi.getStaffPayroll().then((res: ResponseData | any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.payrollHeadData = res.result
        this.genForm();
      }
    })
  }

  async genForm() {
    const extField: any = []
    await this.payrollHeadData.forEach((e: any) => {
      const s: formBuilderData = {} as formBuilderData;
      if (e.variable_name && +e?.is_on_staff_profile) {
        s.colName = e.variable_name;
        s.title = e.payroll_headName;
        let c = e.staff_profile_default_value ? e.staff_profile_default_value.split(',') : [0];
        if (c.length > 1) {
          s.type = 'select';
          s.selectKeyName = s.colName;
          s.data = [];
          c.forEach((b: any) => {
            const db = { [s.colName]: b, id: b };
            s.data?.push(db);
          });
        } else {
          s.defaultValue = c[0];
        }
        s.validator = [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
        this.dynamicValidator.map((v: formDynamicValidator) => {
          if (v.controlName == 'is_payroll') {
            v.hideControl?.push(e.variable_name);
            v.validatorControl.push(e.variable_name)
          }
        })
      }
      extField.push(s)
      if (this.payRollData) {
        this.basicForm?.setData(this.payRollData);
      }
    });
    this.formData = [...cloneData(STAFF_PAYROLL_FORM), ...extField];
    this.basicForm?.initForm();
    console.log('after set dyn valid', this.dynamicValidator)
  }

  apiPayload() {
    const payload = this.basicForm?.apiPayload() || {};
    return payload
  }

  setData(data: any) {
    this.payRollData = data;
    setTimeout(() => {
      this.basicForm?.setData(data)
    }, 800);
  }

  setValue(ctrlName, data) {
    this.basicForm?.setValue(ctrlName, data, true);
  }

  getFormValue(dropdownText?: boolean) {
    const value = this.basicForm?.getFormValue(dropdownText) || {};
    return value
  }

  isValid() {
    return this.basicForm?.isValid();
  }

  onChange(ev: any) {

  }
}
