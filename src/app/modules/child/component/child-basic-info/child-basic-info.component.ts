import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { cloneData } from 'src/app/helper/class/utilityHelper';
import { mapInfoView } from 'src/app/helper/interface/form-interface';
import { ResponseData } from 'src/app/helper/interface/response';
import { ModalService } from 'src/app/shared/service/modal.service';
import { CHILD_BASIC_FORM } from '../../helper/child-form';
import { ChildApiService } from '../../service/child-api.service';

@Component({
  selector: 'app-child-basic-info',
  templateUrl: './child-basic-info.component.html',
  styleUrls: ['./child-basic-info.component.scss']
})
export class ChildBasicInfoComponent implements OnInit {
  @Input() childId: any;
  public onClose: Subject<boolean> = new Subject();
  childData: any;
  loadingData: boolean = false
  isModal: boolean = false;
  showData: mapInfoView[] = [...cloneData(CHILD_BASIC_FORM).splice(0, 13), { title: 'Last Update', name: 'updated_at', type: 'DATE' }]
  constructor(private childApi: ChildApiService, private modalService: ModalService) { }
  ngOnInit(): void {
    if (this.childId) {
      this.getChild(this.childId);
    }
  }

  setInput(data: any) {
    this.isModal = true;
    this.getChild(data.child_id);
  }

  getChild(id: string | number) {
    if (id) {
      this.loadingData = true;
      this.childApi.getBasic(id).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          this.childData = res.result;
        }
      }).finally(() => {
        this.loadingData = false;
      })
    }
  }
  closeModal() {
    this.modalService.close();
  }
}
