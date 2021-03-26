import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromReducer from './measurement.reducer';

export const getMeasurementState = createFeatureSelector<fromReducer.State>(
    'measurements'
);

export const selectAll = createSelector(getMeasurementState, fromReducer.selectAll);

