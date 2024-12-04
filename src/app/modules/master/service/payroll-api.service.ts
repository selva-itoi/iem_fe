import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
export class PayrollApiService {
  constructor(protected http: HttpClient) { }

  getPayrollById(tbl: string, id: string | number) {
    return lastValueFrom(this.http.get(`${environment.apiPayrollUrl}/getById/${tbl}/${id}`));
  }
  getPayrollHeadById(id: string | number) {
    return lastValueFrom(this.http.get(`${environment.apiPayrollUrl}/payrollhead/getById/${id}`));
  }
  savePayrollHead(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiPayrollUrl}/payrollhead/save`, data));
  }

  savePolicy(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiPayrollUrl}/leave/savepolicy`, data));
  }

  getPayrollFullData(tbl: string, cond: any = '', isFull = false, lazy = {}) {
    const tbl_ext = `/` + JSON.stringify(cond);
    const lasyP = isEmptyObj(lazy) ? '' : '/' + JSON.stringify(lazy);
    if (isFull) {
      return lastValueFrom(this.http.get(`${environment.apiPayrollUrl}/getfull/${tbl}${tbl_ext}${lasyP}`,));
    } else {
      return lastValueFrom(this.http.get(`${environment.apiPayrollUrl}/get/${tbl}${tbl_ext}${lasyP}`));
    }
  }

  savePayrollData(tbl: string, data: any) {
    return lastValueFrom(this.http.post(`${environment.apiPayrollUrl}/saveData/${tbl}`, data));
  }

  getLeavePolicy(id: string | number) {
    return lastValueFrom(this.http.get(`${environment.apiPayrollUrl}/leave/getPolicyById/${id}`));
  }
  saveLeavePolicy(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiPayrollUrl}/leave/savepolicy`, data));
  }

  getStaffPayroll(){
    return lastValueFrom(this.http.get(`${environment.apiPayrollUrl}/payrollhead/staffPayroll`));
  }
  
}
