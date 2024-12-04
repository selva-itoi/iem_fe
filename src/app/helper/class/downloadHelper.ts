import { HttpClient } from "@angular/common/http";
import { AlertService } from "../service/alert.service";
import { randomString } from "./utilityHelper";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
@Injectable({
    providedIn: 'root'
  })
export class downloadHelper {
    constructor(private http: HttpClient, private alertService: AlertService) { }
    convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
     

    getDateTime() {
        const today = new Date();
        return String(today.toLocaleDateString()) + String(today.getHours());
    }
    async downloadFile(res: any, fName = '') {
        const fileName: string = fName ? fName : `export_iemData_${this.getDateTime()}_${randomString(5)}`,
            data: any = await this.convertBlobToBase64(res);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = data;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(data);
        a.remove();
    }

    downloadApi(url: string, method: 'GET' | 'POST' = 'GET', fName: any='', body: any={}) {
        const resHead: any = { responseType: 'blob' }
        return new Promise<{ msg: string, status: boolean }>((resolve, reject) => {
            const API = method == 'GET' ? this.http.get(url, resHead) : this.http.post(url, body, resHead)
            lastValueFrom(API).then(async (res: any) => {
                await this.downloadFile(res, fName);
                resolve({ msg: 'downloaded', status: true });
            }).catch((err) => {
                console.log('err', err)
                this.alertService.showToast('Failed to Download', 'info')
                reject({ msg: 'Error', status: false })
            })
        });
    }
}
