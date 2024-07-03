import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { AppConstant } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { ChurchApiService } from '../../service/church-api.service';
import { ChurchBasicComponent } from '../church-basic/church-basic.component';
import { MemberInfoComponent } from '../member-info/member-info.component';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  memberList: any;
  urlService = UrlServices.PAGE_URL;
  LIST_COL: tableColum[] = [
    {
      colName: 'member_name',
      title: 'Name',
      sort: true,
      filter: true,
    },
    {
      colName: 'id',
      title: 'id',
      visible: false,
      isPrimary: true,
    },
    {
      colName: 'church_id',
      title: 'Church ID',
      sort: false,
      filter: true,
      colType: 'VIEW_INFO'
    },
    {
      colName: 'church_name',
      title: 'Church Name',
      sort: false,
      filter: true,
    },
    {
      colName: 'zone',
      title: 'Zone/State',
      selectKeyName: 'zoneName',
      filterCol: { apiName: 'zone', type: 'DROPDOWN', selectKeyName: 'zoneName', selectPrimaryKey: 'id' },
      sort: true,
      filter: true,
    },
    {
      colName: 'field',
      title: 'Field',
      selectKeyName: 'fieldName',
      filterCol: { apiName: 'field', type: 'DROPDOWN', selectKeyName: 'fieldName', selectPrimaryKey: 'id' },
      sort: true,
      filter: true,
    },
    {
      colName: 'gender',
      title: 'Gender',
      sort: true,
      filter: true,
      colType: 'DROPDOWN',
      filterCol: {
        type: 'DROPDOWN',
        data: AppConstant.GENDER,
        selectKeyName: 'genderName',
        selectPrimaryKey: 'id'
      }
    },
    {
      colName: 'mobile_no',
      title: 'Mobile No',

      sort: true,
      filter: true,
    },
    {
      colName: 'category',
      title: 'Category',

      sort: false,
      filter: true,
      colType: 'DROPDOWN',
      filterCol: {
        type: 'DROPDOWN',
        apiName: 'church_member_category',
        selectKeyName: 'church_member_categoryName', selectPrimaryKey: 'id',
      }
    },
    {
      colName: 'updated_at',
      title: 'Last Update',
      sort: false,
      filter: true,
      colType: 'DATE',
      filterCol: { type: 'DATE', selectKeyName: 'updated_at', yearNavigator: true, monthNavigator: true }
    },
  ];
  segement = {
    LIST: 'Member list',
    OUTBOX: 'outbox'
  }
  segmentVisited: any = { LIST: true }
  currentSegment: string = this.segement.LIST;

  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Edit', type: 'EDIT', permission: { moduleName: 'CHURCH_MEMBER', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View', type: 'VIEW', permission: { moduleName: 'CHURCH_MEMBER', actionName: 'READ' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Relieve', type: 'DELETE', permission: { moduleName: 'CHURCH_MEMBER', actionName: 'DELETE' } }
  ]
  inActiveActionBtn: tableButton[] = [
    { name: '', icon: 'icon-lock-open text-info', type: 'ACTIVE', permission: { moduleName: 'CHURCH_MEMBER', actionName: 'RELIVE' } }
  ]

  showAddBtn: boolean = false;
  tableConfig: tableBuilder = {
    name: 'list',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  outBoxListCol: tableColum[] = JSON.parse(JSON.stringify(this.LIST_COL));

  inActiveTblConfig: tableBuilder = {
    name: 'Church Out box',
    addBtn: false,
    column: this.outBoxListCol,
    action: this.inActiveActionBtn,
    isLazy: true,
    showFilter: true
  }
  globalWhere = [];
  pageInfo: pageInfo = {} as pageInfo
  constructor(private churchApi: ChurchApiService, private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private navigation: NavigationService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.showAddBtn = this.auth.checkPermission('CHURCH_MEMBER', 'ADD');
    this.globalWhere = this.auth.getPermittedId(['CHURCH_MEMBER'], ['VIEW_ALL'], ['region','zone', 'church']) || []
    this.pageInfo = {
      title: 'All Church Member',
      buttonShowBtn: this.showAddBtn,
      button: {
        title: 'New Member',
        url: this.urlService.CHURCH.MEMBER_ADD.URL,
        queryParams: {}
      }
    }

    this.outBoxListCol.push({
      colName: 'reason_relive',
      title: 'Reason',
      sort: false,
      filter: false,
    })
  }

  close() {
    this.navigation.back();
  }

  mapData(res: ResponseData | any) {
    if (!res?.result?.data.length) {
      return res;
    }
    const f = res.result.data || [];
    f.map((a: any) => { a['member_name'] = `${a?.name || ''} <p class="text-primary mb-0 mt-1">${a?.member_id || ''}</p>`; return a });
    res.result.data = f;
    return res;
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.globalWhere;
    return this.memberList = await this.churchApi.getMemberList(e).then(res => { return this.mapData(res) });
  }

  getListDeletedData = async (e: tblFilterQuery): Promise<any> => {
    // e.whereField = this.globalWhere;
    return this.memberList = await this.churchApi.getMemberList(e, true)
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([this.urlService.CHURCH.MEMBER_ADD.URL], { queryParams: { id: id } })
        break;

      case 'ADD':
        this.router.navigate([this.urlService.CHURCH.MEMBER_ADD.URL])
        break;

      case 'VIEW':
        this.modalService.openModal(MemberInfoComponent, { id: id }, 'modal-xl');
        break;

      case 'DELETE':
        return this.relive(id, false);
        break;

      case 'ACTIVE':
        return this.relive(id, true)
        break;
    }
    return Promise.resolve(true);
  }

  viewInfoHandler(id: any, data: any) {
    data.church_id = id;
    this.modalService.openModal(ChurchBasicComponent, data, 'modal-lg');
  }


  relive(id: string | number, isActiveAction = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const title = isActiveAction ? 'Make Active' : 'Delete',
        msg = !isActiveAction ? 'Are you sure to Delete this Member' : 'Are you sure to Make Active this Member';
      this.modalService.openConfirmDialog({ title: title, message: msg, formField: [], isFormField: !isActiveAction, }).then((res: any) => {
        const data = this.memberList.find((a: any) => a.id == id);
        if (res) {
          const apiPayload: any = { status: isActiveAction, id: id, member_id: data.member_id || '' };
          if (!isActiveAction) {
            apiPayload.deleted_at = new Date();
          } else {
            apiPayload.deleted_at = null;
          }
          Object.assign(apiPayload, res);
          this.churchApi.saveMember(apiPayload).then(res => {
            if (res) {
              this.alertService.showToast("Successfully Submitted", 'success');
              resolve({ reload: true })
            } else {
              this.alertService.showToast("Unable to Relive Member", 'info');
              resolve({ reload: false })
            }
          })
        }
      }).catch(err => {
        resolve({ reload: false })
      });
    });

  }
}