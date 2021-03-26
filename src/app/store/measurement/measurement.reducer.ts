import { Action, createReducer, on } from '@ngrx/store';
import { Measurement } from './measurement.model';
import { EntityState, EntityAdapter, createEntityAdapter, Dictionary } from '@ngrx/entity';
import * as measurementActions from './measurement.actions';

export const measurementFeatureKey = 'measurements';

export interface State extends EntityState<Measurement> {
  loading: boolean;
  loaded: boolean;

}

export const adapter: EntityAdapter<Measurement> = createEntityAdapter<Measurement>();
export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
})

export const reducer = createReducer(
  initialState,
  on(measurementActions.upsertMeasurement, (state, { measurementObject}) => {
    return adapter.upsertOne(measurementObject, state);
  }),
  on(measurementActions.upsertMeasurements, (state, { measurements}) => {
    return adapter.upsertMany(measurements, state);
  }),
);

export function measurementReducer(state: State | undefined, action: Action) {
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



