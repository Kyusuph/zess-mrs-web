import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from './patient.reducer';

export const getPatientState = createFeatureSelector<fromReducer.State>('patient');

export const selectAll = createSelector(getPatientState, fromReducer.selectAll);
export const selectEntities = createSelector(getPatientState, fromReducer.selectEntities);

