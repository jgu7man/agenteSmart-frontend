import {createAction, props} from "@ngrx/store";
import {UserInterface} from '../auth.service';




// export const setAuthState = createAction('[AUTH] set logged')
// export const setGdevLoading = createAction('[AUTH] set unlogged')
export const setLogged = createAction('[AUTH] set logged', props<{user: UserInterface}>())
export const setUnlogged = createAction('[AUTH] set unlogged')