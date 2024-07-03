import { Component, Input, OnInit } from '@angular/core';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery, whereField } from 'src/app/helper/interface/response';
import { AuthService } from 'src/app/helper/service/auth.service';
import { SPONSORSHIP_TABLE, SPONSOR_LIST_TABLE } from 'src/app/modules/sponsor/helper/sponsor-form';
import { SponsorApiService } from 'src/app/modules/sponsor/service/sponsor-api.service';
import { ModalService } from '../../service/modal.service';
import { AllotmentInfoComponent } from 'src/app/modules/sponsor/component/allotment-info/allotment-info.component';
import { Router } from '@angular/router';
import { EmailSenderComponent, emailConfigData } from 'src/app/core/component/email-sender/email-sender.component';
import { ChurchBasicComponent } from 'src/app/modules/church/component/church-basic/church-basic.component';

@Component({
  selector: 'sponsorship-ref',
  templateUrl: './sponsorship-ref.component.html',
  styleUrls: ['./sponsorship-ref.component.scss']
})
export class SponsorshipRefComponent implements OnInit {
  @Input() type: 'SPONSORSHIP' | 'INACTIVE' | 'COLLECTION' | 'COLLECTION_EMAIL' = 'SPONSORSHIP';
  @Input() whereField: whereField[] = []
  LIST_COL: tableColum[] = SPONSORSHIP_TABLE
  urlService = UrlServices.PAGE_URL;
  sponsorshipList: any;
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Sponsorship Edit', type: 'EDIT', permission: { moduleName: 'SPONSORSHIP', actionName: 'UPDATE' }, condition: [{ key: 'is_edit', operation: '==', value: true }] },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Sponsorship View', type: 'VIEW', permission: { moduleName: 'SPONSORSHIP', actionName: 'READ' } },
    { name: '', icon: 'icon-user text-success', title: 'Sponsorship Allotment', type: 'ACTIVE', permission: { moduleName: 'SPONSORSHIP', actionName: 'ALLOTMENT' }, condition: [{ key: 'is_monthly', operation: '==', value: '1', join: '&&' }, { key: 'status', operation: '!=', value: '1' }] },
    { name: '', icon: 'icon-trash', class: 'btn-danger', title: 'Sponsorship Delete', type: 'DELETE', permission: { moduleName: 'SPONSORSHIP', actionName: 'RELIVE' }, condition: [{ key: 'total_alloted', operation: '==', value: '0', join: '&&' }, { key: 'status', operation: '!=', value: '1' }] },
    { name: '', class: 'bg-pink', icon: 'icon-logout', title: 'Sponsorship Relieve All', type: 'RELIVE', permission: { moduleName: 'SPONSORSHIP', actionName: 'RELIVE' }, condition: [{ key: 'total_alloted', operation: '!=', value: '0', join: '&&' }, { key: 'status', operation: '!=', value: '1' }] },
  ]
  inActiveActionBtn: tableButton[] = [
    { name: '', icon: 'icon-lock-open text-info', type: 'ACTIVE', permission: { moduleName: 'SPONSORSHIP', actionName: 'RELIVE' } }
  ]
  tableConfig: tableBuilder = {} as tableBuilder;
  globalWhere = this.auth.getPermittedId(['SPONSORSHIP'], ['VIEW_ALL'], ['promotional_office', 'sponsorship_module']) || []
  constructor(private sponsorApi: SponsorApiService, private auth: AuthService,
    private modalService: ModalService, private router: Router) { }

  ngOnInit(): void {
    let actionBtn = this.actionBtn,
      listCol: tableColum[] = this.LIST_COL;
    if (this.type == 'INACTIVE') {
      actionBtn = this.inActiveActionBtn;
    } else {
      listCol = [...[{ title: 'Sponsor Name', colName: 'sponsorName', filter: true }], ...cloneData(SPONSOR_LIST_TABLE).splice(3, 2), ...[
        {
          colName: 'name',
          title: 'Church Name',
          sort: true,
          filter: true,
        },
        {
          colName: 'ref_code',
          title: 'Church ID',
          colType: 'VIEW_INFO',
          sort: true,
          filter: true,
        },
        {
          colName: 'total_amount',
          title: 'Amount',
          colType: 'CURRENCY',
          sort: true,
          filter: true,
        },
        {
          colName: 'email_sent_on',
          title: 'Email Send On',
          colType: 'DATE',
          sort: true,
          filter: true,
        },
      ]];
      this.globalWhere = []
      actionBtn = [{ name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View', type: 'VIEW', permission: { moduleName: 'SPONSORSHIP', actionName: 'READ' } },
      { name: '', class: 'bg-indigo', icon: 'icon-envelope-open', title: 'Email', type: 'EMAIL', permission: { moduleName: 'SPONSORSHIP', actionName: 'READ' } }];
    }

    const append_list: tableColum[] = this.type == 'COLLECTION' ? [{
      colName: 'total_amount_paid',
      title: 'Total Paid',
      sort: true,
      colType: 'CURRENCY',
      filter: true,
    },
    {
      colName: 'balance_sponsorship',
      title: 'Balance',
      colType: 'CURRENCY',
      sort: true,
      filter: true,
    },
    ] : this.type == 'COLLECTION_EMAIL' ? [{
      colName: 'email_sent_on',
      title: 'Email Send On',
      colType: 'DATE',
      sort: true,
      filter: true,
    }] : [];
    listCol = [...listCol, ...append_list];
    this.globalWhere = [...this.globalWhere, ...this.whereField || []]
    this.tableConfig = {
      name: 'list',
      column: listCol,
      action: actionBtn,
      isLazy: true,
      showFilter: true
    }
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    e = this.mapQuery(e);
    const API: any = this.type != 'COLLECTION' ? this.sponsorApi.sponsorshipGetList(e) : this.sponsorApi.getListAllotment(e)
    return this.sponsorshipList = await API.then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res = this.mapResult(res);
      }
      return res;
    });
  }

  mapQuery(e: tblFilterQuery) {
    e.queryParams?.forEach((el) => {
      if (el.colName == 'status' && el.value == -1) {
        el.value = 1;
        e.queryParams.push({ colName: 'is_monthly', value: 1, matchMode: 'equals' });
      }
    });
    e.whereField = [...e.whereField || [], ...this.globalWhere];
    return e;
  }
  mapResult(res: any) {
    res.result.data.map((a: any) => {
      a.total_allotment_count = +a.total_alloted || 0;
      a.total_alloted = a.is_monthly ? +a.total_alloted ? a.total_alloted : 'Not Yet' : 'No alloted';
      a.is_edit = +a.total_allotment_count == 0 && +a.status != 1 ? true : false;
      a.status = +a.is_monthly && +a.status == 1 ? -1 : a.status;
    })
    return res;
  }
  viewInfoHandler(id: any, data: any) {
    data.church_id = id;
    this.modalService.openModal(ChurchBasicComponent, data, 'modal-lg');
  }

  tblAction = (id: string | number, type: tableAction, data: any): Promise<any> => {
    switch (type) {
      case 'VIEW':
        if (this.type != 'COLLECTION') {
          this.modalService.openModal(AllotmentInfoComponent, { ref_id: id }, 'modal-xl')
        } else {
          this.router.navigate([UrlServices.PAGE_URL.SPONSOR.VIEW.URL], { queryParams: { id: data.sponsor_id } })
        }
        break;

      case "EMAIL":
        const config: emailConfigData = {
          type: 'SEND',
          mode: 'EMAIL',
          to: data.sponsorEmail || '',
          body: '',
        }
        this.modalService.openModal(EmailSenderComponent, config, 'modal-xl').then((res: any) => {
          if (res?.emailSend) {
            this.updateEmail(data);
          }
        })
        break
    }
    return Promise.resolve(true);
  }

  updateEmail(d: any) {
    if (d.id) {
      this.sponsorApi.updateEmailAllotment(d.id, { ref_id: d?.email_ref || '' }).then(res => {

      })
    }
  }
}