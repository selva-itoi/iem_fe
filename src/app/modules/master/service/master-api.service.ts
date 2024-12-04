import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { environment } from 'src/environments/environment';
import { PayrollApiService } from './payroll-api.service';
import { lastValueFrom } from 'rxjs';
import { ResponseData } from 'src/app/helper/interface/response';

@Injectable({
  providedIn: 'root'
})
export class MasterApiService extends PayrollApiService {
  payrollTbl = ['salary_category', 'payroll_head', 'leave_policy', 'leave_type', 'hra_percentage', 'work_from_type', 'holiday_type', 'experience_slot', 'payroll_type', 'payroll_group', 'payroll_report_status', 'bible_words']
  constructor(public override http: HttpClient) { super(http); }
  getApi(tbl: string) {
    return this.payrollTbl.includes(tbl) ? environment.apiPayrollUrl : environment.apiUrl;
  }
  getById(tbl: string, id: string | number): Promise<ResponseData> {
    return lastValueFrom(this.http.get(`${this.getApi(tbl)}/getById/${tbl}/${id}`))
  }
  searchAgent(terms: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/search/staff/${terms}`))
  }
  getFullData(tbl: string, cond: any = '', isFull = false, lazy = {}) {
    //0let query: string = '';
    //Array.isArray(cond) ? cond.map(a => query = query + '/' + a) : '';
    const tbl_ext = `/` + JSON.stringify(cond);
    const lasyP = isEmptyObj(lazy) ? '' : '/' + JSON.stringify(lazy);
    if (isFull) {
      return lastValueFrom(this.http.get(`${this.getApi(tbl)}/getfull/${tbl}${tbl_ext}${lasyP}`,))
    } else {
      return lastValueFrom(this.http.get(`${this.getApi(tbl)}/get/${tbl}${tbl_ext}${lasyP}`));
    }
  }

  saveData(tbl: string, data: any) {
    return lastValueFrom(this.http.post(`${this.getApi(tbl)}/saveData/${tbl}`, data))
  }
  saveField(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/field/save`, data))
  }
  getField(lazy: any = {}) {
    const lasyP = isEmptyObj(lazy) ? '' : '/' + JSON.stringify(lazy);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/field/getList${lasyP}`,))
  }

  getMobileApp(lazy: any = {}) {
    const lasyP = isEmptyObj(lazy) ? '' : '/' + JSON.stringify(lazy);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/app/getList${lasyP}`,))
  }

  getFieldByid(id: string | number, isFull = true) {
    const d = isFull ? 'true' : 'false';
    return lastValueFrom(this.http.get(`${environment.apiUrl}/field/get/${id}`,))
  }

  getChurchByField(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/church/getByField/${id}`))
  }

  generateEmail(id: string | number, data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/genEmail/${id}`, data))
  }

  getFieldByZone(id: any) {
    let data: any;
    if (Array.isArray(id)) {
      data = JSON.stringify(id);
    }
    return lastValueFrom(this.http.get(`${environment.apiUrl}/field/getByZone/${data}`))
  }

  exportData(tName = '', data: any = []) {
    data = JSON.stringify(data);
    return lastValueFrom(this.http.post(`${environment.apiUrl}/exportData/${tName}`, data, { responseType: 'blob' }))
  }
  sendEmail(data: Array<any>) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    return lastValueFrom(this.http.post(`${environment.emailApiUrl}/sendEmail`, data))
  }
  search(tbl: string, terms: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/search/${tbl}/${terms}`))
  }

  getLeaveTypeBypolicy(id: any, genderId: any) {
    return lastValueFrom(this.http.get(`${environment.apiPayrollUrl}/getLeveTypeByPolicy/${id}/${genderId}`))
  }
  getPromotionaloffice(id: any) {
    return this.http.get(`${environment.apiUrl}/promotional/promotionalById/${id}`).toPromise();
  }
  getstaffdetails(id: any) {
    return this.http.get(`${environment.apiUrl}/staff/getById/${id}`).toPromise();
  }
  savePromotionaloffice(data: any) {
    return this.http.post(`${environment.apiUrl}/promotional/newPromotional`, data).toPromise();
  }

}
