import { createAction, props } from '@ngrx/store';
import { MessageType, Interaction, QuickResponse, Image } from './chat.model';
import { CardButton } from '../../public/components/agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuestasIntent.model';

export const send = createAction(
    '[INTERACTION] send',
    props<{ message: string | QuickResponse[] | Image | CardButton[]  }>()
);

export const recive = createAction(
    '[INTERACTION] recive',
    props<{ message: string | QuickResponse[] | Image | CardButton[] }>()
)

export const clean = createAction(
    '[INTERACTION] clean',
)

export const toggle = createAction( '[LISTEN] toggle' )
export const open = createAction('[LISTEN] open')
export const close = createAction('[LISTEN] close')


