import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Interaction } from '../../store/chat.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as actions from '../../store/chat.actions'
import { ChatService } from '../chat.service';
import { GdevCache } from '../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { pluck } from 'rxjs/operators';
import { GdevLoading } from '../../../gdev-tools/src/lib/loading/loading.service';
import { CurrentAgenteService } from 'src/app/public/components/agentes/agente/current-agente.service';

@Component({
  selector: 'gdev-typing-area',
  templateUrl: './typing-area.component.html',
  styleUrls: ['./typing-area.component.scss']
})
export class TypingAreaComponent implements OnInit {

  message: string
  @ViewChild('messageInput') private messageInput: ElementRef

  constructor (
    private store: Store<AppState>,
    private _chat: ChatService,
    private _cache: GdevCache,
      private _loading: GdevLoading,
    private _agente: CurrentAgenteService,
  ) {
    this.store.select( 'chat' ).pipe( pluck( 'isOpened' ) )
      .subscribe( async ( opened: boolean ) => {
        if ( opened ) {
          await this._loading.waitFor(500)
          this.messageInput.nativeElement.focus()
        }
      } )
   }

  ngOnInit(): void {
  }

  onSend() {
    this.store.dispatch(actions.send({message: this.message}))
    console.log(this.message);
    this._chat.sendMessage$.next(this.message)
    this.message = ''
  }

  cleanConversation() {
    this.store.dispatch(actions.clean())
    // this._cache.deleteDataKey( 'currentSession' )
    // this._cache.deleteDataKey( 'inputContexts')
      this._agente.cleanTestChat()
  }

}
