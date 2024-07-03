import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AppConstant, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { downloadHelper } from 'src/app/helper/class/downloadHelper';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SponsorApiService {

  constructor(private http: HttpClient, private downloadHelper: downloadHelper) { }

  saveSponsorDetails(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/sponsor/save`, data));
  }
  getList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsor/getList${lasyP}`));
  }

  updateRequest(id: string | number | Array<any>, data: any) {
    if (Array.isArray(id)) {
      id = id.join(',');
    }
    return lastValueFrom(this.http.post(`${environment.apiUrl}/sponsor/updateRequest/${id}`, data));
  }

  sponsorshipUpdateRequest(id: string | number, data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/sponsor/updateSponsorship/${id}`, data));
  }

  getListOnlyDeleted(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsor/getListOnlyDeleted${lasyP}`));
  }

  getById(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsor/getById/${id}`));
  }
  getBasic(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsor/getBasic/${id}`));
  }

  getDetails(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsor/getDetails/${id}`));
  }

  getRememberAll(ev: any = {}, type = 'BIRTHDAY', cat = '0') {
    const lasyP = '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsor/getRememberAll${lasyP}/${type}/${cat}`));
  }

  search(terms: string | null, w: any = []) {
    const lasyP = '/' + JSON.stringify(w);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsor/search/${terms}${lasyP}`));
  }

  saveSponsorShip(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/sponsor/saveSponsorship`, data));
  }

  sponsorshipGetList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorship/getList${lasyP}`));
  }

  getAllPending(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorship/getSponsorAllotment/${id}`));
  }

  saveAllotment(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/sponsorship/saveAllotment`, data));
  }

  updateSponsorshipRequest(id: string | number | Array<any>, data: any) {
    if (Array.isArray(id)) {
      id = id.join(',');
    }
    return lastValueFrom(this.http.post(`${environment.apiUrl}/sponsorship/updateRequest/${id}`, data));
  }

  getSponsorshipDetails(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorship/getDetails/${id}`));
  }
  getSponsorship(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorship/get/${id}`));
  }

  reliveSponsorship(id: any, data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/sponsorship/relive/${id}`, data));
  }

  getSponsorshipAllotment(ref_id: any, module: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorship/getListRefAllotment/${ref_id}/${module}`));
  }

  getActiveAllotment(ref_id: any, module: number | string) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorship/getActiveRefAllotment/${ref_id}/${module}`));
  }

  getListRefSponsorByLang(ref_id: any, lang: any) {
    const tbl_ext = JSON.stringify(ref_id);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorship/getListRefSponsorByLang/${tbl_ext}/${lang}`));
  }
  getListSponsorByRef(ref_id: any, module: number) {
    const tbl_ext = JSON.stringify(ref_id);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorship/getListSponsorByRef/${ref_id}/${module}`));
  }
  getListAllotment(ref_id: any) {
    const tbl_ext = JSON.stringify(ref_id);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorship/getListAllotment/${tbl_ext}`));
  }
  updateEmailAllotment(id: any, data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/sponsorship/updateEmail/${id}`, data));
  }
  getListSponsorshipSponsor(ref_id: any) {
    const tbl_ext = JSON.stringify(ref_id);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorship/getAllSponsor/${tbl_ext}`));
  }


  getListGift(ref_id: any) {
    const tbl_ext = JSON.stringify(ref_id);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorGift/getList/${tbl_ext}`));
  }
  getGiftData(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsorGift/getDetails/${id}`));
  }
  saveGift(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/sponsorGift/save`, data));
  }
  reliveGift(id: any) {
    return lastValueFrom(this.http.delete(`${environment.apiUrl}/sponsorGift/relive/${id}`));
  }
  // donation
  getDonationList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/donation/getList${lasyP}`));
  }
  getDonationApi(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/sponsor/getAllDonation/${id}`));
  }
  getDonationById(id: any) {
    return lastValueFrom(this.http.get(`${environment.apiUrl}/donation/getById/${id}`));
  }
  getDonationSponsorShip(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/donation/getSponsorship${lasyP}`));
  }
  updateDonationRequest(id:any,data:any){
    return lastValueFrom(this.http.post(`${environment.apiUrl}/donation/updateDonation/${id}`, data));
  }
  //donation allotment assign info 
  saveDonationAllotment(data: any) {
    return lastValueFrom(this.http.post(`${environment.apiUrl}/donation/allotment`, data));
  }
  getDonationAllotmentList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/donation/allotment/getList${lasyP}`));
  }
  sponsorshipGetListbyid(id:any) {
    // const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return this.http.get(`${environment.apiUrl}/sponsorship/sponsorshipPending/${id}`).toPromise();
  }
  
  updateDonationdata(id:any,data: any) {
    return this.http.post(`${environment.apiUrl}/donation/paymentUpdate/${id}`, data).toPromise();
  }
  activateMagazine(id: any, data: any) {
    return this.http.post(`${environment.apiUrl}/magazine/active/${id}`, data).toPromise();
  }
  inActivateMagazine(id: any, data: any) {
    return this.http.post(`${environment.apiUrl}/magazine/inActive/${id}`, data).toPromise();
  }
  magazineGetList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return this.http.get(`${environment.apiUrl}/magazine/magazinegetList${lasyP}`).toPromise();
  }
  GetDonorpendingList(ev: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return this.http.get(`${environment.apiUrl}/sponsor/getPendingSponsorshipList${lasyP}`).toPromise();
  }
  MagazineData(id: any) {
    return this.http.get(`${environment.apiUrl}/magazine/getMagazineId/${id}`).toPromise();
  }
  updateMagazine(data: any) {
    return this.http.post(`${environment.apiUrl}/magazine/updateMagazine`, data).toPromise();
  }
  saveMagazine(data: any) {
    return this.http.post(`${environment.apiUrl}/magazine/saveMagazine`, data).toPromise();
  }
  ZoneData(id:any) {
    return this.http.get(`${environment.apiUrl}/get/zone/${id}`).toPromise();
  }
  PromotionalData(id:any) {
    return this.http.get(`${environment.apiUrl}/promotional/findPromoByZone/${id}`).toPromise();
  }
  RegionData(id: any) {
    return this.http.get(`${environment.apiUrl}/get/region/${id}`).toPromise();
  }
  // printMagazine(id: any,count:any,state:any) {
  //   return this.http.get(`${environment.apiUrl}/magazine/print/${id}/${count}/${state}`,{responseType: 'blob'}).toPromise();
  // }
  printMagazine(data: any) {
    return this.http.post(`${environment.apiUrl}/magazine/print`, data,{responseType: 'blob'}).toPromise();
  }
  printsponserreceipt(id:any){
    return this.http.get(`${environment.apiUrl}/donation/donationRecepit/${id}`,{
      responseType: 'blob'}).toPromise();
  }
  getTopList(ev: any,type:any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/volunteer/topList/${type}/${lasyP}`));
  }
  topListExport(ev: any,type:any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    return lastValueFrom(this.http.get(`${environment.apiUrl}/volunteer/topListExcel/${type}/${lasyP}`,{
      responseType: 'blob',
    }));
  }

  genReport(type: string, data: any,cond:any = []) {
    const lasyP = '/' + JSON.stringify(cond);
    return lastValueFrom(this.http.post(`${environment.apiUrl}/report/getReport/${type}${lasyP}`, data,{
      responseType: 'blob',
    }));
  }
  
  exportBirthday(ev: any, type: any, cat: any) {
    const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
    const url = `${environment.apiUrl}/sponsor/exportRemember${lasyP}/${type}/${cat}`;
    const fileName = `${AppConstant.ORG_NAME}-SPONSOR-${type}` || '';
    return this.downloadHelper.downloadApi(url, 'GET', fileName);
  }


  checkRequestExists = (data: any, type: 'SPONSORSHIP' = 'SPONSORSHIP'): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      console.log(data)
      if (+(data.modify_request || 0) == 1) {
        resolve(false);
        return;
      }
      this.getSponsorship(data.id).then((res: ResponseData | any | any) => {
        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
          if (res.result) {
            if (+res.result.modify_request == 0) {
              resolve(true);
            }
          }
        }
        resolve(false);
      }).catch(err => {
        reject(true);
      })
    });
  }
}
