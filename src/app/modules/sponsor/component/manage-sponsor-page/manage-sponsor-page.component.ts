import { Component, OnInit, ViewChild } from '@angular/core';
import { UrlServices } from 'src/app/helper/class/url-services';
import { NewSponsorComponent } from '../new-sponsor/new-sponsor.component';

@Component({
  selector: 'app-manage-sponsor-page',
  templateUrl: './manage-sponsor-page.component.html',
  styleUrls: ['./manage-sponsor-page.component.scss']
})
export class ManageSponsorPageComponent implements OnInit {
  urlService: any = UrlServices.PAGE_URL;
  segement = {
    BASIC: 'Basic',
    SPONSORSHIP: 'SponsorShip',
    PAYMENT: 'Payment',
  }
  segementError: any = {
    BASIC: false,
    SPONSORSHIP: false,
    PAYMENT: false
  }
  isModifyRequest: boolean = false;
  loading: boolean = false;
  returnZero() {
    return 0;
  }

  currentSegment = this.segement.BASIC;
  pSegment: string | undefined = '';
  nSegment: string | undefined = this.segement.SPONSORSHIP;

  @ViewChild('sponsorComp') sponsorComp: NewSponsorComponent | undefined;
  constructor() { }

  ngOnInit(): void {
  }

  get validSegemnet() {
    if (this.currentSegment) {
      switch (this.currentSegment) {
        case 'Basic':
          return !this.sponsorComp?.checkAllValid();
          break;
        case 'SponsorShip':
          // if (this.staff_Form.value.isSamePresent) {
          //   return !this.presentAddress?.isValidForm();
          // } else {
          //   return (!this.presentAddress?.isValidForm() || !this.permanentAddress?.isValidForm()) ? true : false;
          // }
          break;
      }
    }
    return false;
  }

  changeSegment(s: string) {
    //@ts-ignore
    const key: any = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.currentSegment = s;
    this.pSegment = Object.values(this.segement)[Object.keys(this.segement).indexOf(key) - 1];
    this.nSegment = Object.values(this.segement)[Object.keys(this.segement).indexOf(key) + 1];
  }

  onSubmit() {

  }

}
