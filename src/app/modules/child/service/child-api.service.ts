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
export class ChildApiService {

  constructor(private http: HttpClient) { }
  search(terms: string | null, w: any = []) {
    const lasyP = '/' + JSON.stringify(w);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/search/${terms}${lasyP}`))
  }

  saveDetails(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/child/save`, data))
  }
  getParentSearch(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/child/getParentSearch`, data))
  }
  getList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/getList${lasyP}`))
  }
  getListBySponsor(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/getListBySponsor${lasyP}`))
  }
  getListOnlyDeleted(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/getListOnlyDeleted${lasyP}`))
  }
  pendingEducation(type :string,ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/pendingEducation/${type}${lasyP}`))
  }
  pendingEduByChild(type :string,cid: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/pendingEduByChild/${type}/${cid}`))
  }
  saveEducation(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/child/saveEducation`, data))
  }
  rejectEdu(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/child/rejectEdu`, data))
  }
  getDetail(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/getDetail/${id}`))
  }
  getSbiling(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/getSbiling/${id}`))
  }
  

  findParentsById(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/findParentsById/${id}`))
  }
  findParentsDetails(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/getParentsDetails/${id}`))
  }

  getBasic(id: any, isFull = false) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/getBasic/${id}/${isFull}`))
  }

  relive(id: any, data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/child/relive/${id}`, data))
  }

  updateRequest(id: string | number | Array<any>, data: any) {
    if (Array.isArray(id)) {
      id = id.join(',');
    }
    return lastValueFrom(this.http.post(`${environment.apiUrl}/child/updateRequest/${id}`, data))
  }
  getReportById(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/getReportById/${id}`))
  }
  getReportList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/child/getListReport${lasyP}`))
  }
  saveReport(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/child/saveReport`, data))
  }
  deleteReport(id: any) {
    return lastValueFrom(this.http.delete(`${environment.apiUrl}/child/delete/${id}`))
  }
  // home

  getHomeDetail(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/home/getDetail/${id}`))
  }


  checkRequestExists = (data: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      console.log(data)
      if (+(data.modify_request || 0) == 1) {
        resolve(false);
        return;
      }
      this.getBasic(data.child_id).then((res: ResponseData | any) => {
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
