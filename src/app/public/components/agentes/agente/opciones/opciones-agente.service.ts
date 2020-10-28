import { Injectable } from '@angular/core';
import { IntentModel } from '../mensajes/mensaje.model';
import { CurrentAgenteService } from '../current-agente.service';
import { MensajesService } from '../mensajes/mensajes.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';

@Injectable({
    providedIn: 'root',
})
export class OpcionesAgenteService {
  constructor (
      private _agente: CurrentAgenteService,
      private _mensajes: MensajesService,
      private fs: AngularFirestore,
      private loading: Loading,
      private _alerts: AlertService
    ) {}

    async restoreDefaultIntent(
        intent: 'Default Welcome Intent' | 'Default Fallback Intent'
    ) {

        // Init process
        this.loading.toggleWaitingSpinner(true)

        console.log('Search for intent');
        var defaultIntent: IntentModel = this._agente.mensajesList.find(
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
            .doc(this._agente.path)
            .collection('mensajes')
            .doc(resourceID)
            .set( defaultIntent );
        
        console.log('Process finished');
        
        this.loading.toggleWaitingSpinner( false )
        this._alerts.sendFloatNotification(intent+' creado')
    }
}
