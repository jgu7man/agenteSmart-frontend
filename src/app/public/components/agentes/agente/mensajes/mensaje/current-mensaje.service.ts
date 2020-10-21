import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IntentModel, FraseEntrenamiento, ParametroMensaje } from '../mensaje.model';
import { Observable, Subject, of, Subscription, forkJoin } from 'rxjs';
import { Loading } from '../../../../../../Gdev-Tools/loading/loading.service';
import { pluck } from 'rxjs/operators';
import { CacheService } from '../../../../../../Gdev-Tools/cache/cache.service';
import { RespuestaModel } from './entrenamiento/respuestas/respuesta.model';
import { AlertService } from '../../../../../../Gdev-Tools/alerts/alert.service';
import { Store } from '@ngrx/store';
import { MensajeState } from '../mensaje.model';
import * as actions from './store/mensaje.actions'
// import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CurrentMensajeService {


  mensaje$: Observable<IntentModel> = new Observable()
  current$: Subject<IntentModel> = new Subject()
  mensajeSub$: Subscription
  
  current: IntentModel
  changes: IntentModel
  paramsSubs$: Subscription
  queryParamsSubs$: Subscription
  
  mensajeName: string
  currentContexto: string
  mensajesPath: string

  private _url = 'https://us-central1-main-agentesmart.cloudfunctions.net/dialogflow/intent';

  constructor (
    private _agente: CurrentAgenteService,
    private fs: AngularFirestore,
    private _cache: CacheService,
    private loading: Loading,
    private _alerts: AlertService,
    private store: Store<MensajeState>,
    private _http: HttpClient
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

        // await this.getFrasesList()
        // await this.getParametrosList()
        await this.getRespuestasList()

        this.mensajeSub$ = this.mensaje$.subscribe( this.current$ )
        this.current$.subscribe( current => {
          this.current = current
          // this._cache.updateData( 'currentMensaje', current )
        } )

        this._cache.updateData( 'currentContexto', this.currentContexto )
      }
    } )
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


  async update() {
    this.loading.toggleWaitingBar()
    Object.keys( this.current ).forEach( key =>
    { if ( this.current[ key ] == undefined ) delete this.current[ key ] } )

    try {
      // REVIEW falta testear esta función de update

      const request = await this.updateIntentApiRequest(this.current);
      if (request) {
        console.info('Se Actualizo Intent:', request);
      }

      await ( await this.mensajesCollection() ).doc( this.current.name )
      .update( { ...this.current } )
      
      this.store.dispatch(actions.setSaved() )
      this.loading.toggleWaitingBar()
      this._alerts.sendFloatNotification('Mensaje guardado')
    } catch ( error ) {
      console.error(error);
      // this._alerts.sendError( 'No se pudo guardar', error )
      this.loading.toggleWaitingBar()
    }

  }

  private updateIntentApiRequest(intent: IntentModel): Promise<IntentModel> {
    // NOTE se debe de saber exactamente que parametros mandar en el body
    // me refiero más a los types de Dialogflow
    // LINK https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.intents#resource:-intent

    return new Promise((resolve, reject ) => {
      
      this._http.put(this._url, {
        intent: intent,
        intentView:"INTENT_VIEW_FULL" 
      }, {
        responseType: "json"
      }).toPromise()
      .then( response => {
        if (response) {
          console.info('Intent Updateado:', response['result'])
          resolve(response['result'])
        }
      })
      .catch( err => {
        if (err) {
          this._alerts.sendError('No es posible actualizar este intent, intentelo de nuevo, porfavor.', err)
        }
        reject(err)
      })
      
    })
  }





  async updateMensajeName( mensajeName: string, displayName: string ) {
    await ( await this.mensajesCollection() ).doc( mensajeName ).update( {
      displayName: displayName
    } )
  }



  async delete(mensajeName) {
    //params intentName (ultima cadena)
    // REVIEW Falta testear esta función.
    const request = await this.deleteIntentRequest(mensajeName);
    if (request) {
      //No error, intent Borrado
    }

    return await ( await this.mensajesCollection() ).doc( mensajeName ).delete()
  }

  private deleteIntentRequest(intentId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const projectId: string = this._cache.getDataKey('projectId')

      this._http.delete(this._url +`/${intentId}/project/${projectId}`)
      .toPromise()
      .then( response => {
        console.info(response)
        resolve(response)
      })
      .catch( err => {
        if (err) {
          this._alerts.sendError('No es posible elimnar intent, intentelo de nuevo, porfavor.', err)
        }
        reject(err)
      })

    })
  }

  unsubscribe() {
    this.mensajeSub$.unsubscribe()
    this.store.dispatch(actions.getOutMensaje())
  }
}


export interface CurrentMensaje {
  mensaje: IntentModel,
  contexto: string
}