import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  userName: string; 
  constructor() { }

  ngOnInit(): void {
   this.userName = localStorage.getItem('currentUser'); 
  }

}
