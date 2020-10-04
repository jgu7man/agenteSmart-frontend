import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { UserInterface, AuthService } from '../../../../../admin/auth/auth.service';
import { MensajesService } from '../mensajes/mensajes.service';
import { IntentModel } from '../mensajes/mensaje.model';
import { CacheService } from '../../../../../Gdev-Tools/cache/cache.service';
import { ContextoModel } from './contexto.model';
import { CurrentAgenteService } from '../current-agente.service';
import { take, mergeMap, distinctUntilKeyChanged, mergeAll, tap } from 'rxjs/operators';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';
import { Subject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextosService {

  /** Ruta de los mensajes para acciones del CRUD */
  private agentePath
  /** Contexto actualizado optenido de la ruta */
  currentContexto$: string
  /** Consulta de los contextos de la base de datos */
  contextQuery$: Subject<ContextoModel> = new Subject()
  /** Lista actualizada de los contextos en orden de aparición (index) */
  list: ContextoModel[]


  constructor (
    private afs: AngularFirestore,
    private _alerta: AlertService,
    private _mensajes: MensajesService,
    private _agente: CurrentAgenteService,
    private _cache: CacheService,
    private loading: Loading
  ) {


    // Obtiene el contexto de la ruta actual
    this.loading.getRouteQueryParams().subscribe( queryParams => {
      this.currentContexto$ = queryParams['contexto']
    } )


  }
  

/** Obtiene constante actualizado la ruta del mensaje en curso para los métodos del CRUD */
  private async contextosCollection() {
    this.agentePath = await this._agente.getPath( 'contextos' )
    const contextosRef = this.afs.collection( this.agentePath ).ref;
    return contextosRef
  }



  // SECTION CRUD de contextos

  // CREATE

  
  async setContext( contexto: ContextoModel ) {

    if ( !contexto.id ) {
      let contextFinded = this.list.find(context => context.contextName === contexto.contextName)
      if ( !contextFinded ) {
        let contextNuevo = await ( await this.contextosCollection() ).add( contexto );
        await (await this.contextosCollection()).doc( contextNuevo.id ).update( { id: contextNuevo.id })
      } else {
        this._alerta.sendMessageAlert('Contexto duplicado')
      }
    } else {
      // Crea un nuevo contexto
      await (await this.contextosCollection()).doc( contexto.id ).update( contexto )
    }
    return 
  }


  // READ
  /** Obtiene el contexto en curso de la session storage */
  async getCurrentContexto() {
    if ( !this.currentContexto$ ) {
      this.currentContexto$ = await this._cache.getDataKey( 'currentContexto' )
      if(!this.currentContexto$) return ''
    } 
    return this.currentContexto$
  }
  


  async getOneContext( contexto: ContextoModel ) {
    var contextDoc = await (await this.contextosCollection()).doc( contexto.id ).get()
    var contextGeted: ContextoModel = contextDoc.data() as ContextoModel
    return contextGeted
  }


  // READ ALL

  /** Se suscribe para optener todos los contexto del agente en curso */
  private subscribeAllContext: Subscription

  /** Escucha todos los contextos en tiempo real */
  async getAllContexts() {
    
     this.subscribeAllContext = this.contextQuery$.pipe(
      distinctUntilKeyChanged( 'contextName' ),
    ).subscribe( contexto => {
      this.list.push( contexto )
      this._cache.updateData( 'allContexts', this.list )
    } )
    
    this.list = []
    var contextCol = await ( await this.contextosCollection() ).orderBy( 'index' ).get()
    // console.log( contextCol.size );
    
    
      contextCol.forEach( contexto => {
        this.contextQuery$.next( contexto.data() as ContextoModel )
        
    } )

    return this.list
  }

  /** Se desuscribe cunado la vista de contextos no está en pantalla */
  unsubscribeAllContext() {
    this.subscribeAllContext.unsubscribe()
  }


  // UPDATE Index


  /** Actualiza el orden de los contextos en la vista de contextos */
  async updateIndex( contextos: ContextoModel[] ) {
    contextos.forEach( async (contexto, index) => {
      await (await this.contextosCollection()).doc(contexto.id).update({index:index})
    } )
    return 
  }



  // DELETE



  async delContext( context:ContextoModel  ) {
    var mensajesPath = await  this._agente.getPath('mensajes')
    const mensajeRef = this.afs.collection(mensajesPath).ref;
      
    const mensajes = await this._mensajes.getMensajesListByContexto( context )
    if ( mensajes.length > 0 ) {
      mensajes.forEach( ( mensaje: IntentModel ) => {
        let contextToDel = mensaje.contextos.findIndex( ent => ent === context.id )
        mensaje.contextos.splice( contextToDel, 1 );
        mensajeRef.doc(mensaje.name).set({contextos: mensaje.contextos}, {merge: true})
      } )
    }
    
    await (await this.contextosCollection()).doc( context.id ).delete()
    return 
  }
}
