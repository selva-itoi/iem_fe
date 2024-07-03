import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { actionInterface, Concrete, modulInterface, roleMap, User } from '../interface/user';
import { UrlServices } from '../class/url-services';
import { isEmptyObj } from '../class/utilityHelper';
import { RolePermissionService } from 'src/app/core/service/role-permission.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RolePermissionService {
  user: User = ({}) as User;
  
  dbName: string = environment.production ? 'live_GEMSAdmin' : 'dev_GEMSAdmin';
  private userBS: BehaviorSubject<User> = new BehaviorSubject<User>(({}) as User);
  public currentUser: Observable<User>;
  constructor(private router: Router) {
    super();
    this.userBS = new BehaviorSubject<User>(({}) as User);
    this.currentUser = this.userBS.asObservable();
    this.setUserBS(this.getUser());
  }
  
  public get currentUserValue(): User {
    return this.userBS.value;
  }
  
  setUserBS(user: User) {
    this.userBS.next(user)
    this.userRoleData = this.currentUserValue.permission || {} as roleMap;
  }

  
    
  getUser() {
    const res: any = localStorage.getItem(this.dbName);
    return JSON.parse(res) || {};
  }

  setApplicationUser(user: User) {
    this.clearLocalStorage();
    if (user.staff) {
      user.fname = user.staff?.name || '';
      user.lname = user.staff?.last_name || '';
      user.imageUrl = user.staff.profile_image || '';
    }
    this.setUserBS(user);
    localStorage.setItem(this.dbName, JSON.stringify(user));
  }

  setLocationData(data: any) {
    localStorage.setItem(this.dbName + '_location', JSON.stringify(data));
  }

  getLocation() {
    const res: any = localStorage.getItem(this.dbName + '__location');
    return JSON.parse(res) || {};
  }

  loginStatus() {
    if (isEmptyObj(this.currentUserValue)) {
      this.setUserBS(this.getUser());
    }
    if (this.currentUserValue && this.currentUserValue.token) {
      return true;
    }
    return false;
  }

  getToken() {
    return this.currentUserValue.token || '';
  }

  clearLocalStorage() {
    localStorage.removeItem(this.dbName);
    localStorage.clear();
  }

  clearSubscribe() {
    this.userBS.next(({}) as User);
    this.user = ({}) as User;
  }

  logout(returnUrl: any = '') {
    this.clearLocalStorage();
    this.clearSubscribe();
    this.router.navigate([UrlServices.AUTH_PAGE.LOGIN_URL], { queryParams: { 'returnUrl': returnUrl ? returnUrl : this.router.url } });
  }

  isAllowable(mName: Concrete<keyof modulInterface>, aName: Concrete<keyof actionInterface>) {
    const res = this.checkPermission(mName, aName);
    if (!res) {
      this.redirectToDenied();
    }
    return res;
  }

  redirectToLogin() {
    this.router.navigate([UrlServices.AUTH_PAGE.LOGIN_URL]);
  }
  redirectToDashboard() {
    this.router.navigate([UrlServices.DASHBOARD_ROUTE]);
  }

  redirectToDenied() {
    this.router.navigate([UrlServices.ACCESS_DENIED_ROUTE]);
  }
}

