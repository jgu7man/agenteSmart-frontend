import { Injectable } from '@angular/core';
import { IntentModel } from '../mensajes/mensaje.model';
import { CurrentAgenteService } from '../current-agente.service';
import { MensajesService } from '../mensajes/mensajes.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { GdevLoading } from 'src/app/gdev-tools/src/lib/loading/loading.service';
import { GdevAlert } from 'src/app/gdev-tools/src/lib/alert/alert.service';
import { GdevCache } from 'src/app/gdev-tools/src/lib/cache/gdev-cache.service';
import { CurrentMensajeService } from '../mensajes/mensaje/current-mensaje.service';

@Injectable({
    providedIn: 'root',
})
export class AgentConfigService {
  constructor (
      private _agente: CurrentAgenteService,
      private _mensajes: MensajesService,
      private fs: AngularFirestore,
      private _loading: GdevLoading,
      private _alerts: GdevAlert,
      private _cache: GdevCache,
      private _mensaje: CurrentMensajeService
    ) {}

    async restoreDefaultIntent(
        intent: 'Default Welcome Intent' | 'Default Fallback Intent' | 'Default Context Intent'
    ) {

        // Init process
        this._loading.toggleWaitingSpinner('open')
        var intentList: IntentModel[] = await this._cache.getAsyncKey<IntentModel[]>('intents')

        console.log( 'Search for intent' );
        if ( intentList && intentList.length > 0 ) {
            var defaultIntent: IntentModel = intentList.find(
                ( i ) => i.displayName == intent
            );

            if ( defaultIntent ) {
                console.log('Delete for default Intent');
                // DELETE INTENT
                this._mensaje.delete(defaultIntent.name)
            }
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
      let path = this._cache.getDataKey<string>('agentePath')
        await this.fs
            .collection(path+'/mensajes')
            .doc(resourceID)
            .set( {
                name: resourceID,
                displayName: defaultIntent.displayName
            } );

        console.log( 'Process finished' );
        this._mensajes.getDialogFlowIntents()

        this._loading.toggleWaitingSpinner( 'close' )
        this._alerts.sendFloatNotification(intent+' creado')
    }
}
