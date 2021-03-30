import { Injectable } from '@angular/core';
import { AgenteModel } from '../init-agente/agente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, UserInterface } from '../../../../admin/auth/auth.service';
import { GdevCache } from '../../../../gdev-tools/src/lib/cache/gdev-cache.service';
import { Subject, Observable, Subscription, of, BehaviorSubject, zip, forkJoin } from 'rxjs';
import { filter, concatAll, pluck, tap, map } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { IntentModel, MensajeState, MensajeModel } from './mensajes/mensaje.model';
import { ContextoModel } from './contextos/contexto.model';
import { SystemEntitieModel, TipoEntidadModel } from './tipos/tipo.model';
import { ColeccionModel } from '../../colecciones/collection.interface';
import { TarjetaModel } from '../../tarjetas/tarjeta.model';
import { HttpClient } from '@angular/common/http';
import { GdevAlert } from '../../../../gdev-tools/src/lib/alert/alert.service';
import { GdevLoading } from '../../../../gdev-tools/src/lib/loading/loading.service';
import { SystemEntitiesService } from '../../../../admin/system/system-entities.service';
import { environment } from '../../../../../environments/environment';
import firebase from 'firebase/app'

@Injectable({
    providedIn: 'root',
})
export class CurrentAgenteService {

    // SECTION CURRENT AGENTE

    // # CURRENT AGENT
    /** Estado presente del agente actual */
    public current: AgenteModel;
    // # PROJECT ID
    /** Almacena el ID de projecto actual */
    public projectId: string;
    // # PATH
    /** Almacena la ruta actual del agente actual del usuario actual */
    public path: string;
    // # USER
    /** Almacena la información del usuario actual */
    public usuario: UserInterface;
    // # AGENTE LOADED
    /** Escucha cuando el agente termina de ser cargado */
    public agenteLoaded$: Subject<boolean> = new Subject();
    /** Número de veces que se ha recargado el agente */
    private loads = 0;
    /** Almacena la URL del API */
    private _url = environment.restURL + 'intent';


    constructor(
        private fs: AngularFirestore,
        private _cache: GdevCache,
        private router: Router,
        private _http: HttpClient,
        private _alerts: GdevAlert,
        private _loading: GdevLoading,
        private _systemEntites: SystemEntitiesService
    ) {
        this.listenFirstLoad();
        // this.getAllIntents();
    }


    /** Ejecuta el incremento de veces que se ha recargado el agente */
    async listenAgenteLoaded() {
        return await new Promise((resolve) => {
            this.agenteLoaded$.subscribe(() => resolve(true));
        });
    }



