import { createAction, props } from '@ngrx/store';

export const loadCurrentUsers = createAction(
  '[CurrentUser] Load CurrentUsers'
);

export const loadCurrentUsersSuccess = createAction(
  '[CurrentUser] Load CurrentUsers Success',
  props<{ data: any }>()
);

export const loadCurrentUsersFailure = createAction(
  '[CurrentUser] Load CurrentUsers Failure',
  props<{ error: any }>()
);

