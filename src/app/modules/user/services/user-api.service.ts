import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { isEmptyObj, jsonParse } from 'src/app/helper/class/utilityHelper';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(private http: HttpClient) { }

  saveUser(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/users/saveUser`, data))
  }

  isUnique(field: any, id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/users/isUnique/${field}/${id}`))
  }
  isEmailUnique(username: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/users/isEmailUnique/${username}`))
  }

  getUserData(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/users/getUserDetails/${id}`))
  }
  getAllUser(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/users/getUserAll${lasyP}`))
  }
  getAllInactive(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/users/getAllInactive${lasyP}`))
  }

  getUserById(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/users/getUserDetails/${id}`))
  }
  getUserByUserName(username: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/users/getUserByUserName/${username}`))
  }
  deleteUser(id: any) {
    return lastValueFrom(this.http.delete(`${environment.apiUrl}/users/deleteUser/${id}`))
  }
  makeActive(id: any) {
    return lastValueFrom(this.http.put(`${environment.apiUrl}/users/makeActive/${id}`, {}))
  }
  getDashboardData() {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/dashboard/getData`))
  }
  getListVolunter(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return this.http.get(`${environment.apiUrl}/volunteer/getList${lasyP}`).toPromise();
  }
  volunteerDelete(data: any) {
    return (this.http.post(`${environment.apiUrl}/volunteer/updateStatus`,data)).toPromise();
  }
  searchVolunteer(terms: string | null, w: any = []) {
    const lasyP = '/' + JSON.stringify(w);
    return this.http.get(`${environment.apiUrl}/volunteer/search/${terms}${lasyP}`).toPromise();
  }
  getReceiptById(id: any) {
    return this.http.get(`${environment.apiUrl}/donation_receipt_book/getbyId/${id}`).toPromise();
  }
  saveVolunterReceipt(data:any){
    return this.http.post(`${environment.apiUrl}/donation_receipt_book/save`, data).toPromise();
  }
  getByIdVolunter(id: any) {
    return this.http.get(`${environment.apiUrl}/volunteer/getById/${id}`).toPromise();
  }
  getreportAccount(id: any) {
    return (this.http.get(`${environment.apiUrl}/promotional/promotionalById/${id}`)).toPromise();
  }
  saveVolunter(data:any){
    return this.http.post(`${environment.apiUrl}/volunteer/save`, data).toPromise();
  }
  getReciptdata(id: any) {
    return this.http.get(`${environment.apiUrl}/donation_receipt_book/shiftcurrent_recipt/${id}`).toPromise();
  }
  getReciptlist(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return this.http.get(`${environment.apiUrl}/donation_receipt_book/get${lasyP}`).toPromise();
  }
  updateReceiptdata(data:any){
    return this.http.post(`${environment.apiUrl}/donation_receipt_book/update`, data).toPromise();
  }
  getreceiptdetails(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return this.http.get(`${environment.apiUrl}/donation_receipt_book/getList${lasyP}`).toPromise();
  }
  Recepitdelete(id: any) {
    return this.http.delete(`${environment.apiUrl}/donation_receipt_book/delete/${id}`).toPromise();
  }
  getareasecratarystats(id:any,ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return this.http.get(`${environment.apiUrl}/promotional/areaSecretoryAccountTrans/${id}/${lasyP}`).toPromise();
  }



  getWhether() {
    const weatherAPI = 'http://api.openweathermap.org/data/2.5/weather?',
      weatherParams = '&units=metric&APPID=eb03b1f5e5afb5f4a4edb40c1ef2f534',
      getIP = 'http://ip-api.com/json/';
// lastValueFrom(     return this.http.get(getIP))
   return this.http.get(getIP).pipe(mergeMap((location: any) => this.http.post(`${environment.apiUrl}/dashboard/getWhetherUrl/${location.city}`,location)))
  }
}