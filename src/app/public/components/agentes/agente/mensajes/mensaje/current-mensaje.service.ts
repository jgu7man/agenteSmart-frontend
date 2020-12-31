import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IntentModel } from '../mensaje.model';
import { Subject, Subscription, forkJoin, Observable } from 'rxjs';
import { Loading } from '../../../../../../gdev-tools/loading/loading.service';
import { map, pluck, tap, debounceTime } from 'rxjs/operators';
import { CacheService } from '../../../../../../gdev-tools/cache/cache.service';
import { RespuestaModel } from './entrenamiento/respuestas/respuesta.model';
import { AlertService } from '../../../../../../gdev-tools/alerts/alert.service';
import { Store } from '@ngrx/store';
import { MensajeState } from '../mensaje.model';
import * as actions from './store/mensaje.actions';
import { GdevCommonsService } from '../../../../../../gdev-tools/commons/gdev-commons.service';
import { Location } from '@angular/common';



@Injectable({
    providedIn: 'root',
})
export class CurrentMensajeService {

    /** Informa cuando el intent actual ha cambiado */
    public current$: Subject<IntentModel> = new Subject();
    /** Contiene el intent actual y sus cambios */
    public current: IntentModel;
    /** Contiene el nombre del contexto actual */
    public currentContexto: string;
    /** Suscripción a los parámetros de la ruta activa */
    private paramSubs: Subscription
    /** Contiene el nombre del intent actual */
    private mensajeName: string;
    /** Contiene la ruta de FIRESTORE del mensaje actual */
    private mensajesPath: string;
    /** Contiene la ruta a la API */
    private _url =
        'https://us-central1-main-agentesmart.cloudfunctions.net/dialogflow/intent';
    private intentListSubs: Subscription
    private intentList$: Observable<IntentModel[]>

    constructor(
        private fs: AngularFirestore,
        private loading: Loading,
        private store: Store<MensajeState>,
        private _agente: CurrentAgenteService,
        private _cache: CacheService,
        private _alerts: AlertService,
        private _http: HttpClient,
        private _commons: GdevCommonsService,
        private _router: Router,
        private _location: Location
    ) {  }

    
    /**
     * Obtiene los parámetros de la ruta cuando se ingresa a editar un mensaje
     * @return {*} Obserbavle con variable 'mensajeName' y 'currentContexto'
     */
    private getParams() {
        return forkJoin({
            ['mensajeName']: this.loading
                .getRouteParams()
                .pipe(pluck('name')),
            ['currentContexto']: this.loading
                .getRouteQueryParams()
                .pipe(pluck('contexto')),
        });
    }

    
    /** Returna como promesa la referencia a FIRESTORE directa a la colección de los mensajes del usuario y del agente
     * @return {*} Referencia de firestore
     */
    public async mensajesCollection() {
        this.mensajesPath = await this._agente.getPath('mensajes');
        const mensajesRef = this.fs.collection(this.mensajesPath).ref;
        return mensajesRef;
    }

    
    /**
     * Obtiene el mensaje actual de la lista de intents y lo asigna como actual
     *
     * @param {string} displayName displayName del mensaje
     * @returns {IntentModel} intent actual
     */
    async getCurrent(displayName: string) {
        this.mensajesPath = await this._agente.getPath('mensajes');
        this.current = await this.findMensaje(displayName)
        // console.log(this.current);
        if (this.current) {this.setCurrent()}
        return this.current
    }


    /**
     * Busca en la lista de intents del storage un intent que coincida con el parámetro displayName
     *
     * @param {string} nameOrDisplayName displayName del intent o name. 
     * Busca a través de ambos
     * @returns {IntentModel | null} intent completo si existe, si no, retorna null
     */
    async findMensaje(nameOrDisplayName: string) {
        let list = await this._cache.getAsyncKey<IntentModel[]>('intents')
        // console.log('lista de mensajes',  list);
        let intent = list.find((m) => m.displayName == nameOrDisplayName);
        if (!intent) intent = list.find((m) => m.name == nameOrDisplayName);
        // console.log(intent);
        return list ? intent ? intent : null : null
    }

    /** Establece en el storage el intent actual y emite un evento para current$ */
    async setCurrent() {
        // console.log(this.current);
        
        this.current$.next(this.current);
        this._cache.updateData('currentContexto', this.currentContexto);
        this._cache.updateData('currentIntent', this.current);
        this.getRespuestasList();

        this.intentList$ = this._cache.listenForChanges<IntentModel[]>('intents')
        this.intentListSubs = this.intentList$.pipe(
            debounceTime(1000),
            // tap(emit => console.log(emit)),
            map(list => list.find(intent => intent.name == this.current.name))
        ).subscribe(mensaje => { 
            this.current$.next(mensaje)
            this.current = mensaje
        })
   }

