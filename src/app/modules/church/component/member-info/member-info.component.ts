import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { COMMON_INFO_UPDATE_INFO } from 'src/app/core/helper/core_form_helper';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { AlertService } from 'src/app/helper/service/alert.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { churchMemberForm } from '../../helper/church-form';
import { ChurchApiService } from '../../service/church-api.service';

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss']
})
export class MemberInfoComponent implements OnInit {
  dataLoading: boolean = false;
  memberData: any = {};
  isModal: boolean = false;
  memberForm = cloneData(churchMemberForm).filter((a: any) => !['gifting'].includes(a.colName))
  pageInfo: pageInfo = {} as pageInfo;
  formData: any[] = [...[{ title: 'Member ID', name: 'member_id' }], ...this.memberForm, ...[{ name: 'gifting', title: 'Gifting' }], ...[{ name: 'reason_relive', title: 'Reason Relive' }], ...COMMON_INFO_UPDATE_INFO]
  constructor(private modalService: ModalService, private navServ: NavigationService,
    private alertService: AlertService,
    private churchApi: ChurchApiService) { }

  ngOnInit(): void {
    this.pageInfo = { title: 'Church Member Info' };
    // const do_bap = cloneData(churchMemberForm).find((a: any) => ['do_bap'].includes(a.colName))
    // this.formData.splice(23, 0, do_bap)
    // console.log('FORm', this.formData);
  }

  setInput(data: any) {
    this.isModal = true;
    if (data.id) {
      this.getMemberData(data.id);
    }
  }

  getMemberData(id: any) {
    if (id) {
      this.dataLoading = true;
      this.churchApi.getMember(id).then((res: any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.memberData = res.result;
          console.log(this.memberData);

          if (this.memberData) {
            //this.memberData.gender = GENDER_STATUS_TBL.find((a: any) => a.key == +this.memberData.gender)?.label || '';
            //this.memberData.status = churchMem_STATUS.find((a: any) => a.key == +this.memberData.status)?.label || '';
          }
        }
      }).catch((err: any) => {
        this.alertService.showToast('Unable to fetch member data', 'error');
      }).finally(() => this.dataLoading = false)
    }
  }

  close() {
    if (this.isModal) {
      this.modalService.close();
    } else {
      this.navServ.back();
    }
  }
}
