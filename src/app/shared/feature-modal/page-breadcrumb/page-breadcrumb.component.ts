import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NavigationService } from 'src/app/core/service/navigation.service';
import { UrlServices } from 'src/app/helper/class/url-services';
import { isArray } from 'src/app/helper/class/utilityHelper';
import { pageInfo } from 'src/app/helper/interface/menu-interface';


@Component({
  selector: 'app-page-breadcrumb',
  templateUrl: './page-breadcrumb.component.html',
  styleUrls: ['./page-breadcrumb.component.scss']
})
export class PageBreadcrumbComponent implements OnInit, OnDestroy {
  @Input() pageInfo: pageInfo | any = {} as pageInfo;
  @Input() isModal: boolean = false;
  @Output() btnClickEvent: EventEmitter<any> = new EventEmitter();
  _bsModalRef: BsModalRef = {} as BsModalRef;
  urlService = UrlServices.PAGE_URL;
  constructor(private navServe: NavigationService,
    private route: Router,
    private injector: Injector) { }
  ngOnDestroy(): void {
    this._bsModalRef = {} as BsModalRef;
  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.isModal) {
        this._bsModalRef = this.injector.get<BsModalRef>(BsModalRef);
      }
    }, 700);
    // if (this.pageInfo.button && !isArray(this.pageInfo.button)) {
    //   this.pageInfo.button = [this.pageInfo.button];
    // }
  }

  btnClick(btn) {
    if (btn.url) {
      this.route.navigate([btn.url], { queryParams: btn?.queryParams || {} })
    }
    this.btnClickEvent.emit(btn);
  }
  close() {
    if (this.isModal) {
      this._bsModalRef.hide();
    } else
      this.navServe.back();
  }

  isArray(data) {
    return Array.isArray(data);
  }
}
