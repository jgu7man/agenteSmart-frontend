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

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  mensajesPath: string
  mensaje: IntentModel
  parameterAdded$: Subject<ParametroMensaje> = new Subject()
  parameterDeleted$: Subject<boolean> = new Subject()
  list$: Subject<ParametroMensaje[]> = new Subject()
  list: ParametroMensaje[]

  constructor (
    private fs: AngularFirestore,
    private _agente: CurrentAgenteService,
    private _mensaje: CurrentMensajeService,
    private _cache: CacheService,
    private _frases: FrasesService,
    private loading: Loading
  ) {



    // Get subscriptions
    this._mensaje.current$.pipe(
      map<IntentModel, ParametroMensaje[]>( mensaje => mensaje.parameters )
    ).subscribe( this.list$ )
    this.list$.pipe(
      startWith([])
    ).subscribe( list => {
      this.list = list
    } )

   }
  
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
    
    
    if ( !this.list ) {
      await ( await this.mensajesCollection() ).doc( this.mensaje.name )
        .update( { parameters: [ param ] } );
      this.parameterAdded$.next( param )

    } else {
      let paramStored = this.list.find( parameter => parameter.displayName = param.displayName )
  
      if ( !paramStored ) {
        this.list.push( param )
        await ( await this.mensajesCollection() ).doc( this.mensaje.name )
          .update( { parameters: this.list } );
        this.parameterAdded$.next( param );
      }

    }


    return
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

  async deleteParamInParts( displayName: string ) {

    await this.loading.asyncForEach( this.list,
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
