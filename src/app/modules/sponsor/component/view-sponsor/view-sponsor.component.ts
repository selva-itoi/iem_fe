import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { ResponseData, tableBuilder, tblFilterQuery } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { SPONSORSHIP_TABLE } from '../../helper/sponsor-form';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { UntypedFormGroup } from '@angular/forms';
import { ModalService } from 'src/app/shared/service/modal.service';
import { isArray } from 'src/app/helper/class/utilityHelper';


@Component({
  selector: 'app-view-sponsor',
  templateUrl: './view-sponsor.component.html',
  styleUrls: ['./view-sponsor.component.scss']
})
export class ViewSponsorComponent implements OnInit {
  sponsor_id: number | string = '';
  initialChanges: any = {};
  sponsorshipList: Array<any> = [];
  dataForm: UntypedFormGroup = {} as UntypedFormGroup;
  sponsorshipId: string | number = '';
  showTable: boolean = false;
  sponsorData: any = {};
  dataLoading: boolean = false;
  loading: boolean = false;
  segement = {
    BASIC: 'Basic',
    ACTIVE: 'Active Sponsorship',
    SPONSORSHIP: 'Sponsorship',
    DONATION: 'Donation',
    ALLOTMENT: 'Allotment'
  }
  sponsorshipListLoading: boolean = false;
  statusData: Array<any> = [
    { label: 'Active', key: 2, color: 'info' },
    { label: 'Completed', key: 1, color: 'success' },
    { label: 'Pending', key: 3, color: 'warning' },
  ];
  sponsorshipData: any = {};
  sponsorId: string | number = '';
  segmentVisited: any = { BASIC: true };
  currentSegment: string = this.segement.BASIC;
  pageInfo: pageInfo = {} as pageInfo;
  showData: mapInfoView[] = [
    { name: 'sponsor_id', title: 'Ref ID' }, { name: 'fullName', title: 'Name' },
    { name: 'regionName', title: 'Region' }, { name: 'zoneName', title: 'Zone/State' },
    { name: "promotionalName", title: 'Church Ministry Area' }, { name: 'email_id', title: 'Email ID' },
    { name: 'mobile_no', title: 'Mobile' }, { name: 'whats_app_number', title: 'WhatsApp No' },
    { name: 'genderName', title: 'Gender' },
    { name: 'langName', title: 'Report Language' },
    { name: 'place', title: 'Place' },
    { name: 'dob', title: 'Date of Birth', type: 'DATE' },
    { name: 'do_marraige', title: 'Date of Marriage', type: 'DATE' },
    { name: 'fullAddress', title: 'Address' },
    { name: 'comment', title: 'Remarks' },
    { name: 'updated_at', title: 'Last Update', type: 'DATETIME' }
  ];
  LIST_COL = SPONSORSHIP_TABLE.slice(3, -1);
  tableConfig: tableBuilder = {
    name: '',
    addBtn: false,
    column: this.LIST_COL,
    action: [],
    isLazy: true,
  }
  activeSponsorship: any
  dataid: any;
  constructor(private sponsorApi: SponsorApiService,
    private navigation: NavigationService, private alertService: AlertService,
    private activatedRoute: ActivatedRoute,  private modalService: ModalService,
    private alertController: AlertService) { }

  ngOnInit(): void {
    this.sponsor_id = this.activatedRoute.snapshot.queryParams.id || '';
    this.pageInfo = { title: 'Sponsor Details' };
    if (this.sponsor_id) {
      this.getSponsorData();
    }
    
  }

