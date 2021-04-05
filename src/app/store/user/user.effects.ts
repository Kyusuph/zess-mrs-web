import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ApplicationState } from '..';
import * as userActions from './user.actions';
import { upsertUsers } from './user.actions';



@Injectable()
export class UserEffects {



  constructor(private actions$: Actions, private userService: UserService, private store: Store<ApplicationState>) { 
    console.log('effect')
  }

  users$ = createEffect(() => this.actions$.pipe(ofType(userActions.getUsers), mergeMap(() => this.userService.getUsers().pipe(map(users => userActions.upsertUsers({users})
  ), catchError(() => EMPTY)))));

}
