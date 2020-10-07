import { ActionReducerMap } from '@ngrx/store';
import { MensajeModel, IntentModel, FraseEntrenamiento, ParametroMensaje } from '../../mensaje.model';
import { RespuestaModel } from '../entrenamiento/respuestas/respuesta.model';
import { mensajeReducer } from './mensaje.reducer';
import { MensajeState } from "../../mensaje.model";




export interface CurrentMensajeState {
    state: MensajeState
}

export const mensajeMap: ActionReducerMap<CurrentMensajeState> = {
    state: mensajeReducer
}