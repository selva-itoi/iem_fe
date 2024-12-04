import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { pageInfo } from 'src/app/helper/interface/menu-interface';
import { tblFilter } from 'src/app/helper/interface/response';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { AuthService } from 'src/app/helper/service/auth.service';
@Component({
  selector: 'app-church-collection',
  templateUrl: './church-collection.component.html',
  styleUrls: ['./church-collection.component.scss']
})
export class ChurchCollectionComponent implements OnInit {

  urlService: any = UrlServices.PAGE_URL;
  globalWhere: tblFilter[] = [];
  pageInfo: pageInfo = {
    title: 'Church Collection'
  }
  type: 'DONATION' | 'COLLECTION' = 'DONATION'
  segement = {
    LIST: 'donation list',
    PENDING: 'pending',
    MODIFYREQUEST: 'request'
  }
  segmentVisited: any = {}
  currentSegment: string = '';
  globalWherePending: tblFilter[] = [];
  modifyModule: Concrete<keyof modulInterface>[] = ['DONATION_ALLOTMENT']
  constructor(private activateRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.type = this.activateRoute.snapshot.queryParams['type'] || 'DONATION';
    this.globalWherePending = [{ colName: 'status', value: 1 }];
  }
}
