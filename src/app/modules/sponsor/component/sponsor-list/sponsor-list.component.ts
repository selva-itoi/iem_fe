import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { formBuilder, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { SPONSOR_LIST_TABLE } from '../../helper/sponsor-form';
import { SponsorApiService } from '../../service/sponsor-api.service';

@Component({
  selector: 'app-sponsor-list',
  templateUrl: './sponsor-list.component.html',
  styleUrls: ['./sponsor-list.component.scss']
})
export class SponsorListComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  sponsorList: any;
  LIST_COL: tableColum[] = SPONSOR_LIST_TABLE

  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Sponsor Edit', type: 'EDIT', permission: { moduleName: 'SPONSOR', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'Sponsor View', type: 'VIEW', permission: { moduleName: 'SPONSOR', actionName: 'READ' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Sponsor Relieve', type: 'DELETE', permission: { moduleName: 'SPONSOR', actionName: 'DELETE' } }
  ]
  inActiveActionBtn: tableButton[] = [
    { name: '', icon: 'icon-lock-open text-info', type: 'ACTIVE', permission: { moduleName: 'SPONSOR', actionName: 'DELETE' } }
  ]

  showAddBtn: boolean = false;
  tableConfig: tableBuilder = {
    name: 'Sponsor List',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  outBoxListCol: tableColum[] = JSON.parse(JSON.stringify(this.LIST_COL));

  inActiveTblConfig: tableBuilder = {
    name: 'Sponsor Out box',
    addBtn: false,
    column: this.outBoxListCol,
    action: this.inActiveActionBtn,
    isLazy: true,
    showFilter: true
  }
  segement = {
    LIST: 'Donor list',
    OUTBOX: 'Disable',
  }
  segmentVisited: any = {}
  currentSegment: string = this.segement.LIST;
  constructor(private sponsorApi: SponsorApiService, private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.showAddBtn = this.auth.checkPermission('SPONSOR', 'ADD');
    this.outBoxListCol.push({
      colName: 'reason_relive',
      title: 'Reason',
      sort: false,
      filter: false,
    })
  }

  viewInfoHandler(id: any, data: any) {
    data.sponsor_id = id;
    this.modalService.openSponsorInfo(data)
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.auth.getPermittedId(['SPONSOR'], ['VIEW_ALL'], ['promotional_office','sponsorship_module']) || [];
    e.whereField = this.auth.getPermittedId(['SPONSOR'], ['VIEW_ALL']) || [];

    return this.sponsorList = await this.sponsorApi.getList(e)
  }

  getListDeletedData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['SPONSOR'], ['VIEW_ALL'], ['promotional_office','sponsorship_module']) || [];
    return this.sponsorList = await this.sponsorApi.getListOnlyDeleted(e)
  }
  getListInactiveData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.auth.getPermittedId(['SPONSOR'], ['VIEW_ALL'], ['promotional_office']) || [];
    e.whereField = [{ colName: 'status', value: 0 }]
    return this.sponsorList = await this.sponsorApi.getList(e)
  }
  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([UrlServices.PAGE_URL.SPONSOR.ADD.URL], { queryParams: { id: id } })
        break;
      case 'VIEW':
        this.router.navigate([UrlServices.PAGE_URL.SPONSOR.VIEW.URL], { queryParams: { id: id } })
        break;

      case 'DELETE':
        return this.relive(id, false)
        break;

      case 'ACTIVE':
        return this.relive(id, true)
        break;
    }
    return Promise.resolve(true);
  }

  relive(id: string | number, isActiveAction = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const title = isActiveAction ? 'Make Active' : 'Make Inactive',
        msg = !isActiveAction ? 'Are you sure to Make InActive this Sponsor' : 'Are you sure to Make Active this Sponsor';
      const formFiled: formBuilder[] = [
        {
          colName: 'reason_block',
          title: 'Reason',
          validator: [{ name: 'required', error: 'Reason is Required' }]
        }];

      this.modalService.openConfirmDialog({ title: title, message: msg, formField: formFiled, isFormField: !isActiveAction }).then((res: any) => {
        if (res) {
          // console.log('RESULT',res)
          const data = this.sponsorList.result.data.find((a: any) => a.sponsor_id == id);
          // Object.assign(data, res)
          if(res.reason_block){
            data.reason_block = res?.reason_block;
          }
          if (isActiveAction) {
            data.deleted_at = null;
          } else {
            data.deleted_at = mysqlDataTime();
          }
          this.sponsorApi.updateRequest(data.sponsor_id, data).then(res => {
            if (res) {
              this.alertService.showToast("Successfully  Updated", 'success');
            } else {
              this.alertService.showToast("Something went to wrong ", 'info');
            }
            resolve({ reload: true })
          }).catch(err => {
            // this.alertService.showToast("Unable to update your request ", 'error');
            resolve({ reload: false })
          })
        } else
          resolve({ reload: false })
      });
    });

  }

}
