import {
    ActionReducerMap,
    createFeatureSelector,
    MetaReducer,
} from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';
import * as fromUser from './user/user.reducer';
import { environment } from '../../environments/environment';
import { RouterStateUrl } from './router/router.reducer';
import * as fromCases from './case/case.reducer';
import * as fromMeasurements from './measurement/measurement.reducer';
import * as fromPatient from './patient/patient.reducer';
import * as fromCustomer from './customer/customer.reducer';
export interface ApplicationState {
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
    users: fromUser.State,
    cases: fromCases.State,
    patient: fromPatient.State,
    customer: fromCustomer.State,
    measurements: fromMeasurements.State
}

export const reducers: ActionReducerMap<ApplicationState> = {

    routerReducer: fromRouter.routerReducer,
    users: fromUser.userReducer,
    cases: fromCases.caseReducer,
    patient: fromPatient.patientReducer,
    customer: fromCustomer.customerReducer,
    measurements: fromMeasurements.measurementReducer
};

export const metaReducers: MetaReducer<
    ApplicationState
>[] = !environment.production ? [] : [];

export const getRouteState = createFeatureSelector<
    fromRouter.RouterReducerState<RouterStateUrl>
>('routerReducer');
