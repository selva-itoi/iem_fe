import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppConstant, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { isArray, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { ResponseData, formBuilderData, formDynamicValidator } from 'src/app/helper/interface/response';
import { ChildBasicInfoComponent } from 'src/app/modules/child/component/child-basic-info/child-basic-info.component';
import { CHILD_SIBLING_FORM } from 'src/app/modules/child/helper/child-form';
import { ChildApiService } from 'src/app/modules/child/service/child-api.service';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';
import { ModalService } from 'src/app/shared/service/modal.service';

interface eduDataConfig {
  title?: string,
  isView?: boolean,
  isRequest?: boolean
}


@Component({
  selector: 'app-child-sbiling',
  templateUrl: './child-sbiling.component.html',
  styleUrls: ['./child-sbiling.component.scss']
})
export class ChildSbilingRefComponent implements OnInit {
  mode: 'EDIT' | 'VIEW' | 'MODIFICATION' = 'EDIT'
  shortOrg = AppConstant.ORG_NAME;
  @Input() public set config(s: eduDataConfig) {
    if (!isEmptyObj(s) && s) {
      this.data = s;
      if (s.isView && !s.isRequest) {
        this.mode = 'VIEW';
      } else if (s.isRequest) {
        this.mode = 'MODIFICATION';
      }
    }
  }
  @Input() public set staffEmpId(id: any) {
    console.log('call sibiling', id)
    if (id) {
      this.getSibiling(id);
    }
  }
  @Input() childId: string | number = '';

  submitted: boolean = false;
  data: eduDataConfig | null = {};
  currentData: any = {};
  childData: Array<any> = [];

  dateRange = AppConstant.DEFAULT_DATE_RANGE;
  dateFormat = AppConstant.DATE_FORMAT;
  initialValue: any = {};
  staffSibling: Array<any> = [];
  loadingSibiling: boolean = false;
  viewData: any = {};
  dynamicController: formDynamicValidator[] = [
    {
      controlName: 'status',
      validatorControl: ['died_on'],
      hideControl: ['died_on'],
      value: '4',
    },
    {
      controlName: 'marital_status_id',
      validatorControl: ['spouse_name'],
      hideControl: ['spouse_name'],
      value: '1',
      operation: '>'
    },
    {
      controlName: 'status',
      validatorControl: [''],
      hideControl: ['monthly_income'],
      value: '3'
    },
  ];
  formColData: formBuilderData[] = CHILD_SIBLING_FORM;
  @ViewChild('dyTbl') dyTbl: DynamicTableFormComponent | undefined;
  constructor(private modalService: ModalService,
    private childApi: ChildApiService) { }

  setInput(data: any) {
    this.data = data;
  }

  ngOnInit(): void { }


  setData(data: Array<any> = [], modify = []) {
    if (data.length || modify.length) {
      this.childData = data;
      if (this.dyTbl) {
        this.dyTbl?.setInputData(this.childData, modify);
      } else {
        this.setData(data, modify);
      }
    }
  }

  apiPayload(): Array<any> {
    return this.dyTbl?.apiPayload() || [];
  }



  getSibiling(id: string | number) {
    if (id) {
      this.loadingSibiling = true;
      this.childApi.getSbiling(id).then((res: ResponseData | any | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (isArray(res.result)) {
            this.staffSibling = res.result.filter((a: any) => a.child_id != this.childId);
            if (isArray(this.childData)) {
              this.childData = this.staffSibling;
            } else {
              this.staffSibling.forEach((a: any) => {
                this.childData.push(a);
              })
            }
            this.dyTbl?.setInputData(this.childData);
          }
        }
      }).finally(() => {
        this.loadingSibiling = false;
      })
    }
  }

  showSibiling(data: any, temp: any) {
    this.viewData = data;
    if (data.child_no) {
      this.modalService.openModal(ChildBasicInfoComponent, data, 'modal-lg')
    } else
      this.modalService.openModalTemplate(temp);
  }
  closeModal() {
    this.modalService.close();
  }
}