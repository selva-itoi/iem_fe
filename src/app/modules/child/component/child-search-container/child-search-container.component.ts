import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RESPONSE_CODE, VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';
import { ResponseData } from 'src/app/helper/interface/response';
import { ModalService } from 'src/app/shared/service/modal.service';
import { ChildApiService } from '../../service/child-api.service';

@Component({
  selector: 'app-child-search-container',
  templateUrl: './child-search-container.component.html',
  styleUrls: ['./child-search-container.component.scss']
})
export class ChildSearchContainerComponent implements OnInit {
  @Output() onComplete: EventEmitter<any> = new EventEmitter();
  @Input() type: 'CHILD' | 'PARENT' = 'PARENT';
  @Input() profileType : 'MK' | 'HOME' | undefined;
  @Input() parent_type: number = 1;
  @Input() showResult: boolean = false;
  loading: boolean = false;
  searchControl: UntypedFormControl = new UntypedFormControl('', [Validators.pattern(VALIDATOR_PATTERNS.AADHAR_VALIDATOR)]);
  searchSub: Subscription = {} as Subscription;
  searchResult: Array<any> = []
  constructor(private modalService: ModalService, private childApi: ChildApiService) { }

  ngOnInit(): void {
    if (typeof this.searchSub.unsubscribe == "function") {
      this.searchSub?.unsubscribe();
    }
    this.searchSub = this.searchControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(v => {
      if (this.searchControl.valid && v) {
        this.findParents({ aadhar: v, is_address: false });
      }
    })
  }
  findParents(cond: any) {
    if (cond) {
      this.loading = true;
      if (this.type == 'CHILD') {
        cond.is_address = true;
      }
      cond.family_type = this.parent_type == 3 ? 2 : 1;
      this.childApi.getParentSearch(cond).then(async (res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          res.result?.parents?.map((a:any) => {
            if(a.staff_fk_id){
              a.occupation = 'missionary';
            }
            return a;
          })
          this.searchResult = res.result.parents || [];
          this.onComplete.emit(res.result);
        }
      }).finally(() => this.loading = false)
    }
  }

  openStaffModal() {
    this.modalService.openSearchModal({ type: 'STAFF' }).then(async (res: any) => {
      if (res) {
        this.findParents({ staff_emp_id: res.staff_emp_id, staff_fk_id: res.id });
      }
    });
  }
}