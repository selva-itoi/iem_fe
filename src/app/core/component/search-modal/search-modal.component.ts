import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { cloneData, isArray } from 'src/app/helper/class/utilityHelper';
import { ResponseData, whereField } from 'src/app/helper/interface/response';
import { AccountApiService } from 'src/app/modules/account/service/account-api.service';
import { ChildApiService } from 'src/app/modules/child/service/child-api.service';
import { ChurchApiService } from 'src/app/modules/church/service/church-api.service';
import { MasterApiService } from 'src/app/modules/master/service/master-api.service';
import { SponsorApiService } from 'src/app/modules/sponsor/service/sponsor-api.service';
import { StaffApiService } from 'src/app/modules/staff/service/staff-api.service';
import { UserApiService } from 'src/app/modules/user/services/user-api.service';
import { searchModal, searchModalResult, searchType } from 'src/app/shared/interface/modal-interface';


@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss']
})
export class SearchModalComponent implements OnInit, OnDestroy {
  data: searchModal = {} as searchModal;
  loading: boolean = false;
  searchSub: Subscription = {} as Subscription;
  public onClose: Subject<boolean> | any;
  searchControl: UntypedFormControl = {} as UntypedFormControl;
  resultData: searchModalResult[] = [];
  filterForm: UntypedFormGroup = new UntypedFormGroup({});
  filterCol: any = [];
  DATA_LOADING: any = {};
  FORM_SUPPORT_DATA: any = {};
  constructor(private _bsModalRef: BsModalRef,
    private sponsorApi: SponsorApiService,
    private childApi: ChildApiService,
    private churchApi: ChurchApiService,
    private masterApi: MasterApiService,
    private userApi: UserApiService,
    private staffApi: StaffApiService,
    private accountApi: AccountApiService,) { }


  public ngOnInit(): void {
    this.onClose = new Subject();
    this.initForm();
  }


  initForm() {
    const f: any = {};
    this.filterCol.forEach((a: any) => f[a.tblName] = new UntypedFormControl(""));
    this.filterForm = new UntypedFormGroup(f);
    this.searchControl = new UntypedFormControl();
    if (typeof this.searchSub.unsubscribe == "function") {
      this.searchSub?.unsubscribe();
    }
    this.searchSub = this.searchControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(v => {
      if (v) {
        this.searchData(v);
      } else {
        this.resultData = [];
      }
    })
  }


