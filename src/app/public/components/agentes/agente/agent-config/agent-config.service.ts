import { Injectable } from '@angular/core';
import { IntentModel } from '../mensajes/mensaje.model';
import { CurrentAgenteService } from '../current-agente.service';
import { MensajesService } from '../mensajes/mensajes.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Loading } from 'src/app/Gdev-Tools/loading/loading.service';
import { AlertService } from 'src/app/Gdev-Tools/alerts/alert.service';
import { CacheService } from 'src/app/Gdev-Tools/cache/cache.service';

@Injectable({
    providedIn: 'root',
})
export class AgentConfigService {
  constructor (
      private _agente: CurrentAgenteService,
      private _mensajes: MensajesService,
      private fs: AngularFirestore,
      private loading: Loading,
      private _alerts: AlertService,
      private _cache: CacheService
    ) {}

    async restoreDefaultIntent(
        intent: 'Default Welcome Intent' | 'Default Fallback Intent' | 'Default Options Intent'
    ) {

        // Init process
        this.loading.toggleWaitingSpinner(true)
        var intentList: IntentModel[] = await this._cache.getAsyncKey<IntentModel[]>('intents')

        console.log('Search for intent');
        var defaultIntent: IntentModel = intentList.find(
            ( i ) => i.displayName == intent
        );

        if ( defaultIntent ) {
            console.log('Delete for default Intent');
            // DELETE INTENT
        }

        console.log('Create in dialogflow');
        defaultIntent = await this._mensajes.createNewIntent({
            displayName: intent,
        });
        console.log('Intent seted: ', defaultIntent);

        console.log('Get the ID');
        const resourceID = defaultIntent.name.slice(
            defaultIntent.name.lastIndexOf('/') + 1
        );

        console.log('Save on firestore');
        await this.fs
            .collection(await this._agente.getPath('mensajes'))
            .doc(resourceID)
            .set( defaultIntent );
        
        console.log('Process finished');
        
        this.loading.toggleWaitingSpinner( false )
        this._alerts.sendFloatNotification(intent+' creado')
    }
}
