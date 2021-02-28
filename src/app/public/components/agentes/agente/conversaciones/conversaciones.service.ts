import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'src/app/gdev-tools/cache/cache.service';
import { AlertService } from 'src/app/gdev-tools/alerts/alert.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Interaction } from './conversaciones.model';
import { Loading } from 'src/app/gdev-tools/loading/loading.service';
import { FraseEntrenamiento, IntentModel } from '../mensajes/mensaje.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConversacionesService {

    projectId: string
    userId: string
    conversationsPath: string
    private _url = environment.restURL + 'intent';


    constructor (
        private _cache: CacheService,
        private _alert: AlertService,
        private _fs: AngularFirestore,
        private _loading: Loading,
        private _http: HttpClient,
    ) {
        this.projectId = this._cache.getDataKey( 'projectId' )
        this.userId = this._cache.getDataKey( 'user' )[ 'uid' ]
        this.conversationsPath = `usuarios/${ this.userId }/agentes/${ this.projectId }/clientes/`

    }

    async list() {
        let listDocs = await this._fs.collection( this.conversationsPath ).ref.get()
        let list:any[] = []
        listDocs.forEach( async conv => {
            let conver = conv.data()
            let conversation: Interaction[]= await this.getConversation( conv.id )
            if ( conversation.length > 0 ) {
                conver[ 'userId' ] = conv.id
                conver['conversation'] = conversation
                list.push(conver)
            }
        })
        return list
    }

    async getConversation(userId: string) {
        const convRef = this._fs.collection( this.conversationsPath ).ref
            .doc( userId )
            .collection( 'conversacion' )
            // .orderBy('time')

        const convCol = await convRef.get()
        let conversation: Interaction[] = []
        await this._loading.asyncForEach( convCol.docs, interaction => {
            if ( !interaction.data()[ 'checked' ] ) {
                let inter = interaction.data()
                inter['id'] = interaction.id
                conversation.push(inter)
            }
        } )
        return conversation
    }

    async deleteConversation(userId: string) {
        try {
            const userRef = this._fs.collection( this.conversationsPath ).ref.doc( userId )
            const convRef = userRef.collection( 'conversacion' )
            const convCol = await convRef.get();
            convCol.forEach( conv => conv.ref.delete() )
            await userRef.delete()

            this._alert.sendFloatNotification( 'Conversacion eliminada' )
            return
        } catch (error) {
            console.error(error)
            this._alert.sendFloatNotification('No fue posible borrar')
        }
    }

    async setInteractionChecked(userId: string, convId: string) {
        const userRef = this._fs.collection( this.conversationsPath ).ref.doc( userId )
        const convRef = userRef.collection( 'conversacion' ).doc( convId)
        try {
            convRef.update( { checked: true } )
            this._alert.sendFloatNotification('Actualizado')
        } catch (error) {
            console.error( error )
            this._alert.sendFloatNotification('Hubo problemas para actualizar')
        }
    }





    async addTraningPhrase( updateBody: any ) {
        this._loading.toggleWaitingSpinner(true)
        const {intentId, text, userId, convId} = updateBody
        const partialId = intentId.slice(intentId.lastIndexOf('/') + 1)
        const intentList = this._cache.getDataKey<IntentModel[]>( 'intents' )
        const intentSelected = intentList.find( i => i.name === partialId )
        const trainingPhrase: FraseEntrenamiento = {
            parts: [ {'text': text} ]
        }
        intentSelected.trainingPhrases.push( trainingPhrase )
        await this.updateIntentApiRequest( intentSelected )
        this._loading.toggleWaitingSpinner(false)
        this.setInteractionChecked(userId, convId)
    }

    private updateIntentApiRequest(intent: IntentModel): Promise<IntentModel> {
        let projectId = this._cache.getDataKey('projectId');
        let path = `projects/${projectId}/agent/intents/${intent.name}`;
        intent.name = path;

        return new Promise((resolve, reject) => {
            this._http
                .put(
                    this._url,
                    {
                        intent: intent,
                        intetnView: 'INTENT_VIEW_FULL',
                    },
                    {
                        responseType: 'json',
                    }
                )
                .toPromise()
                .then((response) => {
                    if (response) {
                        console.info('Intent Updateado:', response);
                        resolve( response[ 'intent' ] );
                    }
                })
                .catch((err) => {
                    if (err) { console.error(err)}
                    reject(err);
                });
        });
    }
}
