import { Injectable } from '@angular/core';
import { AgenteModel } from '../init-agente/agente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, UserInterface } from '../../../../admin/auth/auth.service';
import { CacheService } from '../../../../Gdev-Tools/cache/cache.service';
import { Subject, Observable, BehaviorSubject, Subscription } from 'rxjs';
import { take, filter, map, pluck, tap, scan, count } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { IntentModel } from './mensajes/mensaje.model';
import { ContextoModel } from './contextos/contexto.model';
import { TipoEntidadModel } from './tipos/tipo.model';
import { ColeccionModel } from './colecciones/collection.interface';
import { TarjetaModel } from './tarjetas/tarjeta.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentAgenteService {

  currentAgent: AgenteModel
  currentProjectId: string
  currentAgente$: Subject<AgenteModel> = new Subject()
  path: string

  usuario: UserInterface

  agenteLoaded$: Subject<boolean> = new Subject()

  

  mensajesList$: Observable<IntentModel[]>
  tipos
  

  constructor (
    private fs: AngularFirestore,
    private _cache: CacheService,
    private _auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.listenFirstLoad()
  } 


  async listenAgenteLoaded() {
    return await new Promise( resolve => {
      this.agenteLoaded$.subscribe(() =>resolve(true))
    })
  }



  loads = 0
  listenFirstLoad() {
    this.router.events.pipe(
      filter( event => event instanceof NavigationEnd ),
    ).subscribe( loads =>  this.loads++ )
  }



  getCurrentProjectId() {
    var route = this.activatedRoute.firstChild
    let paramsKeys = Object.keys( route.snapshot.params)
    
    while ( paramsKeys.length == 0 ) {
      route = route.firstChild;
      paramsKeys = Object.keys( route.snapshot.params )
    }

    this.currentProjectId = route.snapshot.params.id
    return this.currentProjectId
    
  }


  async getPath( collection?) {
    this.usuario = await this._auth.getCurrentUser()
    this.path = `usuarios/${ this.usuario.uid }/agentes/${ this.getCurrentProjectId() }`;
    return !collection ? this.path : `${ this.path }/${ collection }`;
  }

  
  
  
  
  async get() {
    await this.getCurrentProjectId()

    if ( this.loads == 1 ) {
      this.usuario = await this._auth.getCurrentUser()
      
      const agenteRES = await this.fs.collection( 'usuarios' )
        .doc( this.usuario.uid ).collection( 'agentes' ).ref
        .doc( this.currentProjectId ).get();
      
      this.currentAgent = agenteRES.data() as AgenteModel
      this._cache.updateData( 'agenteId', this.currentAgent.agenteId )
      this._cache.updateData( 'currentAgente', this.currentAgent )
        
      this.currentAgente$.next( this.currentAgent )
      
      await this.getMensajesList()
      await this.getColeccionesList()
      await this.getContextosList()
      await this.getTiposList()
      await this.getTarjetasList()
      
      this.agenteLoaded$.next( true )
    
    } else {
      this.currentAgent = await this._cache.getDataKey('currentAgente')
    }
    
    return this.currentAgent
  }


  mensajesList: IntentModel[]
  mensajesSubs: Subscription
  async getMensajesList() {
    const path = await this.getPath( 'mensajes' )
    this.mensajesList = await this._cache.getDataKey( 'mensajes' )

    var changes =
      this.fs.collection<IntentModel>( path )
        .valueChanges()

    this.mensajesSubs =
      changes.subscribe( list => {
        this.mensajesList = list
        this._cache.updateData( 'mensajes', list )
      } )

    var promise = new Promise<IntentModel[]>( ( resolve, reject ) => {
      changes.subscribe( list => resolve( list ) )
    } )
  }


  contextosList: ContextoModel[] = []
  contextosSubs: Subscription
  async getContextosList() {
    const path = await this.getPath( 'contextos' )
    this.contextosList = this._cache.getDataKey( 'contextos' )
    
    var changes = this.fs.collection<ContextoModel>( path )
      .valueChanges()
    
    this.contextosSubs = 
      changes.subscribe( list => {
        this.contextosList = list
        this._cache.updateData( 'contextos', list )
      } )
  }



  tiposList: TipoEntidadModel[]
  tiposSubs: Subscription
  async getTiposList() {
    const path = await this.getPath( 'tipos' )
    this.tiposList = this._cache.getDataKey( 'tipos' )
    var changes = this.fs.collection<TipoEntidadModel>( path )
      .valueChanges()
    
    this.tiposSubs = changes.subscribe( list => {
      this.tiposList = list
      this._cache.updateData('tipos', list)
    })
  }


  tarjetasList: TarjetaModel[]
  tarjetasSubs: Subscription
  async getTarjetasList() {
    const path = await this.getPath( 'tarjetas' )
    this.tarjetasList = this._cache.getDataKey( 'tarjetas' )
    var changes = this.fs.collection<TarjetaModel>( path )
      .valueChanges()
    this.tarjetasSubs = 
      changes.subscribe( list => {
        this.tarjetasList = list
        this._cache.updateData('tarjetas', list)
      })
  }

  
  coleccionesList: ColeccionModel[]
  coleccionesSubs: Subscription
  async getColeccionesList() {
    const path = await this.getPath( 'colecciones' )
    this.coleccionesList = await this._cache.getDataKey( 'colecciones' )

    var changes =     
    this.fs.collection<ColeccionModel>( path )
        .valueChanges()
    
    this.coleccionesSubs = 
      changes.subscribe( list => {
        this.coleccionesList = list
        this._cache.updateData( 'colecciones', list )
    } )
    
    var promise = new Promise<ColeccionModel[]>( ( resolve, reject ) => {
      changes.subscribe( list => resolve( list ) )
    } )

    

    // if ( this.loads == 1 ) {
    //   console.log('refrescó');
      
    //   if ( this.coleccionesList.length > 0 ) {
    //     console.log( 'envia colecciones' );
    //     return this.coleccionesList
    //   } else {
    //     console.log( 'envia promsa' );
    //     return await promise
    //   } 

    //   // return this.coleccionesList.length > 0 ? this.coleccionesList : await promise

    // } else {
    //   console.log('navegó');
    //   return this.coleccionesList
    // }
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
