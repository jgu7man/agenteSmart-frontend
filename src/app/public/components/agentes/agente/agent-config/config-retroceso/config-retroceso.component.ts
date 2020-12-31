import {Component, OnInit} from '@angular/core';
import { MensajeModel, IntentModel } from '../../mensajes/mensaje.model';
import { CurrentAgenteService } from '../../current-agente.service';
import { CurrentMensajeService } from '../../mensajes/mensaje/current-mensaje.service';
import { AlertService } from '../../../../../../gdev-tools/alerts/alert.service';
import { Loading } from '../../../../../../gdev-tools/loading/loading.service';
import { RespuestaModel, SimpleModel, ResultResponse } from '../../mensajes/mensaje/entrenamiento/respuestas/respuesta.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { CacheService } from '../../../../../../gdev-tools/cache/cache.service';

@Component({
    templateUrl: './config-retroceso.component.html',
    styleUrls: ['./config-retroceso.component.scss']
})
export class ConfigRetrocesoComponent implements OnInit {

    intent: MensajeModel
    respuesta: RespuestaModel
    result: ResultResponse
    respuestaPath: string
    constructor (
        private _agente: CurrentAgenteService,
        public mensaje_: CurrentMensajeService,
        private _alerts: AlertService,
        private loading: Loading,
        private fs: AngularFirestore,
        public dialog_: MatDialogRef<ConfigRetrocesoComponent>,
        private _cache: CacheService
    ) {
        this.result = new SimpleModel('', [])
        this.respuesta = new RespuestaModel('simple',this.result,0)
    }

    ngOnInit(): void {
        // this.loading.toggleWaitingSpinner( true )
        
        this.getFallbackIntent()
    }

    async getFallbackIntent() {
        var intentList: IntentModel[] = await this._cache.getAsyncKey<IntentModel[]>('intents')
        this.intent = intentList.find(
            (i) => i.displayName == 'Default Fallback Intent'
        );

        this.respuestaPath = await this._agente.getPath(`mensajes/${this.intent.name}/respuestas`)
        const respuestasCol = await this.fs.collection(this.respuestaPath).ref.get()

        if (respuestasCol.size > 0) {
            const respuestaDoc = respuestasCol.docs[0]
            this.respuesta = respuestaDoc.data() as RespuestaModel
            this.result = this.respuesta.result
        }

        
        // this.loading.toggleWaitingSpinner(false)
    }

    catchText(respuesta) {
        this.result.text = respuesta
    }
    

    saveRespuesta() {
        this.respuesta.result = {...this.result}
        Object.keys(this.respuesta).forEach(key => { if (this.respuesta[key] == undefined) delete this.respuesta[key]})
        
        try {
            
            if ( this.respuesta.id ) {
                console.log( 'edited', {...this.respuesta} )
                this.fs.collection(this.respuestaPath).doc(this.respuesta.id).set({...this.respuesta})
            } else {
                console.log( 'new', {...this.respuesta} )
                this.fs.collection(this.respuestaPath).add({...this.respuesta})
                .then(doc => doc.update({id: doc.id}))
            }

            this._alerts.sendFloatNotification('Respuesta guardada')
            this.dialog_.close()
        } catch (error) {
            console.error(error)
            this._alerts.sendError('Error', error)
        }

    }

}
