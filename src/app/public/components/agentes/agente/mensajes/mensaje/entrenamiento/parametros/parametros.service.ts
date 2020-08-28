import { IntentModel } from '../../../mensaje.model';
import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { AngularFirestore, docChanges } from '@angular/fire/firestore';
import { CacheService } from '../../../../../../../../Gdev-Tools/cache/cache.service';
import { ParametroMensaje, FraseEntrenamiento, FraseParte } from '../../../mensaje.model';
import { CurrentMensajeService } from '../../current-mensaje.service';
import { Subject, Observer, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FrasesService } from '../frases-form/frases.service';
import { Loading } from '../../../../../../../../Gdev-Tools/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  mensajesPath: string
  mensaje: IntentModel
  parameterAdded$: Subject<ParametroMensaje> = new Subject()
  parameterDeleted$: Subject<boolean> = new Subject()
  paramList: ParametroMensaje[]

  constructor (
    private fs: AngularFirestore,
    private _agente: CurrentAgenteService,
    private _mensaje: CurrentMensajeService,
    private _cache: CacheService,
    private _frases: FrasesService,
    private loading: Loading
  ) { }
  
  async mensajesCollection() {
    this.mensajesPath = await this._agente.getPath( `mensajes` )
    const mensajesRef = this.fs.collection( this.mensajesPath ).ref
    return mensajesRef
  }

  // CREATE Parametros

  async addParam( param: ParametroMensaje ) {

    this.mensaje = await this._cache.getDataKey( 'currentMensaje' )
    param.name = Math.random().toString( 36 ).substring( 7 );
    var newParam = [ param ];
    var paramList = await this.get()
    
    if ( !paramList ) {
      await ( await this.mensajesCollection() ).doc( this.mensaje.name )
        .update( { parameters: [ param ] } );
      this.parameterAdded$.next( param )

    } else {
      let paramStored = paramList.find( parameter => parameter.displayName = param.displayName )
  
      if ( !paramStored ) {
        paramList.push( param )
        await ( await this.mensajesCollection() ).doc( this.mensaje.name )
          .update( { parameters: paramList } );
        this.parameterAdded$.next( param );
      }

    }


    return
  }


  async get() {
    this.paramList = []
    this.mensaje = await this._mensaje.getCurrentMensaje()
    this.paramList = this.mensaje.parameters

    return this.paramList
  }


  async updateParam( param: ParametroMensaje ) {
    var paramIndex = this.paramList.findIndex( parameter => parameter.name == param.name )
    this.paramList[paramIndex] = param
    await ( await this.mensajesCollection() ).doc( this.mensaje.name ).update( {
      parameters: this.paramList
    })
  }


  async deleteParam( param: ParametroMensaje ) {
    var paramIndex = this.paramList.findIndex( parameter => parameter.name == param.name )
    this.paramList.splice(paramIndex, 1)
    await ( await this.mensajesCollection() ).doc( this.mensaje.name ).update( {
      parameters: this.paramList
    } ).then( () => {
      this.deleteParamInParts(param.displayName)
    } )
  }

  async deleteParamInParts( displayName: string ) {
    const frasesList = await this._frases.get()

    await this.loading.asyncForEach( frasesList,
      async ( frase: FraseEntrenamiento ) => {
      
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
