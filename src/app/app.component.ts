import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router,NavigationEnd, ActivatedRoute } from '@angular/router';
import { AppConstant } from './helper/class/app-constant';
import { AlertService } from './helper/service/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = AppConstant.TITLE;
  loading: boolean = false;
  constructor(private alertService: AlertService, private router: Router,private titleServ : Title,
    protected activeRoute: ActivatedRoute) {
    this.titleServ.setTitle(this.title);
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
        console.log("event started",this.activeRoute.snapshot.data)
        console.log("event end")
      }
    });
  }
  ngOnInit(): void {
    this.loading=false;
  }
  onclick() {
    this.alertService.clearToast();
  }
}