import { HttpClient } from '@angular/common/http';
import { Loading } from 'src/app/Gdev-Tools/loading/loading.service';
import { CacheService } from 'src/app/Gdev-Tools/cache/cache.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TextService } from '../../../../../services/text.service';
import { CurrentAgenteService } from '../current-agente.service';
import { ContextoModel } from '../contextos/contexto.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';
import { Observable, from, of } from 'rxjs';
import { IntentModel } from './mensaje.model';
import { first, filter, switchMap, toArray, pluck, catchError, tap } from 'rxjs/operators';
import { error } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  mensajesPath: string
  mensajes$ = new Observable<IntentModel[]>()
  projectId
  // list: IntentModel[]
  
  
  constructor (
    private _http: HttpClient,
    private fs: AngularFirestore,
    private _alerta: AlertService,
    private _text: TextService,
    private _cache: CacheService,
    private _agente: CurrentAgenteService,
    private _loading: Loading,
    private _route: ActivatedRoute,
    private router: Router
  ) {
    this.getAllMensajesList()
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


  async setMensaje(name: string, displayName: string, index?:number, contexto?: string,  ) {
    
    
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
          displayName: displayName,
          contextos: contexto ? [ contexto ] : []
        } )
      return this._alerta.sendFloatNotification('Mensaje creado')
    }


  }


  

  // READ ENTRADAS

  async getAllMensajesList() {
    this.mensajesPath = await this._agente.getPath( 'mensajes' )
    // this.mensajes$ = this.fs.collection<IntentModel>( this.mensajesPath ).valueChanges()
    // this.mensajes$.pipe(startWith([])).subscribe( async mensajes => {
    //   this.list = mensajes
    //   this._cache.updateData( 'allMensajesList', mensajes )
      
    // })
    
    // return this.list
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

  async createNewIntent(intent: IntentModel) {
    //Crear un intent nuevo
    //@params projectId: id del projecto
    //@param intent: displayname nombre del intent


    const projectId: string = this._cache.getDataKey('projectId')
    //sino se puede hace proxeo de la URL base...
    const url = 'https://us-central1-main-agentesmart.cloudfunctions.net/dialogflow/intent'
    const local = "http://localhost:3000/intent"    
    console.log(projectId)
    const intentRequest = {
      projectId,
      intent,
    }

    console.log(intent)
    return new Promise<IntentModel>((resolve, reject) => {
      this._http.post<IntentModel>(url, intentRequest, { responseType: 'json'})
      .subscribe( intentCreated => {
        console.log('IntentCreated:', intentCreated)
        resolve(intentCreated['result'])
      }, onError => reject(onError))
    })


  }

  

}
