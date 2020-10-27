import { Injectable } from '@angular/core';
import { Interaction } from '../store/chat.model';
import { Store } from '@ngrx/store';
import * as actions from '../store/chat.actions'
import { map, switchMap, take, pluck } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppState } from '../../app.state';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  conversation

  constructor (
    private store: Store<AppState>
  ) { }

  opened = this.store.select('chat').pipe(map( chat => chat.isOpened))
  
  toggleChatbox() {
    this.store.dispatch(actions.toggle())
  }

  sendMessage$: Subject<string> = new Subject()

  reciveMessage(message) {
    this.store.dispatch(actions.recive(message))
  }
  
  restoreConvesation(conversation: Interaction[]) {
    conversation.forEach( interaction => {
      if ( interaction.emiter = 'this' ) {
        this.store.dispatch(actions.send({message: interaction.message}))
      } else {
        this.store.dispatch(actions.recive({message: interaction.message}))
      }
       
    })
  }
}

