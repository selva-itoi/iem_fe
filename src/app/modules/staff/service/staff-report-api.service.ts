import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffReportApiService {

  constructor(private http: HttpClient) { }

  getReportAvailableLang(id: any, month: string, year: string) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staffReport/getAvilableLang/${id}/${month}/${year}`));
  }
  save(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/staffReport/save`, data));
  }
  sendMail(id, data = {}) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/staffReport/mailSend/${id}`, data));
  }
  updateEmailStatus(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/staffReport/updateEmailStatus`, data));
  }
  getList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staffReport/getList${lasyP}`));
  }
  //get report by lang staff id
  getReportById(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staffReport/getById/${id}`));
  }

  getReportStats(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staffReport/getReportStats${lasyP}`));
  }
  getReportStatsSponsor(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/staffReport/getReportStatSponsor${lasyP}`));
  }

  // getReportByLangId(id: any) {
  // lastValueFrom(  return this.http.get(`${environment.apiUrl}/staffReport/getById/${id}`));
  // }

  deleteReport(id: any) {
    return lastValueFrom(this.http.delete(`${environment.apiUrl}/staffReport/${id}`));
  }
  getProgressReportList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return this.http.get(`${environment.apiUrl}/staffProgress/getList${lasyP}`).toPromise();
  }
  getReportByMonth(id: any, year: any, month: any) {
    return this.http.get(`${environment.apiUrl}/staffProgress/getAvilable/${id}/${year}/${month}`).toPromise();
  }
  getProgressReportDetails(id: any) {
    return this.http.get(`${environment.apiUrl}/staffProgress/getById/${id}`).toPromise();
  }
  saveProgressReport(data: any) {
    return this.http.post(`${environment.apiUrl}/staffProgress/save`, data).toPromise();
  }
  
  getGoalReportDetails(id: any) {
    return this.http.get(`${environment.apiUrl}/staffGoal/getById/${id}`).toPromise();
  }
  saveGoalReport(data: any) {
    return this.http.post(`${environment.apiUrl}/staffGoal/save`, data).toPromise();
  }
  getReportByYear(id: any, year: any) {
    return this.http.get(`${environment.apiUrl}/staffGoal/getAvilable/${id}/${year}`).toPromise();
  }
  getGoalReportList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return this.http.get(`${environment.apiUrl}/staffGoal/getList${lasyP}`).toPromise();
  }
  staticsReport(data:any,ev: any){
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);

    return this.http.post(`${environment.apiUrl}/staffProgress/getStatsByDepartment${lasyP}`, data).toPromise();

  }
  
}
