import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObjectString } from 'src/app/core/helper/core.data.interface';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { ResponseData, formBuilderData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { CHURCH_PROGRESS_REPORT } from '../../helper/church-form';
import { ChurchApiService } from '../../service/church-api.service';
import { FormDocComponent } from 'src/app/shared/form/component/form-doc/form-doc.component';

@Component({
  selector: 'app-progress-report-info',
  templateUrl: './progress-report-info.component.html',
  styleUrls: ['./progress-report-info.component.scss']
})
export class ProgressReportInfoComponent implements OnInit {

  loadingData: boolean = false
  segement: ObjectString = {
    BASIC: 'Basic',
    DOCUMENT: 'Document',
  }
  currentSegment: string = this.segement.BASIC
  segmentVisited: any = { BASIC: true }
  progressData: any
  progressId: any
  showData: formBuilderData[] = [...cloneData(CHURCH_PROGRESS_REPORT).filter((a: any) => a.colName != 'status'), ...[{ colName: 'statusName', title: 'Status' }, { colName: 'status_reason', title: 'Reason' }]]
  @ViewChild('docForm') docForm: FormDocComponent | undefined;
  constructor(private modalService: ModalService, private churchApi: ChurchApiService, private alertService: AlertService) { }

  ngOnInit(): void {
  }
  setInput(data: any) {
    this.progressId = data.id || '';
    this.getDetails();
  }

  getDetails() {
    this.loadingData = true
    this.churchApi.getProgressDetails(this.progressId).then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.progressData = res.result;
        this.docForm?.setData(this.progressData.doc || [])
      }
    }).catch(() => this.alertService.showToast('Unable to get Data', 'error'
    )).finally(() => this.loadingData = false)
  }

  close() {
    this.modalService.close();
  }
}
