import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { formBuilder, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { StaffApiService } from '../../service/staff-api.service';
import { StaffDedicationViewComponent } from '../staff-dedication-view/staff-dedication-view.component';

@Component({
  selector: 'app-staff-dedication-list',
  templateUrl: './staff-dedication-list.component.html',
  styleUrls: ['./staff-dedication-list.component.scss']
})
export class StaffDedicationListComponent implements OnInit {
  urlService = UrlServices.PAGE_URL;
  dedicationList: any;
  LIST_COL: tableColum[] = [
    {
      colName: 'profile_img_path',
      title: 'Profile',

      sort: false,
      filter: false,
      colType: 'IMAGE'
    },
    {
      colName: 'id',
      title: 'id',
      visible: false,
      sort: false,
      isPrimary: true
    },
    {
      colName: 'name',
      title: 'Name',

      sort: true,
      filter: true,
    },
    {
      colName: 'staff_emp_id',
      title: 'ID',

      sort: false,
      filter: true,
      colType: 'STAFF_EMP_ID'
    },
    {
      colName: 'place',
      title: 'Place',

      sort: true,
      filter: true,
    },
    {
      colName: 'date_time',
      title: 'Event Date',

      sort: true,
      filter: true,
      colType: 'DATE'
    },
    {
      colName: 'status',
      title: 'Status',

      sort: true,
      filter: true,
      colType: 'DROPDOWN',
      filterCol: {
        type: 'DROPDOWN',
        data: [
          { label: 'Approved', key: 1, color: 'success' },
          { label: 'Processed', key: 2, color: 'info' },
          { label: 'Pending', key: 3, color: 'warning' },
          { label: 'Not Alloted', key: 4, color: 'warning' },
        ]
      }
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
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Edit', type: 'EDIT', permission: { moduleName: 'DEDICATION', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View', type: 'VIEW', permission: { moduleName: 'DEDICATION', actionName: 'READ' } },
    { name: '', class: 'btn-danger', icon: 'icon-trash', title: 'Relieve', type: 'DELETE', permission: { moduleName: 'DEDICATION', actionName: 'DELETE' } }
  ]



  showAddBtn: boolean = false;

  tableConfig: tableBuilder = {
    name: 'Dedication List',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }

  segement = {
    LIST: 'List',
    //MODIFYREQUEST: 'Pending',
    // OUTBOX: 'Dedication outbox'
  }
  segmentVisited = {
    LIST: true,
    MODIFYREQUEST: false,
    OUTBOX: false
  }
  currentSegment: string = this.segement.LIST;
  constructor(private staffApi: StaffApiService, private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.showAddBtn = this.auth.checkPermission('DEDICATION', 'ADD');
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
    e.whereField = this.auth.getPermittedId(['DEDICATION'], ['VIEW_ALL'], ['zone', 'region', 'department', 'trust']) || [];
    return this.dedicationList = await this.staffApi.getDedicationList(e)
  }

  getListDeletedData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['DEDICATION'], ['VIEW_ALL'], ['zone', 'region', 'department', 'ad_office', 'trust']) || [];
    return this.dedicationList = await this.staffApi.getListOnlyDeleted(e)
  }

  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.router.navigate([UrlServices.PAGE_URL.STAFF.DEDICATION_ADD.URL], { queryParams: { id: id } })
        break;

      case 'ADD':
        this.router.navigate([UrlServices.PAGE_URL.STAFF.DEDICATION_ADD.URL])
        break;

      case 'VIEW':
        this.modalService.openModal(StaffDedicationViewComponent, { id: id }, 'modal-lg');
        break;

      case 'DELETE':
        return this.reliveDedication(id, false);
        break;

      case 'ACTIVE':
        return this.reliveDedication(id, true);
        break;
    }
    return Promise.resolve(true);
  }

  reliveDedication(id: string | number, isActiveAction = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const title = isActiveAction ? 'Make Active' : 'Relieve',
        msg = !isActiveAction ? 'Are you sure to Delete this Dedication' : 'Are you sure to Make Active this Sponsor';
      const formFiled: formBuilder[] = [
        {
          colName: 'reason_delete',
          title: 'Reason',
          validator: [{ name: 'required', error: 'Reason is Required' }]
        }];

      this.modalService.openConfirmDialog({ title: title, message: msg, formField: formFiled, isFormField: !isActiveAction }).then((res: any) => {
        if (res) {
          const data = this.dedicationList.result.data.find((a: any) => a.sponsor_id == id);
          Object.assign(data, res)
          if (isActiveAction) {
            data.deleted_at = null;
          } else {
            data.deleted_at = mysqlDataTime();
          }
          this.staffApi.updateRequest(data.sponsor_id, data).then((res: any) => {
            if (res) {
              this.alertService.showToast("Successfully  Updated", 'success');
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

  close() {
    //this.n
  }
}
