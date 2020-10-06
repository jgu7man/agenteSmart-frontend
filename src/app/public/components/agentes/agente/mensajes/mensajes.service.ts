import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TextService } from '../../../../../services/text.service';
import { CacheService } from '../../../../../Gdev-Tools/cache/cache.service';
import { CurrentAgenteService } from '../current-agente.service';
import { Loading } from '../../../../../Gdev-Tools/loading/loading.service';
import { ContextoModel } from '../contextos/contexto.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';
import { Observable, from, of } from 'rxjs';
import { IntentModel } from './mensaje.model';
import { first,  filter, switchMap, toArray } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  mensajesPath: string
  mensajes$ = new Observable<IntentModel[]>()
  // list: IntentModel[]
  
  
  constructor (
    private fs: AngularFirestore,
    private _alerta: AlertService,
    private _text: TextService,
    private _agente: CurrentAgenteService,
    private _loading: Loading,
  ) {
    this.getAllMensajesList()
  }
  

  async mensajesCollection() {
    this.mensajesPath = await this._agente.getPath( 'mensajes' )
    const mensajesRef = this.fs.collection( this.mensajesPath ).ref
    return mensajesRef
  }
  
    

  // SECTION CRUD de mensajes
  
  
  // CREATE Mensajes


  async setMensaje( mensajeName: string, contexto: string, index?:number ) {
    

    const name = this._text.normalize( mensajeName.toLowerCase() )
    
    // READ Busca en las mensajes que no esté duplicada
    // if ( !this.mensajesList ) this.mensajesList = await this._cache.getDataKey( 'allMensajesList' )
    
    let mensajeDuplicated = this._agente.mensajesList
    .find(msj => msj.name == name)
    if ( mensajeDuplicated ) {
      console.log(name, ' duplicada');
      this._alerta.sendMessageAlert( 'Mensaje Duplicada' )
    } else {
      await (await this.mensajesCollection()).doc( name )
        .set( {
          index: index,
          name: name,
          displayName: mensajeName,
          contextos: [ contexto ]
        } )
      return true
    }
  }


  


  

  // READ ENTRADAS

  async getAllMensajesList() {
    this.mensajesPath = await this._agente.getPath( 'mensajes' )
  }


  async getMensajesListByContexto( contexto: ContextoModel ) {
    var mensajesList = []
    const mensajeCol = await ( await this.mensajesCollection() )
      .where( 'contextos', 'array-contains', contexto.id )
      .orderBy('index', 'asc')
      .get()
    
    await this._loading.asyncForEach( mensajeCol.docs, mensaje => { mensajesList.push( mensaje.data() ) } )
    return mensajesList
  }

  getContextoMensajesList( contextoId: string ) {
    var whenMsj = this.mensajes$.pipe( first() )
    return whenMsj.pipe(
      switchMap( mensajes => mensajes ? 
        from( this._agente.mensajesList ).pipe(
            filter<IntentModel>( msj => msj.contextos.includes( contextoId ) ),
            toArray<IntentModel>()
        ) 
          : of( null )
        )
    )
    
  }

  async getMensajesListByContextoName( contextoName: string ) {
    var mensajesList = []
    const mensajeCol = await ( await this.mensajesCollection() )
      .where( 'inputContextNames', 'array-contains', contextoName )
      .orderBy( 'index', 'asc' )
      .get()
    
    await this._loading.asyncForEach( mensajeCol.docs, mensaje => { mensajesList.push( mensaje.data() ) } )
    return mensajesList
  }

  


  
  

}