    /** Obtiene el intent actual a partir de la subscripción a los cambios de la ruta */
    async getByActivatedRoute( intentName: string, contexto: string ) {
        this.loading.toggleWaitingSpinner(true)
        this._cache.updateData('currentContexto', contexto)
        this._cache.updateData('mensajeName', intentName)
        
        this.currentContexto = await this._cache.getAsyncKey<string>('currentContexto', 1)
        this.mensajeName = await this._cache.getAsyncKey<string>('mensajeName', 1)
        this.mensajesPath = await this._agente.getPath('mensajes');
        this.current = await this.findMensaje(this.mensajeName)
        console.log(this.current)
        if ( this.current ) { this.setCurrent() }
        else { 
            await this.loading.waitFor(1000)
            const projectId: string = this._cache.getDataKey('projectId');
            this._alerts.sendFloatNotification( 'Error al cargar el intent. Parece que fue eliminado' )
            this._router.navigate( [ `/dashboard/agente/${ projectId }/mensajes` ] )
        }
        this.loading.toggleWaitingSpinner(false)
    }



    
    respuestasSubs: Subscription;
    respuestasList: RespuestaModel[];
    /**
     * Se suscribe a los cambios de FIRESTORE para obtener las respuestas del intent actual y estble la variable de respuestasList con la lista actualizada. También inserta la lista de respuestas en el storage
     *
     * @returns {RespuestaModel} Array de respuestas actualizado
     */
    async getRespuestasList() {
        const mensajeName = await (await this._cache.getAsyncKey<IntentModel>('currentIntent')).name
        const respuestasPath = await this._agente.getPath(
            `mensajes/${mensajeName}/respuestas`
        );

        

        var changes = this.fs
        .collection<RespuestaModel>(respuestasPath)
        .valueChanges()
        
        this.respuestasSubs = changes.subscribe((respuestas) => {
            this.respuestasList = this._commons.sortBy<RespuestaModel>(respuestas, 'index')
            this._cache.updateData('currentRespuestas', respuestas);
        });
        
        // console.log({respuestasPath});
        this.respuestasList = await this._cache.getAsyncKey<RespuestaModel[]>('currentRespuestas');
        
        return this.respuestasList
    }



    // UPDATE MENSAJE ACTUAL
    mensajeUpdated$: Subject<any> = new Subject()
    /** Actualiza el intent actual en DIALOGFLOW con los cambios hechos en el área de entrenamiento. */
    async update(mensaje?: IntentModel) {
        this.loading.toggleWaitingBar();

        // if ( !mensaje ) {
        //     Object.keys(this.current).forEach((key) => {
        //         if (this.current[key] == undefined) delete this.current[key];
        //     });
        // } else {
        //     Object.keys(mensaje).forEach((key) => {
        //         if (mensaje[key] == undefined) delete mensaje[key];
        //     });
        // }

        try {

            // Update current mensaje
            if ( !mensaje ) {
                const request = await this.updateIntentApiRequest(this.current);
                console.log(request);
                if (request) {
                    console.info('Se Actualizo Intent:', request);
                    
                    this._agente.getIntentList()
                    this.store.dispatch(actions.setSaved());
                    this.loading.toggleWaitingBar();
                    this._alerts.sendFloatNotification('Mensaje guardado');
                    return this.mensajeUpdated$.next()
                }
            }

            
            // Update another mensaje
            else {
                await this.updateIntentApiRequest( mensaje );
                this._agente.getIntentList()
                this.loading.toggleWaitingBar();
                return
            }
   
        } catch (error) {
            console.error(error);
            this._alerts.sendError( 'No se pudo guardar', error )
            this.loading.toggleWaitingBar();
        }
    }


    
    /**
     * Actualiza el intent actual en DIALOGFLOW a través de la API
     *
     * @private
     * @param {IntentModel} intent
     * @returns {*}  {Promise<IntentModel>}
     */
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
                        resolve(response['intent']);
                    }
                })
                .catch((err) => {
                    if (err) { console.error(err)}
                    reject(err);
                });
        });
    }

    /**
     * Actualiza el nombre del mensaje en DIALOGFLOW y en FIRESTORE
     *
     * @param {string} mensajeName name del intent
     * @param {string} displayName displayName nuevo
     */
    async updateMensajeName(mensajeName: string, displayName: string) {
        this.current.displayName = displayName
        await this.updateIntentApiRequest(this.current)
        await (await this.mensajesCollection()).doc(mensajeName).update({
            displayName: displayName,
        });
    }

    /**
     * Elimina el intent en DIALOGFLOW y después en FIRESTORE
     *
     * @param {string} mensajeName name del intent
     * @returns {*} 
     */
    async delete(mensajeName: string) {
        //params intentName (ultima cadena)
        // REVIEW Falta testear esta función.
        const projectId: string = this._cache.getDataKey('projectId');
        const request = await this.deleteIntentRequest(mensajeName);
        if ( request ) {
            console.log(mensajeName)
            await (await this.mensajesCollection())
                .doc(mensajeName)
                .delete();
            await this._router.navigateByUrl( `/dashboard`, { skipLocationChange: true } )
            this._router.navigate([`/dashboard/agente/${ projectId }/mensajes`])
        }   

        return
    }

    /**
     * Elimina el intent desde la API
     * @private
     * @param {string} intentId
     * @returns {*}  {Promise<any>}
     */
    public deleteIntentRequest( intentId: string ): Promise<any> {
        this.loading.toggleWaitingSpinner(true)
        return new Promise((resolve, reject) => {
            const projectId: string = this._cache.getDataKey('projectId');

            this._http
                .delete(this._url + `/${intentId}/project/${projectId}`)
                .toPromise()
                .then((response) => {
                    resolve(true);
                })
                .catch((err) => {
                    if ( err ) {
                        console.log(err);
                        this._alerts.sendError(
                            'No es posible elimnar intent, intentelo de nuevo, porfavor.',
                            err
                        );
                    }
                    // reject(true);
                });
        });
    }

    /** Desuscribe todos los datos en este servicio */
    unsubscribe() {
        this.store.dispatch(actions.getOutMensaje());
        this._cache.deleteDataKey('currentIntent')
        this._cache.deleteDataKey( 'currentRespuestas' )
        if ( this.respuestasSubs ) { this.respuestasSubs.unsubscribe() }
        if ( this.intentListSubs ) { this.intentListSubs.unsubscribe() }
        if ( this.paramSubs ) this.paramSubs.unsubscribe()
        // console.log('unsubscribe');
    }
}
