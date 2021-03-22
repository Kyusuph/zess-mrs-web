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
      route: '/users',
      icon: 'case.png',
      helpUrls: ['/userConfiguration/users0.png'],
    },
    {
      name: 'Patients',
      route: '/users',
      icon: 'patients.png',
      helpUrls: ['/userConfiguration/users0.png'],
    },
    {
      name: 'Customers',
      route: '/users',
      icon: 'customers.png',
      helpUrls: ['/userConfiguration/users0.png'],
    },
    {
      name: 'Users',
      route: '/users',
      icon: 'users.png',
      helpUrls: ['/userConfiguration/users0.png'],
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

  check(event) {

  }

}
