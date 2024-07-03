import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { emailConfigData, EmailSenderComponent } from 'src/app/core/component/email-sender/email-sender.component';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { formBuilderData, tableButton, tableBuilder, tblFilterQuery, ResponseData, tableAction } from 'src/app/helper/interface/response';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { EMAIL_TEMP_FORM, MOBILE_FORM } from '../../config/config';
import { MasterApiService } from '../../service/master-api.service';
import { cloneData } from 'src/app/helper/class/utilityHelper';

@Component({
  selector: 'app-mobile-app',
  templateUrl: './mobile-app.component.html',
  styleUrls: ['./mobile-app.component.scss']
})
export class MobileAppComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  emailList: any;
  LIST_COL: formBuilderData[] = cloneData(MOBILE_FORM)
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Edit', type: 'EDIT', permission: { moduleName: 'MASTER', actionName: 'MANAGE_EMAIL_TEMPLATES' } },
    { name: '', icon: 'icon-eye text-info', title: 'View', type: 'VIEW', permission: { moduleName: 'MASTER', actionName: 'MANAGE_EMAIL_TEMPLATES' } }
  ]

  dataLoading: boolean = false;

  showAddBtn: boolean = false;

  tableConfig: tableBuilder = {
    name: 'App Templates',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }

  constructor(private masterApi: MasterApiService, private router: Router,
    private modalService: ModalService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.showAddBtn = this.auth.checkPermission('MASTER', 'MANAGE_EMAIL_TEMPLATES');
  }


  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['MASTER'], ['MANAGE_EMAIL_TEMPLATES'], []) || [];
    return this.emailList = await this.masterApi.getMobileApp(e).then((res:ResponseData) => {
      if(res.statusCode == RESPONSE_CODE.SUCCESS){
         return res.result.data.map((a:any) => { a.allow_email = +a.allow_to_send_email ? 'Yes' : 'No'; return a})
      }
    })
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([UrlServices.PAGE_URL.MASTER.UPDATE_EMAIL.URL], { queryParams: { id: id } })
        break;
      case 'VIEW':
        this.showPreview(id);
        break;
    }
    return Promise.resolve(true);
  }

  showPreview(id: any) {
    this.masterApi.getById('email_template', id).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        const data: emailConfigData = res.result;
        data.config = { is_preview: true, is_pdf: false }
        this.modalService.openModal(EmailSenderComponent, data, 'modal-lg');
      }
    }).finally(() => {
    })
  }

}
