import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from './customer.reducer';


export const getCustomerState = createFeatureSelector<fromReducer.State>(
    'customer'
);

export const selectAll = createSelector(getCustomerState, fromReducer.selectAll);