import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import * as actions from './chat.actions';

export interface OpenState {
    isOpened: boolean
}

const initialState: OpenState = {
    isOpened: false
}

const _listening = createReducer( initialState,
    on( actions.open,  ( state ) => ({...state, isOpened: true}) ),
    on( actions.close, ( state ) => ({...state, isOpened: false}) )
)

export function listening( state, action ) {
    return _listening(state, action)
}