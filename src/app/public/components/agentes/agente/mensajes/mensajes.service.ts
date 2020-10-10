import { HttpClient } from '@angular/common/http';
import { Loading } from 'src/app/Gdev-Tools/loading/loading.service';
import { CacheService } from 'src/app/Gdev-Tools/cache/cache.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TextService } from '../../../../../services/text.service';
import { CurrentAgenteService } from '../current-agente.service';
import { ContextoModel } from '../contextos/contexto.model';
import { AlertService } from '../../../../../Gdev-Tools/alerts/alert.service';
import { Observable, from, of } from 'rxjs';
import { IntentModel } from './mensaje.model';
import { first, filter, switchMap, toArray, pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  mensajesPath: string
  mensajes$ = new Observable<IntentModel[]>()
  projectId
  // list: IntentModel[]
  private _url = 'https://us-central1-main-agentesmart.cloudfunctions.net/dialogflow/intent';
  
  
  constructor (
    private _http: HttpClient,
    private fs: AngularFirestore,
    private _cache: CacheService,
    private _alerta: AlertService,
    private _text: TextService,
    private _agente: CurrentAgenteService,
    private _loading: Loading,
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


  async setMensaje( newIntent: IntentModel, index?:number, contexto?: string,  ) {
    
    // READ Busca en las mensajes que no esté duplicada
    // if ( !this.mensajesList ) this.mensajesList = await this._cache.getDataKey( 'allMensajesList' )
    const resourceID = newIntent.name.slice(newIntent.name.lastIndexOf("/") + 1); //formato esperado: f0b12fde-9600-4e2e-88a7-70861817a358
    

    newIntent = {...newIntent, index: index, contextos: contexto ? [ contexto ] : []}
    
    let mensajeDuplicated = this._agente.mensajesList
    .find(msj => msj.name == resourceID)
    if ( mensajeDuplicated ) {
      console.log(name, ' duplicada');
      this._alerta.sendMessageAlert( 'Mensaje Duplicada' )
    } else {
      await (await this.mensajesCollection()).doc( resourceID )
        .set( newIntent )
      return this._alerta.sendFloatNotification('Mensaje creado')
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

  async createNewIntent(intent: IntentModel) {
    //Crear un intent nuevo
    //@params projectId: id del projecto
    //@param intent: displayname nombre del intent


    const projectId: string = this._cache.getDataKey('projectId')
    //sino se puede hace proxeo de la URL base...
    console.log(projectId)
    const intentRequest = {
      projectId,
      intent,
    }

    console.log(intent)
    return new Promise<IntentModel>((resolve, reject) => {
      this._http.post<IntentModel>(this._url, intentRequest, { responseType: 'json'})
      .subscribe( intentCreated => {
        console.log('IntentCreated:', intentCreated)
        resolve(intentCreated['result'])
      }, onError => reject(onError))
    })


  }

  async getAllIntents(): Promise<IntentModel[]> {
    return new Promise((resolve, reject) => {
      const projectId: string = this._cache.getDataKey('projectId')

      this._http.get(this._url + `/${projectId}`, {
        responseType: 'json'
      })
      .toPromise()
      .then(response => {
        console.info('Peticion echa intents:', response)
        const intents: IntentModel[] = response['result']['intents'];
        resolve(intents);
      })
      .catch(err => {
        if (err) {
          console.error('Error tomando todos los intents', err.message)
          this._alerta.sendError('Un error tomando los intents', err);
          reject(err)
        }
      })
    })
  }
}
