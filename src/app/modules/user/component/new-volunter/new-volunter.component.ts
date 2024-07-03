import { Component, OnInit, ViewChild } from '@angular/core';
import { cloneData, isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilderData, formDynamicValidator } from 'src/app/helper/interface/response';
import { NEW_VOLUNTER } from '../../helper/user_form';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { UrlServices } from 'src/app/helper/class/url-services';
import { UserApiService } from '../../services/user-api.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { AlertService } from 'src/app/helper/service/alert.service';
import { ModalService } from 'src/app/shared/service/modal.service';

@Component({
  selector: 'app-new-volunter',
  templateUrl: './new-volunter.component.html',
  styleUrls: ['./new-volunter.component.scss']
})
export class NewVolunterComponent implements OnInit {

  urlService = UrlServices.PAGE_URL
  pageInfo: pageInfo = {} as pageInfo
  dataLoading: boolean = false
  basicFormData: formBuilderData[] = cloneData(NEW_VOLUNTER)
  volunterData: any
  volunterId: any
  loading: boolean = false
  promotionAccount = {};
  reportdata:any
  reportaccount:any
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined
  activeid: any;
  constructor(private activatedRoute: ActivatedRoute, private navigation: NavigationService,private modalService: ModalService,
    private auth: AuthService, private userApi: UserApiService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.volunterId = this.activatedRoute.snapshot.queryParams['id'] || ''
    this.pageInfo = {
      title: (this.volunterId ? 'Update ' : 'New ') + 'Area Secretary',
      buttonShowBtn: this.auth.checkPermission('USER', 'VIEW_ALL'),
      button: {
        title: 'All Area Secretary',
        url: this.urlService.USER.VOLUNTER_LIST.URL
      }
    }
    if (this.volunterId) {
      this.getData()
    }
   
  }
 
  // dynamicForm: formDynamicValidator[] = [
  //   {
  //     controlName: 'promotionalOffice_id',
  //     hideControl: ['report_to'],
  //     validatorControl: ['report_to'],
  //     value: 0, operation: "!="
  //   },
  // ]

  // getReportAccount(){
  //   //api
  //   this.promotionAccount = {} // api result
  // }

  getData() {
    this.dataLoading = true
    this.userApi.getByIdVolunter(this.volunterId).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.volunterData = res.result
        if(this.volunterData.mobile_no.length !=10){
        this.volunterData.mobile_no = this.volunterData?.mobile_no.slice(2)
        }
        this.mapData();
      }
    }).finally(() => this.dataLoading = false)
  }

  mapData() {
    setTimeout(() => {
      this.basicForm?.setData(this.volunterData)
    }, 800);

    this.promotionAccount = {id : this.volunterData.report_fk_id,account_code :this.volunterData.account_code}
  }

  apiPayload() {
    const payload = this.basicForm?.apiPayload()
    payload.report_to_fk_id = this.reportdata?.account_id;
    if (this.volunterId) {
      payload.id =  this.volunterData.id
    }
    if(this.activeid){
      payload.status = 1
    }
    return payload
  }
  onChange(ev:any){
    if (ev?.controlName == 'promotionalOffice_id'){
      this.userApi.getreportAccount(ev.value).then((res:any)=>{
        this.reportdata = res.result
        if(this.reportdata === undefined || this.reportdata == 0){
          this.reportaccount =' '
        }else{
          this.reportaccount =this.reportdata.account_code
        }
      })
    }
  }

  onSubmit() {
    // if(isEmptyObj( this.reportaccount)){
    //   return 
    // }
  //    if(!this.volunterId){
  //    if( this.reportdata === undefined || this.reportdata == 0){
  //     return 
  //   }
  //  }
  if (!this.basicForm?.isValid()) { return }
  console.log('onsubit ', this.apiPayload())
    this.loading = true
    this.userApi.saveVolunter(this.apiPayload()).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Volunter Saved Successfully', 'success')
        this.close()
      } else {
        this.alertService.showToast('Unable to Save data', 'error')
      }
    }).catch(() => {
      this.alertService.showToast('Unable to Save data', 'error')
    }).finally(() => this.loading = false)
  }

  close() {
    this.navigation.back();
  }
}
