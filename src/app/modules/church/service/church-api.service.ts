import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChurchApiService {

  constructor(private http: HttpClient) { }
  search(terms: string | null, w: any = []) {
    const lasyP = '/' + JSON.stringify(w);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/church/search/${terms}${lasyP}`));
  }

  saveDetails(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/church/save`, data));
  }
  getList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/church/getList${lasyP}`));
  }
  getListWithProgress(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/church/getListWithProgress${lasyP}`));
  }
  getListOnlyDeleted(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/church/getListOnlyDeleted${lasyP}`));
  }
  getBasic(id: any, isFull = false) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/church/getBasic/${id}/${isFull}`));
  }
  getDetails(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/church/getDetails/${id}`));
  }
  reliveChurch(id: any, data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/church/relive/${id}`, data));
  }
  updateRequest(id: string | number | Array<any>, data: any) {
    if (Array.isArray(id)) {
      id = id.join(',');
    }
    return lastValueFrom(this.http.post(`${environment.apiUrl}/church/updateRequest/${id}`, data));
  }

  saveMember(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/churchMember/save`, data));
  }
  getMember(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/churchMember/get/${id}`));
  }
  deleteMember(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/churchMember/get/${id}`));
  }

  getMemberList(ev: any, outbox: boolean = false) {
    const api = outbox ? 'getListOnlyDeleted' : 'getList';
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/churchMember/${api}/${lasyP}`));
  }

  getCommitteeMember(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/church/getCommitteeMember/${id}`));
  }

  searchMember(terms: string | null, w: any = []) {
    const lasyP = '/' + JSON.stringify(w);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/churchMember/search/${terms}${lasyP}`));
  }
  getBelieversTotal(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/churchMember/getBelieversTotal`, data));
  }

  saveReport(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/churchReport/save`, data));
  }
  getReport(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/churchReport/get/${id}`));
  }
  deleteReport(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/churchReport/get/${id}`));
  }
  getReportList(ev: any, outbox: boolean = false) {
    const api = outbox ? 'getListOnlyDeleted' : 'getList';
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/churchReport/${api}/${lasyP}`));
  }
  checkReportExists(date: any) {
    //const api = outbox ? 'getListOnlyDeleted' : 'getList';
    //const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/churchReport/checkByDate/${date}`));
  }

  //progress Report
  saveProgressReport(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/churchProgress/save`, data));
  }
  getProgressReportList(ev:any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/churchProgress/getList${lasyP}`));
  }

  getProgressDetails(id:any){
    return lastValueFrom(this.http.get(`${environment.apiUrl}/churchProgress/get/${id}`));
  }
  checkRequestExists = (data: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      console.log(data)
      if (+(data.modify_request || 0) == 1) {
        resolve(false);
        return;
      }
      this.getBasic(data.church_id).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (res.result) {
            if (+res.result.modify_request == 0) {
              resolve(true);
            }
          }
        }
        resolve(false);
      }).catch(err => {
        reject(true);
      })
    });
  }
}
