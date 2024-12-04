import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstant } from 'src/app/helper/class/app-constant';
import { AuthService } from 'src/app/helper/service/auth.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  title = AppConstant.TITLE
  logo = AppConstant.LOGO_SRC;
  theme_color = '#417adf'
  theme = `background-color: ${ this.theme_color} `
  constructor(private auth: AuthService , private router : Router) { }

  ngOnInit(): void {
    if(this.router.url.includes('pw')){
      this.theme = `background-color: #1c6485 `
    }
    
  }

}
