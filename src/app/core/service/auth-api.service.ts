import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { jsonParse } from 'src/app/helper/class/utilityHelper';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private http: HttpClient) { }
  
  otpSend(num: any, type = 'LOGIN') {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sendOTP/${num}/${type}`));
  }
  resendOtp(num: any, type = 'LOGIN') {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/resendOTP/${num}/${type}`));
  }
  login(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/Auth/login`, data));
  }
  getRolePermission(data: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/getAllPermission/${data}`));
  }
  loginOTP(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/Auth/loginVerifyOtp`, data));
  }
  changePassword(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/Auth/changePassword`, data));
  }

  getUserPermission(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/role/getPermissionByUser/${id}`));
  }
  saveRolePermission(data: any, id: string) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/role/updatePermission/${id}`, data));
  }
  getRolePermissionByRole(id: any, isFull = false) {
    if (isFull) {
      return lastValueFrom(this.http.get(`${environment.apiUrl}/role/getPermissionFull/${id}`));
    } else {
      return lastValueFrom(this.http.get(`${environment.apiUrl}/role/getPermission/${id}`));
    }
  }
}