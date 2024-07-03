import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { isEmptyObj } from "../class/utilityHelper";
import { userPermission } from "../interface/user";
import { AuthService } from "../service/auth.service";

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard  {
    constructor(private auth: AuthService) { }
    // canActivate(
    //     route: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //     const data: any = route.data.permission || {} as userPermission;
    //     const check_queryParam = route.data.queryParam || false;
    //     if(data.permission == undefined){
    //         return true;
    //     }
    //     if (isEmptyObj(data)) {
    //         return false;
    //     }
    //     let res = false;
    //     const skipParams = ['my_profile', 'my_report','draft'];
    //     if (skipParams.includes(route.queryParams.id)) {
    //         return true;
    //     }

    //     if (check_queryParam && !isEmptyObj(route.queryParams)) {
    //         res = this.auth.checkPermission(data.moduleName, route.data.queryParam);
    //     } else {
    //         res = this.auth.checkPermission(data.moduleName, data.actionName);
    //     }
        
    //     if (!res) {
    //         this.auth.redirectToDenied();
    //     }

    //     return true;
    // }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const data: any = route.data.permission || {} as userPermission;
        const check_queryParam = route.data.queryParam || false;
        let res = false;
        if (data == undefined) {
            return true;
        }
        if (isEmptyObj(data)) {
            return true;
        }

        const skipParams = ['my_profile', 'my_report', 'draft'];
        if (skipParams.includes(route.queryParams.id)) {
            return true;
        }
        let moduleName = data.moduleName, actionName = data.actionName;
        if (!isEmptyObj(route.queryParams)) {
            if (check_queryParam && typeof check_queryParam == 'string') {
                actionName = check_queryParam;
            } else if (typeof check_queryParam == 'object') {
                if (check_queryParam.key) {
                    if (check_queryParam.value) {
                        if (route.queryParams[check_queryParam.key] == check_queryParam.value || '') {
                            moduleName = check_queryParam.moduleName;
                            actionName = check_queryParam.actionName;
                        }
                    } else {
                        moduleName = check_queryParam.moduleName;
                        actionName = check_queryParam.actionName;
                    }
                }
            }
        }
        res = this.auth.checkPermission(data.moduleName, data.actionName);
        if (!res) {
            // this.auth.redirectToDenied();
            this.auth.redirectToDashboard();
        }

        return true;
    }
}