import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { AppConstant, MODULE_NAME, PERMISSION, RESPONSE_CODE, STATUS_TBL } from 'src/app/helper/class/app-constant';
import { createSearchTableQuery, isArray, isEmptyObj, isExistsKey, removeTableClass } from 'src/app/helper/class/utilityHelper';
import { ResponseData, tableAction, tableBuilder, tableButton, tableColum, tableFilter, tblFilterQuery } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { DonationInfoComponent } from 'src/app/modules/sponsor/component/donation-info/donation-info.component';
import { StaffBasicComponent } from 'src/app/shared/feature-modal/staff-basic/staff-basic.component';
import { ModalService } from 'src/app/shared/service/modal.service';
export interface tagInfo {
  data: any,
  text: string
}

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit {
  @Input() parentGetList: ((args?: any) => Promise<any>) | any;
  @Input() parenttblAction: ((id: string | number, args?: tableAction, data?: any) => Promise<any>) | any;
  @Input() viewAction: ((id: string | number, data?: any) => Promise<any>) | any;
  @Input() tagInfoAction: ((tagData: tagInfo, data?: any) => Promise<any>) | any;
  data: any;
  tableLoader: boolean = false;
  @Input() selectable: 'SINGLE' | 'MULTI' | false | undefined = false;
  @Input() maxSelection: number = -1; // -1 means unlimited;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Input() skipId: Array<string | number> = [];
  @Input() title: any;
  @Input() tbl: any;
  @Input() tableConfig: tableBuilder | null = {} as tableBuilder;
  @Input() globalFilterField: Array<any> = [];
  @Input() exportLoading: boolean = false
  showFilter: boolean = false;
  cols: Array<any> = [];
  actionBtn: Array<any> = [];
  selectedData: Array<any> = [];
  FORM_SUPPORT_DATA: any = {};
  DATA_LOADING: any = {};
  statusArray: any = STATUS_TBL;
  moduleArray: any = Object.keys(MODULE_NAME);
  actionArray: any = Object.keys(PERMISSION);
  totalRecords: number = 0;
  primaryKey: string | number | any = 'id';
  lastFilter: tblFilterQuery = {} as tblFilterQuery;
  defaultRow = this.tableConfig?.rows || AppConstant.TABLE_PAGE_ROWS;
  first = 0
  @Input() silentMode: boolean = false
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('d1') tblDiv: Table = {} as Table;
  yearRange = AppConstant.DEFAULT_DATE_RANGE
  constructor(
    private alertService: AlertService,
    private modalService: ModalService,
    private masterApi: MasterApiService,
    private elRef: ElementRef,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private auth: AuthService) { }
  paramsKeys: any = [];
  allParams: any = {}
  pageParams = {};
  ngOnInit(): void {
    if (!this.silentMode) {
      const params: any = this.activateRoute.snapshot.queryParamMap
      this.allParams = params['params'] || {};
      const s = this.allParams.page ? JSON.parse(this.allParams.page) : {};
      this.pageParams = s;
      if (s && !isEmptyObj(s)) {
        if (s.page) {
          this.first = +s.page * this.defaultRow;
        }
      }
    }
    this.initTbl()
    if (!this.tableConfig?.isLazy) {
      this.getData();
    }
  }


  async initTbl() {
    this.cols = [];
    await this.tableConfig?.column.map(a => {
      if (a.filter && !this.tableConfig?.showFilter) {
        this.showFilter = true; // if any one has filter show filter will be true
      }
      if (a.isPrimary) {
        this.primaryKey = a.selectKeyName ? a.selectKeyName : a.colName;
      }
      if (!("visible" in a)) {
        a.visible = true;
      }
      if (a.visible) {
        let colType: tableFilter = {} as tableFilter;
        if (a.filter) {
          colType = a.filterCol ? a.filterCol : {} as tableFilter;
        }
        switch (a.filterCol?.type) {
          case 'DROPDOWN':
            this.FORM_SUPPORT_DATA[a?.colName] = isArray(a?.filterCol?.data) ? a?.filterCol?.data : []
            if (a.filterCol?.apiName) {
              this.getFullData(a);
            }
            break;
        }
        // this.cols.push({ field: a.selectKeyName && !a.filterCol?.selectKeyName ? a.selectKeyName : a.colName, colName: a.colName, header: a.title, type: a.colType, sort: a.sort, filter: a.filter, filterCol: a.filterCol, icon_append: a.icon_append || '' });
        this.cols.push({ field: a.selectKeyName ? a.selectKeyName : a.colName, colName: a.colName, header: a.title, type: a.colType, sort: a.sort, filter: a.filter, filterCol: a.filterCol, icon_append: a.icon_append || '', colJoinSeperator: a?.colJoinSeperator || false, colJoinName: a?.colJoinName || '', isEditable: a.isEditable });
      }
    });
    this.tableConfig?.action.map((a: tableButton) => {
      if (a.type) {
        const mName: any = a.permission?.moduleName,
          aName: any = a.permission?.actionName;
        if (!mName) {
          this.actionBtn.push(a);
          return;
        }
        if (isExistsKey(a, ['permission', 'moduleName'])) {
          if (this.auth.checkPermission(mName, aName)) {
            this.actionBtn.push(a);
          }
        }
      }
    })
  }
  makeChange = true;
  markChanged() {
    this.makeChange = false;
    this.setTableData(this.data)
    this.ref.detectChanges();
    this.makeChange = true;
  }

  getFullData(a: tableColum) {
    this.DATA_LOADING[a.colName] = true;
    const api: any = this.masterApi.getFullData(a.filterCol?.apiName || '', []);
    api.then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.FORM_SUPPORT_DATA[a.colName] = []
        if (isArray(res.result)) {
          this.FORM_SUPPORT_DATA[a.colName] = res.result;
        }
      }
    }).finally(() => this.DATA_LOADING[a.colName] = false)
  }


  ngAfterViewInit() {
    removeTableClass(this.elRef);
  }

  pushHistory(ev: tblFilterQuery) {
    const frg: any = this.activateRoute.snapshot.fragment;
    console.log('on push history', JSON.stringify(ev))
    this.router.navigate(
      [],
      {
        relativeTo: this.activateRoute,
        queryParams: { page: JSON.stringify(ev) },
        fragment: frg,
        queryParamsHandling: 'merge',
        //skipLocationChange:true
      });
  }
  initialCall = true;
  getData(ev: tblFilterQuery = {} as tblFilterQuery) {
    const frg: any = this.activateRoute.snapshot.queryParams.page || '';
    if (!this.silentMode) {
      if (!this.initialCall || ev.queryParams?.length) {
        this.pushHistory(ev)
      }
    }
    this.initialCall = false;
    this.tableLoader = true;
    ev?.queryParams?.map((a: any) => { if (typeof a.value == 'string') { a.value = a.value.trim() } return a });
    this.parentGetList?.(ev).then((res: ResponseData | any) => {
      if (res?.statusCode == 200) {
        if (this.tableConfig?.isLazy) {
          this.data = res.result.data;
          this.markSelectable();
          this.totalRecords = res.result.totalRecord;
        } else {
          this.setTableData(res.result);
        }
        this.ngAfterViewInit();
      } else if (Array.isArray(res)) {
        this.setTableData(res);
      }
    }).catch((res: any) => {
      console.log(res, 'Date result');
    }).finally(() => {
      this.tableLoader = false;
    })
  }

  setTableData(res: any) {
    this.data = [];
    if (isArray(res)) {
      this.data = res;
      this.totalRecords = this.data.length;
    }
  }

  openStaffInfo(id: string | number) {
    const component: any = StaffBasicComponent;
    this.modalService.openModal(component, { staff_emp_id: id }, 'modal-lg').then((res: any) => {
    });
  }
 

  btnAction(id: string | number, type: tableAction, data = {}) {
    this.parenttblAction?.(id, type, data).then((res: any) => {
      if (res.reload) {
        this.reload();
      }
    });
  }

  btnAnchorAction(id: string | number, data = {}) {
    this.viewAction?.(id, data);
  }

  btnTagInfo(tag: tagInfo, data: any) {
    this.tagInfoAction?.(tag, data);
  }

  reload() {
    if (this.tableConfig?.isLazy) {
      if (!isEmptyObj(this.lastFilter)) {
        this.loadData(this.lastFilter);
      } else {
        this.tblDiv.filter('', this.tableConfig?.column[0].colName, 'contains');
      }
    } else {
      this.getData();
    }
  }

  loadData(ev: any = {}) {
    if (!isEmptyObj(ev)) {
      this.lastFilter = createSearchTableQuery(ev) || {};
    }
    this.getData(this.lastFilter);
  }

  AddRemoveSelection(con: any) {
    if (this.selectable) {
      let index = this.isExistsData(con);
      if (this.isExistsData(con) == -1) {
        if (this.maxSelection == -1 || (this.maxSelection != -1 && this.maxSelection > this.selectedData.length)) {
          this.selectedData.push(con);
        } else {
          this.selectedData.splice(0, 1);
          this.selectedData.push(con);
        }
      } else {
        this.selectedData.splice(index, 1);
      }
      this.markSelectable();
      this.onSelect.emit(this.selectedData);
    } else {
      this.onSelect.emit(con);
    }
  }

  clearAllSelection() {
    this.selectedData = [];
    this.markSelectable();
    this.onSelect.emit(this.selectedData);
  }

  markSelectable() {
    if (this.selectable) {
      if (this.selectedData.length) {
        this.data.map((a: any) => {
          console.log(a, ' A value')
          if (this.isExistsData(a) == -1) {
            a.selectable = false;
          } else {
            a.selectable = true;
          }
        })
        console.log(this.data, 'selectable list')
      } else {
        this.data.map((a: any) => a.selectable = false);
      }
    } else {
      this.selectedData = [];
    }
  }


  updateRow(row: any, field: any, data: any) {
    // console.log('id',row,'controlName',field,'value',data)
    this.onChangeEvent.emit({ controlName: field, value: data || '', row: row })
  }

  onSelectData(con: any) {
    if (this.skipId.includes(con[this.primaryKey])) {
      this.alertService.showToast('Duplicate Selection, unable to select', 'info')
      return;
    }
    this.AddRemoveSelection(con);
  }

  isExistsData(con: any) {
    return this.selectedData.findIndex(a => a[this.primaryKey] == con[this.primaryKey]);
  }
}