import { Component, OnInit, ViewChild } from '@angular/core';
import { formBuilderData } from 'src/app/helper/interface/response';
import { MasterComponent } from '../master/master.component';
import { VALIDATOR_PATTERNS } from 'src/app/helper/class/app-constant';

@Component({
  selector: 'app-general-master',
  templateUrl: './general-master.component.html',
  styleUrls: ['./general-master.component.scss']
})
export class GeneralMasterComponent implements OnInit {
  segment: any = {
    STAYED_CATEGORY: 'stayed_category',
    CHILD_STATUS: 'child_status',
    ACTIVITY_PROGRAM: 'activity program',
    PROMOTIONAL_REGION: 'Promotional Region',
    CHURCH_PROGRESS: 'Church Progress',
    ACCOUNT_CATEGORY: 'Account Category',
    ACCOUNT_SCHEME: 'Account Scheme',
    SETTINGS: 'settings'
  };
  COL: any = {};
  STAYED_CATEGORY_COL: formBuilderData[] = [
    {
      colName: 'stayed_categoryName',
      title: 'Category Name',
      validator: [{ name: 'required' }]
    }];
  PROMOTIONAL_REGION_COL: formBuilderData[] = [
    {
      colName: 'promotional_regionName',
      title: 'Region Name',
      validator: [{ name: 'required' }]
    },
    {
      colName: 'description',
      title: 'Description',
    }];
  ACTIVITY_PROGRAM_COL: formBuilderData[] = [
    {
      colName: 'activity_programName',
      title: 'Program Name',
      validator: [{ name: 'required' }]
    }];
  CHILD_STATUS_COL: formBuilderData[] = [
    {
      colName: 'child_statusName',
      title: 'Status Name',
      validator: [{ name: 'required' }]
    }];
  CHURCH_PROGRESS_COL: formBuilderData[] = [
    {
      colName: 'church_progressName',
      title: 'Church Progress',
      validator: [{ name: 'required' }]
    }
  ]
  ACCOUNT_CATEGORY_COL: formBuilderData[] = [
    {
      colName: 'account_categoryName',
      title: 'Account Category',
      validator: [{ name: 'required' }]
    }
  ]
  ACCOUNT_SCHEME_COL: formBuilderData[] = [
    {
      colName: 'account_category_id',
      title: 'Account Category',
      apiTblName: 'account_category',
      type: 'select',
      selectKeyName: 'account_categoryName',
      selectPrimaryKey: 'id',
      validator: [{ name: 'required' }]
    },
    {
      colName: 'account_schemeName',
      title: 'Account Scheme Name',
      validator: [{ name: 'required' }]
    },
    {
      colName: 'duration_in_month',
      title: 'Duration In Month',
      validator: [{ name: 'required' }, { name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER }]
    },
    {
      colName: 'max_amount',
      title: 'Maximum Amount',
      validator: [{ name: 'pattern', funValue: VALIDATOR_PATTERNS.NUMBER_FLOAT }]
    }
  ]
  currentSegment = this.segment.STAYED_CATEGORY;
  @ViewChild('masterPage') masterPage: MasterComponent | undefined
  allKeys: Array<any> = Object.keys(this.segment);
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
  tblAction(ev){}

}
