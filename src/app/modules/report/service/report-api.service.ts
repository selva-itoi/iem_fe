import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportApiService {

  constructor(private http: HttpClient) { }

  genReport(type: string, data: any,cond:any = []) {
    const lasyP = '/' + JSON.stringify(cond);
    return lastValueFrom(this.http.post(`${environment.apiUrl}/report/getReport/${type}${lasyP}`, data,{
      responseType: 'blob',
    }));
  }
}
