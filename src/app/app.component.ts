import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationState } from './store';
import { Go } from './store/router/router.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'zess-mrs-web';
  constructor(private store: Store<ApplicationState>) { }

  ngOnInit() {
  }
}

