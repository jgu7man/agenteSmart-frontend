import { createReducer, on } from '@ngrx/store';
import * as actions from './mensaje.actions';
import { MensajeModel } from '../../mensaje.model';

const currentMensaje = JSON.parse(sessionStorage.getItem('as-data'))
    ? JSON.parse(sessionStorage.getItem('as-data')).currentMensaje
    : {} ;

export const initialState: MensajeModel = 
new MensajeModel(currentMensaje, '',0,'')

const _mensajeReducer = createReducer( initialState,
    on( actions.getData, ( state, mensaje ) => {
        state.intent = mensaje
        console.log(state, mensaje);
        return state
    } ),
    on( actions.resetData, ( state ) => {
        state = new MensajeModel( currentMensaje, '', 0, '' ) 
        return state
    })
);


export function mensajeReducer( state, action ) {
    return _mensajeReducer( state, action );
}



