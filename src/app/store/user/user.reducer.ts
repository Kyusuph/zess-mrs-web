import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Dictionary } from '@ngrx/entity';
import { User } from './user.model';
import * as userActions from './user.actions';

export const userFeatureKey = 'users';

export interface State extends EntityState<User> {
  loading:boolean;
  loaded:boolean;
  currentUser:User
}


export const adapter: EntityAdapter<User> = createEntityAdapter<User>();
export const initialState: State = adapter.getInitialState({
  loading:false,
  loaded:false,
  currentUser:null
});


export const reducer = createReducer(
  initialState,
  on(userActions.upsertUser, (state, { user }) => {
    return adapter.upsertOne(user, state);
  }),
  on(userActions.upsertUsers, (state, { users }) => {
    console.log('users-reducer', users);
    return adapter.upsertMany(users, state);
  }),
  on(userActions.addCurrentUser, (state, { user }) => {
    return adapter.addOne(user, {
      ...state,
      currentUser: { ...user },
      loading: false,
      loaded: true
    });
  }),
);

  export function userReducer(state: State | undefined, action: Action) {
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
  export const getCurrentUser = (state: State) => state?.currentUser;
