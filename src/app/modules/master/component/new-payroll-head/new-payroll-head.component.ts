import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilder, formBuilderData, formDynamicValidator } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { PAYROLL_HEAD_DYN_FORM, PAYROLL_HEAD_FORM } from '../../helper/payrollForm';
import { MasterApiService } from '../../service/master-api.service';

@Component({
  selector: 'app-new-payroll-head',
  templateUrl: './new-payroll-head.component.html',
  styleUrls: ['./new-payroll-head.component.scss']
})
export class NewPayrollHeadComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  isModal: boolean = false;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  basicFormData: formBuilder[] = []
  submitted: boolean = false;
  dataLoading: boolean = false;
  loading: boolean = false;
  disabled_save: boolean = false;
  payrollData: any = {};
  pageInfo: pageInfo = { title: 'New Payroll Head' } as pageInfo;
  payrollID: any = '';
  payRollDynamicValidator: formDynamicValidator[] = [
    {
      controlName: 'marital_status_id',
      validatorControl: ['spouse_name', 'do_marriage'],
      hideControl: ['spouse_name', 'do_marriage'],
      value: '2',
    },

    {
      controlName: 'is_on_staff_profile',
      validatorControl: ['staff_profile_default_value'],
      hideControl: ['staff_profile_default_value'],
      operation: '==',
      value: '1',
    },
  ]
  dynamicValiTbl: formDynamicValidator[] = [
    {
      controlName: 'is_fixed',
      validatorControl: ['fixed_value'],
      hideControl: ['fixed_value'],
      value: '1',
    },
    {
      controlName: 'is_fixed',
      validatorControl: ['calculation_formula'],
      hideControl: ['calculation_formula'],
      operation: '!=',
      value: '1',
    },
  ]
  calKeys = ['basic', 'hra_percentage_value', 'allowance', '>', '<', '*', '(', ')', 'deduction', '+', '/', '-', 'eb', 'year_of_experience', 'increment', 'saving', 'loan', 'slot', 'is_epf', 'is_esi', 'is_welfare'];
  tblFormData: formBuilderData[] = cloneData(PAYROLL_HEAD_DYN_FORM)
  @ViewChild('dynTbl') dynTbl: DynamicTableFormComponent | undefined;
  constructor(private masterApi: MasterApiService, private modalService: ModalService,
    private alertService: AlertService, private navServ: NavigationService) { }

  ngOnInit(): void { }

  setInput(d: any) {
    this.isModal = true;
    const formData  =cloneData(PAYROLL_HEAD_FORM);
    this.basicFormData = formData;
    if (d.id) {
      formData.map((a:any) => {if(a.colName == 'variable_name'){
        a.readonly = true
      }return a})
      this.pageInfo.title = 'Update Payroll Head';
      this.payrollID = d.id;
      this.getData(d.id);
    }
  }
  onChange(ev: any) { }

  getData(id: any) {
    this.dataLoading = true;
    this.masterApi.getPayrollHeadById(id).then((res: ResponseData | any) => {
      if (res.statusCode == 200) {
        this.payrollData = res.result;
        this.basicForm?.setData(this.payrollData);
        if (this.payrollData?.head_calculation?.length) {
          setTimeout(() => {
            this.dynTbl?.setInputData(this.payrollData?.head_calculation || []);
          }, 800);
        }
      }
    }).finally(() => this.dataLoading = false)
  }

  get isValid() {
    return this.basicForm?.isValid();
  }

  getPayload() {
    const data = this.basicForm?.apiPayload();
    data.head_calculation = this.dynTbl?.apiPayload() || [];
    if (this.payrollID) {
      data.id = this.payrollID;
    }
    return data;
  }
  onSubmit() {
    this.submitted = true
    if (!this.isValid) {
      return
    }
    this.loading = true;
    this.masterApi.savePayrollHead(this.getPayload()).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Saved Successfully', 'success');
        this.close()
      }
    }).catch((err) => {
      this.alertService.showToast(err, 'error');
    }).finally(() => this.loading = false)
  }

  close() {
    if (this.isModal) {
      this.modalService.close()
    } else {
      this.navServ.back()
    }

  }
  showTooltip: boolean = false
  copyToClipboard(index: any): void {
    const textToCopy: any = this.calKeys[index];
    navigator.clipboard.writeText(textToCopy);
    this.showTooltip = true;
    setTimeout(() => {
      this.showTooltip = false;
    }, 2000);
  }
}
