import { Injectable } from '@angular/core';
import { AgenteModel } from '../init-agente/agente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, UserInterface } from '../../../../admin/auth/auth.service';
import { CacheService } from '../../../../Gdev-Tools/cache/cache.service';
import { Subject, Observable, Subscription, of, BehaviorSubject, zip, forkJoin } from 'rxjs';
import { filter, concatAll, pluck, tap, map } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { IntentModel, MensajeState } from './mensajes/mensaje.model';
import { ContextoModel } from './contextos/contexto.model';
import { SystemEntitieModel, TipoEntidadModel } from './tipos/tipo.model';
import { ColeccionModel } from './colecciones/collection.interface';
import { TarjetaModel } from './tarjetas/tarjeta.model';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../../../Gdev-Tools/alerts/alert.service';
import { Loading } from '../../../../Gdev-Tools/loading/loading.service';
import { SystemEntitiesService } from '../../../../admin/system/system-entities.service';

@Injectable({
    providedIn: 'root',
})
export class CurrentAgenteService {
    currentAgent: AgenteModel;
    currentProjectId: string;
    currentAgente$: Subject<AgenteModel> = new Subject();
    path: string;
    
    usuario: UserInterface;

    agenteLoaded$: Subject<boolean> = new Subject();

    mensajesList$: Observable<IntentModel[]>;
    tipos;
    private _url =
        'https://us-central1-main-agentesmart.cloudfunctions.net/dialogflow/intent';
    systemEntities: SystemEntitieModel[] = []

    constructor(
        private fs: AngularFirestore,
        private _cache: CacheService,
        private _auth: AuthService,
        private router: Router,
        private _route: ActivatedRoute,
        private _http: HttpClient,
        private _alerts: AlertService,
        private loading: Loading,
        private _systemEntites: SystemEntitiesService
    ) {
        this.systemEntities = this._systemEntites.systemEntities
        this.listenFirstLoad();
        this.getAllIntents()
    }

    async listenAgenteLoaded() {
        return await new Promise((resolve) => {
            this.agenteLoaded$.subscribe(() => resolve(true));
        });
    }

    loads = 0;
    listenFirstLoad() {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => this.loads++);
    }

    getCurrentProjectId() {
        var route = this._route.firstChild;
        let paramsKeys = Object.keys(route.snapshot.params);

        while (paramsKeys.length == 0) {
            route = route.firstChild;
            paramsKeys = Object.keys(route.snapshot.params);
        }

        this.currentProjectId = route.snapshot.params.id;
        return this.currentProjectId;
    }

    async getPath(collection?) {
        this.usuario = await this._auth.getCurrentUser();
        this.path = `usuarios/${this.usuario.uid}/agentes/${this.getCurrentProjectId()}`;
        return !collection ? this.path : `${this.path}/${collection}`;
    }

    async get() {
        await this.getCurrentProjectId();

        if (this.loads == 1) {
            this.usuario = await this._auth.getCurrentUser();

            const agenteRES = await this.fs
                .collection('usuarios')
                .doc(this.usuario.uid)
                .collection('agentes')
                .ref.doc(this.currentProjectId)
                .get();

            this.currentAgent = agenteRES.data() as AgenteModel;
            this._cache.updateData('projectId', this.currentAgent.projectId);
            this._cache.updateData('currentAgente', this.currentAgent);

            this.currentAgente$.next(this.currentAgent);

            await this.getMensajesList();
            await this.getColeccionesList();
            await this.getContextosList();
            await this.getTiposList();
            await this.getTarjetasList();

            this.agenteLoaded$.next(true);
        } else {
            this.currentAgent = await this._cache.getDataKey('currentAgente');
        }

        return this.currentAgent;
    }

    mensajesList: IntentModel[];
    mensajesSubs: Subscription;
    mensajesLoaded$: Subject<any> = new Subject()
    async getMensajesList() {
        this.mensajesList = await this._cache.getDataKey('mensajes');

        var changes = this.getAllIntents().pipe(
            pluck('result', 'intents'),
            tap(res => console.log(res))
        )

        this.mensajesSubs = changes.subscribe((list) => {
            let filteredList = list.map((m) => {
                m.name = m.name.slice(m.name.lastIndexOf('/') + 1);
                return m;
            });
            this.mensajesList = filteredList;
            this.mensajesLoaded$.next()
            // this._cache.updateData( 'mensajes', list )
        });

    }

    contextosList: ContextoModel[] = [];
    contextosSubs: Subscription;
    async getContextosList() {
        const path = await this.getPath('contextos');
        this.contextosList = this._cache.getDataKey('contextos');

        var changes = this.fs.collection<ContextoModel>(path).valueChanges();

        this.contextosSubs = changes.subscribe((list) => {
            this.contextosList = list;
            this._cache.updateData('contextos', list);
        });
    }
    
    

    tiposList: (TipoEntidadModel | SystemEntitieModel)[];
    tiposSubs: Subscription;
    async getTiposList() {
        const path = await this.getPath('tipos');
        this.tiposList = this._cache.getDataKey('tipos');
        var changes = this.fs.collection<TipoEntidadModel>(path).valueChanges();

        var system = of(this.systemEntities)

        this.tiposSubs = zip(changes, system)
            .pipe( map(([userTypes, systemTypes]) => [...userTypes, ...systemTypes]))
            .subscribe((list) => {
                this.tiposList = list;
                this._cache.updateData('tipos', list);
            });
    }

    tarjetasList: TarjetaModel[];
    tarjetasSubs: Subscription;
    async getTarjetasList() {
        const path = await this.getPath('tarjetas');
        this.tarjetasList = this._cache.getDataKey('tarjetas');
        var changes = this.fs.collection<TarjetaModel>(path).valueChanges();
        this.tarjetasSubs = changes.subscribe((list) => {
            this.tarjetasList = list;
            this._cache.updateData('tarjetas', list);
        });
    }

    coleccionesList: ColeccionModel[];
    coleccionesSubs: Subscription;
    async getColeccionesList() {
        const path = await this.getPath('colecciones');
        this.coleccionesList = await this._cache.getDataKey('colecciones');

        var changes = this.fs.collection<ColeccionModel>(path).valueChanges();

        this.coleccionesSubs = changes.subscribe((list) => {
            this.coleccionesList = list;
            this._cache.updateData('colecciones', list);
        });

        var promise = new Promise<ColeccionModel[]>((resolve, reject) => {
            changes.subscribe((list) => resolve(list));
        });
    }

    
    getAllIntents(): Observable<any> {
        const projectId: string = this._cache.getDataKey('projectId');

        return this._http.get(this._url + `/${projectId}`, {responseType: 'json'})
                
    }

    

    // async getCollection( collection: string ) {
    //   const path = await this.getPath( collection )
    //   var dataArray: any[] = []
    //   if ( this.loads == 1 ) {
    //     dataArray = await new Promise( ( resolve, reject ) => {

    //       this.fs.collection<any>( path )
    //         .valueChanges().subscribe( col => {
    //           resolve( col )
    //           this._cache.updateData( collection, col )
    //       } )
    //     })
    //   } else {
    //     dataArray = await this._cache.getDataKey(collection)
    //   }
    //   return dataArray
    // }
}
