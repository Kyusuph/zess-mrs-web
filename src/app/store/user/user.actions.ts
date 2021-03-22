import { createAction, props } from '@ngrx/store';
import { User } from './user.model';

export const loadUsers = createAction('[User] Load Users');

export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ data: any }>());

export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: any }>());

export const upsertUser = createAction('[User] Upsert User', props<{ user: User }>());

export const upsertUsers = createAction('[User] Upsert users', props<{ users: User[] }>());

export const addCurrentUser = createAction('[User] Add user', props<{ user: User }>());
