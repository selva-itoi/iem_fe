import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtiltiyService {
  constructor(
    private http: HttpClient
    ) { }
  uploadFiles(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('files', file);
    const request = new HttpRequest('POST', `${environment.apiUrl}/uploadFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(request);
  }
}