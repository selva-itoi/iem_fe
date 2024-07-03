import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { infoModalData } from 'src/app/core/helper/core.data.interface';


@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit {

  data: infoModalData | null = {
    title: 'Info',
    content: '',
    btn: 'OK'
  };
  type: 'FORM' | 'DEFAULT' = 'DEFAULT';
  mode : 'VIEW' | 'MODIFICATION' ='VIEW'
  public onClose: Subject<boolean> = new Subject();
  constructor(private _bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  setInput(data: infoModalData) {
    this.data = data;
    if (data.formData) {
      this.type = 'FORM';
      this.mode = data?.mode || 'VIEW'
    }
  }

  public onCancel(): void {
    this.onClose.next(false);
    this._bsModalRef.hide();
  }
}
