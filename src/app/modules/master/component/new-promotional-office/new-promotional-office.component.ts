import { Component, OnInit, ViewChild } from '@angular/core';
import { RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { formBuilder, formBuilderData } from 'src/app/helper/interface/response';
import { FormGeneratorComponent } from 'src/app/shared/form/component/form-generator/form-generator.component';
import { ModalService } from 'src/app/shared/service/modal.service';
import { MasterApiService } from '../../service/master-api.service';
import { AlertService } from 'src/app/helper/service/alert.service';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { StaffApiService } from 'src/app/modules/staff/service/staff-api.service';

@Component({
  selector: 'app-new-promotional-office',
  templateUrl: './new-promotional-office.component.html',
  styleUrls: ['./new-promotional-office.component.scss']
})
export class NewPromotionalOfficeComponent implements OnInit {
  pageInfo: pageInfo = {} as pageInfo;
  inChargeData:any
  loading:boolean = false;
  // basicFormData: formBuilder[] = []

  basicFormData: formBuilderData[] = [


    {
      colName: 'regionName',
      title: 'Region Name',
      readonly:true,
      // validator: [{ name: 'required', error: 'Region should not be blank' }]
  },
  {
      colName: 'zoneName',
      title: 'Zone/State Name',
      readonly:true,
  },

    {
      colName: 'email_id',
      title: 'Email',
      readonly:true,
    
    },
    {
      colName: 'mobile_no',
      title: 'Mobile',
      readonly:true,

    },
    {
      colName: 'mobile_no',
      title: 'WhatsApp Number',
      readonly:true,

    },

    {
      colName: 'name',
      title: 'Contact Name',
      readonly:true,

    },
  ]
  addressFormData: formBuilderData[] = [

    {
      colName: 'street',
      title: 'Address Line 1',
      readonly:true,

    },
    {
      colName: 'address',
      title: 'Address Line 2',
      readonly:true,

    },
    {
      colName: 'address_line',
      title: 'Address Line 3',
      readonly:true,
    },
    // {
    //   colName: 'city_name',
    //   filter: true,
    //   sort: true,
    //   visible: false,
    //   title: 'City Name',
    //   readonly:true,
    // },
    {
      colName: 'countryName',
      title: 'Country',
     readonly:true
      },
  {
      colName: 'stateName',
      title: 'State',
      readonly:true
  },
  {
      colName: 'districtName',
      title: 'District Name',
      readonly:true,
      // event: { name: 'change', apiTblName: 'city', valueAssign: 'city' }
  },
    {
      colName: 'pincode',
      title: 'Pincode',
      readonly:true,

      // validator: [
      //   { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    // {
    //   colName: 'in_chargeName',
    //   filter: true,
    //   sort: true,
    //   visible: true,
    //   hidden: true,
    //   title: 'In charge',
    // },
    // {
    //   colName: 'in_charge_mobile_no',
    //   filter: true,
    //   sort: true,
    //   visible: true,
    //   hidden: true,
    //   title: 'In charge Mobile',
    // },
    // {
    //   colName: 'report_to_promotional_id',
    //   filter: true,
    //   sort: true,
    //   visible: true,
    //   hidden: true,
    //   title: 'Report To',
    // },
  ]
  BankData: formBuilderData[] = [
      {
      colName: 'promotionalName',
      title: 'Church Ministry Area',
      validator: [{ name: 'required' }]
    },
    { groupTitle:'IEM Bank Details',
      colName: 'bank_account_name',
      title: 'Account Name',
      validator: [{ name: 'required' }],

      // validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
  },
  {
      colName: 'bank_account_no',
      title: 'Account Number',
      validator: [{ name: 'required' }],

      // validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
  },
  {
    colName: 'bank_name',
    title: 'Bank Name',
    validator: [{ name: 'required' }],

    // validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
},
  {
      colName: 'bank_address',
      title: 'Branch',
      validator: [{ name: 'required' }],
  },
  {
      colName: 'bank_ifc_code',
      title: 'IFSC Code',
      // validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }],
      validator: [{ name: 'required' }],
      event: { name: 'change', isCallback: true },
      visible: false
  },
  ];

  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;
  @ViewChild('bankForm') bankForm: FormGeneratorComponent | undefined;
  @ViewChild('addressForm') addressForm: FormGeneratorComponent | undefined;


  editid:any;

  constructor(private modalService: ModalService,private masterapi:MasterApiService, private alertService: AlertService,
    private navigation: NavigationService,private activateRoute: ActivatedRoute,private staffapi: StaffApiService) { }

  ngOnInit(): void {
    this.editid = this.activateRoute.snapshot.queryParams['id']
    console.log(this.editid,'this.editid')
    this.pageInfo = {
      title: this.editid? 'Update Church Ministry Area' :'New Church Ministry Area'
      }
      if(this.editid){
        this.editdata()
      }
    }

    editdata(){
      this.masterapi.getPromotionaloffice(this.editid).then((a:any)=>{
        const data = a?.result
        console.log(data,'editdata')
        // this.inChargeData=data
        setTimeout(() => {
          this.bankForm?.setData(data)
        }, 1000);
        this.staffapi.getStaffDetails(data.staff_fk_id).then((a:any)=>{
        this.inChargeData=a?.result
        setTimeout(() => {
          this.basicForm?.setData( this.inChargeData)
          this.addressForm?.setData( this.inChargeData?.address[0])
        }, 1000);
        })
      })
    }

    openStaffModal() {
      this.modalService.openSearchModal({ type: 'STAFF' }).then(async (res: any) => {
        if (res) {
          this.inChargeData = res;
          this.staffapi.getStaffDetails(this.inChargeData.id).then((a:any)=>{
            this.basicForm?.setData(a?.result)
            this.addressForm?.setData(a?.result.address[0])


          })
          // this.dataForm.patchValue({ staff_incharge_fk_id: res.id })
        }
      });
    }
    apiPayload(){
     const data:any =  {}
     data.staff_fk_id =  this.inChargeData.id
     data.region =  this.inChargeData.region
     data.zone =  this.inChargeData.zone
     data.email_id=  this.inChargeData.email_id


        // data.officeaccount = this.inChargeData.name
     data.bank= this.bankForm?.apiPayload()
     data.promotionalName = this.bankForm?.apiPayload().promotionalName
        if (this.editid) {
          data.id = this.editid
        }
        return data
    }
    onSubmit(){
      if (!this.basicForm?.isValid()) { return }
      if(!this.inChargeData){return}
      this.loading = true
      this.masterapi.savePromotionaloffice(this.apiPayload()).then((res: any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.alertService.showToast('Church Ministry Area Successfully', 'success')
          this.close()
        } else {
          this.alertService.showToast('Unable to Save data', 'error')
        }
      }).catch(() => {
        this.alertService.showToast('Unable to Save data', 'error')
      }).finally(() => this.loading = false)
    }
  

      // this.masterapi.savePromotionaloffice(this.apipayload())

    

      close() {
        this.navigation.back();
      }
  }


