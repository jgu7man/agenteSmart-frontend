import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Loading } from 'src/app/gdev-tools/loading/loading.service';
import { CacheService } from 'src/app/gdev-tools/cache/cache.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TextService } from '../../../../../services/text.service';
import { CurrentAgenteService } from '../current-agente.service';
import { ContextoModel } from '../contextos/contexto.model';
import { AlertService } from '../../../../../gdev-tools/alerts/alert.service';
import { of, Subject } from 'rxjs';
import { IntentModel, MensajeModel } from './mensaje.model';
import { map } from 'rxjs/operators';
import { RespuestaModel } from './mensaje/entrenamiento/respuestas/respuesta.model';
import { CurrentMensajeService } from './mensaje/current-mensaje.service';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class MensajesService {

    /** Almacena la ruta de los mensajes, incluyendo ID de usuario y de proyecto */
    private mensajesPath: string;
    /** Almacena el ID del proyecto actual */
    private projectId;
    /** Motiva a recargar los mensajes */
    reloadMensajes$ = new Subject<any>();
    /** Almacena la URL para consultas de la API */
    private _url = environment.restURL + 'intent';

    constructor(
        private _http: HttpClient,
        private fs: AngularFirestore,
        private _cache: CacheService,
        private _alerts: AlertService,
        private _agente: CurrentAgenteService,
        private _loading: Loading,
        private _text: TextService,
        private _current: CurrentMensajeService,
        private _router: Router
    ) {}

    /** Obtine la referencia actual a FIRESTORE para los mensjaes */
    async mensajesCollection() {
        this.mensajesPath = await this._agente.getPath('mensajes');
        const mensajesRef = this.fs.collection(this.mensajesPath).ref;
        return mensajesRef;
    }

    // SECTION CRUD de mensajes

    // CREATE Mensajes

    /**Crear un intent nuevo en DIALOGFLOW a través de la API
     *@param projectId id del projecto
     *@param intent displayname nombre del intent */
    async createNewIntent(intent: IntentModel) {
        const projectId: string = await this._cache.getAsyncKey('projectId');
        //si no se puede hace proxeo de la URL base...
        const intentRequest = { projectId, intent };

        return new Promise<IntentModel>((resolve, reject) => {
            this._http
                .post(this._url, intentRequest, { responseType: 'json' })
                .subscribe(
                    (intentCreated) => {
                        console.log('IntentCreated:', intentCreated['intent']);
                        resolve(intentCreated['intent']);
                        this.reloadMensajes$.next();
                    },
                    (onError) => {
                        // this._alerts.sendError('Algo falló', onError);
                        reject(onError);
                    }
                );
        });
    }


    /** Agrega el intent nuevo creado por la API a dialogflow como referencia para la interfaz en FIRESTORE
     * @param {IntentModel} displayName intent creado por la API
     * @param {number} [index] index en el orden del contexto
     * @param {string} [contexto] contexto con el que será invocado en la interfaz
     */
    async setMensaje(
        displayName: string,
        index?: number,
        contexto?: string
    ) {
        this._loading.toggleWaitingSpinner('open')
        const projectId = this._cache.getDataKey( 'projectId' )
        var nameContext = this._text.normalize( displayName ).toLowerCase()
        nameContext = nameContext.replace(/\s/g, '')
        console.log({ displayName,index,contexto });
        try {

            const newIntent = await this.createNewIntent({
                displayName: displayName,
                inputContextNames: contexto
                    ? [
                        `projects/${ projectId }/agent/sessions/-/contexts/${ contexto }`,
                        `projects/${ projectId }/agent/sessions/-/contexts/${ nameContext }`
                    ]
                    : [
                        `projects/${ projectId }/agent/sessions/-/contexts/${ nameContext }`
                    ]
            } );

            const resourceID = newIntent.name.slice(
                newIntent.name.lastIndexOf('/') + 1
            );

            let intent = {
                name: newIntent.name,
                displayName: newIntent.displayName,
            };

            if (index) intent['index'] = index;
            intent[ 'contexto' ] = contexto
                ? contexto
                : 'no-context'

            console.log(`guardando intent en firestore: `, intent)
            await (await this.mensajesCollection()).doc(resourceID).set(intent)
            this._agente.getIntentList()
            this._loading.toggleWaitingSpinner( 'close' )
            await this._router.navigateByUrl('/dashboard/agentes', { skipLocationChange: true }).then(() =>
                this._router.navigate([`/dashboard/agente/${ projectId }/mensajes`])
            )
            return this._alerts.sendFloatNotification('Mensaje creado');

        } catch (error) {
            console.error( error )
            this._loading.toggleWaitingSpinner('close')
            if ( error.error.code === 3 ) {
                this._alerts.sendError( 'Este nombre de intent ya existe, por favor elige otro', error.error.error.details )
            } else if ( error.error.code === 9){
                this._alerts.sendError( 'El nombre del intent no sólo puede contener caracteres como LETRAS: [a-z, A-Z], números:[0-9], guión bajo [_], guión medio [-] o espacios', error.error.error.details )

            } else {
                this._alerts.sendError('Error', error.error.error.details)
            }
        }
  }


    setContextMensaje( context: string ) {
        const intentList = this._cache.getDataKey<IntentModel[]>( 'intents' )
        const contextIntent = intentList.find(
            i => i.displayName === 'Default Context Intent'
        )

        contextIntent.parameters.push( {
            defaultValue: context,
            displayName: context,
            entityTypeDisplayName: context,
            isList: false,
            mandatory: false,
            value: context
        } )

        contextIntent.trainingPhrases.push( {
            parts: [ {
                alias: context,
                entityType: "@contextos",
                text: context,
                userDefined: true
            }],
            type: "EXAMPLE"
        } )

        // console.log(contextIntent)
        this._current.update( contextIntent )
        return

    }


    // READ ENTRADAS

    /** Obtiene los Mensajes de Firestore que coinciden con tener el contexto indicado
     *
     * @param {ContextoModel} contexto Indica el contexto al cual pertenece la fila donde se invoca la lista de mensajes
     * @return {MensajeModel[]} Regresa un array de mensajes pertenecientes al contexto
     */
    async getMensajesListByContexto(contexto: ContextoModel) {
        var mensajesList: MensajeModel[] = [];
        if ( contexto.id ) {
            // console.log(contexto.id);
            const mensajeCol = await (await this.mensajesCollection())
                .where('contexto', '==', contexto.id)
                .orderBy('index', 'asc')
                .get();

            // console.log(mensajeCol.docs);
            await this._loading.asyncForEach(mensajeCol.docs, (mensaje) => {
                mensajesList.push(mensaje.data());
            });
        }
        // console.log(mensajesList)
        return mensajesList;
    }

    async getMensajesWithoutContext() {
        var mensajesList: MensajeModel[] = []
        const mensajeCol = await (await this.mensajesCollection())
            .where('contexto', '==', 'no-context').get();

        await this._loading.asyncForEach(mensajeCol.docs, (mensaje) => {
            mensajesList.push(mensaje.data());
        } );

        return mensajesList
    }

    /**
     * Obtiene los mensajes siguientes del mensaje que solicita mediente su ID
     *
     * @param {string} id Id del mensajes del cuál se solicita saber sus siguientes mensajes
     * @return {*} Array de mensajes siguientes del mensaes
     */
    async getFollowingMensajes(id: string) {
        var following: string[] = [];
        var respuestasCol = await (await this.mensajesCollection())
            .doc(`${id}`)
            .collection('respuestas')
            .get();

        if (respuestasCol.size > 0) {
            respuestasCol.forEach((res) => {
                let respuesta = res.data() as RespuestaModel;
                let resStored = following.findIndex(
                    (r) => r == respuesta.nextIntent
                );
                if (resStored < 0) following.push(respuesta.nextIntent);
            });
        }

        await new Promise((resolve) => {
            of(following)
                .pipe(
                    map((f) => {
                        if (f.length == respuestasCol.size) return true;
                    })
                )
                .subscribe((fo) => resolve(fo));
        });
        return following;
    }
}
