import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IntentModel } from '../mensaje.model';
import { Observable, Subject, of } from 'rxjs';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { switchMap, take } from 'rxjs/operators';
import { CacheService } from '../../../../../../Gdev-Tools/cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentMensajeService {

  updateCurrtentMensaje$: Subject<CurrentMensaje> = new Subject()
  currentMensaje$: Observable<IntentModel> = new Observable()
  mensajeName: string
  currentContexto: string
  mensajesPath: string
  constructor (
    private _agente: CurrentAgenteService,
    private fs: AngularFirestore,
    private _cache: CacheService,
    private loading: Loading,
  ) {
    this.getParams()
    this.get()
  }

  getParams() {
    this.loading.getRouteParams().subscribe( params => {
      this.mensajeName = params['name']
    } )
    this.loading.getRouteQueryParams().subscribe( qParams => {
      this.currentContexto = qParams[ 'contexto' ]
      this._cache.updateData( 'currentContexto', this.currentContexto )
    })
  }
  

  async getCurrentMensaje() {
    let mensaje: IntentModel = await this._cache.getDataKey( 'currentMensaje' )
    if ( !mensaje ) {
      let mensajeDoc = await ( await this.mensajesCollection() )
        .doc( this.mensajeName ).get()
      mensaje = mensajeDoc.data() as IntentModel
    }
    return mensaje
  }
    

  async mensajesCollection() {
    this.mensajesPath = await this._agente.getPath( 'mensajes' )
    const mensajesRef = this.fs.collection( this.mensajesPath ).ref
    return mensajesRef
  }
  
  async get() {
    this.mensajesPath = await this._agente.getPath( 'mensajes' )
    this.currentMensaje$ =
      this.fs.collection( this.mensajesPath ).doc<IntentModel>( this.mensajeName )
        .valueChanges()
    this.currentMensaje$.pipe().subscribe( doc => {
      this._cache.updateData('currentMensaje', doc)
    })
  }

  async updateMensajeName( mensajeName: string, displayName: string ) {
    await ( await this.mensajesCollection() ).doc( mensajeName ).update( {
      displayName: displayName
    } )
  }



  async delete( mensajeName ) {
    return await ( await this.mensajesCollection() ).doc( mensajeName ).delete()
  }
}


export interface CurrentMensaje {
  mensaje: IntentModel,
  contexto: string
}