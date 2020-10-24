import { ChatState } from './Gdev-Tools/chat/store/chat.state';
import { MensajeState } from './public/components/agentes/agente/mensajes/mensaje.model';
import { ActionReducerMap } from '@ngrx/store';
import { mensajeReducer } from './public/components/agentes/agente/mensajes/mensaje/store/mensaje.reducer';
import { conversation } from './Gdev-Tools/chat/store/chat.reducer';
import { TipoState } from './public/components/agentes/agente/tipos/store/tipo.state';
import { tiposReducer } from './public/components/agentes/agente/tipos/store/tipo.reducer';

export interface AppState {
    editIntent: MensajeState,
    chat: ChatState,
    tipos: TipoState[]
}

export const appReducers: ActionReducerMap<AppState> = {
    editIntent: mensajeReducer,
    chat: conversation,
    tipos: tiposReducer
}