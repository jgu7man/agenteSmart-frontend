import { IntentModel } from '../../../mensaje.model';
import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { AngularFirestore, docChanges } from '@angular/fire/firestore';
import { CacheService } from '../../../../../../../../Gdev-Tools/cache/cache.service';
import { ParametroMensaje, FraseEntrenamiento, FraseParte } from '../../../mensaje.model';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { Subject, Observer, Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { FrasesService } from '../frases-form/frases.service';
import { Loading } from '../../../../../../../../Gdev-Tools/loading/loading.service';
import { AlertService } from '../../../../../../../../Gdev-Tools/alerts/alert.service';

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
  list: ParametroMensaje[]

  constructor (
    private fs: AngularFirestore,
    private _agente: CurrentAgenteService,
    private _mensaje: CurrentMensajeService,
    private _cache: CacheService,
    private _frases: FrasesService,
    private loading: Loading,
    private _alerts: AlertService
  ) {



    // Get subscriptions
    this._mensaje.current$.subscribe( mensaje => {
      this.mensaje = mensaje
      this.list = mensaje.parameters
    } )


   }
  
  
  /** Obtiene constante actualizado la ruta del mensaje en curso para los métodos del CRUD */
  private async mensajesCollection() {
    this.mensajesPath = await this._agente.getPath( `mensajes` )
    const mensajesRef = this.fs.collection( this.mensajesPath ).ref
    return mensajesRef
  }

  // CREATE Parametros

  async addParam( param: ParametroMensaje ) {

    console.log(param);
    this.mensaje = await this._cache.getDataKey( 'currentMensaje' )
    param.name = Math.random().toString( 36 ).substring( 7 );
    var newParam = [ param ];
    
    
    if ( !this.list ) {
      await ( await this.mensajesCollection() ).doc( this.mensaje.name )
        .update( { parameters: [ param ] } );
      this.parameterAdded$.next( param )

    } else {
      console.log(this.list);
      let paramStored = this.list.find( parameter => parameter.displayName == param.displayName )
  
      console.log(paramStored);
      if ( !paramStored ) {
        this.list.push( param )
        console.log(this.list);
        await ( await this.mensajesCollection() ).doc( this.mensaje.name )
          .update( { parameters: this.list } );
        this.parameterAdded$.next( param );
      } else {
        this._alerts.sendMessageAlert('Elige otro nombre para este parámetro')
      }

    }


    return
  }


  getParamByName( name: string ) {
    return this.list.find(p=> p.displayName == name)
  }


  


  async updateParam( param: ParametroMensaje ) {
    var paramIndex = this.list.findIndex( parameter => parameter.name == param.name )
    this.list[paramIndex] = param
    await ( await this.mensajesCollection() ).doc( this.mensaje.name ).update( {
      parameters: this.list
    })
  }


 
  async deleteParam( param: ParametroMensaje ) {
    var paramIndex = this.list.findIndex( parameter => parameter.name == param.name )
    this.list.splice(paramIndex, 1)
    await ( await this.mensajesCollection() ).doc( this.mensaje.name ).update( {
      parameters: this.list
    } ).then( () => {
      this.deleteParamInParts(param.displayName)
    } )
  }

  /**
   * Elimina el parámetro de todas las frases de entrenamiento que lo contengan
   */
  private async deleteParamInParts( displayName: string ) {

    await this.loading.asyncForEach( this.list,
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
