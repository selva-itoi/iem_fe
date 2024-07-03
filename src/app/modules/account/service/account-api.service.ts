import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountApiService {

  constructor(private http: HttpClient) { }

  save(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/account/save`, data))
  }
  getMainAccount(id: any) {
    return this.http.get(`${environment.apiUrl}/account/getAccountTypes/1/${id}`).toPromise();
  }
  getAllAccountDetails(id: any) {
    return this.http.get(`${environment.apiUrl}/account/getAllAccountStatus/${id}`).toPromise();
  }
  getList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/account/getList${lasyP}`))
  }
  getAccountDetails(id: string | number) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/account/get/${id}`))
  }
  closeAccount(data: any, id: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/account/accountClose/${id}`, data))
  }
  getListTransaction(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/account/getListTransaction${lasyP}`))
  }
  saveTransaction(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/account/newTransaction`, data))
  }
  searchAccount(terms: string | null, w: any = []) {
    const lasyP = '/' + JSON.stringify(w);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/account/search/${terms}${lasyP}`))
  }
  getAccountByStaff(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/account/getByStaff/${id}/${true}`)); // true =>for active only
  }
  getListSettlement(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/account/getListSettlement${lasyP}`))
  }
  getBulkListStaff(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/account/getListStaff`, data))
  }
  saveSettlement(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/account/saveSettlement`, data))
  }
  getSettlementDetails(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/account/getSettlementDetails/${id}`))
  }
  // updateSettlement(data: any) {
  //   return lastValueFrom(this.http.post(`${environment.apiUrl}/account/updateSettlement`, data))
  // }
  getSettlementByAccount(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/account/getSettlementByAccount/${id}`))
  }
  getListNotification() {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/account/getListNotification`))
  }
  getListLog(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/account/getListLog${lasyP}`))
  }
  gettransaction(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return this.http.get(`${environment.apiUrl}/account/getTransactionList/${lasyP}`).toPromise(); // true =>for active only
  }
  getmainList(id: any) {
    return (this.http.get(`${environment.apiUrl}/account/getAllAccountStatus/MAIN_ACCOUNT/${id}`)).toPromise();
  }
  getofficeList(id: any) {
    return (this.http.get(`${environment.apiUrl}/account/getAllAccountStatus/PROMOTIONAL_ID/${id}`)).toPromise();
  }
  gettransationdetails(id:any) {
    return this.http.get(`${environment.apiUrl}/account/getAccountTransaction/${id}`).toPromise(); 
  }
  getstaffdetails(id:any,fk_id:any,category:any) {
    return this.http.get(`${environment.apiUrl}/account/getAccountdetails/${id}/${fk_id}/${category}`).toPromise(); 
  }
  savesettlement(data: any) {
        return lastValueFrom(this.http.post(`${environment.apiUrl}/account/updateSettlement`, data))

    // return this.http.post(`${environment.apiUrl}/account/updateSettlement`, data).toPromise();
  }
  getAllSettlementDetails(id:any) {
    return this.http.get(`${environment.apiUrl}/account/settlementById/${id}`).toPromise(); 
  }
  getsettlementItemGetList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return this.http.get(`${environment.apiUrl}/account/settlementItemGetList${lasyP}`).toPromise();
  }
  getSettlementDetailsbyId(id:any) {
    return this.http.get(`${environment.apiUrl}/account/getByIdSettlementItem/${id}`).toPromise(); 
  } 
  getAccountTransationList(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/account/accountTransactionList`, data))
  }
  exportSettlementDetailsbyId(id:any) {
    return this.http.get(`${environment.apiUrl}/account/settlementExport/${id}`,{
      responseType: 'blob',
    }).toPromise(); 
  }

}
