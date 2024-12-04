import { Component, OnInit } from '@angular/core';
import { AppConstant } from 'src/app/helper/class/app-constant';
import { AuthService } from 'src/app/helper/service/auth.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit {
  shortTitle = AppConstant.ORG_NAME;
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }
  goHome() {
    this.auth.redirectToDashboard();
  }
}
