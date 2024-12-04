import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { modifyApi } from 'src/app/helper/interface/modifyRequest';
import { modifyActionType } from 'src/app/helper/interface/response';
import { Concrete, dynamicObjectKey, modulInterface } from 'src/app/helper/interface/user';
import { ModifyService } from 'src/app/helper/service/modify.service';
import { ModalService } from '../../service/modal.service';

@Component({
  selector: 'tab-head',
  templateUrl: './tab-head.component.html',
  styleUrls: ['./tab-head.component.scss']
})
export class TabHeadComponent implements OnInit {
  @Input() segment: dynamicObjectKey = {} as dynamicObjectKey;
  @Input() segmentError: dynamicObjectKey = {} as dynamicObjectKey;
  @ContentChild("tabBody") public tabBody!: TemplateRef<any>;
  @ViewChild("tabFooter", { static: false }) tabFooter: TemplateRef<any> | any
  @ViewChild("modifyAlert", { static: false }) modifyAlert: TemplateRef<any> | any
  @Input() showSubmit: boolean = true;
  @Input() disabledBtn: boolean = false;
  @Input() loading: boolean = false;
  @Input() type: modifyActionType = 'SUBMIT';
  @Input() modifyData: modifyApi = {} as modifyApi;
  @Input() module: Concrete<keyof modulInterface> = 'STAFF';
  @Input() data: any = {};
  @Input() bsModalRef: BsModalRef = {} as BsModalRef;
  segmentVisited: any = {} as any;
  defaultFragment: any = '';
  queryparam: any;
  @Output() onSelect: EventEmitter<{ key: string, visited: any }> = new EventEmitter();
  @Output() onSubmitEvent: EventEmitter<{ key: any }> = new EventEmitter();
  @Input() checkValidSegment: ((args?: any) => Boolean) | any;
  @Input() getModificationPayload: ((args?: any) => modifyApi) | any;
  @Input() getApiApprove: ((args?: any) => any) | any;
  @Input() public set initial(s: any) {
    if (s) {
      this.defaultFragment = s;
      this.toSelectSegment(s);
    }
  }
  currentSegment: string = '';
  currentKey: string = '';
  currentRoute: any;
  hideTabMenu = false;
  constructor(private activateRoute: ActivatedRoute, private router: Router,
    private modalService: ModalService,
    private nav: NavigationService,
    private modifyApi: ModifyService) { }

  ngOnInit(): void {
    const keys = Object.keys(this.segment);
    if (!this.currentKey) {
      this.currentKey = keys[0] || '';
    }
    this.queryparam = this.activateRoute.snapshot.root.queryParams;
    const full_url = this.router.url || '';
    this.currentRoute = full_url.split('#')[0] || ''
    const frg = this.activateRoute.snapshot.fragment,
      a: any = frg ? frg.toUpperCase() : null;
    if (a) {
      this.toSelectSegment(this.segment[a], true);
    } else {
      if (!this.defaultFragment) {
        this.defaultFragment = Object.values(this.segment)[0] || '';
        this.toSelectSegment(this.defaultFragment, true);
      }
      const key: any = Object.keys(this.segment).find((k: any) => this.segment[k] === this.defaultFragment);
      if (!this.modalService.isModalOpen()) {
        history.pushState('', '', `${this.currentRoute}#${key?.toLowerCase()}`)
      }
    }
  }
  getHideStatus() {
    const keys = Object.keys(this.segment);
    return keys.length == 1
  }


  toSelectSegment(s: string, silent = false) {
    if (!s) {
      return;
    }
    const key: any = Object.keys(this.segment).find((k: any) => this.segment[k] === s);
    this.navigateSegment(key, silent);
  }

  navigateSegment(key: any, silent = false) {
    this.currentSegment = this.segment[key];
    this.currentKey = key;
    if (!silent && this.currentRoute && !this.modalService.isModalOpen()) {
      const url = this.currentRoute.split('?')[0] || '';
      this.router.navigate([url], { queryParams: this.queryparam, fragment: key.toLowerCase() })
    }
    this.segmentVisited[key] = true;
    this.onSelect.emit({ key: this.currentSegment, visited: this.segmentVisited });
  }

  nextSegment() {
    if (!this.isLastSegment()) {
      const key: Array<any> = Object.keys(this.segment),
        nextIndex = key.findIndex((k: any) => this.segment[k] === this.currentSegment) + 1;
      this.navigateSegment(key[nextIndex]);
    }
  }
  prevSegment() {
    if (!this.isFirstSegment()) {
      const key: Array<any> = Object.keys(this.segment),
        nextIndex = key.findIndex((k: any) => this.segment[k] === this.currentSegment) - 1;
      this.navigateSegment(key[nextIndex]);
    }
  }

  lastSegment() {
    return Object.keys(this.segment).pop();
  }
  isLastSegment() {
    const last_key: any = Object.keys(this.segment).pop();
    return this.segment[last_key] == this.currentSegment
  }
  isFirstSegment() {
    const last_key: any = Object.keys(this.segment);
    return this.segment[last_key[0]] == this.currentSegment;
  }
  returnZero() {
    return 0;
  }

  checkSegmentStatus(ke: any = this.currentKey) {
    return this.segmentError[ke] = this.checkValidSegment?.(ke) == false;
  }

  checkAllError() {
    Object.keys(this.segment).forEach((key: any) => {
      const res = this.checkValidSegment?.(key);
    });
    return Object.values(this.segmentError).some((a: any) => a == true);
  }


  isSubmitted: boolean = false;
  onSubmit() {
    this.isSubmitted = true;
    const allError = this.checkAllError();
    if (allError) {
      return;
    }
    if (this.type == 'MODIFICATION_SUBMIT') {
      this.saveModification();
    } else
      this.onSubmitEvent.emit({ 'key': 'SUBMIT' });
  }

  saveModification() {
    const payload = this.getModificationPayload?.('');
    this.loading = true;
    this.modifyApi.saveModification(payload, payload.request_data, {}, 'NEW').then((res) => {
      if (res) {
        this.disabledBtn = true;
        this.onSubmitEvent.emit({ key: true });
      }
    }).finally(() => {
      this.loading = false;
    })
  }

  close(status: boolean) {
    if (!isEmptyObj(this.bsModalRef)) {
      this.bsModalRef.hide();
      this.bsModalRef.content.onClose.next(status);
    } else {
      this.nav.back();
    }
  }
  approveRequest = (payload: any) => {
    return this.getApiApprove(payload);
  }
}