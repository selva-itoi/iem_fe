import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MODIFY_COL } from 'src/app/core/helper/core_form_helper';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UrlServices } from 'src/app/helper/class/url-services';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilderData, ResponseData } from 'src/app/helper/interface/response';
import { HOME_FORM } from '../../config/config';
import { MasterApiService } from '../../service/master-api.service';
@Component({
  selector: 'app-homes-info',
  templateUrl: './homes-info.component.html',
  styleUrls: ['./homes-info.component.scss']
})
export class HomesInfoComponent implements OnInit {

  urlService: any = UrlServices.PAGE_URL;
  loading: boolean = false;
  homeId: string | number = '';
  pageInfo: pageInfo = {} as pageInfo;
  homeData: any;
  dataLoading: boolean = false;
  basicFormData: formBuilderData[] = [...HOME_FORM,...[{colName : 'no_of_boys', title : 'No of Boys'},{colName : 'no_of_girls',title : 'No of Girls'},{colName: 'total_child',title : 'Total Number of Students'}]];
  isModal: boolean = false
  totalNumberStudent: number = 0;
  formOfficeField:mapInfoView[] = [{title : 'No Of Warden',name : 'no_of_wardern'},
  {title : 'No Of Cook',name : 'no_of_cook'},
  {title : 'No Of Social Worker',name : 'no_of_social_worker'},
  {title : 'No Of Helper',name : 'no_of_helper'},
  {title : 'Region',name : 'regionName'},
  {title : 'Zone/State',name : 'zoneName'},
  {title : 'Field',name : 'fieldName'},
  {title : 'Allow Mk Child On home ?',name : 'allow_mk_statusName'},
  {title : 'Remarks',name : 'remarks'},
  {title : 'Comments',name : 'comment'},
]
officeModify:any =MODIFY_COL
  constructor(private activatedRoute: ActivatedRoute,
    private masterApi: MasterApiService
  ) { }

  ngOnInit(): void {
    const showBtnList = true;
    this.homeId = this.activatedRoute.snapshot.queryParams.id || '';
    this.pageInfo = {
      title: 'Home / Project Details',
      buttonShowBtn: showBtnList,
      button: {
        title: 'All Home',
        url: this.urlService.MASTER.HOMES.URL,
      }
    }
    this.getData();
    this.totalNumberStudent = this.homeData.no_of_girls + this.homeData.no_of_boys;
  }
  getData() {
    if (this.homeId) {
      this.dataLoading = true;
      this.masterApi.getById('home', this.homeId).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (res.result) {
            this.homeData = res.result;
            this.homeData.total_child=(+res.result.no_of_girls || 0) + (+res.result.no_of_boys || 0);
            this.homeData.allow_mk_statusName = +res?.result?.allow_mk ? 'Yes' : 'No';
          }
        }
      }).finally(() => {
        this.dataLoading = false;
      });
    }
  }

}
