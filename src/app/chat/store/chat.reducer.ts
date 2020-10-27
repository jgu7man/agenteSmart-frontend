import { createReducer, on } from '@ngrx/store';
import * as actions from './chat.actions';
import { Interaction } from './chat.model';
import { ChatState } from './chat.state';
import { listening } from './listen.reducer';



const initialState: ChatState = {
    conversation: [],
    isOpened: false
}

export const _conversation = createReducer(initialState,
    
    on( actions.send, ( state, { message } ) => ( {
        ...state,
        conversation: [
            ...state.conversation,
            new Interaction( message, 'this' )
        ],
    })),
    
    on( actions.recive, ( state, { message } ) => ( {
        ...state,
        conversation: [
            ...state.conversation,
            new Interaction( message, 'that' )
        ],
    } ) ),

    on( actions.clean, state => ( {
        ...state,
        conversation: [],
    } ) ),

    on( actions.open, state => ( { ...state, isOpened: true } ) ),
    on( actions.close, state => ( { ...state, isOpened: false } ) ),
    on( actions.toggle, state => ( { ...state, isOpened: !state.isOpened } ) )

);

export function conversation( state, action ) {
    return _conversation(state, action)
}