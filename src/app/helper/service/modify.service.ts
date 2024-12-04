import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MODULE_NAME, RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { isEmptyObj, isExistsKey, jsonParse, mysqlDataTime } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { roleMap } from 'src/app/helper/interface/user';
import { ModalService } from 'src/app/shared/service/modal.service';
import { environment } from 'src/environments/environment';
import { modifyApi } from '../interface/modifyRequest';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ModifyService {
    module = MODULE_NAME;
    userRoleData: roleMap = {} as roleMap;
    modifyDataReview: modifyApi = {} as modifyApi;
    constructor(private http: HttpClient, private alertService: AlertService,
        private auth: AuthService,
        private modalService: ModalService) {
    }
    setReviewData(d: any) {
        this.modifyDataReview = d;
    }
    clearReviewData() {
        this.modifyDataReview = {} as modifyApi;
    }
    getById(id: string | number) {
        return lastValueFrom(this.http.get(`${environment.apiUrl}/modifyRequest/getById/${id}`));
    }
    getByDetails(id: string | number) {
        return lastValueFrom(this.http.get(`${environment.apiUrl}/modifyRequest/getDetails/${id}`));
    }
    saveModify(data: any) {
        return lastValueFrom(this.http.post(`${environment.apiUrl}/modifyRequest/saveRequest`, data));
    }
    rejectApi(id: any) {
        return lastValueFrom(this.http.get(`${environment.apiUrl}/modifyRequest/reject/${id}`));
    }
    getList(ev: any) {
        const lasyP = isEmptyObj(ev) ? '' : '/' + JSON.stringify(ev);
        return lastValueFrom(this.http.get(`${environment.apiUrl}/modifyRequest/getList${lasyP}`));
    }
    getRequestData(id: any) {
        return new Promise<boolean>((resolve, reject) => {
            this.getByDetails(id).then((res: ResponseData | any ) => {
                if (res.statusCode == RESPONSE_CODE.SUCCESS) {
                    resolve(res.result);
                } else {
                    reject(res)
                }
            })
        });
    }

    saveModification(apiPayload: modifyApi, data: any, sourceData = {}, type: 'NEW' | 'REVERT' | 'ANSWER' = 'NEW') {
        return new Promise<boolean>((resolve, reject) => {
            const msg = type == 'NEW' ? 'Do you want to send this Profile for approval ?' : type == 'REVERT' ? 'Are you sure to sent Query to Applicant ?' : 'Are you sure to applied changes to Admin ?';
            this.modalService.openConfirmDialog({ type: 'CONFIRM', formField: [{ colName: 'query_remark', title: 'Remarks', validator: [{ name: 'required' }] }], isFormField: type == 'REVERT', message: msg, title: 'Modification Request' }).then(res => {
                if (res) {
                    const user_id = this.auth.currentUserValue.user_id, userNae = this.auth.currentUserValue.fname, curD = mysqlDataTime();
                    if (data?.id) {
                        data.created_byName = userNae;
                        data.created_by = user_id;
                    } else {
                        data.last_modify_byName = userNae;
                        data.last_modify_by = user_id;
                    }
                    data.updated_at = curD;
                    data['last_modify_name'] = userNae;
                    apiPayload.request_data = data;
                    apiPayload.source_data = sourceData;
                    apiPayload.status = type == 'REVERT' ? 4 : 2;
                    if (type != 'NEW' && !apiPayload.id) {
                        reject('Rejected id Required');
                    }
                    this.saveModify(apiPayload).then((res: ResponseData | any) => {
                        this.clearReviewData();
                        if (res.statusCode == RESPONSE_CODE.SUCCESS) {
                            this.alertService.showToast('You Request has been Applied', 'success');
                            resolve(true);
                        } else {
                            this.alertService.showToast('You Request has not Registered', 'error');
                            reject(true);
                        }
                    }).catch(err => {
                        reject(true);
                    })
                } else {
                    resolve(false);
                }
            })
        });
    }

    approveModification(approveRequest: any, data: any) {
        const user_id = this.auth.currentUserValue.user_id;
        return new Promise<{ msg: string, status: boolean }>((resolve, reject) => {
            if (!data.id) {
                reject('id not defined');
            }
            this.modalService.openConfirmDialog({ type: 'CONFIRM', title: 'Confirm Approve', message: 'Are you sure to Approve this Request ?' }).then(res => {
                if (res) {
                    //check id still in progress
                    this.getById(data.id).then((resId:  ResponseData | any) => {
                        if (isExistsKey(resId, ['result', 'status']) === true) {
                            if (+resId.result.status == 2) {
                                //call clien api 
                                approveRequest().then((apiRes: any) => {
                                    if (apiRes) {
                                        const req: any = data;
                                        req.action_by = user_id;
                                        req.status = 1;
                                        req.request_data = JSON.stringify(req.request_data);
                                        this.saveModify(req).then((apiRes: any) => {
                                            if (apiRes) {
                                                resolve({ msg: 'Request Has been Approved', status: true });
                                            }
                                        }).catch((err: any) => {
                                            console.log(err)
                                            reject('Unable to handle your request');
                                        });
                                    }
                                }).catch((err: any) => {
                                    console.log(err)
                                    reject('Unable to handle your request');
                                    //reject(err)
                                });
                                // end of api call
                            } else {
                                resolve({ msg: 'Request Has been actioned by someone', status: false });
                            }
                        } else {
                            reject("we could'nt find your records");
                        }
                    }).catch(err => {
                        reject('unable to fetch the result');
                    });

                } else {
                    reject('denied your request');
                }
            });
        });
    }



    rejectModification(rejectRequest: any, data: any) {
        return new Promise<{ msg: string, status: boolean }>((resolve, reject) => {
            const user_id = this.auth.currentUserValue.user_id || '';
            if (!data.id) {
                reject('id not defined');
            }
            this.modalService.openConfirmDialog({ title: 'Confirm Reject', message: 'Are you sure to Reject this Request ?' }).then(res => {
                if (res) {
                    this.rejectApi(data.id).then((resId:  ResponseData | any) => {
                        if (isExistsKey(resId, ['result', 'status']) === true) {
                            if (+resId.result.status == 2) {
                                rejectRequest().then((apiRes: any) => {
                                    if (apiRes) {
                                        const req: any = data;
                                        req.action_by = user_id;
                                        req.status = 3;
                                        req.request_data = JSON.stringify(req.request_data);
                                        this.saveModify(req).then((apiRes: any) => {
                                            if (apiRes) {
                                                resolve({ msg: 'Request Has been Rejected successfully', status: true });
                                            }
                                        }).catch((err: any) => {
                                            console.log(err)
                                            reject('Unable to handle your request');
                                        });
                                    }
                                }).catch((err: any) => {
                                    console.log(err)
                                    reject('Unable to handle your request');
                                });
                            } else {
                                resolve({ msg: 'Request Has been actioned by someone', status: false });
                            }
                        } else {
                            reject("we could'nt find your records");
                        }
                    });
                } else {
                    reject('denied your request');
                }
            });
        });
    }

    reject(id: any) {
        return new Promise<{ msg: string, status: boolean }>((resolve, reject) => {
            if (!id) {
                reject('id not defined');
            }
            this.modalService.openConfirmDialog({ title: 'Confirm Reject', message: 'Are you sure to Reject this Request ?' }).then(res => {
                if (res) {
                    this.rejectApi(id).then((resData: ResponseData | any) => {
                        if (resData.statusCode == RESPONSE_CODE.SUCCESS) {
                            this.clearReviewData();
                            resolve({ msg: 'Request Has been Rejected successfully', status: true });
                        }
                    }).catch((err) => reject({ msg: 'Unable to handle your request', status: false }))
                }else {
                    reject({ msg: 'Request Denied By User', status: false })
                }
            })
        })
    }
    approve(approveRequest: any, data: any) {
        const payload = data.request_data;
        payload.modify_request_id = data.id;
        return new Promise<{ msg: string, status: boolean, result: any }>((resolve, reject) => {
            if (!approveRequest) {
                reject('Api Not Passed');
            }
            this.modalService.openConfirmDialog({ title: 'Confirm Reject', message: 'Are you sure to Approve this Request ?' }).then(res => {
                if (res) {
                    payload.modify_request = 0;
                    approveRequest(payload).then((resData: ResponseData) => {
                        if (resData.statusCode == RESPONSE_CODE.SUCCESS) {
                            this.clearReviewData();
                            resolve({ msg: 'Request Has been Approved successfully', status: true, result: resData.result });
                        }
                    }).catch((err: any) => reject({ msg: 'Unable to handle your request', status: false, result: {} }))
                } else {
                    reject({ msg: 'Request Denied By User', status: false })
                }
            })
        })
    }

    review(data: modifyApi) {
        const payload = data.request_data;
        payload.modify_request_id = data.id;
        return new Promise<{ msg: string, status: boolean, result: any }>((resolve, reject) => {
            this.modalService.openConfirmDialog({ title: 'Confirm Review', formField: [{ colName: 'remarks', title: 'remarks', validator: [{ name: 'required' }] }], message: 'Are you sure to send the Request to Review ?' }).then(res => {
                if (res) {
                    payload.status = 4;
                    this.saveModify(payload).then((resData: ResponseData | any ) => {
                        if (resData.statusCode == RESPONSE_CODE.SUCCESS) {
                            this.clearReviewData();
                            resolve({ msg: 'Request Has been Applied for Review', status: true, result: resData.result });
                        }
                    }).catch((err: any) => reject({ msg: 'Unable to handle your request', status: false, result: {} }))
                }else {
                    reject({ msg: 'Request Denied By User', status: false })
                }
            })
        })
    }
}