  getFullData(tblName: any, cond = [], colName: any = '', apiFun: string = '') {
    if (tblName || apiFun) {
      this.DATA_LOADING[tblName] = true;
      let api: any;
      if (apiFun) {
        //@ts-ignore
        api = this.masterApi[apiFun](cond);
      } else {
        api = this.masterApi.getFullData(tblName, cond, false);
      }
      api.then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          let re: any = res.result;
          this.data.whereField?.forEach((a: any) => {
            if (a.colName == tblName) {
              const val = isArray(a.value) ? a.value : [a.value];
              const cond = val.filter((a: any) => +a > 0);
              if (cond.length) {
                re = [];
                res.result.forEach((b: any) => {
                  if (a.value.includes(b.id)) {
                    re.push(b);
                  }
                })
              }
            }
          })
          this.FORM_SUPPORT_DATA[tblName] = re;
        } else {
          this.FORM_SUPPORT_DATA[tblName] = [];
        }
      }).finally(() => this.DATA_LOADING[tblName] = false)
    }
  }

  mapFormValue() {
    if (this.data.filterShow) {
      switch (this.data.type) {
        case 'STAFF':
          this.filterCol = [{ tblName: 'zone' }, { tblName: 'department', colName: 'dName' }];
          break;
          case 'STAFF_PAYROLL':
          this.filterCol = [{ tblName: 'trust',colName : 'trustName' }, { tblName: 'payroll_group', colName: 'payroll_groupName' }];
          break;
        case 'SPONSOR':
          this.filterCol = [{ tblName: 'promotional_office' }];
          break;
        case 'CHILD':
          this.filterCol = [{ tblName: 'home' }];
          break;
        case 'CHURCH':
          this.filterCol = [{ tblName: 'zone' }, { tblName: 'church' }];
          break;
        case 'ACCOUNT':
          this.filterCol = [{ tblName: 'account_category' },{ tblName: 'account_scheme' } ];
          break;
          case 'VOLUNTEER':
            this.filterCol = [{ tblName: 'promotional_office' }];
           break;
      }
      this.filterCol.forEach((a: any) => this.getFullData(a.tblName, [], a.colName || a + 'Name'));
    }
    this.initForm();
  }

  setInput(data: any) {
    this.data = data;
    this.mapFormValue();
    this.searchData(null);
  }
  removeUnderscore(t: string) {
    return t.replace(/_/g, " ");
  }

  mapToResultData(data: any, type: searchType = 'STAFF') {
    const mapElement: searchModalResult | any = {};
    switch (this.data.type) {
      case 'STAFF':
        mapElement.avatarPic = 'profile_img_path';
        mapElement.avatarTxt = 'name';
        mapElement.mutedText = 'zoneName+dName';
        mapElement.detail = 'name+last_name';
        mapElement.topEndText = 'staff_emp_id';
        mapElement.bottomEndText = 'staff_cross_id';
        mapElement.active = 'deleted_at';
        break;
        case 'STAFF_PAYROLL':
        mapElement.avatarPic = 'profile_img_path';
        mapElement.avatarTxt = 'name';
        mapElement.mutedText = 'payroll_groupName+trustName';
        mapElement.detail = 'name+last_name';
        mapElement.topEndText = 'staff_emp_id';
        mapElement.bottomEndText = 'zoneName';
        mapElement.active = 'deleted_at';
          break;

      case 'SPONSOR':
        mapElement.avatarPic = 'profile_img_path';
        mapElement.avatarTxt = 'name';
        mapElement.mutedText = 'promotionalName';
        mapElement.detail = 'name';
        mapElement.topEndText = 'sponsor_id';
        mapElement.bottomEndText = '';
        mapElement.active = 'deleted_at';
        break;
      case 'CHILD':
        mapElement.avatarPic = 'profile_img_path';
        mapElement.avatarTxt = 'name';
        mapElement.mutedText = 'homeName';
        mapElement.detail = 'name';
        mapElement.topEndText = 'child_id';
        mapElement.bottomEndText = 'mobile_no';
        mapElement.active = 'deleted_at';
        break;
      case 'CHURCH':
        mapElement.avatarPic = 'profile_img_path';
        mapElement.avatarTxt = 'church_name';
        mapElement.mutedText = 'zoneName';
        mapElement.topEndText = 'church_id';
        mapElement.bottomEndText = 'church_typeName';
        mapElement.detail = 'church_name';
        mapElement.active = 'deleted_at';
        break;
      case 'CHURCH_MEMBER':
        mapElement.avatarPic = 'profile_img_path';
        mapElement.avatarTxt = 'name';
        mapElement.mutedText = 'mobile_no';
        mapElement.detail = 'place';
        mapElement.topEndText = 'church_id';
        mapElement.bottomEndText = 'email_id';
        mapElement.active = 'deleted_at';
        break;
      case 'ACCOUNT':
        mapElement.avatarPic = 'profile_img_path';
        mapElement.avatarTxt = 'accountName';
        mapElement.mutedText = 'account_code';
        mapElement.detail = 'typeName';
        mapElement.topEndText = 'account_categoryName';
        mapElement.bottomEndText = 'typeName';
        mapElement.active = 'statusName';
        break;
        case 'VOLUNTEER':
          mapElement.avatarPic = 'profile_img_path';
          mapElement.avatarTxt = 'volunteerName';
          mapElement.mutedText = 'volunterr_id';
          mapElement.detail = 'volunteerName';
          mapElement.topEndText = '';
          mapElement.bottomEndText = 'mobile_no';
          mapElement.active = 'statusName';
          break;
    }
    const dt = ['avatarPic', 'avatarTxt', 'mutedText', 'topEndText', 'bottomEndText', 'active', 'detail'];
    data.forEach((a: any) => {
      const s: any = {};
      dt.forEach(b => {
        const spiV = mapElement[b].split('+') || [];
        s[b] = (a[spiV[0]] || '') + (spiV[1] ? '   <span class="text-primary">' : '') + (spiV[1] ? a[spiV[1]] || '' + '</span>' : '');
      })
      this.resultData.push({ ...s, ...a });
    });
  }
  searchChange(value: any) {
    if (value.value) {
      this.searchData(value.value);
    } else {
      this.searchData(null)
    }

  }

  searchData(terms: string | null, initial: boolean = false) {
    this.loading = true;
    const where: whereField[] = this.data.whereField ? cloneData(this.data.whereField) : [];
    if (this.data.activeOnly) {
      if (isArray(where)) {
        where?.push({ colName: 'deleted_at', operation: 'AND', value: null })
      }
    }
    if (this.data.skipKey && this.data.skipData) {
      if (isArray(where)) {
        where?.push({ colName: this.data.skipKey, operation: 'AND', value: this.data.skipData })
      }
    }
    if (this.filterCol.length) {
      this.filterCol.forEach((a: any) => {
        const v = this.filterForm.value[a.tblName] || '';
        if (v) {
          const f = where.findIndex((c: any) => c.colName == a.tblName);
          if (f > -1) { where.splice(f, 1); }
          where?.push({ colName: a.tblName, value: v, operation: 'AND' });
        }
      })
    }
    let api: any;
    switch (this.data?.type) {
      case 'STAFF':
        api = this.staffApi.searchStaff(terms, where);
        break;
      case 'SPONSOR':
        api = this.sponsorApi.search(terms, where);
        break;
      case 'CHILD':
        api = this.childApi.search(terms, where);
        break;
      case 'CHURCH':
        api = this.churchApi.search(terms, where);
        break;
      case 'CHURCH_MEMBER':
        api = this.churchApi.searchMember(terms, where);
        break;
      case 'ACCOUNT':
        api = this.accountApi.searchAccount(terms, where);
        break;
        case 'VOLUNTEER':
          api = this.userApi.searchVolunteer(terms, where);
          break;
    }
    api.then((res: ResponseData | any) => {
      this.resultData = [];
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.mapToResultData(res.result);
      }
    }).finally(() => {
      this.loading = false;
    })
  }

  public onConfirm(data: any): void {
    this.onClose.next(data);
    this._bsModalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this._bsModalRef.hide();
  }

  ngOnDestroy(): void {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }
}