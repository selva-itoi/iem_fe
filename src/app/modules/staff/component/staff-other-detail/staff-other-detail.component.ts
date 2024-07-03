import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { formBuilderData, formDynamicValidator } from 'src/app/helper/interface/response';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { staffDynamicValidator, STAFF_BANK_FORM, STAFF_OTHERS_FORM } from '../../helper/staff_form';

@Component({
  selector: 'app-staff-other-detail',
  templateUrl: './staff-other-detail.component.html',
  styleUrls: ['./staff-other-detail.component.scss']
})
export class StaffOtherDetailComponent implements OnInit {
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @Input() profiletype : any
  basicFormData: formBuilderData[] = [...STAFF_BANK_FORM, ...STAFF_OTHERS_FORM];
  dynamicValidatorBasic: formDynamicValidator[] = staffDynamicValidator
  staffData: any;
  constructor() { }
  ngOnInit(): void { 
    if(this.profiletype == 'profile'){
    this.basicFormData.map((a:any)=>{   
      if(a.colName == 'account_name' ||a.colName=='bank_name' ||a.colName=='branch_name' ||a. a.colName == 'ifc_code' || a.colName == 'account_number' || a.colName == 'aadhar' ){
      a.validator=[]}})
    }else{
      this.basicFormData.map((a:any)=>{   
        if(a.colName == 'account_name' || a.colName == 'ifc_code' || a.colName == 'account_number'|| a.colName == 'aadhar' ){
        a.validator=[{name:'required'}]}})
    }
  }


  // onChange(ev: any) {
  //   if(ev.controlName == 'bank_name' || ev.controlName == 'branch_name' || ev.controlName == 'account_name' ){
  //    this.basicForm?.toremoveWhiteSpace(ev)
  //  }


  //  }

  applyFormValue(data: any) {
    console.log(this.basicFormData);
    
    if (data) {
      this.staffData = data;
      this.basicForm?.setData(data);
    }
  }
  apiPayload() {
    const payload = this.basicForm?.getFormValue();
    return payload;
  }

  isValidForm() {
    return this.basicForm?.isValid();
  }
}