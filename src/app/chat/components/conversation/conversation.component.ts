import { AppState } from './../../../app.state';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Interaction, MessageType, QuickResponse, Image } from '../../store/chat.model';
import { BehaviorSubject } from 'rxjs';
import { GdevText } from '../../../gdev-tools/src/lib/text/gdev-text.service';
import { GdevLoading } from '../../../gdev-tools/src/lib/loading/loading.service';
import { Store } from '@ngrx/store';
import * as actions from '../../store/chat.actions'
import { ChatService } from '../chat.service';

@Component({
  selector: 'gdev-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, AfterViewInit {

  messages: Interaction[] = []
  private _conv : BehaviorSubject<Interaction[]> = new BehaviorSubject([]);
  @Input() set conv(conver: Interaction[]) { this._conv.next(conver); }
  get conv() { return this._conv.getValue()}

  @ViewChild( 'messagesContainer' ) public messagesContainer: ElementRef

  constructor (
    private _text: GdevText,
      private _loading: GdevLoading,
      private store: Store<AppState>,
      private _chat: ChatService
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this._conv.subscribe( async conv => {
      this.messages = conv
      await this._loading.waitFor(100)
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight + 50
    })

  }

    messageType(msg: string | QuickResponse | Image) {
        if (typeof msg == 'string') {
            return 'string'
        } else {
            if (msg['src']) {
                return 'image'
            } else {
                return 'quickresponse'
            }
        }
    }


    onSuggest(item) {
        this.store.dispatch(actions.send({ message: item.displayText }))
        this._chat.sendMessage$.next(item.displayText)
    }


  formatDate( fecha: Date ) {
    const hoy = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )


    if ( fecha > hoy ) {
      return this._text.stringifyTime(fecha)
    } else {
      return `${this._text.stringifyShortDate(fecha)} - ${this._text.stringifyTime(fecha)}`
    }
  }

}
