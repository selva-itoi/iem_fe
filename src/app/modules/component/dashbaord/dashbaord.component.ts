import { Component, OnInit, ViewChild } from '@angular/core';
import { RESPONSE_CODE } from 'src/app/helper/class/app-constant';
import { isEmptyObj } from 'src/app/helper/class/utilityHelper';
import { ResponseData } from 'src/app/helper/interface/response';
import { Concrete, modulInterface } from 'src/app/helper/interface/user';
import { AuthService } from 'src/app/helper/service/auth.service';
import { MapComponent } from 'src/app/shared/map/component/map/map.component';
import { UserApiService } from '../../user/services/user-api.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  data: any = {};
  modifyModule: Concrete<keyof modulInterface>[] = []
  WHETHER_URL = 'https://forecast7.com/en/';
  locationData: any;
  wheather: any;
  staff_id:any;
  Todotask: any;
  Todolist: any = [];
  complete = false;
  popup: boolean = false;
  displayPosition: boolean = false;
  editview: any;
  indexnumber: number = 0;
  style: any;
  showActive: boolean = true;
  Todocompleted: any = [];
  basicData: any;
  basicOptions: any;
  segement = {
    STAFF_BIRTHDAY: 'Staff Birthday',
    STAFF_ANNIVERSARY: 'Staff Anniversary',
    SPONSOR_BIRTHDAY: 'Sponsor Birthday',
    SPONSOR_ANNIVERSARY: 'Sponsor Anniversary',
  }
  currentSegment = this.segement.STAFF_BIRTHDAY;
  segmentVisited:any = {}
  @ViewChild('map') map: MapComponent | undefined;
  constructor(private auth: AuthService, private userApi: UserApiService) { }

  returnZero() {
    return 0;
  }
  changeSegment(s: string) {
    this.currentSegment = s;
    //@ts-ignore
    const key: 'STAFF_BIRTHDAY' | 'SPONSOR_BIRTHDAY' = Object.keys(this.segement).find((k: any) => this.segement[k] === s);
    this.segmentVisited[key] = true;
  }

  ngOnInit(): void {
    this.staff_id = this.auth.currentUserValue.staff_fk_id;
    console.log(this.auth.currentUserValue,'sssqqq')

    // this.modifyModule = this.auth.getModuleByAction(['VIEW_ALL']);
    const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.basicData = {
          labels: ['jan', 'feb', 'mar', 'Apr', 'may', 'jun','jul','aug', 'sep', 'oct', 'nov', 'dec'],
          datasets: [
              {
                  label: 'Members',
                  data: [40, 25, 92, 62,32,60,80],
                  backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                  borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                  borderWidth: 1
              }
          ]
      };

      this.basicOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };
    this.getData();
    this.locationData = this.auth.getLocation() || {};
    if (isEmptyObj(this.locationData)) {
      this.getWhether();
    } else {
      this.WHETHER_URL = this.WHETHER_URL + `/${this.locationData?.data_url}/`;
    }
    this.modifyModule = this.auth.getModuleByAction(['VERIFY'])
  }

  getWhether() {
    this.userApi.getWhether().subscribe((res: any) => {
      this.locationData = res.result;
      this.auth.setLocationData(res.result);
      this.WHETHER_URL = this.WHETHER_URL + `${this.locationData?.data_url}/`;
    });
  }

  getData() {
    this.userApi.getDashboardData().then((res: ResponseData | any) => {
      if (res.statusCode == RESPONSE_CODE.SUCCESS) {
        this.data = res.result
      }
    })
  }
  weather(res: any) {
    this.wheather = res;
    let sunsetTime = new Date(this.wheather.sys.sunset * 1000);
    this.wheather.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date();
    this.wheather.isDay = (currentDate.getTime() < sunsetTime.getTime());
  }
  add() {
    this.Todolist.push(this.Todotask);
    this.Todotask = '';
    console.log('todo', this.Todolist);
  }
  check(index: any) {
    this.complete = !this.complete;
    console.log('ch', this.Todolist[index]);
    if (this.complete) {
      this.style = 'text-decoration : line-through ';
    } else {
      this.style = 'text-decoration : none ';
    }
  }
  delete(index: any) {
    this.Todolist.splice(index, 1)

  }
  edit(index: number) {
    this.indexnumber = index;
    const temp = this.Todolist.slice(0, index + 1);
    console.log('edit', temp[index]);
    this.displayPosition = true;
    this.editview = temp[index];
  }
  update() {
    console.log('log', this.editview);
    this.Todolist.splice(this.indexnumber, 1, this.editview);
    this.displayPosition = false;
  }
  clearAll() {
    this.Todolist = [''];
    console.log('clear', this.Todolist = ['']);
  }
  taskCompleted(index: number) {
    // let comp = this.Todolist.splice(index, 1);
    // this.Todocompleted.push(comp);
  }
  deleteComp(index: any) {
    this.Todocompleted.splice(index, 1)

  }
}