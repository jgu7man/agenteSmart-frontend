import { Injectable } from '@angular/core';
import { CurrentAgenteService } from '../../../../current-agente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CacheService } from '../../../../../../../../global/cache/cache.service';
import { ParametroEntrada } from '../../../entrada.model';
import { CurrentEntradaService } from '../../current-entrada.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  entradasPath: string
  parameterAdded: Subject<ParametroEntrada> = new Subject()
  constructor (
    private fs: AngularFirestore,
    private _agente: CurrentAgenteService,
    private _entrada: CurrentEntradaService,
    private _cache: CacheService
  ) { }
  
  async entradasCollection() {
    this.entradasPath = await this._agente.getPath( `entradas` )
    const entradasRef = this.fs.collection( this.entradasPath ).ref
    return entradasRef
  }

  // CREATE Parametros

  async addParam( param: ParametroEntrada ) {

    const entrada = await this._cache.getDataKey( 'currentEntrada' )
    param.name = Math.random().toString( 36 ).substring( 7 );
    var newParam = [ param ];
    var paramList = await this.get()
    console.log( { entrada, newParam, paramList } );
    
    if ( !paramList ) {
      await ( await this.entradasCollection() ).doc( entrada.name )
        .update( { parameters: [ param ] } );
      this.parameterAdded.next( param )

    } else {
      let paramStored = paramList.find( parameter => parameter.displayName = param.displayName )
  
      if ( !paramStored ) {
        paramList.push( param )
        await ( await this.entradasCollection() ).doc( entrada.name )
          .update( { parameters: paramList } );
        this.parameterAdded.next( param );
      }

    }


    return
  }


  async get() {
    const entrada = await this._entrada.getCurrentEntrada()
    const paramList: ParametroEntrada[] = await ( await ( await this.entradasCollection() )
      .doc( entrada.name ).get() )
      .get( 'parameters' );

    return paramList
  }

}
