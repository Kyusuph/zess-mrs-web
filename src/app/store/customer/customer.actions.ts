import { createAction, props } from '@ngrx/store';
import { Customer } from './customer.model';

export const loadCustomers = createAction(
  '[Customer] Load Customers'
);


export const upsertCustomer = createAction('[Customer] Upsert Customer', props<{ customer: Customer }>());
export const upsertCustomers = createAction('[Customer] Upsert Customers', props<{ customers: Customer[] }>());