  getSponsorData() {
    this.dataLoading = true;
    this.sponsorApi.getDetails(this.sponsor_id).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.sponsorData = res.result;
        this.dataid = this.sponsorData.id
    this.getSponsorshipList(this.dataid);
        console.log('this.sponsorData',this.sponsorData.id)
        this.mapAddress(this.sponsorData);
      }
    }).catch(err => {
      this.alertController.showToast('Content not getting loaded', 'error');
    }).finally(() => {
      this.dataLoading = false
    })

  }

  getListData = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = [{ colName: 'sponsor_id', value: this.sponsor_id, operation: 'AND' }];
    if (this.currentSegment == this.segement.ACTIVE) {
      e.whereField.push({ colName: 'status', value: 2 })
    }
    return this.activeSponsorship = await this.sponsorApi.sponsorshipGetList(e).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        res.result.data.map((a: any) => {
          a.total_alloted = a.is_monthly ? +a.total_alloted ? a.total_alloted : 'Not Yet' : 'No alloted';
        })
      }
      return res;
    });
  }

  mapAddress(a: any) {
    const full_address = [a.street, a.address, a.cityName || a.city_name, a.pName, a.vName, a.subDistrictName || a.sub_district_name, a.districtName || a.district_name, a.stateName || a.state_name, a.countryName || a.country_name, (a.pincode || '')].filter(a => a).join(',');
    this.sponsorData.fullAddress = full_address;
  }

  active() {
    const status = this.sponsorData?.status,
      payload = this.sponsorData,
      msg = status != 0 ? 'Sponsor Inactive Successfully' : 'Sponsor Active Successfully'
    if (status != 0) {
      if (this.activeSponsorship?.result?.data?.length) {
        return this.alertController.showToast('Sponsor had Active Sponsorship', 'info')
      } else {
        payload.status = 0
      }
    } else {
      payload.status = 1
    }
    this.loading = true
    this.sponsorApi.updateRequest(payload.id, payload).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.alertController.showToast(msg, 'success')
        this.close()
      }
    }).catch(() => this.alertController.showToast('Unable to save Changes', 'error'
    )).finally(() => this.loading = false)
  }

  returnZero() {
    return 0;
  }

  changeSegement(s: string) {
    this.currentSegment = s;
    //@ts-ignore
    const key: 'OUTBOX' | 'LIST' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.segmentVisited[key] = true;
  }
  close(status = false) {
    this.navigation.back();
  }

  resetSponsor() {
    this.sponsorData = {};
  }

  getSponsorshipList(id) {
    this.sponsorshipListLoading = true;
    this.sponsorApi.getAllPending(id).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.sponsorshipList = res.result;
        this.sponsorshipList.forEach((item, index) => {
          item.id = (index + 1).toString(); // Assigning 1-based index as id
      });
        if (!isArray(this.sponsorshipList)) {
          this.alertService.showToast('Oh! No Active sponsorship', 'info');
        }
      } else {
        this.alertService.showToast('Unable to get Sponsorship Data', 'info');
        this.sponsorshipList = [];
        this.sponsorshipId = '';
      }
    }).catch(err => {
      this.sponsorshipId = '';
      this.sponsorshipList = [];
      this.alertService.showToast('Unable to get Sponsorship Data', 'info');
    }).finally(() => {
      this.sponsorshipListLoading = false,
        this.dataForm.patchValue({ sponsorship_id: '' })
    })
  }


  selectSponsorship() {
  //   const id = this.dataForm.value.sponsorship_id || '';
  //   this.sponsorshipData = {};
  //   this.sponsorshipId = '';
  //   this.showTable = false;
  //   if (id) {
  //     this.sponsorshipData = this.sponsorshipList.find((a: any) => +a.id == +id);
  //     this.dataForm.patchValue({
  //       sponsorship_id: this.sponsorshipData?.id,
  //       amount: this.sponsorshipData?.amount, total_support: this.sponsorshipData.total_support
  //     });
  //     // this.changeTableSelection();
  //     this.showTable = true;
  //     this.calMaxSelection();
  //     this.initialChanges = this.apiPayload();
    // }
  }
  // apiPayload() {
  //   const payload: any = this.dataForm.value;
  //   payload.id = this.sponsorshipData.id;
  //   payload.sponsorship_module = this.sponsorshipData.sponsorship_module;
  //   payload.isChanged = this.isChangedAmount;
  //   if (this.isChangedAmount) {
  //     payload.amount = this.dataForm.value.amount;
  //     payload.total_support = this.dataForm.value.total_support;
  //   }
  //   const allotted: Array<any> = [...this.selectedData] || [];
  //   if (this.sponsorshipData.allotment) {
  //     this.sponsorshipData.allotment.filter((a: any) => +a.action == 3 || +a.action == 2).forEach((e: any) => {
  //       allotted.push(e);
  //     });
  //   }
  //   payload.last_modify_byName = this.userData.fname;
  //   payload.last_modify_by = this.userData.user_id;
  //   payload['allotmentData'] = allotted;
  //   return payload;
  // }

  openSponsorModal() {
    // this.modalService.openSearchModal({ type: 'SPONSOR', skipKey: 'sponsor_id', skipData: [], activeOnly: true }).then(async (res: any) => {
    //   if (res.sponsor_id) {
    //     if (+res.status == 2) {
    //       this.alertService.showToast("sponsor on Pending Mode,unable to process", 'info');
    //       return;
    //     }

    //     this.sponsorData = {};
    //     if (res.deleted_at != null) {
    //       this.alertService.showToast("You can't select Inactive sponsor", 'info');
    //       return;
    //     }
    //     this.resetSponsor();
    //     this.sponsorData = res || {}
    //     this.getSponsorshipList();
    //   }
    // });
  }
}
