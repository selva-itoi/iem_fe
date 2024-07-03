import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {
  constructor(private auth: AuthService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.auth.loginStatus()) {
      this.auth.redirectToLogin();
      return false;
    } else {
      return true;
    }
  }
}
@Injectable({
  providedIn: 'root'
})
export class LogoutGuard  {
  constructor(private auth: AuthService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.loginStatus()) {
      this.auth.redirectToDashboard();
      return false;
    } else {
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root',
})
export class StrictNoAuthhGuard  {
  constructor(
    private authenticationService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.loginStatus()) {
      // logged in so return true
      this.authenticationService.redirectToDashboard();
      return false;
    } else {
      return true;
    }
    // not logged in so redirect to login page with the return url
  }
}
