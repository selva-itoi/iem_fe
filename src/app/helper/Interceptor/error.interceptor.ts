import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { AlertService } from '../service/alert.service';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService, private alertService: AlertService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(catchError(error => {
      switch (error.status) {
        case 401:
          this.alertService.showToast('Token expired, Please login again.', 'warn');
          this.authenticationService.logout();
          break;
        case 400:
          if (error.message){
          let msg = error?.error?.message || error.message;
            this.alertService.showToast(msg, 'warn');
          }
          break;
        case 500:
          this.alertService.showToast('Internal Server Error', 'warn');
          break;
      }
      const error_msg = error.error.message || error.statusText;
      return throwError(error_msg);
    }));
  }
}