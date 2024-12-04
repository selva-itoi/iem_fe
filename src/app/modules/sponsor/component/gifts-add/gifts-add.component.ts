import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { emailConfigData, EmailSenderComponent } from 'src/app/core/component/email-sender/email-sender.component';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData, isEmptyObj, mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilder, ResponseData, tableBuilder, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { page } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ChildBasicInfoComponent } from 'src/app/modules/child/component/child-basic-info/child-basic-info.component';
import { CHILD_GIFT_FORM, CHILD_LIST_TBL } from 'src/app/modules/child/helper/child-form';
import { ChildApiService } from 'src/app/modules/child/service/child-api.service';
import { StaffBasicComponent } from 'src/app/shared/feature-modal/staff-basic/staff-basic.component';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { SponsorApiService } from '../../service/sponsor-api.service';

@Component({
  selector: 'app-gifts-add',
  templateUrl: './gifts-add.component.html',
  styleUrls: ['./gifts-add.component.scss']
})
export class GiftsAddComponent implements OnInit {
  urlService: page = UrlServices.PAGE_URL;
  dataLoading: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  disabled_save: boolean = false;
  selectedData: Array<any> = [];
  maxSelection: number = 0;
  errorText: string = '';
  sponsorData: any = {};
  giftData: any = {};
  gift_id: string | number = '';
  sponsorId: string | number = '';
  isModal: boolean = false;
  isMk:boolean=false;
  isHome :boolean=false;
  CHILD_LIST_COL: tableColum[] = cloneData(CHILD_LIST_TBL).splice(0, 7)
  tableConfig: tableBuilder = {
    name: 'Child List',
    addBtn: false,
    column: this.CHILD_LIST_COL,
    action: [],
    isLazy: true,
    showFilter: true
  }
  initialChanges: any = {};
  minDate = new Date();
  maxDate = new Date();
  showTable: boolean = false;
  LIST_COL = [];
  formData: formBuilder[] = CHILD_GIFT_FORM;
  pageInfo: pageInfo = { title: 'Sponsor Gifts Details' }
  skipId: Array<string | number> = [];
  @ViewChild('tableList') tableList: TableListComponent | undefined;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  showAllList: boolean = false;
  constructor(private activatedRoute: ActivatedRoute, private navigation: NavigationService,
    private alertService: AlertService,
    private auth: AuthService,
    private childApi: ChildApiService,
    private sponsorApi: SponsorApiService, private modalService: ModalService) { }


  ngOnInit(): void {
    this.gift_id = this.activatedRoute.snapshot.queryParams.id || '';
    this.sponsorId = this.activatedRoute.snapshot.queryParams.sponsorId || '';
    this.isMk = this.auth.checkPermission('CHILD', 'MANAGE_MK_CHILD'),
    this.isHome = this.auth.checkPermission('CHILD', 'MANAGE_HOME_CHILD');
    this.pageInfo = {
      title: !this.gift_id ? ' Add New Sponsor Gift' : 'Update Sponsor Gift Details',
      buttonShowBtn: this.auth.checkPermission('SPONSOR_GIFT', 'VIEW_ALL'),
      button: { title: 'View All Gift', url: this.urlService.SPONSOR.SPONSOR_GIFT.URL }
    }
    if (this.gift_id) {
      this.getGiftData();
    } else {
      this.changeTableSelection();
    }
    if (this.sponsorId) {
      this.getSponsorData()
    }
  }

  setInput(data: any) {
    this.isModal = true;
    if (data.id) {
      this.gift_id = data.id;
      this.pageInfo.title = 'Sponsor Gift Details. ';
      this.getGiftData();
    }
  }
  get sponsorship_module(): number {
    return (+this.basicForm?.dataForm.value.sponsorship_module) || 2;
  }

