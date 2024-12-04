import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, lastValueFrom } from 'rxjs';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { AlertService } from 'src/app/helper/service/alert.service';
import { AuthService } from 'src/app/helper/service/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailApiService {

  constructor(private auth: AuthService, private http: HttpClient, private alertService: AlertService) { }

  generateEmail(id: string | number, data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/genEmail/${id}`, data))
  }
  sendEmail(data: Array<any>) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    data.forEach((e: any) => {
      e.user_id = this.auth.currentUserValue.user_id;
      e.created_byName = `${this.auth.currentUserValue.fname} ${this.auth.currentUserValue.lname}`;
    });
    return lastValueFrom(this.http.post(`${environment.emailApiUrl}/sendEmail`, data))
  }

  reSendEmail(id: any) {
    return lastValueFrom(this.http.get(`${environment.emailApiUrl}/reSendEmail/${id}`))
  }

  getEmailById(id: any) {
    return lastValueFrom(this.http.get(`${environment.emailApiUrl}/getMailById/${id}`))
  }

  showPdf(data: any, id: any = '') {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/preview_pdf${id ? '/'+id : ''}`, data, { responseType: 'blob' }))
  }

  getListEmail(lazy: any) {
    const lasyP = isEmptyObj(lazy) ? '' : '/' + JSON.stringify(lazy);
    return lastValueFrom(this.http.get(`${environment.emailApiUrl}/getList${lasyP}`))
  }

  getListOutbox(lazy: any) {
    const lasyP = isEmptyObj(lazy) ? '' : '/' + JSON.stringify(lazy);
    return lastValueFrom(this.http.get(`${environment.emailApiUrl}/getListOnlyDeleted${lasyP}`))
  }
  deleteEmail(id: any) {
    return lastValueFrom(this.http.get(`${environment.emailApiUrl}/delete/${id}`))
  }

  sendEmailRef(id: number, apiLoad: any = {}, mapVal: any = [], mapKey = '') {
    return new Promise((resolve, reject) => {
      const api: any = [];
      if (mapVal.length) {
        mapVal.forEach((e: any) => {
          apiLoad[mapKey] = e[mapKey];
          apiLoad.user_id = this.auth.currentUserValue.user_id;
          api.push(this.generateEmail(id, apiLoad));
        });
      } else if (!isEmptyObj(apiLoad)) {
        api.push(this.generateEmail(id, apiLoad));
      }
      if (api.length) {
        lastValueFrom(forkJoin(api)).then((res: any) => {
          const data: Array<any> = [];
          res.forEach((e: any) => {
            e.result.user_id = this.auth.currentUserValue.user_id;
            // check email settings;
            if (+e.result.allow_to_send_email) {
              data.push(e.result);
            }
          });
          if (!data.length) {
            resolve(true);
          } else {
            this.sendEmail(data).then((res: ResponseData | any | any) => {
              this.alertService.showToast('Email Has been sent', 'success');
              resolve(true)
            }).catch(err => {
              this.alertService.showToast('unable to Send Email', 'error');
              reject(false)
            })
          } // end of check
        }).catch(err => {
          reject(err);
        });

      } else {
        resolve(true);
      }
    });
  }

}