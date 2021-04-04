import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from './user.reducer';



export const getUserState = createFeatureSelector<fromReducer.State>(
    'users'
);
export const selectIds = createSelector(getUserState, fromReducer.selectIds);

export const selectAll = createSelector(getUserState, fromReducer.selectAll);

export const selectCurrentUser = createSelector(getUserState, fromReducer.getCurrentUser);
