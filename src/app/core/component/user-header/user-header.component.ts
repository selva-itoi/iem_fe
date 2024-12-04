import { Component, OnInit } from '@angular/core';
import { AppConstant } from 'src/app/helper/class/app-constant';
import { MENU_ITEMS } from 'src/app/helper/class/page-menu';
import { UrlServices } from 'src/app/helper/class/url-services';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { menu } from 'src/app/helper/interface/menu-interface';
import { User } from 'src/app/helper/interface/user';
import { AuthService } from 'src/app/helper/service/auth.service';
import { ModalService } from 'src/app/shared/service/modal.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss'],
})
export class UserHeaderComponent implements OnInit {
  menu: any;
  isDev= !environment.production
  logo = AppConstant.LOGO_SRC;
  title = AppConstant.TITLE
  urlService = UrlServices.PAGE_URL;
  user: User = this.auth.currentUserValue;
  roleName = 'Staff';
  constructor(private auth: AuthService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.setUserMenus();
    this.roleName = this.user.role?.[0].roleName || 'Staff';
  }

  checkPermission(item: any) {
    if (isEmptyObj(item.data?.permission)) {
      return 'empty';
    }
    const mName = item.data?.permission.moduleName;
    const aName = item.data?.permission.actionName;
    const per = this.auth.checkPermission(mName, aName);
    if (mName == 'MONTHLY_REPORT_STAFF' && aName !='PROCESS') {
      if (!per) {
        return 'my_report';
      }
    }
    return per; 

  }

  setUserMenus() {
    const filterRoles: any = [], menuItems: menu[] = [] as menu[];

    MENU_ITEMS.forEach((item, index) => {
      const pM = this.checkPermission(item);
      //skip its false
      if (!pM) {
        return;
      }
      if (item.children?.length) {
        const chMenu: any = [];
        item.children.map((a: any) => {
          const chk = this.checkPermission(a);
          if (chk || chk == 'my_report') {
            if (chk === 'my_report') {
              a.queryParams = { id: 'my_report' }
            }
            chMenu.push(a)
          }
        });
        if (!chMenu.length) {
          return;
        }
        item.children = chMenu;
      }
      menuItems.push(item);
    });
    this.menu = menuItems;
    console.log('menu items ', this.menu);
  }

  openChangePassword() {
    this.modalService.openModal(ChangePasswordComponent, 'modal-md').then(res => {
      if (res) {
        this.auth.logout();
      }
    })
  }

  logout() {
    this.auth.logout();
  }
}
