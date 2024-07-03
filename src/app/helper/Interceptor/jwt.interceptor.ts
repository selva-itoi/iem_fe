import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { HttpCallHandleService } from './http-call-handle.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {


  constructor(private authenticationService: AuthService,
    private router: Router,
    private httpcallHandle: HttpCallHandleService) {

    this.router.events.subscribe(event => {
      // An event triggered at the end of the activation part of the Resolve phase of routing.
      if (event instanceof ResolveEnd) {
        // Cancel pending calls
        this.httpcallHandle.cancelPendingRequests();
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(request)
    const token: any = this.authenticationService.getToken();
    const skipToken = request.headers.get("skipToken") || false;
    const modifiedUrl = request.url.replace(/([^:]\/)\/+/g, '$1');
    if (token && !skipToken) {
      request = request.clone({
        url:modifiedUrl,
        setHeaders: {
          //'Content-Type': 'application/json',
          //'Accept': 'application/json',
          //'Access-Control-Allow-Origin': '*',
          //'X-AppName':  'Inhertiv Initiative Flow',
          'Authorization': 'Bearer ' + token,
        },
        //body : request.headers.get("skipJson") && request.method=='post' ? request.body : JSON.parse(request.body) 
      });
    }
    return next.handle(request).pipe(takeUntil(this.httpcallHandle.onCancelPendingRequests()));
  }
}
