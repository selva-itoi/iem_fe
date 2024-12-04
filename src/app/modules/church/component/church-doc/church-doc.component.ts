import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ImageUploadComponent } from 'src/app/core/component/image-upload/image-upload.component';
import { fileInfo } from 'src/app/core/helper/core.data.interface';

@Component({
  selector: 'app-church-doc',
  templateUrl: './church-doc.component.html',
  styleUrls: ['./church-doc.component.scss']
})
export class ChurchDocComponent implements OnInit {
  church_id: string | number = '';
  @Input() mode: 'VIEW' | 'EDIT' = 'EDIT';
  dataLoading: boolean = false;
  loading: boolean = false;
  imageData: Array<any> = [];
  apiImageData: Array<any> = [];
  dataForm: UntypedFormGroup = new UntypedFormGroup({});
  @Output() uploadedEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('imageUploader') imageUploader: ImageUploadComponent | undefined;

  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const group: any = { remarks: new UntypedFormControl('', [Validators.required]), document_path: new UntypedFormControl(''), document: new UntypedFormControl(''), id: new UntypedFormControl(''), action: new UntypedFormControl('') };
    this.dataForm = new UntypedFormGroup(group);
  }

  setData(data: any) {
    this.imageData = data;
  }
  saveImage() {
    const apiData: any = this.dataForm.value;
    this.imageData.push(apiData);
    this.initForm();
    this.imageUploader?.resetFileInput();
  }

  apiPayload() {
    return this.imageData.filter(a => a.action) || [];
  }

  didUpload(e: fileInfo) {
    this.dataForm.patchValue({ document: e.fileName, action: 1, document_path: e.filePath });
    this.saveImage();
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


  get validForm() {
    return this.dataForm.valid;
  }
}
