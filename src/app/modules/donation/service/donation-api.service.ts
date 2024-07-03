import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonationApiService {

  constructor(private http: HttpClient) { }

  saveCampaign(data: any) {
    return this.http.post(`${environment.apiUrl}/campaign/save`, data).toPromise();
  }
  payDonation(data: any) {
    return this.http.post(`${environment.apiUrl}/donation/save`, data).toPromise();
  }
  addDonation(data:any){
    return this.http.post(`${environment.apiUrl}/donation/donationSponsorship`, data).toPromise();
  }
  updatePaymentStatus(id: any, data: any) {
    return this.http.post(`${environment.apiUrl}/donation/paymentUpdate/${id}`, data).toPromise();
  }
  getDonationDetails(id: any) {
    return this.http.get(`${environment.apiUrl}/donation/getById/${id}`).toPromise();
  }
  getMainBankAccount(){
    return this.http.get(`${environment.apiUrl}/account/getMainBankAccount`).toPromise();
  }
}
