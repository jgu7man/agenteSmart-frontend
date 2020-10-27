import { Injectable } from '@angular/core';
import { ChatService } from '../../../chat/components/chat.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { QuickResponse, Image } from '../../../chat/store/chat.model';

@Injectable({
    providedIn: 'root',
})
export class ChatTesterService {
    constructor(private _chat: ChatService) {
        this.sendMessage();
    }

    // TODO Depsite aquí su función
    // Esta función escucha cada que el trigger de enviar mensaje es ejecutado
    sendMessage(): Subscription {
        return this._chat.sendMessage$
            .pipe(distinctUntilChanged())
            .subscribe((message: string) => {
                // Aquí se debe ingtresar el trigger para el backend tomando "message" como la request para dialogflow
            });
    }

    // Esta función recibe la respuesta y la pinta en la ventana
    reciveMessage(message: string | QuickResponse[] | Image) {
        // NOTE Si quieres testear sólo manda un string como respuesta, me falta implementar una lógica para mostrar objetos

        this._chat.reciveMessage(message);
    }
}
