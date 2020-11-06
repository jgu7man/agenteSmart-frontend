import { createReducer, on } from '@ngrx/store';
import * as actions from './auth.actions';
import { UserInterface } from '../auth.service';
import {UserAuth} from './auth.model';


const User: UserInterface = {
    uid: '',
    email: '',
}
export const initialState: UserAuth = new UserAuth(User)

const _authReducer = createReducer(initialState,
    on(actions.setLogged, (state, {user}) => {
        return {
            ...state,
            user: user,
            logged: true
        }
    }),
    on(actions.setUnlogged, (state) => {
        return {
            ...state,
            user: User,
            logged: false
        }
    }),
);

export function authReducer( state, action ) {
    return _authReducer( state, action );
}