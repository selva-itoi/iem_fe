import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilderData, tableBuilder, tblFilterQuery } from 'src/app/helper/interface/response';
import { NEW_VIEW_VOLUNTER, NEW_VOLUNTER } from '../../helper/user_form';
import { ObjectString } from 'src/app/core/helper/core.data.interface';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '../../services/user-api.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';

@Component({
  selector: 'app-volunter-info',
  templateUrl: './volunter-info.component.html',
  styleUrls: ['./volunter-info.component.scss']
})
export class VolunterInfoComponent implements OnInit {

  pageInfo: pageInfo = {} as pageInfo
  isModal: boolean = false
  dataLoading: boolean = false
  info_message: any
  volunterData: any
  volunterId: any
  basicFormData: formBuilderData[] = cloneData(NEW_VIEW_VOLUNTER)
  loading: boolean = false
  segement: ObjectString = {
    BASIC: 'Basic',
    SETTLEMENT: 'Account Settlement'
  }
  segmentVisited: any = {}
  currentSegment: string = this.segement.BASIC;

  LIST_COL: formBuilderData[] = [{ colName: 'amount', title: 'Amount', colType: 'CURRENCY' }, { colName: 'narritor', title: 'Pay To' },
  { colName: 'statusName', title: 'Status' }, { colName: 'created_on', title: 'Created On', colType: 'DATE' }]

  tableConfig: tableBuilder = {
    name: 'Account Settlement',
    action: [],
    column: this.LIST_COL
  }
  constructor(private navigation: NavigationService,private activateRoute : ActivatedRoute,private userApi :UserApiService) { }

  ngOnInit(): void {
    this.volunterId = this.activateRoute.snapshot.queryParams['id'] || ''
    this.pageInfo = {
      title: 'Volunter Info'
    }
    if(this.volunterId){
      this.getData()
    }
  }
  
  getData() {
    this.dataLoading = true
    this.userApi.getByIdVolunter(this.volunterId).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.volunterData = res.result
        // this.volunterData.mobile_no = this.volunterData?.mobile_no.slice(2)
        // this.mapData()
      }
    }).finally(() => this.dataLoading = false)
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    //e.whereField = this.auth.getPermittedId(['FORMS'], ['VIEW_ALL'], ['region', 'zone', 'department', 'trust', 'ad_office']) || [];
    // return this.formList = await this.staffApi.getList(e)
  }

  close() {
    this.navigation.back()
  }
}
