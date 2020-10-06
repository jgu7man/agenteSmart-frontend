import { createReducer, on } from '@ngrx/store';
import * as actions from './mensaje.actions';
import { MensajeModel, IntentModel } from '../../mensaje.model';

// const currentMensaje = JSON.parse( sessionStorage.getItem( 'as-data' ) ).currentMensaje;

export const initialState: IntentModel = {}

const _mensajeReducer = createReducer( initialState,
    on( actions.getData, ( state, mensaje ) => {
        state = {...state, ...mensaje}
        return state
    } ),
    on( actions.getOutMensaje, ( state ) => {
        state = {}
        return state
    } ),
    on( actions.changeData, ( state, mensaje ) => {
        state = { ...state, ...mensaje }
        return state
    } ),
);


export function mensajeReducer( state, action ) {
    return _mensajeReducer( state, action );
}



