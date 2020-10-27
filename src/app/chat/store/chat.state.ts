import { Interaction } from './chat.model';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import { conversation } from "./chat.reducer";
import { listening, OpenState } from './listen.reducer';


export interface ChatState {
    conversation: Interaction[],
    isOpened: boolean
}