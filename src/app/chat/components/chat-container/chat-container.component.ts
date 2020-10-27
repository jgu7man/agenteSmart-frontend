import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Interaction } from '../../store/chat.model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as actions from '../../store/chat.actions'
import { AppState } from '../../../app.state';

@Component({
  selector: 'gdev-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit, OnDestroy {

  public conversation: Interaction[] = []
  storeSubs: Subscription
  @Output() closeChatWindow: EventEmitter<any> = new EventEmitter()
  @Output() sendMessage: EventEmitter<any> = new EventEmitter()
  @Output() reciveMessage: EventEmitter<any> = new EventEmitter()


  constructor (
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    
  }
  
  ngAfterViewInit() {
    this.storeSubs = this.store
      .subscribe( async store => {
      this.conversation = store.chat.conversation
    })
    
  }

  ngOnDestroy(){
    this.storeSubs.unsubscribe()
    this.store.dispatch(actions.clean())
  }

}
