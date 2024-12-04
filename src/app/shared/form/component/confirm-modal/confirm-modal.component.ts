import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { AppConstant } from 'src/app/helper/class/app-constant';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { formBuilder, formDynamicValidator } from 'src/app/helper/interface/response';
import { confirmModalData } from 'src/app/shared/interface/modal-interface';
import { FormGeneratorComponent } from '../form-generator/form-generator.component';
import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  data: any = {};
  type: 'CONFIRM' | 'FORM' = 'CONFIRM';
  public onClose: Subject<boolean> | any;
  formField: formBuilder[] = [];
  dynamicValidator: formDynamicValidator[] = [{
    controlName: 'is_alive',
    validatorControl: ['died_on'],
    hideControl: ['died_on'],
    operation: '!=',
    value: 1
  },
  {
    controlName: 'is_alive',
    validatorControl: ['effect_from'],
    hideControl: ['effect_from'],
    value: 1
  }]
  formValue: any = {}
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  constructor(private _bsModalRef: BsModalRef) { }

  public ngOnInit(): void {
    this.onClose = new Subject();
  }

  setInput(data: confirmModalData) {
    this.data = data;
    const formBuild: any = [{
      colName: 'reason_relive',
      title: 'Reason',
      validator: [{ name: 'required', error: 'Reason is Required' }]
    },
    {
      colName: 'is_alive',
      title: 'Is Alive',
      defaultValue: true,
      type: 'checkbox',
      data: [{ name: '', id: true }],
      selectKeyName: 'name',
      selectPrimaryKey: 'id',
      validator: [],
      event: {
        name: 'change',
        isCallback: true
      },
    },
    {
      colName: 'died_on',
      title: 'Date of Death',
      validator: [],
      type: 'DATE',
      monthNavigator: true,
      yearNavigator: true,
      dateFormat: AppConstant.DATE_FORMAT,
      dateRange: AppConstant.DEFAULT_DATE_RANGE,
    },
    {
      colName: 'effect_from',
      title: 'Effect From',
      validator: [],
      type: 'DATE',
      defaultValue: new Date(),
      monthNavigator: true,
      yearNavigator: true,
      dateFormat: AppConstant.DATE_FORMAT,
      dateRange: AppConstant.DEFAULT_DATE_RANGE,
    }];
    const dyn = [{
      controlName: 'is_alive',
      validatorControl: ['died_on'],
      hideControl: ['died_on'],
      value: false,
      validator: [{ name: 'required', error: '' }]
    },
    {
      controlName: 'is_alive',
      validatorControl: ['effect_from'],
      hideControl: ['effect_from'],
      value: true,
      validator: [{ name: 'required', error: 'Effect From Date is Required' }]
    }]
    this.type = data.type == 'FORM' ? 'FORM' : 'CONFIRM'
    if (data.isFormField) {
      this.type = 'FORM'
      this.dynamicValidator = data.dynamicValidator?.length ? data.dynamicValidator : this.dynamicValidator
      this.formField = data.formField?.length ? data.formField : formBuild;
      this.basicForm?.initForm()
      this.basicForm?.changeValidator();
    }
    if (!isEmptyObj(data.formValue)) {
      setTimeout(() => {
        this.basicForm?.setData(data.formValue)
      }, 800);
    }
    console.log('TYPE', this.type,data)
  }

  onChange(ev: any) { }

  get isValid() {
    return !this.basicForm?.isValid();
  }

  public onConfirm(): void {
    if (this.data.isFormField) {
      if (!this.basicForm?.isValid()) {
        return;
      }
    }
    const returnData = this.data.isFormField ? this.basicForm?.getFormValue() : true;
    this.onClose.next(returnData);
    this._bsModalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this._bsModalRef.hide();
  }
}
