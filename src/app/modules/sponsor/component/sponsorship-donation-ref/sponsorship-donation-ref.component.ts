import { Component, Input, OnInit } from '@angular/core';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { tableBuilder, tableColum, tblFilterQuery } from 'src/app/helper/interface/response';
import { SPONSORSHIP_TABLE } from '../../helper/sponsor-form';
import { SponsorApiService } from '../../service/sponsor-api.service';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';

@Component({
  selector: 'sponsorship-donation-ref',
  templateUrl: './sponsorship-donation-ref.component.html',
  styleUrls: ['./sponsorship-donation-ref.component.scss']
})
export class SponsorshipDonationRefComponent implements OnInit {
  @Input() type: 'DONATION' | 'SPONSORSHIP' = 'DONATION';
  @Input() ref_id: any;
  // LIST_COL: tableColum[] = [...[{colName:'promotionalName',title :'Church Ministry Area'},{ colName: 'amount', title: 'Donate Amount' }, { colName: 'sponsorship_amount', title: 'Sponsorship Amount' }], ...cloneData(SPONSORSHIP_TABLE)?.splice(8, 1)]
  LIST_COL: tableColum[] = [...[{colName:'sponsorship_moduleName',title :'Purpose'},{ colName: 'amount', title: 'Donate Amount' },], ...cloneData(SPONSORSHIP_TABLE)?.splice(8, 1)]
  tableConfig: tableBuilder = {
    name: '',
    addBtn: false,
    column: this.LIST_COL,
    action: [],
    isLazy: true,
  }
  constructor(private sponsorApi: SponsorApiService) { }

  ngOnInit(): void {
  }
  getListDonation = async (e: tblFilterQuery): Promise<any> => {
    e.whereField = [];
    if (this.type == 'DONATION') {
      e.whereField?.push({ colName: 'donation_fk_id', value: this.ref_id });
    } else {
      e.whereField?.push({ colName: 'sponsorship_fk_id', value: this.ref_id });
    }
    return await this.sponsorApi.getDonationSponsorShip(e)
    // .then((res: any) => {
    //   if (res.statusCode == RESPONSE_CODE.SUCCESS) {
    //     res.result.data.map((a: any) => {
    //       a.payment_statusName = 
    //     })
    //   }
    //   return res;
    // });
  }
}
