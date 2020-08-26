import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IntentModel } from '../mensaje.model';
import { Observable, Subject } from 'rxjs';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { switchMap, take } from 'rxjs/operators';
import { CacheService } from '../../../../../../Gdev-Tools/gdev-cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentMensajeService {

  currentMensaje$: Subject<CurrentMensaje> = new Subject()
  mensajesPath: string
  constructor (
    private _agente: CurrentAgenteService,
    private fs: AngularFirestore,
    private _cache: CacheService,
    private loading: Loading
    ) { }

  async getCurrentMensaje() {
    let mensaje: IntentModel = await this._cache.getDataKey( 'currentMensaje' )
    if ( !mensaje ) mensaje =  await ( await this.currentMensaje$.pipe( take( 1 ) ).toPromise() ).mensaje;
    return mensaje
  }
    

  async mensajesCollection() {
    this.mensajesPath = await this._agente.getPath( 'mensajes' )
    const mensajesRef = this.fs.collection( this.mensajesPath ).ref
    return mensajesRef
  }
  
  async get( name, contexto? ) {
    const mensajeDoc = await ( await this.mensajesCollection() ).doc( name ).get()
    if ( mensajeDoc.exists ) {
      var mensaje = mensajeDoc.data() as IntentModel
      this.currentMensaje$.next( { mensaje: mensaje, contexto } )
      this._cache.updateData( 'currentMensaje', mensaje )
      this._cache.updateData( 'currentContexto', contexto )
      return mensaje
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
}


export interface CurrentMensaje {
  mensaje: IntentModel,
  contexto: string
}