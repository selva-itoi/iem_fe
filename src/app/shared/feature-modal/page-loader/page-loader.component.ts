import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss']
})
export class PageLoaderComponent implements OnInit {

  @Input() loading: boolean = false;
  @Input() card: boolean = true;
  @Input() loadingText: string = 'please wait.. fetching data...'
  constructor() { }

  ngOnInit(): void {
  }

}
