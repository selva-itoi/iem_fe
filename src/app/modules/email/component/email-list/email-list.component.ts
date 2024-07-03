import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { User } from 'src/app/helper/interface/user';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ChildBasicInfoComponent } from 'src/app/modules/child/component/child-basic-info/child-basic-info.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { EmailApiService } from '../../service/email-api.service';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit {

  emailList: any;
  urlService = UrlServices.PAGE_URL;
  LIST_COL: tableColum[] = [
    {
      colName: 'email_to',
      title: 'Email To',
      sort: true,
      filter: true,
    },
    {
      colName: 'name',
      title: 'Name',
      sort: true,
      filter: true,
    },
    {
      colName: 'id',
      title: 'Subject',
      visible: false,
      isPrimary: true,
    },
    {
      colName: 'subject',
      title: 'Subject',
      sort: true,
      filter: true,
    },
    {
      colName: 'created_byName',
      title: 'Sent By',
      filter: true,
    },
    {
      colName: 'status',
      title: 'Status',
      sort: true,
      filter: true,
      colType: 'DROPDOWN',
      filterCol: {
        type: 'DROPDOWN',
        data: [{ key: '1', label: 'Send', color: 'success' }, { key: '2', label: 'Pending', color: 'warning' }, { key: '0', label: 'Failed', color: 'error' }]
      }
    },
    {
      colName: 'updated_at',
      title: 'Last Update',
      filter: true,
      colType: 'DATE'
    },
  ];

  actionBtn: tableButton[] = [
    { name: '', icon: 'icon-reload text-info', title: 'Resend', type: 'EDIT' },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View', type: 'VIEW' },
    { name: '', icon: 'icon-trash text-danger', title: 'Move to Outbox', type: 'DELETE', condition: [{ key: 'deleted_at', operation: '==', value: null }] }
  ]

  inActiveActionBtn: tableButton[] = [
    { name: '', icon: 'icon-lock-open text-info', type: 'ACTIVE', permission: { moduleName: 'MASTER', actionName: 'MANAGE_EMAIL_TEMPLATES' } }
  ]

  showAddBtn: boolean = false;

  tableConfig: tableBuilder = {
    name: 'Child list',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  outBoxListCol: tableColum[] = JSON.parse(JSON.stringify(this.LIST_COL));

  inActiveTblConfig: tableBuilder = {
    name: 'Child Out box',
    addBtn: false,
    column: this.outBoxListCol,
    action: this.inActiveActionBtn,
    isLazy: true,
    showFilter: true
  }

  segement = {
    LIST: 'Email List',
    PENDING: 'pending',
    OUTBOX: 'outbox'
  }
  segmentVisited = {
    LIST: true,
    PENDING: false,
    OUTBOX: false
  }
  currentSegment: string = this.segement.LIST;
  userData: User = this.auth.currentUserValue;
  showAll: boolean = false
  constructor(private emailApi: EmailApiService, private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private navigation: NavigationService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.showAddBtn = true;
    this.outBoxListCol.push({
      colName: 'relive_remarks',
      title: 'Reason',

      sort: false,
      filter: false,
    })
    this.showAll = this.auth.checkPermission('MASTER', 'MANAGE_EMAIL_TEMPLATES');
  }

  close() {
    this.navigation.back();
  }

  returnZero() {
    return 0;
  }
  changeSegment(s: string) {
    this.currentSegment = s;
    //@ts-ignore
    const key: 'OUTBOX' | 'LIST' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.segmentVisited[key] = true;
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    if (!this.showAll) {
      e.whereField = [{ colName: 'user_id', value: this.auth.currentUserValue.user_id, operation: 'AND' }]
    }
    return this.emailList = await this.emailApi.getListEmail(e);
  }
  getPendingListData = async (e: tblFilterQuery): Promise<any> => {
    if (!this.showAll) {
      e.whereField = [{ colName: 'user_id', value: this.auth.currentUserValue.user_id, operation: 'AND' }]
    }
    e.whereField = [...[{ colName: 'status', value: 2 }]]
    return this.emailList = await this.emailApi.getListEmail(e);
  }

  getListDeletedData = async (e: tblFilterQuery): Promise<any> => {
    if (!this.showAll) {
      e.whereField = [{ colName: 'user_id', value: this.auth.currentUserValue.user_id, operation: 'AND' }]
    }
    return this.emailList = await this.emailApi.getListOutbox(e)
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        return this.resend(id);
        break;

      case 'ADD':
        this.router.navigate([this.urlService.EMAIL.ADD.URL])
        break;

      case 'VIEW':
        let data: any = { id: id };
        data.config = { is_pdf: false, is_preview: true };
        this.modalService.showPreviewModal(data, 'modal-lg');
        break;

      case 'DELETE':
        return this.reliveMail(id, false);
        break;
    }
    return Promise.resolve(true);
  }


  viewInfoHandler(id: any, data: any) {
    data.child_id = id;
    this.modalService.openModal(ChildBasicInfoComponent, data, 'modal-lg');
  }

  resend(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.emailApi.reSendEmail(id).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.alertService.showToast('Successfully completed', 'success')
          resolve({ reload: true });
        } else {
          this.alertService.showToast('Unable to complete', 'error')
          reject({ reload: false });
        }
      }).catch((err: any) => {
        this.alertService.showToast('Unable to complete', 'error')
        reject({ reload: false });
      })
    });
  }

  reliveMail(id: string | number, isActiveAction = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const title = isActiveAction ? 'Make Active' : 'Relieve',
        msg = !isActiveAction ? 'Are you sure to Relieve this Staff' : 'Are you sure to Make Active this Staff';
      this.modalService.openConfirmDialog({ title: title, message: msg, formField: [], isFormField: !isActiveAction }).then((res: any) => {
        if (res) {
          this.emailApi.deleteEmail(id).then((res: ResponseData | any) => {
            if (res.statusCode == RESPONSE_CODE.SUCCESS) {
              this.alertService.showToast('Successfully completed', 'success')
              resolve({ reload: true });
            }
          }).catch((err: any) => {
            this.alertService.showToast('Unable to complete', 'error')
            reject({ reload: false });
          })
        }
      });
    });
  }
}