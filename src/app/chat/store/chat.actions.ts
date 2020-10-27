import { createAction, props } from '@ngrx/store';
import { MessageType, Interaction, QuickResponse, Image } from './chat.model';

export const send = createAction(
    '[INTERACTION] send',
    props<{ message: string | QuickResponse[] | Image  }>()
);

export const recive = createAction(
    '[INTERACTION] recive',
    props<{ message: string | QuickResponse[] | Image  }>()
)

export const clean = createAction(
    '[INTERACTION] clean',
)

export const toggle = createAction( '[LISTEN] toggle' )
export const open = createAction('[LISTEN] open')
export const close = createAction('[LISTEN] close')


