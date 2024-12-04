import { Component, OnInit } from '@angular/core';
import { UrlServices } from 'src/app/helper/class/url-services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  UrlService = UrlServices
  constructor() { }

  ngOnInit(): void {
  }

}
