import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IntentModel } from '../mensaje.model';
import { Observable, Subject, of, Subscription, AsyncSubject, forkJoin } from 'rxjs';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { switchMap, take, distinctUntilKeyChanged, mergeAll, pluck, map, tap } from 'rxjs/operators';
import { CacheService } from '../../../../../../Gdev-Tools/cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentMensajeService {


  mensaje$: Observable<IntentModel> = new Observable()
  current$: Subject<IntentModel> = new Subject()
  mensajeSub$: Subscription

  currentMensaje: IntentModel
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
  ) {
  }

  getParams() {
    return forkJoin({
      [ 'mensajeName' ]: this.loading.getRouteParams()
        .pipe(pluck('name')),
      [ 'currentContexto' ]: this.loading.getRouteQueryParams()
        .pipe(pluck('contexto'))
    } )
  }
  

  async mensajesCollection() {
    this.mensajesPath = await this._agente.getPath( 'mensajes' )
    const mensajesRef = this.fs.collection( this.mensajesPath ).ref
    return mensajesRef
  }



  


  async getAsync() {
    this.getParams().subscribe( async ( data ) => {
      this.currentContexto = data.currentContexto 
      this.mensajeName = data.mensajeName
      
      this.mensajesPath = await this._agente.getPath( 'mensajes' )
      this.mensaje$ = this.fs.collection( this.mensajesPath )
      .doc<IntentModel>( this.mensajeName ).valueChanges()
      
      this.mensajeSub$ = this.mensaje$.subscribe( this.current$ )
      this.mensaje$.subscribe( mensaje => this._cache.updateData( 'currentMensaje', mensaje ) )
      
      this._cache.updateData( 'currentContexto', this.currentContexto )
    } )
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
  }
}


export interface CurrentMensaje {
  mensaje: IntentModel,
  contexto: string
}