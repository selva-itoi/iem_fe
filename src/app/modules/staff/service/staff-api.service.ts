import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AppConstant, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { downloadHelper } from 'src/app/helper/class/downloadHelper';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffApiService {

  constructor(private http: HttpClient, private downloadHelper: downloadHelper) { }

  saveStaffDetails(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/staff/saveStaff`, data))
  }
  getStaffDetails(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getDetail/${id}`))
  }
  getStaffAddress(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getAddressByEmpId/${id}`))
  }
  searchStaff(terms: string | null, w: any = []) {
    const lasyP = '/' + JSON.stringify(w);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/search/${terms}${lasyP}`))
  }

  updateRequest(id: string | number | Array<any>, data: any) {
    if (Array.isArray(id)) {
      id = id.join(',');
    }
    return lastValueFrom(this.http.post(`${environment.apiUrl}/staff/updateRequest/${id}`, data))
  }

  reliveStaff(id: any, data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/staff/relive/${id}`, data))
  }


  generateCross(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/createCrossRef/${id}`))
  }
  getSaffViews(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getViewDetails/${id}`))
  }
  getList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getList${lasyP}`))
  }
  getStaffByCross(id: string | number) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getByCross/${id}`))
  }
  getStaffDetailWithAddress(id: string | number) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getDetailAddress/${id}`))
  }
  getFamilyByStaff(id: string | number) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getFamilyByStaff/${id}`))
  }
  getRememberAll(ev: any = {}, type = 'BIRTHDAY', cat = '0') {
    const lasyP = '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getRememberAll${lasyP}/${type}/${cat}`))
  }

  //Gems Exp
  getActiveExp(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getActiveExp/${id}/true`))
  }
  getAllExp(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getAllExp/${id}`))
  }


  getBasic(id: any, isFull = false) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getBasic/${id}/${isFull}`))
  }

  getListOnlyDeleted(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staff/getListOnlyDeleted${lasyP}`))
  }

  //Transfer Started
  saveStaffTransfer(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/staffTransfer/save`, data))
  }
  getListTransfer(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staffTransfer/getList${lasyP}`))
  }

  getTransferByid(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staffTransfer/getById/${id}`))
  }

  //dedication 
  getDedicationList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/dedication/getList${lasyP}`))
  }

  getDedicationByid(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/dedication/getById/${id}`))
  }
  saveDedication(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/dedication/save`, data))
  }

  profileDownload(id: any, data: any = {}) {
    const url = `${environment.apiUrl}/staff/profile_print/${id}`;
    const fileName = `${data.name || ''}-${data.staff_emp_id || ''}` || '';
    return this.downloadHelper.downloadApi(url, 'GET', fileName);
  }

  exportBirthday(ev: any, type: any, cat: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    const url = `${environment.apiUrl}/staff/exportRemember${lasyP}/${type}/${cat}`;
    const fileName = `${AppConstant.ORG_NAME}-STAFF-${type}` || '';
    return this.downloadHelper.downloadApi(url, 'GET',fileName);
  }
  checkRequestExists = (data: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      console.log(data)
      if (+(data.modify_request || 0) == 1) {
        resolve(false);
        return;
      }
      this.getBasic(data.staff_emp_id).then((res: ResponseData | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (res.result) {
            if (+res?.result?.modify_request == 0) {
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
