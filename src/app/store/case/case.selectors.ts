import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from './case.reducer';
import * as fromPatientSelector from '../patient/patient.selectors';

export const getCaseState = createFeatureSelector<fromReducer.State>(
    'cases'
);

export const selectAll = createSelector(getCaseState, fromReducer.selectAll);
export const selectDetailed = createSelector(selectAll,fromPatientSelector.selectEntities, (cases,patients) => {
    return cases.map(case_object => {
        return {
            ...case_object,
            patient_name:`${patients[case_object.patient_id].firstName} ${patients[case_object.patient_id].surname}`
        }
    })
})

