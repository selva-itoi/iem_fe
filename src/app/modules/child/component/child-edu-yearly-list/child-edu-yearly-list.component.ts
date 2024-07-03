import { Component, OnInit, ViewChild } from '@angular/core';
import { UrlServices } from 'src/app/helper/class/url-services';
import { convertDate } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilderData, tableAction, tableBuilder, tableButton, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { AuthService } from 'src/app/helper/service/auth.service';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { ChildApiService } from '../../service/child-api.service';
import { ChildEduYearlyUpdateComponent } from '../child-edu-yearly-update/child-edu-yearly-update.component';

@Component({
  selector: 'app-child-edu-yearly-list',
  templateUrl: './child-edu-yearly-list.component.html',
  styleUrls: ['./child-edu-yearly-list.component.scss']
})

export class ChildEduYearlyListComponent implements OnInit {

  report_month: string | any = new Date();
  LIST_COL: tableColum[] = [
    {
      colName: 'child_id',
      title: 'Child Id',
      sort: true,isPrimary:true,
      filter: true,
    },
    {
      colName: 'name',
      title: 'Child Name',
      sort: true,
      filter: true,
      colType: 'CHILD_ID'
    },
    {
      colName: 'child_type',
      title: 'Type',
      sort: true,
      colType:'DROPDOWN',
      filterCol: {
          data : [{child_typeName : 'MK',id : 1},{child_typeName:'Home',id :2}],
          selectPrimaryKey: 'id',
          selectKeyName :'child_typeName',
          type : 'DROPDOWN',
      },
      filter: true,
      visible:false
  },
    {
      colName: 'homeName',
      title: 'Home/Project',
      sort: false,
      filter: true
    },
    {
      colName: 'course_name',
      title: 'Course Name',
      sort: false,
      filter: true
    },
    {
      colName: 'from_date',
      title: 'Course From',
      sort: true,
      filter: true,
      colType: 'DATE'
    },
    {
      colName: 'to_date',
      title: 'Course To',
      sort: true,
      filter: true,
      colType: 'DATE'
    },
  ];
  actionBtn: tableButton[] = [
    { name: '', class: 'btn-info', icon: 'icon-pencil', title: 'Update', type: 'EDIT', permission:{moduleName :'CHILD_EDUCATION',actionName : 'UPDATE'}},
  ];
  basicFormData: formBuilderData[] = [{ colName: 'from_date', title: 'from_date', validator: [{ name: 'required' }], type: 'DATE',dateViewMode:'month', monthNavigator: true, yearNavigator: true,defaultValue : new Date(),dateFormat:'mm-yy',dateRange:`${(new Date().getFullYear()-2).toString()}:  ${(new Date().getFullYear() + 5).toString()}` },
  { colName: 'to_date', title: 'to_date', validator: [{ name: 'required' }], monthNavigator: true,type:'DATE', yearNavigator: true, dateViewMode: 'month',dateFormat:'mm-yy',defaultValue:new Date((new Date().getFullYear() +1),6,1),dateRange:`${(new Date().getFullYear()-2).toString()}:  ${(new Date().getFullYear() + 5).toString()}` }]
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  tableConfig: tableBuilder = {
    name: 'Yearly Edu Update',
    addBtn: false,
    column: this.LIST_COL,
    action: this.actionBtn,
    isLazy: true,
    showFilter: true
  }
  segement = {
    LIST: 'Pending',
    UPCOMING: 'upcoming',
    MODIFYREQUEST : 'Approval Request'
  }
  isMk:boolean=false;
  isHome :boolean=false;
  modifyModule: Concrete<keyof modulInterface>[] = ['CHILD_EDUCATION']
  urlService = UrlServices.PAGE_URL;
  pageInfo: pageInfo = {} as pageInfo
  segmentVisited: any = { LIST: true };
  currentSegment: string = this.segement.LIST;
  @ViewChild('upcomingTbl') upcomingTbl: TableListComponent | undefined;
  constructor(private auth: AuthService, private childApi: ChildApiService,
    private modalService: ModalService
  ) { }
  ngOnInit(): void {
    this.pageInfo = { title: '', buttonShowBtn: this.auth.checkPermission('CHILD', 'ADD'), button: { title: 'New Child', url: this.urlService.CHILD.ADD.URL } };
    this.isMk = this.auth.checkPermission('CHILD', 'MANAGE_MK_CHILD'),
    this.isHome = this.auth.checkPermission('CHILD', 'MANAGE_HOME_CHILD');
    if(this.isMk && this.isHome){
      this.LIST_COL.map((a:tableColum) => {if(a.colName == 'child_type') {a.visible =true;} return a});
    }
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
  mapCondition(e:any){
    if(!(this.isMk && this.isHome)){
      if(this.isHome){
        e.whereField?.push({colName:'child_type',value :2,operation:'AND'});
      }else{
        e.whereField?.push({colName:'child_type',value :1,operation:'AND'});
      }
    }
    return e;
  }

  getListPendingData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['CHILD_EDUCATION'], ['UPDATE'], []) || [];
    e=this.mapCondition(e);
    return await this.childApi.pendingEducation('NOW', e)
  }
  pendingUpcoming = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = this.auth.getPermittedId(['CHILD_EDUCATION'], ['UPDATE'], []) || [];
    e=this.mapCondition(e);
    const data = this.basicForm?.apiPayload();
    const currentData = new Date();
    e.whereField?.push({ colName: 'from_date', value: convertDate(data.from_date) || convertDate(new Date(currentData.getFullYear(), currentData.getMonth(), 1)) })
    e.whereField?.push({ colName: 'to_date', value: convertDate(data.to_date) || convertDate(new Date(currentData.getFullYear(), currentData.getMonth() + 1, 0)) })
    return await this.childApi.pendingEducation('upcoming', e);
  }

  search() {
    this.upcomingTbl?.reload();
  }

  tblAction = async (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
        this.modalService.openModal(ChildEduYearlyUpdateComponent, { child_id: id, type: 'UPDATE',category : this.currentSegment == this.segement.LIST? 'NOW' :'upcoming' },'modal-xl').then(res => {
          if (res) {
            console.log('close modal');
          }
        });
        break;
    }
    return Promise.resolve(true);
  }
}
