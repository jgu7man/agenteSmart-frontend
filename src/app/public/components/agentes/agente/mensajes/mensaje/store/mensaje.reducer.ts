import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import * as actions from './mensaje.actions';
import { MensajeModel, IntentModel, FraseEntrenamiento, ParametroMensaje } from '../../mensaje.model';
import { MensajeState } from '../../mensaje.model';


export const initialState: MensajeState = new MensajeState()

const _mensajeReducer = createReducer( initialState,
    on( actions.setUnsaved, ( state ) => { return { ...state, unsaved: true } } ),
    on( actions.setSaved, ( state ) => { return { ...state, unsaved: false } } ),
    on( actions.getOutMensaje, ( state ) => { return {} } ),
    
    );
    


export function mensajeReducer( state, action ) {
    return _mensajeReducer( state, action );
}