    /** Incrementa el número de veces que se ha recargado la página */
    private listenFirstLoad() {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => this.loads++);
    }


    // # GET PATH
    /** Obtiene la ruta del agente en curso, espera por la respuesta del auth service para obtener el usuario */
    async getPath(collection?: string): Promise<string> {
        this.usuario = await this._cache.getAsyncKey<UserInterface>('user');
        // this.projectId = await this._cache.getAsyncKey<string>('projectId');
        this.path = `usuarios/${this.usuario.uid}/agentes/${this.projectId}`;
        return !collection ? this.path : `${this.path}/${collection}`;
    }

    // # GET
    /** Inicializa todos los compoentes del agente */
    async get() {

        this._loading.toggleWaitingSpinner('open')

        try {

            const path = await this.getPath();
            this.current = this._cache.getDataKey('currentAgente');


            if (!this.current) {
                const agenteDoc = await this.fs.doc(path).ref.get();
                console.log(agenteDoc.id);
                this.current = agenteDoc.data() as AgenteModel;
                this._cache.updateData('currentAgente', this.current);
            }

            await this.getIntentList();
            // console.log('intents');
            await this.getIntentsFromFirestore();
            // console.log('nextMensajes');
            await this.getColeccionesList();
            // console.log('colecciones');
            await this.getContextosList();
            // console.log('contextos');
            await this.getTiposList();
            // console.log('tipos');
            await this.getTarjetasList();
            // console.log('tarjetas');

            this.agenteLoaded$.next(true);
            this._loading.toggleWaitingSpinner('close');
            return this.current;

        } catch (error) {
            this._loading.toggleWaitingSpinner('close');
            console.error(error)
            this._alerts.sendError('Error', error)
        }
    }


    // SECTION INTENTS
    // Se obtienen los intents configurados en dialogflow y se almacenan en caché
    intentList$: BehaviorSubject<IntentModel[]> = new BehaviorSubject([])
    intentListSubs: Subscription
    /** Retorna  la lista completa de mensajes */
    async getIntentList(): Promise<IntentModel[]> {
        this.intentListSubs = this._cache
            .listenForChanges<IntentModel[]>('intents')
            .subscribe(list => this.intentList$.next(list))

        await this.getDialogFlowIntents()
        return this.intentList$.getValue()
    }

    /** Obtiene respuesta de los intents registrados en el agente de Dialogflow */
    async getDialogFlowIntents(): Promise<IntentModel[]> {
        const projectId: string = await this._cache.getAsyncKey('projectId');

        return new Promise<IntentModel[]>((resolve) => {
            this._http
                .get<IntentModel[]>(`${this._url}/${projectId}`, {responseType: 'json',})
                .pipe(
                    pluck<any, IntentModel[]>('result', 'intents'),
                    // tap(intents => console.log(intents)),
                    map<IntentModel[], IntentModel[]>((list) => {
                        return list.map((intent) => {
                            intent.name = intent.name.slice(
                                intent.name.lastIndexOf('/') + 1
                            );
                            return intent;
                        });
                    })
                )
                .toPromise()
                .then((list) => {
                    this._cache.updateData('intents', list)
                    resolve(list);
                });
        });
    }

    /** Se desuscribe de la list de intents */
    unsubscribeIntentList() {
        this.intentListSubs.unsubscribe()
        this.intentList$.next([])
        this._cache.deleteDataKey('intents')
    }



    // nextMensajeList: MensajeModel[] = [];
    firestoreIntentList$: BehaviorSubject<MensajeModel[]> = new BehaviorSubject([])
    firestoreIntentListSubs: Subscription;
    /** GET INTENTS FROM FIRESTORE: Se suscribe a firestore para obtener los intents */
    async getIntentsFromFirestore():Promise<MensajeModel[]> {
        const path = await this.getPath('mensajes');
        this.firestoreIntentListSubs =
        this.fs.collection<MensajeModel>(path).valueChanges()
            .subscribe(list => {
                // this._cache.updateData('nextMensajes', list)
                this.firestoreIntentList$.next(list)
            })
        // this.nextMensajeList = await this._cache
        //     .getAsyncKey<MensajeModel[]>('nextMensajes', 2)

        return this.firestoreIntentList$.getValue()

    }

    unsubscribeFirestoreIntentList() {
        this.firestoreIntentListSubs.unsubscribe()
        this.firestoreIntentList$.next([])
    }

    // !SECTION



    // contextosList: ContextoModel[] = [];
    contextosList$: BehaviorSubject<ContextoModel[]> = new BehaviorSubject([])
    contextosSubs: Subscription;
    /** GET CONTEXT LIST Retorna la lista de Contextos del agente */
    async getContextosList(): Promise<ContextoModel[]> {
        const path = await this.getPath('contextos');
        this.contextosSubs =
            this.fs.collection<ContextoModel>(path).valueChanges()
            .pipe(
                map<ContextoModel[], ContextoModel[]>
                    ( list => list.filter( c => c.contextName != 'contextos' ) ),
                // tap(list => this._cache.updateData('contextos', list))
            ).subscribe(this.contextosList$)
        // this.contextosList$ = this._cache.listenForChanges<ContextoModel[]>('contextos')
        // this.contextosList = await this._cache.getAsyncKey<ContextoModel[]>('contextos', 2);

        return this.contextosList$.getValue()
    }



    // tiposList: (TipoEntidadModel | SystemEntitieModel)[];
    tiposList$: BehaviorSubject<(TipoEntidadModel | SystemEntitieModel)[]> = new BehaviorSubject([])
    tiposSubs: Subscription;
    /** GET TIPOS LIST Retorna la lista completa de entidades del agente y las entidades de sistema */
    async getTiposList(): Promise<(TipoEntidadModel | SystemEntitieModel)[]> {
        const path = await this.getPath('tipos');
        // this.tiposList$ = this._cache.listenForChanges<(TipoEntidadModel | SystemEntitieModel)[]>('tipos')
        var changes = this.fs.collection<TipoEntidadModel>(path).valueChanges()
        var system = of(this._systemEntites.systemEntities);
        // this.tiposList = await this._cache.getAsyncKey('tipos', 2);

        this.tiposSubs = zip(changes, system)
            .pipe(
                map(([userTypes, systemTypes]) => [
                    ...userTypes,
                    ...systemTypes,
                ])
            )
            .subscribe( list => this.tiposList$.next(list));
        return this.tiposList$.getValue()
    }

    tarjetasList: TarjetaModel[];
    tarjetasList$: Observable<TarjetaModel[]>;
    tarjetasSubs: Subscription;
    async getTarjetasList() {
        const path = `usuarios/${this.usuario.uid}/tarjetas`
        var changes = this.fs.collection<TarjetaModel>(path).valueChanges();
        this.tarjetasSubs = changes.subscribe(
            (list) => { this._cache.updateData('tarjetas', list);});
        this.tarjetasList$ = this._cache.listenForChanges < TarjetaModel[] >('tarjetas')
        this.tarjetasList = await this._cache.getAsyncKey('tarjetas', 2);
    }

    /** Lista de colecciones*/
    coleccionesList$: Observable<ColeccionModel[]>;
    coleccionesList: ColeccionModel[];
    coleccionesSubs: Subscription;
    /** Se suscribe a las colecciones en Firestore y las retorna como promesa
     * @return {*}  {Promise<ColeccionModel[]>}
     */
    async getColeccionesList(): Promise<ColeccionModel[]> {
        const path = `usuarios/${this.usuario.uid}/colecciones`
        this.contextosSubs =
            this.fs.collection<ColeccionModel>(path).valueChanges()
                .subscribe(list => this._cache.updateData('colecciones', list))
        this.coleccionesList$ = this._cache.listenForChanges<ColeccionModel[]>('colecciones')
        this.coleccionesList = await this._cache.getAsyncKey<ColeccionModel[]>('colecciones', 2)

        return this.coleccionesList
    }



    /** CLEAN TEST CHAT: Limpia la sesión de conversación para TestChat del agente */
    cleanTestChat() {
        const path = `${this.path}/clientes/TEST`
        this.fs.doc(path).update({
            outputContexts: firebase.firestore.FieldValue.delete(),
            sessionId: firebase.firestore.FieldValue.delete(),
            sessionParams: firebase.firestore.FieldValue.delete()
        })

    }
}
