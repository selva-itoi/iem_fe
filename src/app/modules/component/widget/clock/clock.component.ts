import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {

   weekdays=['Sunday','Monday','Tuesday','Wedneday','Thrusday','Friday','Saturday' ];
   date = new Date();
   hours:any;
   minutes :string='';
   seconds :string='';
   ampm :string='';
   days :string='';


  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      const date = new Date();
      this.updatedate(date);
    }, 1000)

    this.days = this.weekdays[this.date.getDay()]; 
    console.log(`clock ${this.days} ${this.hours,this.minutes,this.seconds} ${this.ampm}`)
  
  }
  updatedate(date:Date){
    const hours = date.getHours();
    this.ampm = hours >= 12 ? 'PM' : 'AM';
    this.hours = hours % 12;
    this.hours = this.hours ? this.hours: 12;
    this.hours = this.hours < 10 ? '0' + this.hours : this.hours;
    const minutes = date.getMinutes();
    this.minutes = minutes < 10 ? '0' + minutes : minutes.toString();
    const seconds = date.getSeconds();
    this.seconds = seconds < 10 ? '0' + seconds : seconds.toString();
  }
 

}
