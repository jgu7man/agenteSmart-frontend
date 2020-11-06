import {Component, OnInit} from '@angular/core';
import { MensajeModel } from '../../mensajes/mensaje.model';
import { CurrentAgenteService } from '../../current-agente.service';
import { CurrentMensajeService } from '../../mensajes/mensaje/current-mensaje.service';
import { AlertService } from '../../../../../../Gdev-Tools/alerts/alert.service';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { RespuestaModel, FormPredefinida } from '../../mensajes/mensaje/entrenamiento/respuestas/respuesta.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    templateUrl: './config-retroceso.component.html',
    styleUrls: ['./config-retroceso.component.scss']
})
export class ConfigRetrocesoComponent implements OnInit {

    intent: MensajeModel
    respuesta: RespuestaModel
    outputMessage: FormPredefinida
    respuestaPath: string
    constructor (
        private _agente: CurrentAgenteService,
        public mensaje_: CurrentMensajeService,
        private _alerts: AlertService,
        private loading: Loading,
        private fs: AngularFirestore,
        public dialog_: MatDialogRef<ConfigRetrocesoComponent>
    ) {
        this.outputMessage = new FormPredefinida('texto','')
        this.respuesta = new RespuestaModel('predefinida',this.outputMessage,0)
    }

    ngOnInit(): void {
        this.loading.toggleWaitingSpinner(true)
        this.getFallbackIntent()
    }

    async getFallbackIntent() {
        this.intent = this._agente.intentList.find(
            (i) => i.displayName == 'Default Fallback Intent'
        );

        this.respuestaPath = await this._agente.getPath(`mensajes/${this.intent.name}/respuestas`)
        const respuestasCol = await this.fs.collection(this.respuestaPath).ref.get()

        if (respuestasCol.size > 0) {
            const respuestaDoc = respuestasCol.docs[0]
            this.respuesta = respuestaDoc.data() as RespuestaModel
            this.outputMessage = this.respuesta.outputMessage
        }

        
        this.loading.toggleWaitingSpinner(false)
    }

    catchText(respuesta) {
        this.outputMessage.respuesta = respuesta
    }
    

    saveRespuesta() {
        this.respuesta.outputMessage = {...this.outputMessage}
        console.log(this.respuesta);
        Object.keys(this.respuesta).forEach(key => { if (this.respuesta[key] == undefined) delete this.respuesta[key]})
        
        try {
            
            if (this.respuesta.id) {
                this.fs.collection(this.respuestaPath).doc(this.respuesta.id).set({...this.respuesta})
            } else {
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
