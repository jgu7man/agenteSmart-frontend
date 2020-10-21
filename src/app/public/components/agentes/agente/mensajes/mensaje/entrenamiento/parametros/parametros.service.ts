import { MensajeState } from './../../../mensaje.model';
import { IntentModel } from '../../../mensaje.model';
import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { AngularFirestore, docChanges } from '@angular/fire/firestore';
import { CacheService } from '../../../../../../../../Gdev-Tools/cache/cache.service';
import { ParametroMensaje, FraseEntrenamiento, FraseParte } from '../../../mensaje.model';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { Subject} from 'rxjs';
import { FrasesService } from '../frases-form/frases.service';
import { Loading } from '../../../../../../../../Gdev-Tools/loading/loading.service';
import { AlertService } from '../../../../../../../../Gdev-Tools/alerts/alert.service';
import { Store } from '@ngrx/store';
import * as actions from '../../store/mensaje.actions'
import { map, debounceTime, first } from 'rxjs/operators';
import { TextService } from '../../../../../../../../Gdev-Tools/text/gdev-text.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  /** Ruta de los mensajes para actualizaciones */
  mensajesPath: string
  /**Mensaje en curso */
  mensaje: IntentModel
  /**Informa cuando un parámetro fue agregado en las frases de entrenamiento */
  public parameterAdded$: Subject<ParametroMensaje> = new Subject()
  /**Informa cuando un parte de frase de entrenamiento fue borrada y contenía algún parámetro */
  public parameterDeleted$: Subject<boolean> = new Subject()
  /**Escucha y actualiza la lista de parámetros del mensaje en curso */
  list$: Subject<ParametroMensaje[]> = new Subject()
  /**Lista siempre actualizada del Subject list$ */
  // list: ParametroMensaje[]

  constructor (
    // private fs: AngularFirestore,
    private _agente: CurrentAgenteService,
    private _mensaje: CurrentMensajeService,
    private _frases: FrasesService,
    private loading: Loading,
    private _alerts: AlertService,
    private store: Store<MensajeState>,
    private _text: TextService
  ) {



    // Get subscriptions
    this._mensaje.current$.pipe(
      map( mensaje => mensaje ?  mensaje.parameters : []),
      debounceTime(1000), first()
    )
      .subscribe( params => {
        if ( !params ) params = []
        params.forEach(param => {
          // this.store.dispatch(actions.addParam({param}))
        });
    } )


   }
  
  
  /** Obtiene constante actualizado la ruta del mensaje en curso para los métodos del CRUD */
  // private async mensajesCollection() {
  //   this.mensajesPath = await this._agente.getPath( `mensajes` )
  //   const mensajesRef = this.fs.collection( this.mensajesPath ).ref
  //   return mensajesRef
  // }

  // CREATE Parametros

  async addParam( param: ParametroMensaje ) {

    console.log(param);
    var mensaje = this._mensaje.current
    var paramList = mensaje.parameters
    param.name = this._text.generateColorCode()
    
    
    if ( !paramList || paramList.length == 0 ) {
      paramList = [param]
      this._mensaje.current.parameters = paramList

      this.parameterAdded$.next( param )

    } else {
      let paramStored = paramList.find( parameter => parameter.displayName == param.displayName )
  
      console.log(paramStored);
      if ( !paramStored ) {
        paramList.push( param )
        // console.log(this.list);
        this._mensaje.current.parameters = paramList
        this.parameterAdded$.next( param );
      } else {
        this._alerts.sendMessageAlert('Elige otro nombre para este parámetro')
      }

    }


    return
  }


  getParamByName( name: string ) {
    var paramSelected = this._mensaje.current.parameters.find( p => p.displayName == name )
    console.log(paramSelected);
    return paramSelected
  }


  

  // UPDATE Mensaje Parametro

  async updateParam( param: ParametroMensaje ) {
    try {
      var paramList = this._mensaje.current.parameters
      var paramIndex = paramList.findIndex( parameter => parameter.name == param.name )
      paramList[ paramIndex ] = param
      this._mensaje.current.parameters = paramList
      return this.store.dispatch(actions.setUnsaved())
    } catch (error) {
      console.error(error)
      this._alerts.sendError('Error', error)
    }
  }



  // DELETE
 
  async deleteParam( param: ParametroMensaje ) {
    try {
      const paramList = this._mensaje.current.parameters
      var paramIndex = paramList.findIndex( parameter => parameter.name == param.name )
      paramList.splice( paramIndex, 1 )
      this._mensaje.current.parameters = paramList
      this.deleteParamInParts( param.displayName )
      return this.store.dispatch(actions.setUnsaved() )
    } catch (error) {
      console.error(error)
      this._alerts.sendError('Error', error)
    }
  }

  /**
   * Elimina el parámetro de todas las frases de entrenamiento que lo contengan
   */
  private async deleteParamInParts( displayName: string ) {
    const frasesList = this._mensaje.current.trainingPhrases

    await this.loading.asyncForEach( frasesList,
      async ( frase: FraseEntrenamiento ) => {
      
        // Busca en las partes donde hay el parámetro eliminado
      return this.loading.asyncForEach( frase.parts,
        ( parte: FraseParte, parteIndex ) => {
        
          if ( parte.paramName ) {
            if ( parte.paramName == displayName )
            delete frase.parts[ parteIndex ].entityType
            delete frase.parts[ parteIndex ].paramName
            frase.parts[ parteIndex ].selected = false
            return this._frases.updatePhrase(frase)
          }

      })

      } )
      
    this.parameterDeleted$.next( true )
    
    return 
    
  }


  
}
