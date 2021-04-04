import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { routeAnimations } from '../shared/animations/router-animation';
import { ApplicationState } from '../store';
import { Go } from '../store/router/router.action';
import { addCurrentUser } from '../store/user/user.actions';
import { User } from '../store/user/user.model';
import * as userSelector from '../store/user/user.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routeAnimations]
})
export class HomeComponent implements OnInit {
  isOpen = false;
  currentUser$: Observable<User>;
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
    if (localStorage.getItem('current-user-token')) {
      const user = localStorage.getItem('user-object');
      this.store.dispatch(addCurrentUser({ user: JSON.parse(user) }));
      console.log('user', user);
    } else {
      this.store.dispatch(new Go({ path: ['login'] }))
    }
    this.currentUser$ = this.store.pipe(select(userSelector.selectCurrentUser));
  }

  logout() {
    localStorage.clear()
    this.store.dispatch(new Go({ path: ['login'] }));
  }

  check(event) {

  }

}
