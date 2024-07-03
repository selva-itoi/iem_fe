import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseData, formBuilderData, whereField } from 'src/app/helper/interface/response';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { UserApiService } from '../../services/user-api.service';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { NEW_RECEIPT } from '../../helper/user_form';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { AlertService } from 'src/app/helper/service/alert.service';

@Component({
  selector: 'app-new-receipt',
  templateUrl: './new-receipt.component.html',
  styleUrls: ['./new-receipt.component.scss']
})
export class NewReceiptComponent implements OnInit {
  pageInfo: pageInfo = {} as pageInfo
  volunteerData: any;
  volunterId: any;
  editdata: any;
  loading:boolean= false;
  basicFormData: formBuilderData[] = NEW_RECEIPT
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined



  constructor(private modalService: ModalService,private activatedRoute: ActivatedRoute,private userApi: UserApiService,private navigation: NavigationService,
    private auth: AuthService,private alertService: AlertService) { }

  ngOnInit(): void {
    this.volunterId = this.activatedRoute.snapshot.queryParams['id'] || ''
    this.pageInfo = {
      title: (this.volunterId ? 'Update ' : 'New ') + 'Receipt',
    }

    if( this.volunterId){
      this.getdata()
    }

  }
  openvolunteerModal() {
    const wh: whereField[] = this.auth.getPermittedId(['MONTHLY_REPORT_STAFF'], ['ADD']) || [];
    this.modalService.openSearchModal({ type: 'VOLUNTEER', whereField: wh, activeOnly: true, filterShow: true }).then(async (res: any) => {
      if (res) {
        this.volunteerData = res;
      }
    });
  }
 

  getdata(){
    this.userApi.getReceiptById(this.volunterId).then((a:any)=>{
         this.volunteerData = a?.result
         setTimeout(() => {
           this.basicForm?.patchValue(this.volunteerData)
        }, 100);
         console.log( this.volunteerData,' this.editdata')
    })
  }
  apiPayload() {
    const payload = this.basicForm?.apiPayload();
    payload.type = '1';
    if(this.volunterId) {
      payload.id= this.volunterId
      payload.ref_fk_id=this.volunteerData.volunteer_fk_id
      payload.volunteer_fk_id=this.volunteerData.volunteer_fk_id
      payload.volunteer_id= this.volunteerData.volunteer_id
    }else{
      // payload.id = this.volunteerData.id
      payload.ref_fk_id=this.volunteerData.id
      payload.volunteer_fk_id=this.volunteerData.id


    }
    return payload
  }


  onSubmit(){
    if(!this.volunteerData){
      return
    }

    if (!this.basicForm?.isValid()) { return }
    this.loading = true;
    this.userApi.saveVolunterReceipt(this.apiPayload()).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Receipt Saved Successfully', 'success')
        this.close()
      } else {
        this.alertService.showToast('Unable to Save data', 'error')
      }
    }).catch(() => {
      this.alertService.showToast('Unable to Save data', 'error')
    }).finally(() => this.loading = false)
  }

  close(){
    this.navigation.back();
  }
   
  }
 


