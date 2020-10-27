import { Component, OnInit } from '@angular/core';
import { Interaction } from '../../store/chat.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as actions from '../../store/chat.actions'
import { ChatService } from '../chat.service';

@Component({
  selector: 'gdev-typing-area',
  templateUrl: './typing-area.component.html',
  styleUrls: ['./typing-area.component.scss']
})
export class TypingAreaComponent implements OnInit {

  message: string

  constructor (
    private store: Store<AppState>,
    private _chat: ChatService
  ) {
    
   }

  ngOnInit(): void {
  }

  onSend() {
    this.store.dispatch( actions.send( {message: this.message} ) )
    this._chat.sendMessage$.next(this.message)
    this.message = ''
  }

  cleanConversation() {
    this.store.dispatch(actions.clean())
  }

}
