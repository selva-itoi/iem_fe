import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { isEmptyObj, cleanForm } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
  public data: any = {};
  roleData: any;
  dataForm: UntypedFormGroup = {} as UntypedFormGroup;
  countryData: any = [];
  submitted: boolean = false;
  loading: boolean = false;
  public onClose: Subject<boolean> = new Subject();
  constructor(private masterApi: MasterApiService, private _bsModalRef: BsModalRef,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.dataForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
    });
  }

  getData() {
    if (!this.data.id) {
      return
    }
    this.masterApi.getById('role', this.data.id).then((res: ResponseData | any) => {
      if (res.statusCode == 200) {
        if (!isEmptyObj(res.result)) {
          this.roleData = res.result;
          this.applyFormValue();
        }
      }
    })
  }

  applyFormValue() {
    if (!this.data.id) {
      return
    }
    this.dataForm.patchValue({
      name: this.roleData.roleName || '',
    });
  }

  getCountry() {
    this.masterApi.getById('country', 1).then((res: ResponseData | any) => {
      if (res.statusCode == 200) {
        if (!isEmptyObj(res.result)) {
          this.countryData = [res.result];
        }
      }
    })
  }

  setInput(data: any) {
    this.data = data;
    console.log(data);
    this.getData();
  }

  apiPayload() {
    cleanForm(this.dataForm);
    let apiData: any = {};
    apiData.roleName = this.dataForm.value.name;
    if (this.data.id! == undefined || this.data.id) {
      apiData.id = this.data.id;
    }
    return apiData;
  }

  saveData() {
    this.submitted = true;
    if (this.dataForm.valid) {
      this.loading = true;
      this.masterApi.saveData('role', this.apiPayload()).then((res: ResponseData | any) => {
        let msg = 'Role has been updated';
        if (res.statusCode == 200) {
          if (!this.data.id) {
            msg = 'Role have been Saved';
          }
          this.onClose.next(true);
          this.close();
          this.alertService.showToast(msg, 'success');
        }
      }).catch(() => {
        this.alertService.showToast("We couldn’t save your changes", 'error');
      }).finally(() => {
        this.loading = false;
      })
    }
  }
  close() {
    this._bsModalRef.hide();
  }
}
