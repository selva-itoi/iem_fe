import { Component, OnInit, ViewChild } from '@angular/core';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilderData, formDynamicValidator, tableAction, tableBuilder, tableButton, tblFilterQuery } from 'src/app/helper/interface/response';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { downloadHelper } from 'src/app/helper/class/downloadHelper';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { MAGAZINE_INFO_COL, MAGAZINE_LIST_COL, SPONSORSHIP_TABLE } from '../../helper/sponsor-form';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { FormControl, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/service/modal.service';
import { UrlServices } from 'src/app/helper/class/url-services';
import { userPermission } from 'src/app/helper/interface/user';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { AlertService } from 'src/app/helper/service/alert.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-magazine-list',
  templateUrl: './magazine-list.component.html',
  styleUrls: ['./magazine-list.component.scss']
})
export class MagazineListComponent implements OnInit {

  segement = {
    ACTIVE: 'Active',
    LIST: 'Inactive',
    PRINT: 'Print'
  }
  segmentVisited: any = {
    LIST: false,
    ACTIVE: false,
    PRINT: false
  }
  currentSegment: string = '';
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Edit', type: 'EDIT', permission: { moduleName: 'SPONSOR', actionName: 'UPDATE' } },
    { name: '', class: 'bg-orange', icon: 'icon-eye', title: 'View', type: 'VIEW', permission: { moduleName: 'SPONSOR', actionName: 'READ' } },
    { name: '', icon: 'icon-lock text-info', title: 'InActive ', type: 'DELETE', permission: {} as userPermission, condition: [{ key: 'status', value: 1, operation: '==' }] },
    { name: '', icon: 'icon-lock-open text-info', title: 'Active ', type: 'ACTIVE', permission: {} as userPermission, condition: [{ key: 'status', value: 0, operation: '==' }] }
  ]
  LIST_COL = cloneData(MAGAZINE_LIST_COL)
  INFO_COL = cloneData(MAGAZINE_INFO_COL)
  tableConfig: tableBuilder = {
    name: '',
    action: this.actionBtn,
    column: this.LIST_COL,
    showFilter: true,
    isLazy: true
  }
  magazineList: any
  printFormData: formBuilderData[] = [
    // {
    //   colName: 'print_type', title: 'Print Type', type: 'select', data: [{ print_typeName: 'All ', id: 1 }, { print_typeName: 'Outside TamilNadu Only', id: 2 }, { print_typeName: 'Outside India Only', id: 3 },
    //   { print_typeName: 'India Only', id: 4 }, { print_typeName: 'TamilNadu Only', id: 5 }], selectKeyName: 'print_typeName', selectPrimaryKey: 'id', validator: [{ name: 'required' }]
    // },
    // {
    //   colName: 'type',
    //    title: 'Country', 
    //    type: 'select', 
    //    data: [{ print_typeName: 'Outside India Only', id: 3 },
    //   { print_typeName: 'India Only', id: 2 }],
    //    selectKeyName: 'print_typeName',
    //     selectPrimaryKey: 'id',
    //      event: { name: 'change', isCallback: true },
    //       validator: [{ name: 'required' }]
    // },
    {
      colName: 'country',
      filter: true,
      sort: true,
      title: 'Country',
      validator: [{ name: 'required' }],
      type: 'select',
      apiTblName: 'country',
      selectKeyName: 'countryName',
      event: { name: 'change', apiTblName: 'state', valueAssign: 'state' },
      defaultValue: '1'
  },
    {
      colName: 'state_id',
      title: 'State',
      apiTblName: 'state',
      type: 'select',
      selectKeyName: 'stateName',
      selectPrimaryKey: 'id',
      validator:[{name:'required'}],
      event: { name: 'change', apiTblName: 'district', valueAssign: 'district_id' },
    },
    {
          colName: 'district_id',
          filter: true,
          sort: true,
          visible: false,
          type: 'select',
          selectKeyName: 'districtName',
          title: 'District Name',
          // event: { name: 'change', apiTblName: 'city', valueAssign: 'city' }
      },
    
    {
      colName: 'count', title: 'Count', type: 'select', data: [{ countName: 'All', id: 3 }, { countName: 'Single', id: 1 }, { countName: 'Multi', id: 2 }],
      selectKeyName: 'countName', selectPrimaryKey: 'id', validator: [{ name: 'required' }]
    }
  ]


  //   {
  //     colName: 'state',
  //     filter: true,
  //     sort: true,
  //     title: 'State',
  //     validator: [{ name: 'required' }],
  //     type: 'select',
  //     selectKeyName: 'stateName',
  //     selectPrimaryKey: 'id',
  //     event: { name: 'change', apiTblName: 'district', valueAssign: 'district' }
  // },
  // {
  //     colName: 'district',
  //     filter: true,
  //     sort: true,
  //     visible: false,
  //     type: 'select',
  //     selectKeyName: 'districtName',
  //     title: 'District Name',
  //     // event: { name: 'change', apiTblName: 'city', valueAssign: 'city' }
  // },

  dynamicFormData: formDynamicValidator[] = [
    {
      controlName: 'type',
      hideControl: ['state_id','district_id'],
      validatorControl: ['state_id'],
      value: 2, operation: '=='
    },
  ]
  printLoader: boolean = false
  pageInfo: pageInfo = {} as pageInfo
  @ViewChild('tableList') tableList: TableListComponent | undefined;
  @ViewChild('printForm') printForm: FormGeneratorComponent | undefined;
  constructor(private sponsorApi: SponsorApiService, private modalService: ModalService, private alertservice: AlertService, private router: Router, private downloadHelper: downloadHelper) { }

  ngOnInit(): void {
    this.pageInfo = {
      title: 'Manage Magazine',
      buttonShowBtn: true,
      button: {
        title: 'New Magazine', url: UrlServices.PAGE_URL.SPONSOR.NEW_MAGAZINE.URL, icon: 'pi pi-plus'
      }
    }
  }

  tblAction = (id: string | number, type: tableAction, data: any): Promise<any> => {
    console.log('idddddddddd', id)
    switch (type) {
      case 'VIEW':
        this.openModal(data)
        // this.router.navigate([this.urlService.STAFF.VIEW.URL], { queryParams: { id: id } })
        break;
      case 'ACTIVE':
        this.inActive(id, true)
        break;
      case 'DELETE':
        this.inActive(id)
        break;
      case 'EDIT':
        this.router.navigate([UrlServices.PAGE_URL.SPONSOR.NEW_MAGAZINE.URL], { queryParams: { id: id } });
        break;
    }
    return Promise.resolve(true);
  }


  inActive(id: any, isMakeActive: boolean = false) {
    const payload: any = {}
    isMakeActive ? payload.from_date = new Date() : payload.to_date = new Date()
    const title = isMakeActive ? 'Active ' : 'InActive ' + 'Magazine', msg = 'Are you sure want to ' + title + ' ?'
    this.modalService.openConfirmDialog({ title: title, message: msg, formField: [{ colName: 'remark', title: 'Remarks', validator: [{ name: 'required' }] }], isFormField: true }).then((res: any) => {
      if (res.remark) {
        payload.remark = res?.remark
        const api = isMakeActive ? this.sponsorApi.activateMagazine(id, payload) : this.sponsorApi.inActivateMagazine(id, payload)
        api.then((res: any) => {
          if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
            this.alertservice.showToast('Save Successfully', 'success')
            this.tableList?.reload()
          }
        }).catch(() => { this.alertservice.showToast('Unable to save', 'error') })
      }
    })
  }

  openModal(srcData: any) {
    srcData.statusName = `<span class="badge font-12 badge-${+srcData.status ? 'success' : 'danger'}">${+srcData.status ? 'Active' : 'InActive'}</span>`
    const formData: [] = cloneData(this.INFO_COL).map((a: formBuilderData) => { if (a.colName == 'status') { a.colName = 'statusName' }; return a })
    const data: any = { title: 'Magazine Info', formData: formData, sourceData: cloneData(srcData) }
    this.modalService.openInfoModal(data, 'modal-lg')
  }
  onTabChange(ev: any) {
    this.segmentVisited = ev.visited;
    this.currentSegment = ev.key;
    console.log(this.segmentVisited, 'fdsf', this.currentSegment)
    // this.tableList?.reload()
  }
  getListData = async (e: tblFilterQuery): Promise<any> => {
    if (this.currentSegment == this.segement.ACTIVE) {
      e.whereField = [{ colName: 'status', value: 1 }]
    }
    if (this.currentSegment == this.segement.LIST) {
      e.whereField = [{ colName: 'status', value: 2 }]
    }
    return this.magazineList = await this.sponsorApi.magazineGetList(e).then((res: any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        res?.result?.data.map((a: any) => {
          a.address = `<strong>${a?.street || ''}</strong></span><br><span><strong class="text-info" >${a?.address || ''}</strong></span> <span><strong class="text-info" >${a?.address_line || ''}</strong>`
          a.sponsor = `<span><strong>${a?.sponsorName || 'UnKnown'}</strong></span><br><span><strong class="text-info" >${a?.sponsor_id || ''}</strong></span>`;
          a.magazine = `<span><strong class="font-14" >${a?.magazineName}</strong></span><br><strong class="text-monospace text-black-50" >${a?.ref_code}</strong>`
        })
      }
      return res
    })
  }
  apipayload(){
    const data = this.printForm?.apiPayload() || ''
    if (data.state_id == '') {
      data.state_id = ''
    }
    if (data.district_id == '') {
      data.district_id = ''
    }
   return data
  }


  print() {
    if (!this.printForm?.isValid()) return
    // const data = this.printForm?.apiPayload() || ''
    // if (data.state_id == '') {
    //   data.state_id = 0
    // }
    // const { print_type, count, state_id } = this.printForm?.apiPayload() || ''
    this.printLoader = true
    //@ts-ignore
    this.sponsorApi.printMagazine(this.apipayload()).then((res: ResponseData) => {
          
     if(res== null){
      this.alertservice.showToast('No data found', 'error')
     }else{
      this.downloadHelper.downloadFile(res);
     }
    }).catch(() => this.alertservice.showToast('Unable to Download', 'error'))
      .finally(() => this.printLoader = false)
  }
}
