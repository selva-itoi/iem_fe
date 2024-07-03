import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from 'src/app/helper/class/page-menu';
import { UrlServices } from 'src/app/helper/class/url-services';

@Component({
  selector: 'app-user-left-side-bar',
  templateUrl: './user-left-side-bar.component.html',
  styleUrls: ['./user-left-side-bar.component.scss']
})
export class UserLeftSideBarComponent implements OnInit {
  urlService = UrlServices;
  menu: any;
  constructor() { }

  ngOnInit(): void {
    this.setUserMenus()
  }

  setUserMenus() {
    const filterRoles = [], menuItems: any = [];

    MENU_ITEMS.forEach((item, index) => {
      let isAllowed = false;
      // console.log('menu item ' + index, item);
      //this.authService.currentUserValue.authorities.forEach((authRole) => {
      // console.log('user authorities ' + authRole);
      //if ((item.data && item.data.roles.indexOf(authRole) !== -1 && filterRoles.indexOf(item.title) === -1) || !item.data.roles) {
      isAllowed = true;
      // filterRoles.push(item.title);
      // }
      //});
      if (isAllowed) {
        menuItems.push(item);
      }
    });
    this.menu = menuItems;
    // console.log('Filtered menu items...', menuItems, filterRoles);
  }
}
