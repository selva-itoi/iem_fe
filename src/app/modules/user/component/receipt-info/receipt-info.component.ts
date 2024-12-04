import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { UserApiService } from '../../services/user-api.service';

@Component({
  selector: 'app-receipt-info',
  templateUrl: './receipt-info.component.html',
  styleUrls: ['./receipt-info.component.scss']
})
export class ReceiptInfoComponent implements OnInit {
  volunterId: any;
  pageInfo: pageInfo = {} as pageInfo
  receiptdata: any;


  constructor(private activateRoute : ActivatedRoute,private navigation: NavigationService,private userApi: UserApiService) { }

  ngOnInit(): void {
    this.volunterId = this.activateRoute.snapshot.queryParams['id'] || ''
     console.log(this.volunterId,'this.volunterId')
     this.pageInfo = {
      title:'Receipt Info',
    }
    if(this.volunterId){
      this.getdata()
    }

  }
    
  getdata(){
    this.userApi.getReceiptById(this.volunterId).then((res: any) => {

      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.receiptdata = res?.result
      }
    })
  }



  close() {
    this.navigation.back()
  }

}
