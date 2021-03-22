import { Action, createReducer, on } from '@ngrx/store';
import { Case } from './case.model';
import { EntityState, EntityAdapter, createEntityAdapter, Dictionary } from '@ngrx/entity';
import * as caseActions from './case.actions';

export const caseFeatureKey = 'cases';

export interface State extends EntityState<Case> {
  loading: boolean;
  loaded: boolean;

}

export const adapter: EntityAdapter<Case> = createEntityAdapter<Case>();
export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
})

export const reducer = createReducer(
  initialState,
  on(caseActions.upsertCase, (state, { caseObject}) => {
    return adapter.upsertOne(caseObject, state);
  }),
  on(caseActions.upsertCases, (state, { cases}) => {
    return adapter.upsertMany(cases, state);
  }),
);

export function caseReducer(state: State | undefined, action: Action) {
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



