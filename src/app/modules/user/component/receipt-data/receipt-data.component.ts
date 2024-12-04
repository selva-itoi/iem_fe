import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, formBuilderData, tableBuilder, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { RECEIPT_VIEW } from '../../helper/user_form';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { UserApiService } from '../../services/user-api.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { AlertService } from 'src/app/helper/service/alert.service';

@Component({
  selector: 'app-receipt-data',
  templateUrl: './receipt-data.component.html',
  styleUrls: ['./receipt-data.component.scss']
})
export class ReceiptDataComponent implements OnInit {
  volunterId: any;

  pageInfo: pageInfo = {} as pageInfo
  receiptdata: any;
  receiptbookdata:any;
  loading:boolean=false;
  pendingstatus:any;
  arr: any[] = [];
  arr1: any[] = []
  tabledata: any;
  totaldata: any;
  data: any[] = []
  totalreceiptdata: any;
  editindex: any;



  constructor(private activateRoute: ActivatedRoute,private alertService: AlertService, private modalService: ModalService, private navigation: NavigationService, private userApi: UserApiService) { }
  RECEIPT_SNO: formBuilderData[] = [
    {
      colName: 'Donation_id',
      title: 'Receipt Id',
      filter: true,
      sort: true,
    },]


  // const mergedArray = [...dataArray, ...Object.values(form.value)];
  RECEIPT_BOOK: tableColum[] = [...cloneData(this.RECEIPT_SNO), ...cloneData(RECEIPT_VIEW)]
  tableConfig: tableBuilder = {
    name: 'Receipt List',
    action: [],
    column: this.RECEIPT_BOOK,
    showFilter: true,
    isLazy: true
  }

  ngOnInit(): void {
    this.volunterId = this.activateRoute.snapshot.queryParams['id'] || ''
    console.log(this.volunterId, 'this.volunterId')
    this.pageInfo = {
      title: 'Receipt Info',
    }
    if (this.volunterId) {
      this.getdata()
    }
  }
  

  getdata() {


    this.userApi.getReceiptById(this.volunterId).then((res: any) => {

      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.receiptdata = res?.result
       this.userApi.getReciptdata( this.receiptdata?.volunteer_fk_id).then((res: any) => {
          this.receiptbookdata = res?.result
          this.pendingstatus = this.receiptbookdata.find((a: any) => 2 == a.status);

          
          // for(var i=0;i<this.receiptbookdata.length;i++){
          //   if(this.receiptbookdata[i].status ==2 || this.receiptbookdata[i].status ==)
          // }
      //  if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
      //    this.receiptdata = res?.result?.Data?.[0]
      //    let a = this.receiptdata.start_from
      //    let b = this.receiptdata.end_no
      //    for (var i = a; i <= b; i++) {
      //      const arD: any = { receipt_data: `${this.receiptdata.prefix}${i}` };
      //      this.arr.push(arD)
      //    }
      //    for (let i = 0; i < this.arr.length; i++) {
      //      let mergedObject = { ...this.arr[i], ...res?.result?.Donation_Data[i] };
      //      this.data.push(mergedObject);
      //    }
 
      //  }
     })
      }
    })





    // this.userApi.getReceiptById(this.volunterId).then((res: any) => {
    // this.userApi.volunteerReceiptById(this.volunterId).then((res: any) => {
  
  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    return this.userApi.getReciptlist(e).then((res: any) => {
      if (res?.statusCode == RESPONSE_CODE.SUCCESS) {
        this.tabledata = res?.result?.data
      }
      return res
    })
  }
  apiPayload(){
     const payload =this.receiptdata
     payload.status = 1
     return payload
  }


  complete(){
    this.userApi.saveVolunterReceipt(this.apiPayload()).then((res: any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertService.showToast('Receipt Saved Successfully', 'success')
        this.close()
      } else {
        this.alertService.showToast('Unable to Save data', 'error')
      }
    }).catch(() => {
      this.alertService.showToast('Unable to Save data', 'error')
    }).finally(() =>
     this.loading = false
     )
  }

  



  updatereceiptdata() {

    //     this.userApi.Receiptdata(this.data).then((res:any) => {

    // })
  }
  




  blockreceipt( i: number) {
    this.modalService.openConfirmDialog({ message: '', title: 'You want to Block This Receipt ?', 'isFormField': true, formField: [{ colName: 'remark', title: 'Remarks', validator: [{ name: 'required' }] }] }).then((res: any) => {
      const payload = this.receiptbookdata[i];
      payload.remarks = res?.remark
      payload.status = 3

      if (res) {
        this.userApi.updateReceiptdata(payload)
      }

    })

  }



  close() {
    this.navigation.back()
  }
}



