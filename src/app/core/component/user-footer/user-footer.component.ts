import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-footer',
  templateUrl: './user-footer.component.html',
  styleUrls: ['./user-footer.component.scss']
})
export class UserFooterComponent implements OnInit {

  year = new Date().getFullYear()
  constructor() { }

  ngOnInit(): void {
  }

}
