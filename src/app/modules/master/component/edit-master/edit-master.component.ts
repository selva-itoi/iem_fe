import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { AddressComponent } from 'src/app/core/component/address/address.component';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { formBuilderData, ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';

@Component({
  selector: 'app-edit-master',
  templateUrl: './edit-master.component.html',
  styleUrls: ['./edit-master.component.scss']
})
export class EditMasterComponent implements OnInit {
  public data: any = {};
  branchData: any;
  submitted: boolean = false;
  loading: boolean = false;
  addressKeys: Array<string> = [];
  dataLoading: boolean = false;
  public onClose: Subject<boolean> = new Subject();
  @ViewChild('address') address: AddressComponent | undefined;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  constructor(private masterApi: MasterApiService, private _bsModalRef: BsModalRef,
    private modalService :ModalService,
    private alertService: AlertService) { }

  ngOnInit(): void { }

  setInput(data: any) {
    this.data = data;
    this.addressKeys = this.data.addressKeys ? this.data.addressKeys : [];
    if (this.data.hideBasic) {
      console.log(this.data, ' data log')
      this.address?.hideBasic(true);
      this.address?.initForm();
    }
    this.getData();
  }
  onChange(ev: any) { }

  getData() {
    if (!this.data.id) {
      return
    }
    let api: any;
    this.dataLoading = true;
    if (this.data.getApi) {
      //@ts-ignore
      api = this.masterApi[this.data.getApi]?.(this.data.id)
    } else {
      api = this.masterApi.getById(this.data.tbl, this.data.id);
    }
    api.then((res: ResponseData | any) => {
      if (res.statusCode == 200) {
        if (!isEmptyObj(res.result)) {
          this.branchData = res.result;
          if (this.data.isAddress) {
            this.address?.applyFormValue(res.result);
          }
          this.applyFormValue();
        }
      }
    }).finally(() => this.dataLoading = false)
  }

  applyFormValue() {
    if (!this.data.id) {
      return
    }
    this.basicForm?.setData(this.branchData);
  }

  isFormChange() {
    if (this.data.isAddress) {
      if (this.address?.isFormChange() || this.basicForm?.isFormChange()) {
        return true;
      } else {
        return false;
      }
    }
    return this.basicForm?.isFormChange();
  }

  isValid() {
    const addr = this.data.isAddress ? this.address?.isValidForm() : true;
    return this.basicForm?.isValid() && addr;
  }

  apiPayload() {
    let apiData: any = {};
    const formData = this.basicForm?.getFormValue();
    this.data.tblCol.map((a: formBuilderData) => {
      apiData[a.colName] = formData[a.colName];
    });
    if (this.data.isAddress) {
      const keys = [...['country', 'state', 'district', 's_district', 'village', 'city', 'ward', 'panchayat'], ...this.addressKeys],
        data = this.address?.apiPayload();
      keys.forEach(a => {
        apiData[a] = data[a]
      })
    }
    if (this.data.id! == undefined || this.data.id) {
      apiData.id = this.data.id;
    }
    return apiData;
  }

  saveData() {
    this.submitted = true;
    if (this.isValid()) {
      if (!this.isFormChange()) {
        this.alertService.showToast('No changes you made', 'info');
        return;
      }
    } else {
      return;
    }
    this.loading = true;
    let api: any = {};
    if (this.data.saveApi) {
      //@ts-ignore
      api = this.masterApi[this.data.saveApi]?.(this.apiPayload())
    } else {
      api = this.masterApi.saveData(this.data.tbl, this.apiPayload());
    }
    api.then((res: ResponseData | any) => {
      let msg = this.data.title + ' has been updated';
      if (res.statusCode == 200) {
        if (!this.data.id) {
          msg = this.data.title + ' have been Saved';
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



  close() {
    this._bsModalRef.hide();
  }
}
