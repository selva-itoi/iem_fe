import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  constructor(private messageService: MessageService) { }

  showToast(msg: string = "we couldn't save your changes", type: 'success' | 'info' | 'warn' | 'error' = 'info') {
    this.messageService.add({ contentStyleClass: 'toastContent pr-0 pl-0 text-center', severity: type, summary: '', detail: msg, life: 3000, closable: false });
  }
  clearToast(id = '') {
    this.messageService.clear(id)
  }
}
