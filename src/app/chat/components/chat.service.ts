import { Injectable } from '@angular/core';
import { Interaction, QuickResponse } from '../store/chat.model';
import { Store } from '@ngrx/store';
import * as actions from '../store/chat.actions';
import {
    map,
    switchMap,
    take,
    pluck,
    distinctUntilChanged,
    tap,
} from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { AppState } from '../../app.state';
import { CacheService } from '../../Gdev-Tools/cache/cache.service';
import { HttpClient } from '@angular/common/http';
import {
    ResultResponse,
    SimpleModel,
    RespuestaBuscarModel,
} from '../../public/components/agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuesta.model';
import { RespuestaCard } from '../../public/components/agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuestasIntent.model';
import { Sugerencia } from '../../public/components/agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuesta.model';
import { UserInterface } from '../../admin/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    conversation;
    private _function =
        'https://us-central1-main-agentesmart.cloudfunctions.net/dialogflow/';
    private _localhost =
        'http://localhost:5000/main-agentesmart/us-central1/dialogflow/';
    private _url = this._localhost + 'session';
    private _projectId: string;
    private _sessionId: string;
    private _clientId: string;

    constructor(
        private _store: Store<AppState>,
        private _cache: CacheService,
        private _http: HttpClient
    ) {
        this.sendMessage();
        this._projectId = this._cache.getDataKey<string>('projectId');
        this._clientId = this._cache.getDataKey<UserInterface>('user').uid;
    }

    opened = this._store.select('chat').pipe(map((chat) => chat.isOpened));

    toggleChatbox() {
        this._store.dispatch(actions.toggle());
    }

    sendMessage$: Subject<string> = new Subject();

    //   reciveMessage(message) {
    //     this._store.dispatch(actions.recive(message))
    //   }

    restoreConvesation(conversation: Interaction[]) {
        conversation.forEach((interaction) => {
            if ((interaction.emiter = 'this')) {
                this._store.dispatch(
                    actions.send({ message: interaction.message })
                );
            } else {
                this._store.dispatch(
                    actions.recive({ message: interaction.message })
                );
            }
        });
    }

    sendMessage(): Subscription {
        // this._store.pipe(
        //     tap(r => console.log(r))
        // ).subscribe(act => console.log(act))

        return this.sendMessage$
            .subscribe((message: string) => {

                // build body
                var body = {
                    projectId: this._projectId,
                    textInput: message,
                    clientId: this._clientId,
                };

                // search for sessionId in storage
                this._sessionId = this._cache.getDataKey('currentSession');
                if ( this._sessionId ) body[ 'sessionId' ] = this._sessionId;
                // search for contexts in storage
                let inputContexts = this._cache.getDataKey( 'inputContexts' );
                if (inputContexts) body[ 'inputContexts' ] = inputContexts

                this._http
                    .post(this._url, body, { responseType: 'json' })
                    .subscribe( ( response ) => {
                        // save the sessionId in storage
                        this._cache.updateData('currentSession',response['session'])
                        // save the contexts in storage
                        this._cache.updateData('inputContexts',response['contextos'])
                        
                        this.reciveMessage(response['respuestas']);
                    });
            });
    }

    reciveMessage(respuestas: ResultResponse[]) {
        if (respuestas.length > 0) {
            respuestas.forEach((resp) => {
                if (resp != null) {
                    if (resp instanceof SimpleModel) {
                        if (resp.suggestions.length > 0) {
                            this.sendSuggestions(resp.suggestions)
                        }
                    } else if (resp instanceof RespuestaBuscarModel) {
                        this.sendCard(resp.card);
                    } else {
                        this._store.dispatch(
                            actions.recive({ message: resp.text })
                        );
                    }
                }
            });
        } else {
            this._store.dispatch(
                actions.recive({ message: 'Entendí lo que dijiste pero no sé qué responder.'})
            );
        }
    }

    sendSuggestions(sugerencias: Sugerencia[]) {
        let suggestions:QuickResponse[] = sugerencias.map(
            (sug) => {
                return {
                    displayText: sug.text,
                    value: sug.contexto,
                };
            }
        );
        this._store.dispatch(actions.recive({message: suggestions}))
    }

    sendCard(card: RespuestaCard) {
        this._store.dispatch(actions.recive({ message: card.title }));
        this._store.dispatch(actions.recive({ message: card.subtitle }));
        this._store.dispatch(actions.recive({ message: card.imageUri }));
        this._store.dispatch(actions.recive({ message: card.body }));
        this._store.dispatch(actions.recive({ message: card.buttons }));
    }
}
