import { Component, ElementRef, OnInit } from '@angular/core';
import { STATUS_TBL, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { removeTableClass } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { EditRoleComponent } from '../../component/edit-role/edit-role.component';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {

  data: any;
  tableLoader: boolean = false;
  cols: Array<any> = [
    { field: 'roleName', header: 'Role Name' },
    { field: 'status', header: 'Status' },
    //{ field: 'created_at', header: 'Date' },
  ];
  statusArray: any = STATUS_TBL;
  constructor(private masterApi: MasterApiService,
    private elRef: ElementRef,
    private alertService: AlertService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit() {
    removeTableClass(this.elRef);
  }

  getData() {
    this.tableLoader = true;
    this.masterApi.getFullData('role', [], false).then((res: ResponseData | any) => {
      if (res.statusCode == 200) {
        this.data = res.result;
        this.ngAfterViewInit();
      }
    }).catch((res: any) => {
      console.log(res, 'Date result');
    }).finally(() => {
      this.tableLoader = false;
    })
  }

  async edit(id: string | number = '') {
    this.modalService.openModal(EditRoleComponent, { id: id }).then((res: any) => {
      if (res) {
        this.getData();
      }
    });
  }

  delete(id: string | number) {
    this.modalService.openConfirmDialog({ message: 'Are you sure to remove this role ?', title: 'Remove Role' }).then((res: any) => {
      if (res) {
        this.masterApi.saveData('role', { status: 0, id: id }).then((res: ResponseData | any) => {
          if (res.statusCode == RESPONSE_CODE.SUCCESS) {
            this.alertService.showToast('Role has been removed!..', 'success');
          }
        })
      }
    });
  }
}