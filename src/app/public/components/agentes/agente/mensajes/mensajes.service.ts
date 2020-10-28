import { HttpClient } from '@angular/common/http';
import { Loading } from 'src/app/Gdev-Tools/loading/loading.service';
import { CacheService } from 'src/app/Gdev-Tools/cache/cache.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TextService } from '../../../../../services/text.service';
import { CurrentAgenteService } from '../current-agente.service';
import { ContextoModel } from '../contextos/contexto.model';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';
import { Observable, from, of, Subject } from 'rxjs';
import { IntentModel } from './mensaje.model';
import { first, filter, switchMap, toArray, pluck, delayWhen, map } from 'rxjs/operators';
import { RespuestaModel } from './mensaje/entrenamiento/respuestas/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  mensajesPath: string
  mensajes$ = new Observable<IntentModel[]>()
  projectId

  reloadMensajes$ = new Subject<any>()
  // list: IntentModel[]
  private _url = 'https://us-central1-main-agentesmart.cloudfunctions.net/dialogflow/intent';
  
  
  constructor (
    private _http: HttpClient,
    private fs: AngularFirestore,
    private _cache: CacheService,
    private _alerts: AlertService,
    private _text: TextService,
    private _agente: CurrentAgenteService,
    private _loading: Loading,
  ) {
    this.getProjectId()
  }

  async getProjectId(){
      this._loading.getRouteParams().pipe(pluck("id"))
      .subscribe(obs => {
        this.projectId = obs
      }).unsubscribe();
  }

  async mensajesCollection() {
    this.mensajesPath = await this._agente.getPath( 'mensajes' )
    const mensajesRef = this.fs.collection( this.mensajesPath ).ref
    return mensajesRef
  }
  
    

  // SECTION CRUD de mensajes
  
  
  // CREATE Mensajes

  /**Crear un intent nuevo
  *@param projectId id del projecto
  *@param intent displayname nombre del intent */
  async createNewIntent( intent: IntentModel ) {

    const projectId: string = this._cache.getDataKey( 'projectId' )
    //si no se puede hace proxeo de la URL base...
    console.log( projectId )
    const intentRequest = { projectId, intent, }

    console.log( intent )
    return new Promise<IntentModel>( ( resolve, reject ) => {
      this._http.post( this._url, intentRequest, { responseType: 'json' } )
        .subscribe( intentCreated => {
          console.log( 'IntentCreated:', intentCreated[ 'intent' ] )
          resolve( intentCreated[ 'intent' ] )
          this.reloadMensajes$.next()
        }, onError => {
          this._alerts.sendError( 'Algo falló', onError )
          reject( onError )
        } )
    } )

      ;
  }


  /** Agrega el intent nuevo creado por la API a dialogflow como referencia para la interfaz
   * @param {IntentModel} newIntent intent creado por la API
   * @param {number} [index] index en el orden del contexto
   * @param {string} [contexto] contexto con el que será invocado en la interfaz
   */
  async setMensaje( newIntent: IntentModel, index?:number, contexto?: string,  ) {
    
    const resourceID = newIntent.name.slice(newIntent.name.lastIndexOf("/") + 1); //formato esperado: f0b12fde-9600-4e2e-88a7-70861817a358
    
    let intent = {
      name: newIntent.name,
      displayName: newIntent.displayName
    }

    if (index) intent['index'] = index
    if (contexto) intent['contexto'] = contexto

    await (await this.mensajesCollection()).doc(resourceID).set(intent)
    
    return this._alerts.sendFloatNotification('Mensaje creado')
    
  }


  


  

  // READ ENTRADAS

  get allMensajesList() {
    return this._cache.getDataKey('allMensajes')
  }


  async getMensajesListByContexto( contexto: ContextoModel ) {
    var mensajesList = []
    
    if ( contexto.id ) {
      const mensajeCol = await ( await this.mensajesCollection() )
        .where( 'contextos', 'array-contains', contexto.id )
        .orderBy( 'index', 'asc' )
        .get()

      await this._loading.asyncForEach( mensajeCol.docs, mensaje => { mensajesList.push( mensaje.data() ) } )
    }

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

  

  



  async getFollowingMensajes( id: string ) {
    var following: string[] = []
    var respuestasCol = await ( await this.mensajesCollection() ).doc( `${ id }` )
      .collection( 'respuestas' ).get()
    
    if ( respuestasCol.size > 0 ) {
      respuestasCol.forEach( res => {
        let respuesta = res.data() as RespuestaModel
        let resStored = following.findIndex( r => r == respuesta.nextIntent )
        if(resStored < 0) following.push( respuesta.nextIntent )
      })
    }

    await new Promise( resolve => {
      of( following ).pipe(
        map( f => {
          if ( f.length == respuestasCol.size ) return true
        })
      ).subscribe(fo => resolve(fo))
    })
    return following
  }
}
