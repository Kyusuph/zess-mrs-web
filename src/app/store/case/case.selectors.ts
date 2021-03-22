import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromReducer from './case.reducer';

export const getCaseState = createFeatureSelector<fromReducer.State>(
    'cases'
);

export const selectAll = createSelector(getCaseState, fromReducer.selectAll);

