import { ChatState } from './Gdev-Tools/chat/store/chat.state';
import { MensajeState } from './public/components/agentes/agente/mensajes/mensaje.model';
import { ActionReducer, ActionReducerMap, ReducerManager } from '@ngrx/store';
import { mensajeReducer } from './public/components/agentes/agente/mensajes/mensaje/store/mensaje.reducer';
import { Interaction } from './Gdev-Tools/chat/store/chat.model';
import { conversation } from './Gdev-Tools/chat/store/chat.reducer';
import { listening, OpenState } from './Gdev-Tools/chat/store/listen.reducer';

export interface AppState {
    editIntent: MensajeState,
    chat: ChatState
}

export const appReducers: ActionReducerMap<AppState> = {
    editIntent: mensajeReducer,
    chat: conversation,
}