import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { tableColum, tableButton, tableBuilder, tblFilterQuery, tableAction, formField } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { SponsorBasicComponent } from 'src/app/shared/feature-modal/sponsor-basic/sponsor-basic.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { GiftsAddComponent } from '../gifts-add/gifts-add.component';

@Component({
  selector: 'app-gifts-list',
  templateUrl: './gifts-list.component.html',
  styleUrls: ['./gifts-list.component.scss']
})
export class GiftsListComponent implements OnInit {

  urlService = UrlServices.PAGE_URL;
  giftList: any;
  LIST_COL: tableColum[] = [
    {
      colName: 'profile_img',
      title: 'Profile',
      
      sort: false,
      filter: false,
      colType: 'IMAGE'
    },
    {
      colName: 'name',
      title: 'Name',
      
      sort: true,
      filter: true,
    },
    {
      colName: 'sponsor_id',
      title: 'ID',
      
      sort: false,
      filter: true,
      colType: 'VIEW_INFO'
    },
    {
      colName: 'qty',
      title: 'Qty',
      
      sort: false,
    },
    {
      colName: 'id',
      title: 'Qty',
      visible: false,
      isPrimary: true,
    },
    {
      colName: 'updated_at',
      title: 'Last Update',
      
      sort: false,
      filter: true,
      colType: 'DATE'
    },
  ];

  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Edit', type: 'EDIT', permission: { moduleName: 'SPONSOR', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View', type: 'VIEW', permission: { moduleName: 'SPONSOR', actionName: 'READ' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Delete', type: 'DELETE', permission: { moduleName: 'SPONSOR', actionName: 'DELETE' } }
  ]

  showAddBtn: boolean = false;

  tableConfig: tableBuilder = {
    name: 'Gift List',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  outBoxListCol: tableColum[] = JSON.parse(JSON.stringify(this.LIST_COL));

  segement = {
    LIST: 'Gift list',
    //OUTBOX: 'sponsor outbox'
  }
  segmentVisited = {
    LIST: true
  }
  currentSegment: string = this.segement.LIST;
  constructor(private sponsorApi: SponsorApiService, private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.showAddBtn = this.auth.checkPermission('SPONSOR_GIFT', 'ADD');
    this.outBoxListCol.push({
      colName: 'reason_relive',
      title: 'Reason',
      
      sort: false,
      filter: false,
    })
  }

  returnZero() {
    return 0;
  }
  changeSegment(s: string) {
    this.currentSegment = s;
    //@ts-ignore
    const key: 'LIST' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.segmentVisited[key] = true;
  }

  viewInfoHandler(id: any, data: any) {
    this.modalService.openSponsorInfo(data)
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['SPONSOR_GIFT'], ['VIEW_ALL'], ['sponsorship_module']) || [];
    return this.giftList = await this.sponsorApi.getListGift(e)
  }


  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([UrlServices.PAGE_URL.SPONSOR.SPONSOR_GIFT_ADD.URL], { queryParams: { id: id } })
        break;

      case 'ADD':
        this.router.navigate([UrlServices.PAGE_URL.SPONSOR.SPONSOR_GIFT_ADD.URL])
        break;

      case 'VIEW':
        this.modalService.openModal(GiftsAddComponent, { id: id }, 'modal-xl');
        break;

      case 'DELETE':
        return this.relive(id, false)
        break;
    }
    return Promise.resolve(true);
  }

  relive(id: string | number, isActiveAction = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const title = isActiveAction ? 'Make Active' : 'Relieve',
        msg = !isActiveAction ? 'Are you sure to Delete this Gift' : 'Are you sure to Make Active this Sponsor';
      this.modalService.openConfirmDialog({ title: title, message: msg, formField: [], isFormField: !isActiveAction }).then((res: any) => {
        if (res) {
          this.sponsorApi.reliveGift(id).then((res: any) => {
            if (res) {
              this.alertService.showToast("Successfully  Removed", 'success');
            } else {
              this.alertService.showToast("Something went to wrong ", 'info');
            }
            resolve({ reload: true })
          }).catch((err: any) => {
            this.alertService.showToast("Unable to update your request ", 'error');
            resolve({ reload: false })
          })
        } else
          resolve({ reload: false })
      });
    });

  }


}
