import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from './user.reducer';



export const getUserState = createFeatureSelector<fromReducer.State>(
    'users'
);
export const selectIds = createSelector(getUserState, fromReducer.selectIds);

export const selectAll = createSelector(getUserState, fromReducer.selectAll);

export const selectCurrentUser = createSelector(getUserState, fromReducer.getCurrentUser);

export const selectDetailed = createSelector(selectAll, selectCurrentUser, (users, currentUser) => {
    return users.map(user => {
        return {
            ...user,
            username: user.userCredentials.username,
            actionButtons: {
                view: true,
                edit: currentUser.id !== user.id
            }
        }
    });
})

export const selectById = (id) => createSelector(selectDetailed, (users) => {
    return users.find(user => user.id === id);
})
