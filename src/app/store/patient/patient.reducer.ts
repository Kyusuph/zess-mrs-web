import { Action, createReducer, on } from '@ngrx/store';
import { Patient } from './patient.model';
import { EntityState, EntityAdapter, createEntityAdapter, Dictionary } from '@ngrx/entity';
import * as patientActions from './patient.actions';


export const patientFeatureKey = 'patient';

export interface State extends EntityState<Patient> {
  loading:boolean;
  loaded:boolean;
}

export const adapter:EntityAdapter<Patient> = createEntityAdapter<Patient>();
export const initialState = adapter.getInitialState({
  loading:false,
  loaded:false
});


export const reducer = createReducer(
  initialState,
  on(patientActions.upsertPatient, (state, { patient}) => {
    return adapter.upsertOne(patient, state);
  }),
  on(patientActions.upsertPatients, (state, { patients}) => {
    return adapter.upsertMany(patients, state);
  }),

);

export function patientReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
export const getLoading = (state: State) => state?.loading;
export const getLoaded = (state: State) => state?.loaded;

