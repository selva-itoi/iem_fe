import { Component, ViewChild } from '@angular/core';
import { ResponseData, formBuilder, tableAction, tableBuilder, tblFilterQuery } from 'src/app/helper/interface/response';
import { STATISTICS_CHURCH_REPORT, STATISTICS_FIELD_REPORT } from '../../helper/staff_form';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { TableListComponent } from 'src/app/shared/form/component/table-list/table-list.component';
import { StaffReportApiService } from '../../service/staff-report-api.service';
import { DatePipe } from '@angular/common';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';

@Component({
  selector: 'app-statistics-report',
  templateUrl: './statistics-report.component.html',
  styleUrls: ['./statistics-report.component.scss'],
  providers: [DatePipe]
})
export class StatisticsReportComponent {
  constructor(private staffreport:StaffReportApiService,private datepipe:DatePipe ){}

  @ViewChild ('basicForm') basicForm:FormGeneratorComponent | undefined
  @ViewChild('tablelist') tablelist:TableListComponent | undefined
  
  pageInfo: pageInfo = { title: 'Statistics Report'}
   statisticschurch:boolean=false
   statisticsfield:boolean=false

  month_year_col: formBuilder[] = [ {
    colName: 'department',
    selectKeyName: 'dName',
    selectPrimaryKey: 'id',
    defaultValue: '',
    apiTblName: 'department',
    type: 'select',
    title: 'Department Name',
    event: { isCallback: true, name: 'change' },
    validator: [{ name: 'required', error: 'Department Name should not be blank' }]
},{ colName: 'report_date', title: 'Report Month', type: 'DATE', dateViewMode: 'month', dateFormat: 'mm/yy',defaultValue:new Date()},
 
  ]
  department:any;
  LIST_COL:any=[]
  ngOnInit(): void { 
    
    // STATISTICS_FIELD_REPORT

  }
  search() {
    const data = this.basicForm?.apiPayload()
    if(data.department ==1){
     
  this.statisticschurch=true
  this.statisticsfield=false
    }
    if(data.department ==2){
    this.statisticsfield=true
    this.statisticschurch=false
    }
    this.tablelist?.reload()
   }

  tableConfig: tableBuilder = {
    name: 'Pending list',
    column:cloneData(STATISTICS_FIELD_REPORT),
    action: [],
    isLazy: true,
    showFilter: true,
  }
  tableConfig1: tableBuilder = {
    name: 'Pending list',
    column: cloneData(STATISTICS_CHURCH_REPORT),
    action: [],
    isLazy: true,
    showFilter: true,
  }

 
  tblAction = (id: string | number, type: tableAction): Promise<any> => {
    switch (type) {
      case 'EDIT':
      
    }
    return Promise.resolve(true);
  }

  apipayload(){
    const payload = this.basicForm?.apiPayload()
    payload.department_fk_id = payload.department
    const report_date = new Date(payload.report_date);
    payload.report_date = this.datepipe.transform(report_date, 'yyyy-MM-dd');
    return payload
  
  }

 

  getListData = async (e: tblFilterQuery): Promise<any> => {
   return this.staffreport.staticsReport(this.apipayload(),e).then((res: ResponseData | any)=>{
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res = this.mapResult(res);
      }
      return res;
    })
  }
  mapResult(res: any) {
    res.result.data.map((a: any) => {
     
      for (let i = 1; i <= 29; i++) {
      
        a[`field_no_${i}`] =a[`field_no_${i}`]+ "/" + a.goal[`field_no_${i}`]
      }

    })
    return res;
  }

  // for (var i = a; i <= b; i++) {
    //      const arD: any = { receipt_data: `${this.receiptdata.prefix}${i}` };
    //      this.arr.push(arD)
    //    }



}
