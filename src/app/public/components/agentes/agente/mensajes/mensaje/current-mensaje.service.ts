import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IntentModel, FraseEntrenamiento, ParametroMensaje } from '../mensaje.model';
import { Observable, Subject, of, Subscription, AsyncSubject, forkJoin } from 'rxjs';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { switchMap, take, distinctUntilKeyChanged, mergeAll, pluck, map, tap } from 'rxjs/operators';
import { CacheService } from '../../../../../../Gdev-Tools/cache/cache.service';
import { RespuestaModel } from './entrenamiento/respuestas/respuesta.model';
import { AlertService } from '../../../../../../Gdev-Tools/alerts/alert.service';
import { Store } from '@ngrx/store';
import { MensajeState } from './store/mensaje.state';
import * as actions from './store/mensaje.actions'

@Injectable({
  providedIn: 'root'
})
export class CurrentMensajeService {


  mensaje$: Observable<IntentModel> = new Observable()
  current$: Subject<IntentModel> = new Subject()
  mensajeSub$: Subscription

  current: IntentModel
  paramsSubs$: Subscription
  queryParamsSubs$: Subscription
  
  mensajeName: string
  currentContexto: string
  mensajesPath: string
  constructor (
    private _agente: CurrentAgenteService,
    private fs: AngularFirestore,
    private _cache: CacheService,
    private loading: Loading,
    private _alerts: AlertService,
    private store: Store<MensajeState>
  ) {
  }

  //* PASO 1: Obtienes los parámetros del route
  getParams() {
    return forkJoin({
      [ 'mensajeName' ]: this.loading.getRouteParams()
        .pipe(pluck('name')),
      [ 'currentContexto' ]: this.loading.getRouteQueryParams()
        .pipe(pluck('contexto'))
    } )
  }
  

  // * PASO 2 Estructura referencia de la base de datos
  async mensajesCollection() {
    this.mensajesPath = await this._agente.getPath( 'mensajes' )
    const mensajesRef = this.fs.collection( this.mensajesPath ).ref
    return mensajesRef
  }
  


  async getAsync() {
    this.getParams().subscribe( async ( data ) => {
      this.currentContexto = data.currentContexto
      this.mensajeName = data.mensajeName
      
      // console.log( this.mensajeName );
      this._cache.updateData( 'currentMensajeName', this.mensajeName )
      
      if ( this.mensajeName ) {
        
        this.mensajesPath = await this._agente.getPath( 'mensajes' )
        this.mensaje$ = this.fs.collection( this.mensajesPath )
          .doc<IntentModel>( this.mensajeName ).valueChanges()

        await this.getFrasesList()
        await this.getParametrosList()
        await this.getRespuestasList()

        this.mensajeSub$ = this.mensaje$.subscribe( this.current$ )
        this.current$.subscribe( current => {
          console.log(current);
          this.store.dispatch(actions.getData(current))
          this._cache.updateData( 'currentMensaje', current )
        } )

        this._cache.updateData( 'currentContexto', this.currentContexto )
      }
    } )
  }

  

  frasesSubs: Subscription
  frasesList: FraseEntrenamiento[]
  getFrasesList() {
    let mensaje = this._cache.getDataKey( 'currentMensaje' );
    this.frasesList = mensaje ? mensaje.trainingPhrases : [];
    this.frasesSubs = this.current$.subscribe( mensaje => {
      this.frasesList = mensaje.trainingPhrases
    })
  }

  parametrosSubs: Subscription
  parametrosList: ParametroMensaje[]
  getParametrosList() {
    let mensaje = this._cache.getDataKey( 'currentMensaje' )
    this.parametrosList = mensaje ? mensaje.parameters : [];
    this.parametrosSubs = this.current$.subscribe( mensaje => {
      this.parametrosList = mensaje.parameters
    })
  }


  respuestasSubs: Subscription
  respuestasList: RespuestaModel[]
  async getRespuestasList() {
    const respuestasPath = await this._agente.getPath( `mensajes/${this.mensajeName}/respuestas` )
    this.respuestasList = this._cache.getDataKey( 'currentRespuestas' )

    var changes = this.fs.collection<RespuestaModel>( respuestasPath )
    .valueChanges()

    this.respuestasSubs = changes.subscribe( respuestas => {
      this.respuestasList = respuestas
      this._cache.updateData('currentRespuestas', respuestas)
    } )
  }


  async update( mensaje: IntentModel ) {
    Object.keys( mensaje ).forEach( key =>
    { if ( mensaje[ key ] == undefined ) delete mensaje[ key ] } )

    try {
      await ( await this.mensajesCollection() ).doc( mensaje.name )
        .update( { ...mensaje } )
      this._alerts.sendFloatNotification('Mensaje actualizado')
    } catch (error) {
      console.error(error);
      this._alerts.sendError('No se pudo guardar', error)
    }
  }


  async updateMensajeName( mensajeName: string, displayName: string ) {
    await ( await this.mensajesCollection() ).doc( mensajeName ).update( {
      displayName: displayName
    } )
  }



  async delete( mensajeName ) {
    return await ( await this.mensajesCollection() ).doc( mensajeName ).delete()
  }


  unsubscribe() {
    this.mensajeSub$.unsubscribe()
    // this.store.dispatch(actions.resetData())
  }
}


export interface CurrentMensaje {
  mensaje: IntentModel,
  contexto: string
}