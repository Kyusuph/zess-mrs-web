import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Dictionary } from '@ngrx/entity';
import { Customer } from './customer.model';
import * as customerActions from './customer.actions';


export const customerFeatureKey = 'customer';


export interface State extends EntityState<Customer> {
  loading: boolean;
  loaded: boolean;

}

export const adapter: EntityAdapter<Customer> = createEntityAdapter<Customer>();
export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
})

export const reducer = createReducer(
  initialState,
  on(customerActions.upsertCustomer, (state, { customer}) => {
    return adapter.upsertOne(customer, state);
  }),
  on(customerActions.upsertCustomers, (state, { customers}) => {
    return adapter.upsertMany(customers, state);
  }),
);

export function customerReducer(state: State | undefined, action: Action) {
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

