import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { formBuilder, formDynamicValidator, ResponseData } from 'src/app/helper/interface/response';
import { DynamicTableFormComponent } from 'src/app/shared/form/component/dynamic-table-form/dynamic-table-form.component';
import { searchModal } from 'src/app/shared/interface/modal-interface';
import { ModalService } from 'src/app/shared/service/modal.service';
import { churchCommitteeMember } from '../../helper/church-form';
import { ChurchApiService } from '../../service/church-api.service';

@Component({
  selector: 'app-council-member',
  templateUrl: './council-member.component.html',
  styleUrls: ['./council-member.component.scss']
})
export class CouncilMemberComponent implements OnInit {
  churchId: string | number = '';
  basicFormData: formBuilder[] = churchCommitteeMember
  data: any;
  title: string = 'Church Council Member';
  @Input() mode: 'VIEW' | 'EDIT' = 'EDIT';
  currentData: any = {};
  memberData: Array<any> = [];
  memberInfo: any = {};
  dataLoading: boolean = false;
  @Input() public set church_id(id: any) {
    if (id) {
      this.churchId = id;
      this.getDetails()
    }
  }
  memberShowData: mapInfoView[] = [{ name: 'name', title: 'Name' }, { name: 'mobile_no', title: 'Mobile No' }];
  dynamicValidator: formDynamicValidator[] = [{
    controlName: 'staff_fk_id',
    validatorControl: ['member_fk_id'],
    value: '',
    validator: [{ name: 'required' }]
  },
  {
    controlName: 'member_fk_id',
    validatorControl: ['staff_fk_id'],
    value: '',
    validator: [{ name: 'required' }]
  }
  ];
  @ViewChild('dyTbl') dyTbl: DynamicTableFormComponent | undefined;
  constructor(private modalService: ModalService, private churchApi: ChurchApiService) { }

  ngOnInit(): void { }

  setData(data: Array<any> = [], modify = []) {
    if (data.length || modify.length) {
      this.memberData = data;
      if (this.dyTbl) {
        this.dyTbl?.setInputData(this.memberData, modify);
      } else {
        this.setData(data, modify);
      }
    }
  }
  onAction(act: any) {
    if (act.action == 'EDIT') {
      this.memberInfo = act.data;
    } else if (act.action == 'RESET') {
      this.memberInfo = {};
    }
  }

  getDetails() {
    if (this.churchId) {
      this.dataLoading = true;
      this.churchApi.getCommitteeMember(this.churchId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (!isEmptyObj(res.result)) {
            this.setData(res.result);
          }
        }
      }).finally(() => { this.dataLoading = false; }).catch(((err: any) => { console.log(err, ' unable to get the details'); }));
    }
  }

  onChange(ev: any) { }

  searchModal(type: string = '') {
    const dataApi: searchModal = { type: 'CHURCH_MEMBER' } as searchModal
    if (type == 'STAFF') {
      dataApi.type = 'STAFF';
      dataApi.title = 'Select Staff/Missionary';
    } else {
      dataApi.whereField = [{ colName: 'church_id', value: this.churchId }]
    }
    this.memberInfo = {};
    this.modalService.openSearchModal(dataApi).then((res: any) => {
      if (res) {
        this.dyTbl?.setValue('staff_emp_id', res.staff_emp_id || '');
        this.dyTbl?.setValue('member_id', res.member_id || '');
        this.dyTbl?.setValue('name', res.name);
        if (dataApi.type == 'STAFF') {
          this.dyTbl?.setValue('staff_fk_id', res.id);
          this.dyTbl?.setValue('member_fk_id', '');
        } else {
          this.dyTbl?.setValue('member_fk_id', res.id);
          this.dyTbl?.setValue('staff_fk_id', '');
        }
        this.memberInfo = res;
        this.dyTbl?.setValue(dataApi.type == 'STAFF' ? 'staff_emp_id' : 'member_id', res.staff_emp_id || res.church_name)
      }
    });
  }

  apiPayload(): Array<any> {
    if (this.dyTbl) {
      return this.dyTbl?.apiPayload();
    }
    return [];
  }
}
