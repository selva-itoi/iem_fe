import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { audioExtension, FILETYPE, imgExtensions, videoExtension } from 'src/app/helper/interface/media-interface';
import { ModalService } from '../../service/modal.service';

@Component({
  selector: 'image-doc-grid',
  templateUrl: './image-doc-grid.component.html',
  styleUrls: ['./image-doc-grid.component.scss']
})
export class ImageDocGridComponent implements OnInit {
  doc_path: string = '';
  fileType: FILETYPE = 'IMAGE';
  fileName: string | undefined = '';
  @Input() public set src(path: string) {
    if (path) {
      this.fileType = this.findFileType(path);
      this.doc_path = path;
      this.fileName = path.split('/').pop();
    }
  }
  @Input() showDelete: boolean = false;
  @Input() primaryKey: string | number = '';
  @Input() remarks: any = ''
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @ViewChild('progressDiv') progressDiv: ElementRef | undefined;
  constructor(private modalService: ModalService) { }

  ngOnInit(): void {}

  findFileType(url: string): FILETYPE {
    const ext: any = url.split(".").pop();
    if (imgExtensions.includes(ext?.toLowerCase())) {
      return 'IMAGE';
    } else if (audioExtension.includes(ext.toLowerCase())) {
      return 'AUDIO';
    } else if (videoExtension.includes(ext.toLowerCase())) {
      return 'VIDEO';
    }
    return 'DOCUMENT';
  }

  delete() {
    this.modalService.openConfirmDialog({ info_message: 'Are You Sure want to delete this File', btnOK: 'Delete' }).then((res: any) => {
      if (res) {
        this.onDelete.emit(this.primaryKey);
      }
    })
  }
}