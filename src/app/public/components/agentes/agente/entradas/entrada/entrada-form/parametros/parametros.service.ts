import { EntradaModel } from './../../../entrada.model';
import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { AngularFirestore, docChanges } from '@angular/fire/firestore';
import { CacheService } from '../../../../../../../../global/cache/cache.service';
import { ParametroEntrada, FraseEntrenamiento, FraseParte } from '../../../entrada.model';
import { CurrentEntradaService } from '../../current-entrada.service';
import { Subject, Observer, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FrasesService } from '../frases-form/frases.service';
import { Loading } from '../../../../../../../../global/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  entradasPath: string
  entrada: EntradaModel
  parameterAdded$: Subject<ParametroEntrada> = new Subject()
  parameterDeleted$: Subject<boolean> = new Subject()
  paramList: ParametroEntrada[]

  constructor (
    private fs: AngularFirestore,
    private _agente: CurrentAgenteService,
    private _entrada: CurrentEntradaService,
    private _cache: CacheService,
    private _frases: FrasesService,
    private loading: Loading
  ) { }
  
  async entradasCollection() {
    this.entradasPath = await this._agente.getPath( `entradas` )
    const entradasRef = this.fs.collection( this.entradasPath ).ref
    return entradasRef
  }

  // CREATE Parametros

  async addParam( param: ParametroEntrada ) {

    this.entrada = await this._cache.getDataKey( 'currentEntrada' )
    param.name = Math.random().toString( 36 ).substring( 7 );
    var newParam = [ param ];
    var paramList = await this.get()
    
    if ( !paramList ) {
      await ( await this.entradasCollection() ).doc( this.entrada.name )
        .update( { parameters: [ param ] } );
      this.parameterAdded$.next( param )

    } else {
      let paramStored = paramList.find( parameter => parameter.displayName = param.displayName )
  
      if ( !paramStored ) {
        paramList.push( param )
        await ( await this.entradasCollection() ).doc( this.entrada.name )
          .update( { parameters: paramList } );
        this.parameterAdded$.next( param );
      }

    }


    return
  }


  async get() {
    this.paramList = []
    this.entrada = await this._entrada.getCurrentEntrada()
    this.paramList = await ( await ( await this.entradasCollection() )
      .doc( this.entrada.name ).get() )
      .get( 'parameters' );

    return this.paramList
  }


  async updateParam( param: ParametroEntrada ) {
    var paramIndex = this.paramList.findIndex( parameter => parameter.name == param.name )
    this.paramList[paramIndex] = param
    await ( await this.entradasCollection() ).doc( this.entrada.name ).update( {
      parameters: this.paramList
    })
  }


  async deleteParam( param: ParametroEntrada ) {
    var paramIndex = this.paramList.findIndex( parameter => parameter.name == param.name )
    this.paramList.splice(paramIndex, 1)
    await ( await this.entradasCollection() ).doc( this.entrada.name ).update( {
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
