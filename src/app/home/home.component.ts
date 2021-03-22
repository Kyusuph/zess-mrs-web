import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isOpen = false;
  menus = [
    {
      name: 'Case',
      route: '/case',
      icon: 'case.png',
    },
    {
      name: 'Patients',
      route: '/patients',
      icon: 'patients.png',
    },
    {
      name: 'Customers',
      route: '/customers',
      icon: 'customers.png',
    },
    {
      name: 'Users',
      route: '/users',
      icon: 'users.png',
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

  check(event) {

  }

}
