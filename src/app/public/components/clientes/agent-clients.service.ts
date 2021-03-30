import { HttpClient } from '@angular/common/http';
import { GdevLoading } from '../../../gdev-tools/src/lib/loading/loading.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { GdevAlert } from '../../../gdev-tools/src/lib/alert/alert.service';
import { GdevCache } from '../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Interaction } from '../agentes/agente/conversaciones/conversaciones.model';

@Injectable({
  providedIn: 'root'
})
export class AgentClientsService {

    projectId: string
    userId: string
    clientsPath: string
    projectPath: string
    private _url = environment.restURL + 'intent';


    constructor (
        private _cache: GdevCache,
        private _alert: GdevAlert,
        private _fs: AngularFirestore,
        private _loading: GdevLoading,
        private _http: HttpClient,
    ) {
        this.projectId = this._cache.getDataKey( 'projectId' )
        this.userId = this._cache.getDataKey( 'user' )[ 'uid' ]
        this.projectPath = `usuarios/${ this.userId }/agentes/${ this.projectId }`
        this.clientsPath = `${ this.projectPath }/clientes`

    }


    async list() {
        let listDocs = await this._fs.collection( this.clientsPath ).ref
            // .orderBy('lastUpdated', 'desc')
            .get()
        let list:any[] = []
        listDocs.forEach( async conv => {
            let conver = conv.data()
            if ( conver[ 'userId' ] ) list.push( conver )
            if ( conver[ 'messengerId' ] && !conver[ 'name' ] ) {
                this.getMessengerProfileData( conver[ 'messengerId' ], conver[ 'userId' ] )
            }
        })
        return list
    }



    async getMessengerProfileData(messengerId: string, userId: string) {
        const integracionesRef = this._fs.collection( `${ this.projectPath }/integraciones` ).ref
        try {
            const messengerDoc = await integracionesRef.doc( 'messenger' ).get()

            if ( messengerDoc.exists ) {
                const page_access_token = messengerDoc.get('page_access_token')

                this._http.get( `https://graph.facebook.com/${ messengerId }?fields=first_name,last_name,profile_pic&access_token=${ page_access_token }` ).subscribe( result => {

                    console.log(result)
                    this._fs.collection( this.clientsPath ).ref.doc( userId ).update( {
                        name: `${ result[ 'first_name' ] } ${ result[ 'last_name' ] }`,
                        photoURL: result['profile_pic']
                    } )


                }, error => {
                        throw {
                            message: 'No se pudo obtener la información del clinete',
                            code: 400,
                            error
                        }
                })

            }
            else {
                let message = 'Archivo de integracion a messenger no encontrado'
                let code = 404
                throw {message, code}
            }
        } catch (error) {
            console.error( error )
            if ( error.code === 404 ) {
                this._alert.sendMessageAlert('No se ha encontrado una integración a messenger, agrega una integracion por que esto puede perjudicar bastante a tu agente. Si el error persiste, comunícate con un asesor de agente smart')
            }
        }

    }



    async getConversation(userId: string): Promise<Interaction[]>{
        const convRef = this._fs.collection( this.clientsPath ).ref
            .doc( userId )
            .collection( 'conversacion' )
            // .orderBy('time')

        const convCol = await convRef.get()
        let conversation: Interaction[] = []
        await this._loading.asyncForEach( convCol.docs, interaction => {
            conversation.push(interaction.data())
        } )
        return conversation
    }



    async deleteConversation(userId: string) {
        try {
            const userRef = this._fs.collection( this.clientsPath ).ref.doc( userId )
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
}
