import { Injectable } from '@angular/core';
import { ChatService } from '../../../chat/components/chat.service';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { QuickResponse, Image } from '../../../chat/store/chat.model';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../../../gdev-tools/cache/cache.service';
import { ResultResponse, SimpleModel, CondicionalModel, RegistroDatosModel, RespuestaBuscarModel } from '../agentes/agente/mensajes/mensaje/entrenamiento/respuestas/respuesta.model';
import {threadId} from 'worker_threads';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ChatTesterService {

    private _url = environment.restURL + 'session';
    private _projectId: string
    private _sessionId: string

    constructor (
        private _chat: ChatService,
        private _http: HttpClient,
        private _cache: CacheService,
        private _store: Store<AppState>
    ) {
        this.sendMessage();
        this._projectId = this._cache.getDataKey<string>('projectId')
    }


    // Esta función escucha cada que el trigger de enviar mensaje es ejecutado
    sendMessage(): Subscription {
        this._store.pipe(
            tap(r => console.log(r))
        ).subscribe(act => console.log(act))


        return this._chat.sendMessage$.pipe(
                distinctUntilChanged(),
                tap(r => console.log(r))
            ).subscribe((message: string) => {
                console.log(message);

                var body = {
                    projectId: this._projectId,
                    textInput: message,
                    userIDs: {
                        userId: 'TEST'
                    }
                }

                // this._sessionId = this._cache.getDataKey('currentSession')
                // if(this._sessionId) body['sessionId'] = this._sessionId
                console.log(body)


                this._http.post(this._url, body, {responseType: 'json'})
                    .subscribe(response => {
                        // this._cache.updateData('currentSession', response['session'])
                        console.log(response['respuestas']);
                        // this.reciveMessage(response['respuestas'])
                    })

            });
    }

    // Esta función recibe la respuesta y la pinta en la ventana
    reciveMessage(respuestas: ResultResponse[]) {
        respuestas.forEach(resp => {

            if (resp instanceof SimpleModel) {
                if (resp.suggestions.length > 0) {
                    let suggestions: QuickResponse[] = resp.suggestions.map(
                        (sug) => {return {displayText: sug.text, value: sug.context}})
                    }
                } else
                if (resp instanceof RespuestaBuscarModel) {
                    // this._chat.reciveMessage(resp.card.title)
                    // this._chat.reciveMessage(resp.card.subtitle)
                    // this._chat.reciveMessage(resp.card.imageUri)
                    // this._chat.reciveMessage(resp.card.body)
                    // this._chat.reciveMessage(resp.card.buttons)
                } else {
                    // this._chat.reciveMessage(resp.text);

                }
            })

    }
}
