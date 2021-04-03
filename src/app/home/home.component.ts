import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { routeAnimations } from '../shared/animations/router-animation';
import { ApplicationState } from '../store';
import { Go } from '../store/router/router.action';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routeAnimations]
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
  constructor(private store: Store<ApplicationState>) { }

  ngOnInit(): void {
    if (localStorage.getItem('user-token')) {
    } else {
      console.log('has token')
      this.store.dispatch(new Go({ path: ['login'] }))
    }
  }

  check(event) {

  }

}
