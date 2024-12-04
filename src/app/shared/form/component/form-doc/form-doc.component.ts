import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { formBuilderData } from 'src/app/helper/interface/response';
import { FormGeneratorComponent } from '../form-generator/form-generator.component';

export interface configFormDoc {
  title?: string,
  hideRemark?: boolean
  remarkTitle?: string
  fileTitle?: string
}
@Component({
  selector: 'app-form-doc',
  templateUrl: './form-doc.component.html',
  styleUrls: ['./form-doc.component.scss']
})
export class FormDocComponent implements OnInit {
  @Input() mode: 'EDIT' | 'VIEW' = 'EDIT';
  basicFormData: formBuilderData[] = []
  imageData: Array<any> = [];
  apiImageData: Array<any> = [];
  @Input() config: configFormDoc | null = {} as configFormDoc;
  @ViewChild('basicForm') basicForm: FormGeneratorComponent | undefined;

  constructor() { }

  ngOnInit(): void {
    if (!this.config?.hideRemark) {
      this.basicFormData = [{ colName: 'remarks', title: this.config?.remarkTitle || 'Photos Name', event: { name: 'change', isCallback: true } }];
    }
    const s: any = this.basicFormData || []
    this.basicFormData = [...s, ...[{ colName: 'document', title: this.config?.fileTitle || 'Photos', type: 'FILE' }]]
  }

  onChange(ev: any) {
    if (ev.controlName == 'document') {
      this.saveImage();
    }
  }

  setData(data: any) {
    this.imageData = data;
  }
  saveImage() {
    const apiData: any = this.basicForm?.apiPayload();
    apiData.action = 1;
    this.imageData.push(apiData);
    this.basicForm?.reset();
  }

  apiPayload() {
    return this.imageData.filter(a => a.action) || [];
  }


  deleteImage(index: number, type: 'NEW' | 'OLD') {
    if (!this.imageData[index]) {
      return;
    }
    if (type == 'NEW') {
      this.imageData.splice(index, 1);
    } else {
      this.imageData[index].action = 3;
    }
  }

}
