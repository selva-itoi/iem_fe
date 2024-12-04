import { Component, OnInit, ViewChild } from '@angular/core';
import { MasterComponent } from '../master/master.component';
import { formBuilderData } from 'src/app/helper/interface/response';

@Component({
  selector: 'app-magazine',
  templateUrl: './magazine.component.html',
  styleUrls: ['./magazine.component.scss']
})
export class MagazineComponent implements OnInit {

  COL: any = {};
  segement: any = {
    MAGAZINE: 'List'
  }
  MAGAZINE_COL: formBuilderData[] = [
    {
      colName: 'magazineName',
      title: 'Name',
      filter: true,
      sort: true
    },
    {
      colName: 'description',
      title: 'Description',
      filter: true,
      sort: true
    },
    {
      colName: 'magazine_code',
      title: 'Code',
      filter: true,
      sort: true
    },
    {
      colName: 'language_fk_id',
      title: 'Language',
      filter: true,
      sort: true,
      apiTblName: 'lang',
      type: 'select',
      selectKeyName: 'langName',
      selectPrimaryKey: 'id'
    },
    // {
    //   colName: 'magazine_img',
    //   title: 'Image',
    //   type: 'FILE',
    //   visible: false,
    //   filter: true,
    //   sort: true
    // },
    // {
    //   colName: 'freqMagazine_fk_id',
    //   title: 'Frequency',
    //   type: 'select',
    //   filter: true,
    //   sort: true,
    //   selectKeyName: 'frequencyMagazineName',
    //   selectPrimaryKey: 'id',
    //   data: [{ frequencyMagazineName: 'Weekly', id: 1 }, { frequencyMagazineName: 'Monthly', id: 2 }, { frequencyMagazineName: 'Yearly', id: 3 }]
    // },
    // {
    //   colName: 'status',
    //   title: 'Status',
    //   colType: 'DROPDOWN',
    //   filterCol: {
    //     type: 'DROPDOWN',
    //     data: [{ statusName: 'Active', id: 1 ,color:'success'}, { statusName: 'InActive', id: 2 ,color:'danger'}],
    //     selectKeyName: 'statusName',
    //     selectPrimaryKey: 'id'
    //   },
    //   hidden: true,
    //   filter: true,
    //   sort: true,
    // },
  ]
  currentSegment = this.segement.MAGAZINE;
  @ViewChild('masterPage') masterPage: MasterComponent | undefined
  allKeys: Array<any> = Object.keys(this.segement);
  constructor() { }

  ngOnInit(): void {
    this.allKeys.forEach((a: any) => {
      //@ts-ignore
      this.COL[a] = this[a + '_COL']
    })
  }

  returnZero() {
    return 0;
  }
  addNew(st: any) {
    this.masterPage?.edit()
  }
  changeSegment(name: any) {
    this.currentSegment = name;
  }

}