  onChangeCheckBox(ev: any) {
    this.showAllList = ev.target.checked;
    this.tableList?.reload();
    console.log(this.showAllList);
  }
  mapCondition(e:any){
    if(!(this.isMk && this.isHome)){
      if(this.isHome){
        e.whereField?.push({colName:'child_type',value :2,operation:'AND'});
      }else{
        e.whereField?.push({colName:'child_type',value :1,operation:'AND'});
      }
    }
    return e;
  }
  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = [];
    let data: any = { statusCode: 400 };
    if (!this.showAllList) {
      const dt = { colName: 'sponsorship_module', value: 2, matchMode: 'equal' };
      e.queryParams ? e.queryParams.push(dt) : e.queryParams = [dt];
      if (this.sponsorData.sponsor_id) {
        e.queryParams.push({ colName: 'sponsor_id', value: this.sponsorData.sponsor_id, matchMode: 'equal' })
      }
    }
    e=this.mapCondition(e);
    switch (this.sponsorship_module) {
      case 2:
        // e.whereField = this.auth.getPermittedId(['CHILD'], ['VIEW_ALL'], ['home']);
        e.whereField = this.auth.getPermittedId(['CHILD'], ['VIEW_ALL']);

        if (!this.showAllList) {
          data = await this.sponsorApi.getListAllotment(e).then((res: ResponseData | any) => {
            res.result.data.map((a: any) => {
              //a.child_id = a.ref_code
            })
            return res;
          });
        } else {
          data = await this.childApi.getList(e);
        }
        break;
    }
    return data;
  }

  onChange(e: any) {
    if (!isEmptyObj(e)) {
      if (e.controlName == 'qty') {
        this.calMaxSelection();
      }
    }
  }
  viewInfoHandler(id: any, data: any = {}) {
    const comp: any = +this.giftData.sponsorship_module == 2 ? ChildBasicInfoComponent : +this.giftData.sponsorship_module == 1 ? StaffBasicComponent : '';
    this.modalService.openModal(comp, { child_id: id }, 'modal-lg', 2);
  }

  changeTableSelection() {
    switch (this.sponsorship_module) {
      case 1: // SRD Staff 
        this.tableConfig.column = this.LIST_COL;
        break;
      case 2:
        this.tableConfig.column = this.CHILD_LIST_COL;
        break;
      case 3:
        //data =await this.sponsorApi.sponsorshipGetList(e);
        break;
    }
    this.showTable = true;
  }

  onRemove(a: any) {
    if (this.tableList) {
      this.tableList.AddRemoveSelection(a);
    }
  }

  applyFormValue(g: any) {
    this.basicForm?.setData(g);
  }

  //call for individual update
  setFormValue(g: any) {
    this.basicForm?.mapFormValue(g);
  }

  getGiftData() {
    if (this.gift_id) {
      this.dataLoading = true;
      this.showTable = false;
      this.sponsorApi.getGiftData(this.gift_id).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.giftData = res.result;
          this.sponsorData = res.result.sponsor || {};
          res.result.allotment.forEach((a: any) => {
            this.skipId.push(a.ref_id);
          })
          console.log(this.giftData)
          this.applyFormValue(this.giftData);
          this.changeTableSelection();
          this.calMaxSelection();
          this.initialChanges = this.apiPayload();
        }
      }).finally(() => { this.dataLoading = false })
    }
  }

  getTotalAlloted(): number {
    let total_alloted = 0;
    if (Array.isArray(this.giftData.allotment)) {
      total_alloted = this.giftData.allotment.filter((a: any) => !a.deleted_at && a.action != 3)?.length;
    }
    return total_alloted + this.selectedData?.length;
  }


  getSponsorData() {
    if (this.sponsorId && isEmptyObj(this.sponsorData)) {
      this.showTable = false;
      this.sponsorApi.getById(this.sponsorId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.sponsorData = res.result;
          this.changeTableSelection();
        } else {
          this.alertService.showToast("Unable to get sponsor Details", 'info');
          this.resetSponsor();
        }
      }).catch(err => {
        this.alertService.showToast("Unable to get sponsor Details", 'info');
        this.resetSponsor();
      })
    }
  }
  resetSponsor() {
    this.sponsorData = {};
    this.setFormValue({ sponsor_fk_id: '' });
  }
  openSponsorModal() {
    this.modalService.openSearchModal({ type: 'SPONSOR', skipKey: 'sponsor_id', skipData: [], activeOnly: true }).then(async (res: any) => {
      if (res.sponsor_id) {
        if (res.deleted_at != null) {
          this.alertService.showToast("You can't select Inactive sponsor", 'info');
          return;
        }
        this.resetSponsor();
        this.setFormValue({ sponsor_fk_id: res.id });
        this.sponsorData = res || {}
        this.tableList?.reload();
      }
    });
  }


  calMaxSelection() {
    const total = this.basicForm?.dataForm.value.qty;
    this.maxSelection = (+total) - (this.getTotalAlloted() - this.selectedData?.length);
  }

  async close(status = false) {
    if (!this.isModal) {
      await this.navigation.back();
    } else {
      this.modalService.close();
    }
  }

  isFormChange() {
    const src = JSON.stringify(this.initialChanges);
    const to = JSON.stringify(this.apiPayload());
    return src === to;
  }

  deleteTableData(index: number) {
    this.modalService.openConfirmDialog({}).then(res => {
      if (res) {
        const data = this.giftData.allotment[index];
        if (data.id) {
          data.action = 3; // to delete
          this.giftData.allotment[index] = data;
          this.calMaxSelection();
        }
      }
    });
  }

  onSelectData(e: any) {
    if (+e.modify_request) {
      this.alertService.showToast('Modification Request has been pending', 'info');
      this.onRemove(e);
      return;
    }
    e.forEach((e: any) => {
      e.sponsorship_module = this.sponsorship_module;
      e.sponsorship_id = this.giftData?.id;
      e.action = 1;
      e.created_at = mysqlDataTime();
      e.ref_id = e.id;
    });
    this.selectedData = e;
  }

  showPreview() {
    const apiLoad = this.apiPayload(),
      emailConfig: emailConfigData = { body: '', to: this.sponsorData?.email_id || '', config: { is_pdf: false, is_preview: true, is_sent: true }, payload: apiLoad, id: 6 }
    this.modalService.openModal(EmailSenderComponent, emailConfig, 'modal-lg', 1, false).then(async (res: any) => {
      if (res.emailSend) {
        await this.sponsorApi.saveGift({ id: apiLoad.id, email_send_on: new Date() });
        this.close();
      }
    });
  }

  apiPayload() {
    const payload: any = this.basicForm?.apiPayload() || {};
    payload.id = this.gift_id || '';
    const allotted: Array<any> = [...this.selectedData] || [];
    if (this.giftData.allotment) {
      this.giftData.allotment.filter((a: any) => +a.action == 3).forEach((e: any) => {
        allotted.push(e);
      });
    }
    payload['allotmentData'] = allotted;
    return payload;
  }

  async onSubmit() {
    this.submitted = true;
    this.errorText = '';
    if (this.isFormChange()) {
      this.alertService.showToast('No changes you made', 'info');
      return;
    }
    if (!this.sponsorData?.sponsor_id) {
      this.errorText = 'Sponsor not yet selected';
    } else if (!this.basicForm?.isValid()) {
      this.errorText = 'Please ensure all the field are valid';
    } else if (!this.getTotalAlloted()) {
      this.errorText = 'Select Any one for allotment';
    } else if ((+this.basicForm?.dataForm.value.qty - this.getTotalAlloted()) != 0) {
      this.errorText = 'Allotment and sponsorship support should be equal';
    }

    if (this.errorText) {
      this.alertService.showToast(this.errorText, 'info');
      return
    }
    const data = this.apiPayload();
    this.loading = true;
    this.sponsorApi.saveGift(data).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.basicForm?.setValue('id', res.result.id);
        this.alertService.showToast('Successfully saved', 'success')
        this.disabled_save = true;
        if (data.send_email) {
          this.showPreview();
        } else {
          this.close()
        }
      } else {
        this.alertService.showToast('Unable to complete', 'error')
      }
    }).finally(() => {
      this.loading = false;
    })

  }
}