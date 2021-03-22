import {
    ActionReducerMap,
    createFeatureSelector,
    MetaReducer,
} from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';
import * as fromUser from './user/user.reducer';
import { environment } from '../../environments/environment';
import { RouterStateUrl } from './router/router.reducer';

export interface ApplicationState {
    users: fromUser.State
}

export const reducers: ActionReducerMap<ApplicationState> = {
    users: fromUser.userReducer
};

export const metaReducers: MetaReducer<
    ApplicationState
>[] = !environment.production ? [] : [];

export const getRouteState = createFeatureSelector<
    fromRouter.RouterReducerState<RouterStateUrl>
>('routerReducer');
